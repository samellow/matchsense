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
  {
    path: '/bet-breakdown',
    name: 'bet-breakdown',
    component: () => import('@/views/BetBreakdownView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

