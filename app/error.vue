<script setup lang="ts">
import type { NuxtError } from '#app'
import { Home, ArrowLeft, Search, Compass, BookOpen, Bookmark, Coffee, Archive } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'

const props = defineProps<{
  error: NuxtError
}>()

const searchKeyword = ref('')

const is404 = computed(() => String(props.error?.statusCode) === '404')

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
  if (searchKeyword.value.trim()) {
    clearError()
    navigateTo(`/articles?q=${encodeURIComponent(searchKeyword.value.trim())}`)
  }
}
</script>

<template>
  <div class="min-h-screen relative flex flex-col justify-between text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
    <!-- 1. 梦幻背景图层与毛玻璃微光 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <!-- 柔和环境光晕 -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-b from-sky-400/15 to-indigo-400/10 blur-[130px] rounded-full" />
      <!-- 点阵背景装饰 -->
      <div class="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.08)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>

    <!-- 2. 顶栏极简导航 -->
    <header class="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="inline-flex flex-col group cursor-pointer"
        @click="clearError()"
      >
        <span class="font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
          神秘花园
        </span>
        <span class="text-[9px] font-mono uppercase tracking-widest font-semibold text-sky-600/70 dark:text-sky-400/70">
          Azure Garden
        </span>
      </NuxtLink>

      <div class="flex items-center gap-3">
        <ThemeToggle :is-transparent="false" />
      </div>
    </header>

    <!-- 3. 核心 404 视觉与交互容器 -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-xl mx-auto text-center space-y-7 p-8 sm:p-12 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/70 dark:border-slate-800 shadow-xl shadow-sky-950/5">
        <!-- 巨大 404 纯粹微光数字 -->
        <div class="relative inline-block select-none">
          <div class="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-500 dark:from-sky-300 dark:via-sky-400 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-sm leading-none">
            {{ is404 ? '404' : (error?.statusCode || '500') }}
          </div>
        </div>

        <!-- 诗意标题与阐述 -->
        <div class="space-y-2.5 px-2">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {{ is404 ? '哎呀，似乎迷失在花园的迷雾深处了' : '这方天地暂时发生了一点小波动' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {{ is404 ? '你所探寻的秘境尚未开辟，或是在时光流转中被拂去了痕迹。不妨随微风返回熟悉的路径。' : (error?.message || '服务器遇到未知状况，请稍后再试。') }}
          </p>
        </div>

        <!-- 快速搜寻输入框 -->
        <div class="max-w-md mx-auto">
          <form class="relative group" @submit.prevent="handleSearch">
            <Search class="w-4 h-4 text-slate-400 group-focus-within:text-sky-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索感兴趣的文章、知识笔记..."
              class="w-full pl-11 pr-24 py-2.5 rounded-full text-xs sm:text-sm bg-white/90 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all placeholder:text-slate-400"
            >
            <button
              type="submit"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold rounded-full bg-sky-500 hover:bg-sky-600 active:scale-95 text-white transition-all shadow-xs cursor-pointer"
            >
              寻找
            </button>
          </form>
        </div>

        <!-- 操作按钮组 -->
        <div class="flex flex-wrap items-center justify-center gap-3.5 pt-1">
          <Button
            size="lg"
            class="rounded-full shadow-md shadow-sky-500/20 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white transition-all cursor-pointer font-bold px-6 text-xs sm:text-sm"
            @click="handleClearError"
          >
            <Home class="w-4 h-4 mr-2" />
            返回花园首页
          </Button>

          <Button
            variant="outline"
            size="lg"
            class="rounded-full border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 transition-all cursor-pointer px-5 text-xs sm:text-sm"
            @click="handleGoBack"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            返回上一页
          </Button>
        </div>

        <!-- 推荐快捷漫游入口 -->
        <div class="pt-5 border-t border-sky-100/60 dark:border-slate-800 max-w-md mx-auto">
          <div class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center justify-center gap-1.5">
            <Compass class="w-3.5 h-3.5 text-sky-500" />
            <span>探索花园中的其他景致</span>
          </div>

          <div class="flex flex-wrap justify-center gap-2">
            <NuxtLink
              to="/articles"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-50/70 dark:bg-slate-800/70 hover:bg-sky-100/80 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError()"
            >
              <BookOpen class="w-3 h-3 text-sky-500" />
              技术文章
            </NuxtLink>

            <NuxtLink
              to="/notes"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-50/70 dark:bg-slate-800/70 hover:bg-sky-100/80 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError()"
            >
              <Bookmark class="w-3 h-3 text-emerald-500" />
              速查笔记
            </NuxtLink>

            <NuxtLink
              to="/essays"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-50/70 dark:bg-slate-800/70 hover:bg-sky-100/80 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError()"
            >
              <Coffee class="w-3 h-3 text-amber-500" />
              即时随笔
            </NuxtLink>

            <NuxtLink
              to="/archive"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-50/70 dark:bg-slate-800/70 hover:bg-sky-100/80 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              @click="clearError()"
            >
              <Archive class="w-3 h-3 text-indigo-500" />
              时空归档
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- 4. 页脚极简版权 -->
    <footer class="relative z-10 py-5 text-center text-xs text-slate-400 font-mono">
      © {{ new Date().getFullYear() }} 神秘花园 · Azure Garden · All Rights Reserved
    </footer>
  </div>
</template>
