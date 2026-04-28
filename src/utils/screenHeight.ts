import { systemInfo } from '@/utils/systemInfo'

/** 获取顶部导航栏高度 */
export function getNavBarHeight() {
  return systemInfo.statusBarHeight + 44
}

/** 获取底部tabbar高度 */
export function getTabBarHeight() {
  return systemInfo.safeAreaInsets.bottom + 50
}

/** 减去底部tabbar的高度 */
export function getHeightSubBottom() {
  return systemInfo.screenHeight - (systemInfo.safeAreaInsets.bottom + 50)
}

/** 获取减去顶部导航栏的高度 */
export function getHeightSubNavBar() {
  return systemInfo.screenHeight - (systemInfo.statusBarHeight + 44)
}

/** 获取中间区域高度（减去顶部导航栏和底部tabbar） */
export function getMiddleHeight() {
  return (
    systemInfo.screenHeight -
    (systemInfo.statusBarHeight + 44) -
    (systemInfo.safeAreaInsets.bottom + 50)
  )
}

/** 获取屏幕高度 */
export function getScreenHeight() {
  return systemInfo.screenHeight
}
