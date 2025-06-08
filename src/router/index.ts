import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupRouterDebug } from './debug'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: 'presentations',
        name: 'presentations',
        component: () => import('../views/PresentationsView.vue')
      },
      {
        path: 'presentations/new',
        name: 'new-presentation',
        component: () => import('../views/NewPresentationView.vue')
      },
      {
        path: 'review/:id',
        name: 'review',
        component: () => import('../views/ReviewView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Add debug logging in development
if (import.meta.env.DEV) {
  setupRouterDebug(router)
}

export default router 