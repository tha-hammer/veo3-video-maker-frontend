import type { Router } from 'vue-router'

export function setupRouterDebug(router: Router) {
  router.beforeEach((to, from) => {
    console.log(`🚀 Navigation triggered: ${from.fullPath} -> ${to.fullPath}`)
    return true
  })

  router.afterEach((to, from) => {
    console.log(`✅ Navigation completed: ${from.fullPath} -> ${to.fullPath}`)
  })

  router.onError((error) => {
    console.error('❌ Navigation error:', error)
  })
} 