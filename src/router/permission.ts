import type { Router } from 'vue-router'
import { getTabbarRedirectPath, tabbarStore } from '@/tabbar/store'

export const permission = {
  install(router: Router) {
    router.beforeEach((to, _from, next) => {
      // H5 地址栏直达及浏览器前进、后退不会总经过 uni 导航拦截器。
      const redirectPath = getTabbarRedirectPath(to.path)
      if (redirectPath) {
        next(redirectPath)
        return
      }
      tabbarStore.setAutoCurIdx(to.path)
      next()
    })
  },
}
