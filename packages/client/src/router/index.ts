import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/HistoryView.vue'),
  },
  {
    path: '/tips',
    name: 'tips',
    component: () => import('@/views/TipsView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

