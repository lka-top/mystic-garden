<script setup lang="ts">
import { ref } from 'vue'
import {
  Compass,
  BookOpen,
  Feather,
  BookMarked,
  Search,
  Menu,
  X,
  User,
  Archive
} from 'lucide-vue-next'
import ThemeToggle from './ThemeToggle.vue'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: '首页', path: '/', icon: Compass },
  { name: '文章', path: '/articles', icon: BookOpen },
  { name: '笔记', path: '/notes', icon: BookMarked },
  { name: '随笔', path: '/essays', icon: Feather },
  { name: '归档', path: '/archive', icon: Archive },
  { name: '关于', path: '/about', icon: User }
]

const route = useRoute()
function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-4 z-40 px-4 sm:px-6">
    <div class="max-w-5xl mx-auto">
      <nav
        class="flex items-center justify-between px-4 sm:px-6 h-14 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700"
      >
        <!-- 品牌标识 (高质感几何矢量 Logo) -->
        <NuxtLink to="/" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div class="flex flex-col">
            <span class="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              神秘花园
            </span>
            <span class="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider leading-none">
              Digital Garden
            </span>
          </div>
        </NuxtLink>

        <!-- 桌面端导航链接 (含知识库笔记入口) -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5',
              isActive(item.path)
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            ]"
          >
            <component :is="item.icon" class="w-3.5 h-3.5" />
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- 右侧操作区 (搜索入口、主题切换、移动端汉堡菜单) -->
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/articles"
            class="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="搜索文章"
          >
            <Search class="w-4 h-4" />
          </NuxtLink>

          <ThemeToggle />

          <button
            type="button"
            class="md:hidden p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <component :is="isMobileMenuOpen ? X : Menu" class="w-4 h-4" />
          </button>
        </div>
      </nav>

      <!-- 移动端抽屉下拉菜单 -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden mt-2 p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg shadow-xl space-y-1"
      >
        <NuxtLink
          v-for="item in navLinks"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-colors',
            isActive(item.path)
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          ]"
          @click="isMobileMenuOpen = false"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
