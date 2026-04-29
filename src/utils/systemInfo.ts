/* eslint-disable import/no-mutable-exports */
type SafeAreaInsets = UniNamespace.SafeAreaInsets
type AppSystemInfo = (UniNamespace.GetWindowInfoResult | UniNamespace.GetSystemInfoResult) & {
  safeAreaInsets: SafeAreaInsets
  statusBarHeight: number
}

// 获取屏幕边界到安全区域距离
let systemInfo: AppSystemInfo
let safeAreaInsets: SafeAreaInsets

// #ifdef MP-WEIXIN
// 微信小程序使用新的API
systemInfo = uni.getWindowInfo()
safeAreaInsets = systemInfo.safeArea
  ? {
      top: systemInfo.safeArea.top,
      right: systemInfo.windowWidth - systemInfo.safeArea.right,
      bottom: systemInfo.windowHeight - systemInfo.safeArea.bottom,
      left: systemInfo.safeArea.left,
    }
  : systemInfo.safeAreaInsets
// #endif

// #ifndef MP-WEIXIN
// 其他平台继续使用uni API
const _systemInfo = uni.getSystemInfoSync()
systemInfo = {
  ..._systemInfo,
  safeAreaInsets: _systemInfo.safeAreaInsets || {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  statusBarHeight: _systemInfo.statusBarHeight || 0,
}
safeAreaInsets = systemInfo.safeAreaInsets
// #endif

console.log('systemInfo', systemInfo)
// 微信里面打印
// pixelRatio: 3
// safeArea: {top: 47, left: 0, right: 390, bottom: 810, width: 390, …}
// safeAreaInsets: {top: 47, left: 0, right: 0, bottom: 34}
// screenHeight: 844
// screenTop: 91
// screenWidth: 390
// statusBarHeight: 47
// windowBottom: 0
// windowHeight: 753
// windowTop: 0
// windowWidth: 390
export { safeAreaInsets, systemInfo }
