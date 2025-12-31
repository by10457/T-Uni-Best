import type { IDoubleTokenRes } from '@/api/types/login'
import type { CustomRequestOptions, IResponse } from '@/http/types'
import { useTokenStore } from '@/store/token'
import { isDoubleTokenMode } from '@/utils'
import { toLoginPage } from '@/utils/toLoginPage'
import { ResultEnum } from './tools/enum'

// 刷新 token 状态管理
let refreshing = false // 防止重复刷新 token 标识
let taskQueue: ((err?: unknown) => void)[] = [] // 刷新 token 请求队列

// 静默登录状态管理（小程序场景：启动时无 token 则静默登录，并让鉴权请求等待）
let loggingIn = false
let loginPromise: Promise<void> | null = null

// 双token刷新并发控制（防止多个请求同时刷新token）
let tokenRefreshing = false // 防止重复刷新 token 标识
let tokenRefreshPromise: Promise<void> | null = null // 刷新 token Promise

/**
 * 确保请求前的认证状态就绪
 *
 * 此函数在每次HTTP请求前被调用，用于处理认证相关的逻辑：
 * 1. 检查请求是否需要忽略认证检查
 * 2. 验证当前用户是否已有有效登录状态
 * 3. 如果启用了双token模式，尝试使用refreshToken刷新accessToken
 * 4. 在微信小程序端，如果用户未登录则执行静默登录
 *
 * @param options HTTP请求配置选项
 * @returns Promise<void> 当认证就绪或忽略认证时resolve，如果认证失败则reject
 */
async function ensureAuthReady(options: CustomRequestOptions) {
  if (options.ignoreAuth)
    return

  const tokenStore = useTokenStore()
  tokenStore.updateNowTime()

  // 已有有效登录态，直接放行
  if (tokenStore.hasLogin)
    return

  // 双 token：优先尝试用 refreshToken 刷新（避免频繁 wx.login）
  if (isDoubleTokenMode) {
    // 第一步：如果已有刷新Promise在进行中，等待它完成
    if (tokenRefreshPromise) {
      await tokenRefreshPromise
      // 刷新完成后，检查是否已有有效登录状态
      tokenStore.updateNowTime()
      if (tokenStore.hasLogin)
        return
    }

    // 第二步：如果没有正在刷新，才启动新的刷新流程
    else if (!tokenRefreshing) {
      tokenRefreshing = true
      tokenRefreshPromise = (async () => {
        try {
          // 执行token刷新逻辑
          await tokenStore.tryGetValidToken()
        }
        finally {
          // 无论成功失败，都重置状态
          tokenRefreshing = false
          tokenRefreshPromise = null
        }
      })()
      // 等待本次刷新完成
      await tokenRefreshPromise
    }

    // 第三步：刷新完成后再次检查登录状态
    tokenStore.updateNowTime()
    if (tokenStore.hasLogin)
      return
  }

  // 小程序端：无 token -> 静默登录（并发仅执行一次，其它请求等待）
  // #ifdef MP-WEIXIN

  // 第一步：如果已有登录Promise在进行中，直接返回它（让其他请求等待）
  if (loginPromise)
    return loginPromise

  // 第二步：如果没有正在登录，才启动新的登录流程
  if (!loggingIn) {
    loggingIn = true
    loginPromise = (async () => {
      try {
        // 实际执行微信登录逻辑
        await tokenStore.wxLogin()
      }
      finally {
        // 无论成功失败，都重置状态，为下次登录做准备
        loggingIn = false
        loginPromise = null
      }
    })()
  }

  // 第三步：返回登录Promise，所有并发请求都会等待这个Promise
  return loginPromise
  // #endif
}

/**
 * 核心HTTP请求函数
 *
 * 这是一个基于uni-app的增强HTTP请求封装，提供了以下核心功能：
 * 1. 自动认证管理 - 请求前自动处理token验证和刷新
 * 2. 无感token刷新 - 遇到401错误时自动刷新token并重试请求
 * 3. 请求队列管理 - 多个并发请求在token刷新时自动排队等待
 * 4. 统一错误处理 - 网络错误、业务错误、认证错误都有相应处理
 * 5. 平台适配 - 自动适配不同uni-app平台的特性
 *
 * @template T - 响应数据的类型，由IResponse<T>的data字段决定
 * @param options - HTTP请求配置选项，包含url、method、data等
 * @returns Promise<T> - 返回响应数据data字段的Promise
 */
