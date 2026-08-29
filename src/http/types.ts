/**
 * 在 uniapp 的 RequestOptions 和 IUniUploadFileOptions 基础上，添加自定义参数
 */
export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 是否忽略鉴权（默认所有请求需要鉴权；登录/刷新等接口需设置 true 以绕过门禁） */
  ignoreAuth?: boolean
  /** 是否跳过添加访问令牌（登录、刷新令牌等接口使用） */
  skipAccessToken?: boolean
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
  /** 内部使用：401 重试计数，防止无限循环（外部请勿手动设置） */
  _retryCount?: number
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

/** 主要提供给 openapi-ts-request 生成的代码使用 */
export type CustomRequestOptions_ = Omit<CustomRequestOptions, 'url'>

export interface HttpRequestResult<T> {
  promise: Promise<T>
  requestTask: UniApp.RequestTask
}

/**
 * HTTP 层统一抛出的错误结构，调用方可通过 type 区分处理策略。
 */
export interface HttpError<T = any> {
  type: 'business' | 'auth' | 'http' | 'network'
  code?: number
  statusCode?: number
  message: string
  data?: T
  raw?: unknown
}

// 通用响应格式（兼容 msg + message 字段）
export type IResponse<T = any> =
  | {
      code: number
      data: T
      message: string
      [key: string]: any // 允许额外属性
    }
  | {
      code: number
      data: T
      msg: string
      [key: string]: any // 允许额外属性
    }

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 分页响应数据
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
