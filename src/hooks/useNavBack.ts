const TAB_PAGE_SET = new Set([
  '/pages/index/index',
  '/pages/me/index',
])

/** 统一处理自定义导航栏返回，无法后退时回到兜底页面 */
export function useNavBack(fallbackUrl = '/pages/index/index') {
  const handleBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
      return
    }

    const url = fallbackUrl.startsWith('/') ? fallbackUrl : `/${fallbackUrl}`
    if (TAB_PAGE_SET.has(url)) {
      uni.switchTab({ url })
      return
    }

    uni.redirectTo({ url })
  }

  return {
    handleBack,
  }
}