export function http<T>(options: CustomRequestOptions) {
  return new Promise<T>((resolve, reject) => {
    (async () => {
      try {
        await ensureAuthReady(options)
      }
      catch (err) {
        return reject(err)
      }

      uni.request({
        ...options,
        dataType: 'json',
        // #ifndef MP-WEIXIN
        responseType: 'json',
        // #endif
        // 响应成功
        success: async (res) => {
          const responseData = res.data as IResponse<T>
          const { code } = responseData

          // 检查是否是401错误（包括HTTP状态码401或业务码401）
          const isTokenExpired = res.statusCode === 401 || code === 401

          if (isTokenExpired) {
            const tokenStore = useTokenStore()
            if (!isDoubleTokenMode) {
              // 未启用双token策略，清理用户信息，跳转到登录页
              tokenStore.logout()
              toLoginPage()
              return reject(res)
            }

            /* -------- 无感刷新 token（容错处理）----------- */
            // 所有401请求都加入队列等待处理
            taskQueue.push((err) => {
              if (err)
                return reject(err)
              // 重新发起原始请求
              http<T>(options).then(resolve).catch(reject)
            })

            // 如果未在刷新中，开始容错处理流程
            if (!refreshing) {
              refreshing = true

              // 执行容错处理（静默登录 + token刷新）
              ; (async () => {
                try {
                  // 第一步：显示处理中提示
                  // nextTick(() => {
                  //   uni.hideToast()
                  //   uni.showToast({
                  //     title: '正在恢复登录状态...',
                  //     icon: 'loading',
                  //     duration: 3000,
                  //   })
                  // })

                  // 第二步：小程序端尝试静默登录
                  // #ifdef MP-WEIXIN
                  await tokenStore.wxLogin()
                  // #endif

                  // 第三步：如果有refreshToken，尝试刷新
                  const tokenInfo = tokenStore.tokenInfo as IDoubleTokenRes
                  if (tokenInfo?.refreshToken) {
                    await tokenStore.refreshToken()
                  }

                  // 第四步：处理成功
                  refreshing = false
                  // nextTick(() => {
                  //   uni.hideToast()
                  //   uni.showToast({
                  //     title: '登录状态已恢复',
                  //     icon: 'success',
                  //     duration: 1500,
                  //   })
                  // })

                  // 执行队列中的所有等待请求
                  taskQueue.forEach(task => task())
                }
                catch (error) {
                  console.error('容错处理失败:', error)
                  refreshing = false

                  // 处理失败，提示用户
                  // nextTick(() => {
                  //   uni.hideToast()
                  //   uni.showToast({
                  //     title: '登录已失效，请重新登录应用',
                  //     icon: 'none',
                  //     duration: 3000,
                  //   })
                  // })

                  // 清除登录状态（但不跳转页面）
                  await tokenStore.logout()

                  // 拒绝所有等待的请求
                  taskQueue.forEach(task => task(error))
                }
                finally {
                  // 清空任务队列
                  taskQueue = []
                }
              })()
            }

            // 检查是否有有效的refreshToken用于容错处理
            const { refreshToken: hasRefreshToken } = tokenStore.tokenInfo as IDoubleTokenRes || {}
            if (!hasRefreshToken) {
              // 没有refreshToken，直接登出并提示用户
              // nextTick(() => {
              //   uni.hideToast()
              //   uni.showToast({
              //     title: '登录已过期，请重新登录',
              //     icon: 'none',
              //     duration: 3000,
              //   })
              // })
              await tokenStore.logout()
              return reject(res)
            }

            // 已进入队列，等待刷新结束后重试
            return
          }

          // 处理其他成功状态（HTTP状态码200-299）
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // 处理业务逻辑错误
            if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
              uni.showToast({
                icon: 'none',
                title: responseData.msg || responseData.message || '请求错误',
              })
            }
            return resolve(responseData.data)
          }

          // 处理其他错误
          !options.hideErrorToast
          && uni.showToast({
            icon: 'none',
            title: (res.data as any).msg || '请求错误',
          })
          reject(res)
        },
        // 响应失败
        fail(err) {
          uni.showToast({
            icon: 'none',
            title: '网络错误，换个网络试试',
          })
          reject(err)
        },
      })
    })()
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpGet<T>(url: string, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query,
    method: 'GET',
    header,
    ...options,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpPost<T>(url: string, data?: Record<string, any>, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
    header,
    ...options,
  })
}

/**
 * PUT 请求
 */
export function httpPut<T>(url: string, data?: Record<string, any>, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    data,
    query,
    method: 'PUT',
    header,
    ...options,
  })
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export function httpDelete<T>(url: string, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query,
    method: 'DELETE',
    header,
    ...options,
  })
}

// 支持与 axios 类似的API调用
http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete

// 支持与 alovaJS 类似的API调用
http.Get = httpGet
http.Post = httpPost
http.Put = httpPut
http.Delete = httpDelete
