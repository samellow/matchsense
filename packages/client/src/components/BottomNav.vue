<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  {
    name: 'Today',
    path: '/',
  },
  {
    name: 'History',
    path: '/history',
  },
  {
    name: 'Tips',
    path: '/tips',
  },
]

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
    <div class="flex items-center justify-around h-16 px-4">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigate(item.path)"
        :class="[
          'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors',
          isActive(item.path)
            ? 'text-risk-low'
            : 'text-text-muted hover:text-text'
        ]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            v-if="item.name === 'Today'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
          <path
            v-else-if="item.name === 'History'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            v-else-if="item.name === 'Tips'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span class="text-xs font-medium">{{ item.name }}</span>
      </button>
    </div>
  </nav>
</template>

