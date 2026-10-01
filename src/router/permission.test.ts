import type { NavigationGuard, Router } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { permission } from './permission'

/** 隔离页面角色判定，仅验证 H5 路由接入与重定向控制。 */
const mocks = vi.hoisted(() => ({ redirect: vi.fn(), sync: vi.fn() }))
vi.mock('@/tabbar/store', () => ({
  getTabbarRedirectPath: mocks.redirect,
  tabbarStore: { setAutoCurIdx: mocks.sync },
}))

/** 执行注册的守卫，模拟地址栏或浏览器历史导航。 */
function navigate(path: string) {
  let guard: NavigationGuard
  permission.install({
    beforeEach: (callback: NavigationGuard) => {
      guard = callback
    },
  } as unknown as Router)
  const next = vi.fn()
  guard!({ path } as Parameters<NavigationGuard>[0], {} as Parameters<NavigationGuard>[1], next)
  return next
}

beforeEach(() => {
  mocks.redirect.mockReturnValue('')
})

describe('h5 TabBar 权限守卫', () => {
  it('受限页重定向后不更新原页面高亮', () => {
    mocks.redirect.mockReturnValue('/pages/index/index')
    const next = navigate('/pages/about/about')
    expect(next).toHaveBeenCalledWith('/pages/index/index')
    expect(mocks.sync).not.toHaveBeenCalled()
  })

  it('允许页面正常放行并同步高亮', () => {
    const next = navigate('/pages/index/index')
    expect(next).toHaveBeenCalledWith()
    expect(mocks.sync).toHaveBeenCalledWith('/pages/index/index')
  })
})
