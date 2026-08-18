<script setup lang="ts">
import { Calendar, Eye, Clock, MessageSquare, Pin, ArrowRight, Heart } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Article } from '~/types'

interface Props {
  article: Article
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0
})
</script>

<template>
  <article
    v-motion
    :initial="{ opacity: 0, y: 28, scale: 0.98 }"
    :visible-once="{
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 500,
        delay: Math.min((props.index % 10) * 100, 600),
        ease: 'easeOut'
      }
    }"
    class="md3-card group relative flex flex-col sm:flex-row gap-5 p-5 sm:p-6 hover:-translate-y-1 transition-all duration-300"
  >
    <!-- 1. 封面图 (左侧大图 / 渐变回退) -->
    <div
      class="w-full sm:w-60 h-44 sm:h-auto shrink-0 rounded-2xl overflow-hidden relative bg-sky-50 dark:bg-slate-800 shadow-xs"
    >
      <img
        v-if="article.coverImage"
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full min-h-[160px] bg-gradient-to-tr from-sky-500/20 via-rose-400/10 to-transparent flex items-center justify-center text-sky-600/40 dark:text-sky-400/40"
      >
        <span class="font-mono text-3xl font-black">#{{ (props.index + 1).toString().padStart(2, '0') }}</span>
      </div>

      <!-- 置顶徽章 (悬浮在封面上 - 珊瑚粉渐变) -->
      <div v-if="article.isPinned" class="absolute top-2.5 left-2.5">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md">
          <Pin class="w-3 h-3" />
          置顶推荐
        </span>
      </div>
    </div>

    <!-- 2. 文本与元数据主体 -->
    <div class="flex-1 flex flex-col justify-between space-y-3">
      <div>
        <!-- 标签与分类药丸 -->
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span
            v-if="article.category"
            class="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50"
          >
            {{ article.category.name }}
          </span>

          <span
            v-for="tag in article.tags?.slice(0, 3)"
            :key="tag.id"
            class="text-[11px] text-slate-400 dark:text-slate-500 font-mono"
          >
            #{{ tag.name }}
          </span>
        </div>

        <!-- 标题 -->
        <h2 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          <NuxtLink :to="`/articles/${article.slug}`" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            {{ article.title }}
          </NuxtLink>
        </h2>

        <!-- 摘要文案 -->
        <p class="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
          {{ article.summary }}
        </p>
      </div>

      <!-- 3. 底部信息行 -->
      <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-sky-100/60 dark:border-slate-800/80">
        <div class="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span class="flex items-center gap-1 font-mono text-[11px]">
            <Calendar class="w-3.5 h-3.5 text-sky-500" />
            {{ dayjs(article.createdAt).format('YYYY-MM-DD') }}
          </span>
          <span class="flex items-center gap-1 font-mono text-[11px]">
            <Clock class="w-3.5 h-3.5 text-rose-400" />
            {{ article.readingTime }}m
          </span>
          <span class="flex items-center gap-1 font-mono text-[11px]">
            <Eye class="w-3.5 h-3.5 text-amber-400" />
            {{ article.views }}
          </span>
          <span v-if="article.commentCount !== undefined" class="flex items-center gap-1 font-mono text-[11px]">
            <MessageSquare class="w-3.5 h-3.5 text-emerald-400" />
            {{ article.commentCount }}
          </span>
        </div>

        <!-- 阅读箭头 -->
        <div class="hidden sm:flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform duration-200">
          <span>阅读全文</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  </article>
</template>
