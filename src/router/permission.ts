import type { Router } from 'vue-router'
import { tabbarStore } from '@/tabbar/store'

export const permission = {
  install(router: Router) {
    router.beforeEach((to, _from, next) => {
      tabbarStore.setAutoCurIdx(to.path)
      next()
    })
  },
}
