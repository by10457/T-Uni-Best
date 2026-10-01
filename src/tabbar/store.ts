import type { UserRole } from '@/api/types/login'
import type {
  CustomTabBarItem,
  CustomTabBarItemBadge,
  CustomTabBarRuntimeItem,
  NativeTabBarItem,
} from './types'
import { computed, reactive, ref } from 'vue'
import { NOT_FOUND_PAGE } from '@/router/config'
import { useUserStore } from '@/store/user'
import { HOME_PAGE } from '@/utils'

import {
  customTabbarList as _tabbarList,
  nativeTabbarList,
  selectedTabbarStrategy,
  TABBAR_STRATEGY_MAP,
} from './config'

/** 将配置路径转换成 uni-app 导航所需的绝对路径。 */
function normalizeTabbarPath(
  path: CustomTabBarItem['pagePath'] | NativeTabBarItem['pagePath'],
): _LocationUrl {
  return (path.startsWith('/') ? path : `/${path}`) as _LocationUrl
}

/** 去掉查询参数和锚点，统一路由路径。 */
export function normalizeRoutePath(path?: string) {
  if (!path) {
    return ''
  }
  const _path = path.split(/[?#]/)[0]
  return _path.startsWith('/') ? _path : `/${_path}`
}

/** 读取当前实际页面，供导航完成后的高亮同步使用。 */
function getCurrentPagePath() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return normalizeRoutePath(currentPage?.route)
}

/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const baseTabbarList = reactive<CustomTabBarRuntimeItem[]>(
  _tabbarList.map((item) => ({
    ...item,
    pagePath: normalizeTabbarPath(item.pagePath), // 统一成 '/' 开头的路径
  })),
)
/** 原生 TabBar 的页面集合，不参与自定义角色过滤。 */
const nativeTabbarPathList = nativeTabbarList.map((item) => normalizeTabbarPath(item.pagePath))

/** Pinia setup store 已解包用户信息，直接读取单角色或多角色字段。 */
const userRoles = computed<UserRole[]>(() => {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  if (Array.isArray(userInfo?.roles) && userInfo.roles.length > 0) {
    return userInfo.roles
  }
  if (userInfo?.role) {
    return [userInfo.role]
  }
  return []
})

/** 未配置角色限制的入口对所有用户可见。 */
function hasRequiredRoles(item: CustomTabBarRuntimeItem) {
  return !item.roles?.length || item.roles.some((role) => userRoles.value.includes(role))
}

/** 当前用户可以看到的自定义 TabBar 入口。 */
const tabbarList = computed(() => baseTabbarList.filter(hasRequiredRoles))

/** H5 根路由对应真实首页，不能假定首页是过滤后的第零项。 */
function resolveTabbarPath(path?: string) {
  const normalizedPath = normalizeRoutePath(path)
  return normalizedPath === '/' ? HOME_PAGE : normalizedPath
}

/** 查找当前用户可见列表的下标；受限页和非 TabBar 页返回 -1。 */
function findTabbarIndexByPath(path?: string) {
  return tabbarList.value.findIndex((item) => item.pagePath === resolveTabbarPath(path))
}

/** 判断页面是否属于 TabBar 配置全集，避免受限页失去导航入口。 */
export function isPageTabbar(path: string) {
  if (selectedTabbarStrategy === TABBAR_STRATEGY_MAP.NO_TABBAR) {
    return false
  }
  const _path = resolveTabbarPath(path)
  if (selectedTabbarStrategy === TABBAR_STRATEGY_MAP.NATIVE_TABBAR) {
    return nativeTabbarPathList.includes(_path as _LocationUrl)
  }
  return baseTabbarList.some((item) => item.pagePath === _path)
}

/** 受限 TabBar 页面跳到可见页面；没有可用入口时回退到 404，避免放行受限页。 */
export function getTabbarRedirectPath(path?: string) {
  if (selectedTabbarStrategy !== TABBAR_STRATEGY_MAP.CUSTOM_TABBAR) {
    return ''
  }
  const item = baseTabbarList.find((item) => item.pagePath === resolveTabbarPath(path))
  if (!item || hasRequiredRoles(item)) {
    return ''
  }
  return tabbarList.value.find((item) => !item.isBulge)?.pagePath || NOT_FOUND_PAGE
}

/** 角色变化会改变下标，持久化页面路径才能保持高亮对应同一个页面。 */
const TABBAR_PATH_STORAGE_KEY = 'app-tabbar-path'
/** 只恢复字符串路径，不使用旧版下标缓存。 */
const cachedPath: unknown = uni.getStorageSync(TABBAR_PATH_STORAGE_KEY)
/** 当前选中的页面路径。 */
const curPath = ref(resolveTabbarPath(typeof cachedPath === 'string' ? cachedPath : HOME_PAGE))
/** 导航失败或主动回退时恢复的页面路径。 */
const prevPath = ref(curPath.value)

/**
 * 自定义 tabbar 的状态管理，原生 tabbar 无需关注本文件
 * tabbar 状态，增加 storageSync 保证刷新浏览器时在正确的 tabbar 页面
 * 使用reactive简单状态，而不是 pinia 全局状态
 */
const tabbarStore = reactive({
  get curPath() {
    return curPath.value
  },
  get curIdx() {
    return findTabbarIndexByPath(curPath.value)
  },
  set curIdx(idx: number) {
    this.setCurIdx(idx)
  },
  get prevIdx() {
    return findTabbarIndexByPath(prevPath.value)
  },
  /** 设置路径后实时推导高亮下标。 */
  setCurPath(path: string) {
    const normalizedPath = resolveTabbarPath(path)
    if (normalizedPath === curPath.value) return
    prevPath.value = curPath.value
    curPath.value = normalizedPath
    uni.setStorageSync(TABBAR_PATH_STORAGE_KEY, normalizedPath)
  },
  /** 将用户点击的可见下标转换为稳定路径。 */
  setCurIdx(idx: number) {
    this.setCurPath(tabbarList.value[idx]?.pagePath || '')
  },
  /** 更新当前可见入口的角标。 */
  setTabbarItemBadge(idx: number, badge: CustomTabBarItemBadge) {
    const list = tabbarList.value
    if (list[idx]) {
      list[idx].badge = badge
    }
  },
  setAutoCurIdx(path: string) {
    // 详情页保留之前的 Tab；受限 Tab 页保留路径但不高亮其他入口。
    if (isPageTabbar(path)) this.setCurPath(path)
  },
  syncCurIdxByCurrentPage() {
    const currentPath = getCurrentPagePath()
    if (currentPath) {
      this.setAutoCurIdx(currentPath)
    }
  },
  syncCurIdxByCurrentPageAsync() {
    setTimeout(() => {
      this.syncCurIdxByCurrentPage()
    }, 0)
  },
  isCurrentRouteTabbarItem(index: number) {
    const item = tabbarList.value[index]
    if (!item) {
      return false
    }
    return findTabbarIndexByPath(getCurrentPagePath()) === index
  },
  restorePrevIdx() {
    this.setCurPath(prevPath.value)
  },
})

export { tabbarList, tabbarStore }
