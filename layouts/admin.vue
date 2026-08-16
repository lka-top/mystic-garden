<script setup lang="ts">
import { LayoutDashboard, BookOpen, Feather, MessageSquare, LogOut, ArrowLeft, ShieldCheck, BookMarked } from 'lucide-vue-next'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'
import { useAuth } from '~/composables/useAuth'

const { logout } = useAuth()
const route = useRoute()

const navItems = [
  { name: '仪表盘', path: '/admin', icon: LayoutDashboard },
  { name: '文章管理', path: '/admin/articles', icon: BookOpen },
  { name: '知识库笔记', path: '/admin/notes', icon: BookMarked },
  { name: '随笔管理', path: '/admin/essays', icon: Feather },
  { name: '评论审核', path: '/admin/comments', icon: MessageSquare },
]

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen flex bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
    <aside class="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 shrink-0">
      <div class="space-y-6">
        <div class="flex items-center justify-between px-2">
          <NuxtLink to="/admin" class="flex items-center gap-2.5 font-bold text-sm tracking-tight">
            <div class="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center">
              <ShieldCheck class="w-4 h-4" />
            </div>
            <span>花园管理后台</span>
          </NuxtLink>
        </div>

        <nav class="space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-medium transition-colors',
              isActive(item.path)
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.name }}
          </NuxtLink>
        </nav>
      </div>

      <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <div class="flex items-center justify-between px-2 text-xs text-zinc-500">
          <NuxtLink to="/" class="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100">
            <ArrowLeft class="w-3.5 h-3.5" />
            返回前台
          </NuxtLink>
          <ThemeToggle />
        </div>

        <button
          type="button"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          @click="logout"
        >
          <LogOut class="w-4 h-4" />
          退出登录
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <main class="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
