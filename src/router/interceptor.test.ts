import { beforeEach, describe, expect, it, vi } from 'vitest'
import { navigateToInterceptor } from './interceptor'

/** 分别模拟角色检查和登录状态，验证角色检查不能被小程序登录策略绕过。 */
const mocks = vi.hoisted(() => ({ redirect: vi.fn(), sync: vi.fn() }))
vi.mock('@uni-helper/uni-env', () => ({ isMp: true, isMpWeixin: false }))
vi.mock('@/store/token', () => ({ useTokenStore: () => ({ hasLogin: true }) }))
vi.mock('@/tabbar/store', () => ({
  getTabbarRedirectPath: mocks.redirect,
  isPageTabbar: (path: string) => path === '/pages/index/index',
  tabbarStore: { setAutoCurIdx: mocks.sync },
}))

beforeEach(() => {
  mocks.redirect.mockReturnValue('')
})

describe('uni 导航与冷启动角色守卫', () => {
  it('角色不足时阻止原导航，并切换到可访问 Tab', () => {
    mocks.redirect.mockReturnValue('/pages/index/index')
    expect(navigateToInterceptor.invoke({ url: '/pages/about/about?from=share' })).toBe(false)
    expect(mocks.redirect).toHaveBeenCalledWith('/pages/about/about')
    expect(uni.switchTab).toHaveBeenCalledWith({ url: '/pages/index/index' })
    expect(mocks.sync).not.toHaveBeenCalled()
  })

  it('冷启动的根路由也经过角色检查', () => {
    mocks.redirect.mockReturnValue('/pages/index/index')
    expect(navigateToInterceptor.invoke({ url: '/' })).toBe(false)
  })

  it('没有可用 Tab 时跳到普通回退页', () => {
    mocks.redirect.mockReturnValue('/pages-redirect/404/index')
    expect(navigateToInterceptor.invoke({ url: '/pages/about/about' })).toBe(false)
    expect(uni.redirectTo).toHaveBeenCalledWith({ url: '/pages-redirect/404/index' })
    expect(uni.switchTab).not.toHaveBeenCalled()
  })

  it('允许页面直接放行，不产生重定向循环', () => {
    expect(navigateToInterceptor.invoke({ url: '/pages/index/index' })).toBe(true)
    expect(uni.switchTab).not.toHaveBeenCalled()
    expect(mocks.sync).toHaveBeenCalledWith('/pages/index/index')
  })
})
