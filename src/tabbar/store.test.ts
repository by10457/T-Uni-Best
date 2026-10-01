import type { IUserInfoRes } from '@/api/types/login'
import type { CustomTabBarItem } from './types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/** 每个用例独立设置 TabBar 策略和角色限制，避免依赖演示配置。 */
const configState = vi.hoisted(() => ({ strategy: 2, list: [] as CustomTabBarItem[] }))

vi.mock('./config', () => ({
  TABBAR_STRATEGY_MAP: { NO_TABBAR: 0, NATIVE_TABBAR: 1, CUSTOM_TABBAR: 2 },
  get selectedTabbarStrategy() {
    return configState.strategy
  },
  get customTabbarList() {
    return configState.list
  },
  nativeTabbarList: [{ pagePath: 'pages/index/index' }, { pagePath: 'pages/me/index' }],
}))
vi.mock('@/api/login', () => ({ getUserInfo: vi.fn() }))

/** 普通用户可见首页和我的，管理员额外可见关于。 */
const tabs: CustomTabBarItem[] = [
  { pagePath: 'pages/index/index', text: '首页', iconType: 'unocss', icon: 'i-carbon-home' },
  {
    pagePath: 'pages/about/about',
    text: '关于',
    iconType: 'unocss',
    icon: 'i-carbon-menu',
    roles: ['admin'],
  },
  { pagePath: 'pages/me/index', text: '我的', iconType: 'unocss', icon: 'i-carbon-user' },
]

/** 更新真实 Pinia store，验证自动解包与响应式角色切换。 */
async function setRoles(fields: Partial<IUserInfoRes>) {
  const { useUserStore } = await import('@/store/user')
  useUserStore().setUserInfo({
    userId: '1',
    uniqueId: 'user-1',
    username: 'test',
    nickname: '测试',
    gender: 0,
    ...fields,
  })
}

beforeEach(() => {
  vi.resetModules()
  configState.strategy = 2
  configState.list = tabs.map((item) => ({ ...item }))
  vi.mocked(uni.getStorageSync).mockReturnValue(null)
  vi.mocked(getCurrentPages).mockReturnValue([{ route: 'pages/index/index' }] as ReturnType<
    typeof getCurrentPages
  >)
})

describe('tabbar 角色和路径状态', () => {
  it('无角色时隐藏受限入口，登录后显示，再退出后隐藏', async () => {
    const { tabbarList } = await import('./store')
    expect(tabbarList.value.map((item) => item.text)).toEqual(['首页', '我的'])
    await setRoles({ roles: ['admin'] })
    expect(tabbarList.value.map((item) => item.text)).toEqual(['首页', '关于', '我的'])
    const { useUserStore } = await import('@/store/user')
    useUserStore().clearUserInfo()
    expect(tabbarList.value.map((item) => item.text)).toEqual(['首页', '我的'])
  })

  it('兼容单角色和多个角色', async () => {
    const { tabbarList } = await import('./store')
    await setRoles({ role: 'admin' })
    expect(tabbarList.value).toHaveLength(3)
    await setRoles({ roles: ['user', 'admin'] })
    expect(tabbarList.value).toHaveLength(3)
    await setRoles({ roles: ['user'] })
    expect(tabbarList.value).toHaveLength(2)
  })

  it('可见列表变化后，选中路径仍指向我的页面', async () => {
    const { tabbarStore } = await import('./store')
    tabbarStore.setCurIdx(1)
    expect(uni.setStorageSync).toHaveBeenCalledWith('app-tabbar-path', '/pages/me/index')
    await setRoles({ role: 'admin' })
    expect(tabbarStore.curIdx).toBe(2)
    await setRoles({})
    expect(tabbarStore.curIdx).toBe(1)
  })

  it('当前受限页失去角色后，不错误高亮另一个入口', async () => {
    await setRoles({ role: 'admin' })
    const { tabbarStore, getTabbarRedirectPath } = await import('./store')
    tabbarStore.setAutoCurIdx('/pages/about/about')
    await setRoles({})
    expect(tabbarStore.curIdx).toBe(-1)
    expect(getTabbarRedirectPath('/pages/about/about?from=share')).toBe('/pages/index/index')
  })

  it('h5 根路由按实际首页匹配，即使首页不是配置第一项', async () => {
    configState.list = [tabs[2], tabs[0], tabs[1]]
    const { tabbarStore } = await import('./store')
    tabbarStore.setAutoCurIdx('/')
    expect(tabbarStore.curIdx).toBe(1)
  })

  it('受限首页冷启动时回退到可见页面', async () => {
    configState.list[0].roles = ['admin']
    const { getTabbarRedirectPath } = await import('./store')
    expect(getTabbarRedirectPath('/')).toBe('/pages/me/index')
    expect(getTabbarRedirectPath('/pages/me/index')).toBe('')
  })

  it('没有可访问入口时回退到 404，不放行受限页', async () => {
    configState.list = configState.list.map((item) => ({ ...item, roles: ['admin'] }))
    const { getTabbarRedirectPath } = await import('./store')
    expect(getTabbarRedirectPath('/')).toBe('/pages-redirect/404/index')
    expect(getTabbarRedirectPath('/pages-redirect/404/index')).toBe('')
  })

  it('详情页不修改之前的 Tab 路径，回退按路径恢复', async () => {
    const { tabbarStore } = await import('./store')
    tabbarStore.setCurIdx(1)
    tabbarStore.setAutoCurIdx('/pages-redirect/login/login')
    expect(tabbarStore.curPath).toBe('/pages/me/index')
    tabbarStore.setCurIdx(0)
    tabbarStore.restorePrevIdx()
    expect(tabbarStore.curPath).toBe('/pages/me/index')
  })

  it('恢复路径缓存，不依赖旧的下标缓存', async () => {
    vi.mocked(uni.getStorageSync).mockImplementation((key) =>
      key === 'app-tabbar-path' ? '/pages/me/index' : 99,
    )
    const { tabbarStore } = await import('./store')
    expect(tabbarStore.curIdx).toBe(1)
  })

  it('受限 Tab 页仍属于 TabBar 全集，未知页面不属于', async () => {
    const { isPageTabbar, getTabbarRedirectPath } = await import('./store')
    expect(isPageTabbar('/pages/about/about')).toBe(true)
    expect(isPageTabbar('/not-a-tab')).toBe(false)
    expect(getTabbarRedirectPath('/not-a-tab')).toBe('')
  })

  it('原生策略只认原生列表，不使用自定义角色守卫', async () => {
    configState.strategy = 1
    const { isPageTabbar, getTabbarRedirectPath } = await import('./store')
    expect(isPageTabbar('/')).toBe(true)
    expect(isPageTabbar('/pages/about/about')).toBe(false)
    expect(getTabbarRedirectPath('/pages/about/about')).toBe('')
  })

  it('无 TabBar 策略不拦截页面', async () => {
    configState.strategy = 0
    const { isPageTabbar, getTabbarRedirectPath } = await import('./store')
    expect(isPageTabbar('/')).toBe(false)
    expect(getTabbarRedirectPath('/pages/about/about')).toBe('')
  })
})
