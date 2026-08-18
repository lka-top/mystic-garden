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
  Archive,
  Sparkles
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
  <header class="sticky top-3 z-50 px-3 sm:px-6 select-none transition-all duration-300">
    <div class="max-w-5xl mx-auto">
      <nav
        class="flex items-center justify-between px-3 sm:px-5 h-14 rounded-full border border-sky-100/60 dark:border-slate-800/80 bg-white/80 dark:bg-[#131c31]/80 backdrop-blur-xl shadow-lg shadow-sky-950/[0.04] dark:shadow-black/30 transition-all duration-300 hover:border-sky-400/40"
      >
        <!-- 品牌标识 (晴空蓝与珊瑚粉双色渐变 Logo) -->
        <NuxtLink to="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Sparkles class="w-4 h-4" />
          </div>

          <div class="flex flex-col">
            <span class="font-bold text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              神秘花园
            </span>
            <span class="text-[9px] font-mono text-sky-600/70 dark:text-sky-400/70 uppercase tracking-widest leading-none font-semibold">
              Azure Garden
            </span>
          </div>
        </NuxtLink>

        <!-- 桌面端导航链接 (MD3 药丸激活状态) -->
        <div class="hidden md:flex items-center gap-1 bg-sky-50/60 dark:bg-slate-900/60 p-1 rounded-full border border-sky-100/50 dark:border-slate-800/50">
          <NuxtLink
            v-for="item in navLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5',
              isActive(item.path)
                ? 'bg-white dark:bg-[#1a2542] text-sky-600 dark:text-sky-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300'
            ]"
          >
            <component :is="item.icon" class="w-3.5 h-3.5" />
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- 右侧操作区 (搜索入口、主题切换、移动端汉堡菜单) -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <NuxtLink
            to="/articles"
            class="p-2 rounded-full text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800/80 transition-colors"
            title="搜索文章"
          >
            <Search class="w-4 h-4" />
          </NuxtLink>

          <ThemeToggle />

          <button
            type="button"
            class="md:hidden p-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <component :is="isMobileMenuOpen ? X : Menu" class="w-4 h-4" />
          </button>
        </div>
      </nav>

      <!-- 移动端抽屉下拉菜单 -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0 -translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 -translate-y-2"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden mt-2 p-3 rounded-3xl border border-sky-100 dark:border-slate-800 bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-xl shadow-2xl space-y-1"
        >
          <NuxtLink
            v-for="item in navLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-medium transition-colors',
              isActive(item.path)
                ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-sky-50/60 dark:hover:bg-slate-800/60'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.name }}
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </header>
</template>
