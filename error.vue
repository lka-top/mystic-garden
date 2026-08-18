<script setup lang="ts">
import type { NuxtError } from '#app'
import { Home, ArrowLeft, Search, Compass, Sparkles, BookOpen, Bookmark, Coffee, Archive } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'
import SearchModal from '~/components/ui/SearchModal.vue'
import { useSearchModal } from '~/composables/useSearchModal'

const searchModal = useSearchModal()

const props = defineProps<{
  error: NuxtError
}>()

const searchKeyword = ref('')

const is404 = computed(() => props.error?.statusCode === 404 || props.error?.statusCode === '404')

useSeoMeta({
  title: is404.value ? '404 · 迷失的秘境 - 神秘花园' : '系统异常 - 神秘花园',
  description: '您访问的页面似乎已迷失在神秘花园的时光迷雾中。'
})

function handleClearError() {
  clearError({ redirect: '/' })
}

function handleGoBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    handleClearError()
  }
}

function handleSearch() {
  searchModal.open()
}
</script>

<template>
  <div class="min-h-screen relative flex flex-col justify-between bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
    <!-- 1. 梦幻背景图层与毛玻璃流光 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- 顶部环境光晕 -->
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-sky-400/20 via-pink-400/15 to-purple-500/15 blur-[120px] rounded-full" />
      <div class="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-gradient-to-tl from-sky-500/15 via-rose-500/15 to-transparent blur-[100px] rounded-full" />

      <!-- 点阵背景装饰 -->
      <div class="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.12)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70" />
    </div>

    <!-- 2. 顶栏极简导航 -->
    <header class="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-rose-500 bg-clip-text text-transparent group"
        @click="clearError"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-sky-400 to-rose-500 group-hover:scale-125 transition-transform" />
        神秘花园 · LUOKAI GARDEN
      </NuxtLink>

      <div class="flex items-center gap-3">
        <ThemeToggle :is-transparent="false" />
      </div>
    </header>

    <!-- 3. 核心 404 视觉与交互容器 -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div class="w-full max-w-2xl mx-auto text-center space-y-8">
        <!-- 巨大 404 艺术渐变字与浮动光标 -->
        <div class="relative inline-block select-none">
          <div class="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r from-sky-400 via-rose-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm animate-pulse">
            {{ is404 ? '404' : (error?.statusCode || '500') }}
          </div>
          <!-- 悬浮小图标徽章 -->
          <div class="absolute -top-3 -right-4 sm:-right-6 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-rose-200/60 dark:border-rose-900/60 text-rose-500 shadow-md flex items-center gap-1.5 animate-bounce">
            <Sparkles class="w-3.5 h-3.5 text-rose-500" />
            <span>{{ is404 ? 'PAGE NOT FOUND' : 'ERROR' }}</span>
          </div>
        </div>

        <!-- 诗意标题与阐述 -->
        <div class="space-y-3 px-4">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {{ is404 ? '哎呀，似乎迷失在花园的迷雾深处了...' : '这方天地暂时发生了一点小波动' }}
          </h1>
          <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {{ is404 ? '你所探寻的秘境尚未开辟，或是在时光流转中被拂去了痕迹。不妨随微风返回熟悉的路径。' : (error?.message || '服务器遇到未知状况，请稍后再试。') }}
          </p>
        </div>

        <!-- 快速搜寻输入框 -->
        <div class="max-w-md mx-auto px-4">
          <form class="relative group" @submit.prevent="handleSearch">
            <Search class="w-4 h-4 text-slate-400 group-focus-within:text-sky-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索感兴趣的文章、知识笔记..."
              class="w-full pl-11 pr-24 py-3 rounded-full text-xs sm:text-sm bg-white/85 dark:bg-slate-900/70 border border-sky-100 dark:border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all placeholder:text-slate-400"
            >
            <button
              type="submit"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-xs cursor-pointer"
            >
              寻找
            </button>
          </form>
        </div>

        <!-- 操作按钮组 -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            class="rounded-full shadow-lg shadow-sky-500/20 bg-gradient-to-r from-sky-500 to-rose-500 text-white hover:opacity-90 transition-all cursor-pointer font-bold px-6"
            @click="handleClearError"
          >
            <Home class="w-4 h-4 mr-2" />
            返回花园首页
          </Button>

          <Button
            variant="outline"
            size="lg"
            class="rounded-full border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer px-5"
            @click="handleGoBack"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            返回上一页
          </Button>
        </div>

        <!-- 推荐快捷漫游入口 -->
        <div class="pt-6 border-t border-sky-100/60 dark:border-slate-800/60 max-w-lg mx-auto">
          <div class="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3 flex items-center justify-center gap-1.5">
            <Compass class="w-3.5 h-3.5" />
            <span>探索花园中的其他景致</span>
          </div>

          <div class="flex flex-wrap justify-center gap-2">
            <NuxtLink
              to="/articles"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/70 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError"
            >
              <BookOpen class="w-3 h-3 text-sky-500" />
              技术文章
            </NuxtLink>

            <NuxtLink
              to="/notes"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/70 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError"
            >
              <Bookmark class="w-3 h-3 text-emerald-500" />
              速查笔记
            </NuxtLink>

            <NuxtLink
              to="/essays"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/70 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError"
            >
              <Coffee class="w-3 h-3 text-amber-500" />
              即时随笔
            </NuxtLink>

            <NuxtLink
              to="/archive"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/70 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError"
            >
              <Archive class="w-3 h-3 text-rose-500" />
              时空归档
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- 全局搜索弹窗 (Ctrl+K) -->
    <SearchModal />

    <!-- 4. 页脚极简版权 -->
    <footer class="relative z-10 py-6 text-center text-xs text-slate-400 font-mono">
      © {{ new Date().getFullYear() }} 神秘花园 · LuoKai Garden · All Rights Reserved
    </footer>
  </div>
</template>
