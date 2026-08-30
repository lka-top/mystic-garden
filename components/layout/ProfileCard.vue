<script setup lang="ts">
import { ref } from 'vue'
import {
  Github,
  Mail,
  Rss,
  Sparkles,
  BookOpen,
  FolderTree,
  Tag as TagIcon,
  Heart
} from 'lucide-vue-next'
import type { ApiResponse } from '~/types'

const config = useRuntimeConfig()
const authorName = config.public.authorName || 'lka'
const authorBio = config.public.authorBio || '全栈开发者 · 晴空之下探索现代 Web 架构与设计'

// 预取文章、分类、标签统计概览
const { data: statsRes } = await useFetch<ApiResponse<any>>('/api/v1/stats/overview')
const stats = computed(() => statsRes.value?.data || { articles: 0, categories: 0, tags: 0 })
</script>

<template>
  <div class="md3-card p-6 flex flex-col items-center text-center relative overflow-hidden group select-none">
    <!-- 顶部双色流光背景微粒 -->
    <div class="absolute -top-12 -right-12 w-36 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
    <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-rose-400/15 rounded-full blur-2xl pointer-events-none" />

    <!-- 1. 头像区 (蔚蓝与珊瑚粉渐变呼吸光环) -->
    <div class="relative mb-4">
      <div class="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-sky-500 via-sky-300 to-rose-400 shadow-md shadow-sky-500/20 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
          :alt="authorName"
          class="w-full h-full object-cover rounded-[20px] bg-sky-50 dark:bg-slate-800"
        />
      </div>
      <!-- 珊瑚粉心动/在线状态小红点 -->
      <span
        class="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white dark:border-[#131c31] shadow-xs animate-pulse"
        title="晴空在线探索"
      />
    </div>

    <!-- 2. 姓名与个性签名 -->
    <div class="space-y-1 mb-5">
      <div class="flex items-center justify-center gap-1.5 font-black text-lg text-slate-900 dark:text-white">
        <span>{{ authorName }}</span>
        <Sparkles class="w-4 h-4 text-sky-500" />
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-xs">
        {{ authorBio }}
      </p>
    </div>

    <!-- 3. 数据统计卡片 (文章/分类/标签) -->
    <div class="grid grid-cols-3 gap-2 w-full py-3 px-2 rounded-2xl bg-sky-50/60 dark:bg-slate-900/60 border border-sky-100/60 dark:border-slate-800/60 mb-5">
      <NuxtLink to="/articles" class="flex flex-col items-center group/stat hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
        <span class="text-base font-extrabold font-mono text-sky-600 dark:text-sky-400 group-hover/stat:scale-110 transition-transform">
          {{ stats.articles || 0 }}
        </span>
        <span class="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
          <BookOpen class="w-2.5 h-2.5 text-sky-500" /> 文章
        </span>
      </NuxtLink>

      <NuxtLink to="/articles" class="flex flex-col items-center group/stat hover:text-sky-600 dark:hover:text-sky-400 transition-colors border-x border-sky-200/50 dark:border-slate-800/60">
        <span class="text-base font-extrabold font-mono text-sky-600 dark:text-sky-400 group-hover/stat:scale-110 transition-transform">
          {{ stats.categories || 0 }}
        </span>
        <span class="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
          <FolderTree class="w-2.5 h-2.5 text-rose-400" /> 分类
        </span>
      </NuxtLink>

      <NuxtLink to="/articles" class="flex flex-col items-center group/stat hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
        <span class="text-base font-extrabold font-mono text-sky-600 dark:text-sky-400 group-hover/stat:scale-110 transition-transform">
          {{ stats.tags || 0 }}
        </span>
        <span class="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
          <TagIcon class="w-2.5 h-2.5 text-amber-400" /> 标签
        </span>
      </NuxtLink>
    </div>

    <!-- 4. 社交图标栏 (MD3 药丸图标按钮) -->
    <div class="flex items-center justify-center gap-2">
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        class="p-2.5 rounded-full bg-sky-50 dark:bg-slate-800/80 text-slate-600 hover:text-white hover:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-900 dark:hover:bg-white transition-all duration-200 hover:scale-110 shadow-xs"
        title="GitHub"
      >
        <Github class="w-4 h-4" />
      </a>
      <a
        href="mailto:contact@example.com"
        class="p-2.5 rounded-full bg-rose-50 dark:bg-slate-800/80 text-rose-500 hover:text-white hover:bg-rose-500 dark:text-rose-400 dark:hover:text-white dark:hover:bg-rose-500 transition-all duration-200 hover:scale-110 shadow-xs"
        title="Email"
      >
        <Mail class="w-4 h-4" />
      </a>
      <NuxtLink
        to="/archive"
        class="p-2.5 rounded-full bg-sky-50 dark:bg-slate-800/80 text-sky-600 hover:text-white hover:bg-sky-500 dark:text-sky-400 dark:hover:text-white dark:hover:bg-sky-500 transition-all duration-200 hover:scale-110 shadow-xs"
        title="RSS 订阅 / 归档"
      >
        <Rss class="w-4 h-4" />
      </NuxtLink>
    </div>
  </div>
</template>
