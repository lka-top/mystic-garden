<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
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
import { useSearchModal } from '~/composables/useSearchModal'

const searchModal = useSearchModal()
const isMobileMenuOpen = ref(false)
const route = useRoute()

const navLinks = [
  { name: '首页', path: '/', icon: Compass },
  { name: '文章', path: '/articles', icon: BookOpen },
  { name: '笔记', path: '/notes', icon: BookMarked },
  { name: '随笔', path: '/essays', icon: Feather },
  { name: '归档', path: '/archive', icon: Archive },
  { name: '关于', path: '/about', icon: User }
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// 滚动监听与进度计算
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 60)
// 判断是否处于顶部透明全宽模式 (全站所有页面在顶部未滚动时均生效)
const isTransparentMode = computed(() => !isScrolled.value)

// 全局滚动进度条百分比
const scrollProgress = ref(0)
function updateScrollProgress() {
  if (typeof window === 'undefined') return
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    scrollProgress.value = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
  } else {
    scrollProgress.value = 0
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  updateScrollProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<template>
  <!-- 1. 全局顶部动态蓝色阅读进度条 -->
  <div
    v-show="scrollProgress > 0"
    class="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-sky-400 via-sky-500 to-rose-400 z-[60] transition-all duration-100 ease-out shadow-xs pointer-events-none"
    :style="{ width: `${scrollProgress}%` }"
  />

  <!-- 2. Mizuki 风格动态响应式导航栏 -->
  <header
    :class="[
      'fixed top-0 inset-x-0 z-50 select-none transition-all duration-500 ease-out',
      isTransparentMode
        ? 'py-3 sm:py-4 px-4 sm:px-10 bg-gradient-to-b from-black/60 via-black/25 to-transparent backdrop-blur-[2px]'
        : 'pt-3 px-3 sm:px-6 pointer-events-none'
    ]"
  >
    <div
      :class="[
        'transition-all duration-500 ease-out',
        isTransparentMode
          ? 'w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto'
          : 'max-w-5xl mx-auto pointer-events-auto'
      ]"
    >
      <nav
        :class="[
          'flex items-center justify-between transition-all duration-500 ease-out',
          isTransparentMode
            ? 'w-full h-12 bg-transparent border-transparent shadow-none px-2'
            : 'px-3 sm:px-5 h-14 rounded-full border border-sky-100/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#131c31]/85 backdrop-blur-xl shadow-lg shadow-sky-950/[0.05] dark:shadow-black/40 hover:border-sky-400/40'
        ]"
      >
        <!-- 品牌标识 Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 group">
          <div
            :class="[
              'w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-3',
              isTransparentMode
                ? 'bg-white/25 backdrop-blur-md border border-white/30 text-white'
                : 'bg-gradient-to-tr from-sky-500 via-sky-400 to-rose-400 shadow-sky-500/25'
            ]"
          >
            <Sparkles class="w-4 h-4 text-sky-200" />
          </div>

          <div class="flex flex-col">
            <span
              :class="[
                'font-bold text-sm tracking-tight transition-colors',
                isTransparentMode
                  ? 'text-white drop-shadow-md group-hover:text-sky-200'
                  : 'text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400'
              ]"
            >
              神秘花园
            </span>
            <span
              :class="[
                'text-[9px] font-mono uppercase tracking-widest leading-none font-semibold transition-colors',
                isTransparentMode
                  ? 'text-white/80 drop-shadow-xs'
                  : 'text-sky-600/70 dark:text-sky-400/70'
              ]"
            >
              Azure Garden
            </span>
          </div>
        </NuxtLink>

        <!-- 桌面端导航链接 -->
        <div
          :class="[
            'hidden md:flex items-center gap-1 p-1 rounded-full transition-all duration-300',
            isTransparentMode
              ? 'bg-black/20 backdrop-blur-md border border-white/15'
              : 'bg-sky-50/60 dark:bg-slate-900/60 border border-sky-100/50 dark:border-slate-800/50'
          ]"
        >
          <NuxtLink
            v-for="item in navLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5',
              isActive(item.path)
                ? (isTransparentMode
                    ? 'bg-white/25 text-white font-bold backdrop-blur-md shadow-xs'
                    : 'bg-white dark:bg-[#1a2542] text-sky-600 dark:text-sky-300 font-bold shadow-xs')
                : (isTransparentMode
                    ? 'text-white/85 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300')
            ]"
          >
            <component :is="item.icon" class="w-3.5 h-3.5" />
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- 右侧操作区 (搜索入口、主题切换、移动端汉堡菜单) -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            :class="[
              'p-2 rounded-full transition-colors cursor-pointer',
              isTransparentMode
                ? 'text-white/90 hover:text-white hover:bg-white/20'
                : 'text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800/80'
            ]"
            title="搜索 (Ctrl + K)"
            @click="searchModal.open()"
          >
            <Search class="w-4 h-4" />
          </button>

          <ThemeToggle :is-transparent="isTransparentMode" />

          <button
            type="button"
            :class="[
              'md:hidden p-2 rounded-full transition-colors',
              isTransparentMode
                ? 'text-white hover:bg-white/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-slate-800'
            ]"
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
