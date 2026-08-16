<script setup lang="ts">
import { Calendar, Eye, Clock, MessageSquare, Pin } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Article } from '~/types'
import Badge from '~/components/ui/Badge.vue'

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
    :initial="{ opacity: 0, y: 32, scale: 0.97 }"
    :visible-once="{
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 650,
        delay: Math.min((props.index % 10) * 120, 800),
        ease: 'easeOut'
      }
    }"
    class="group relative flex flex-col sm:flex-row gap-6 p-6 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl dark:hover:shadow-brand-950/20 hover:-translate-y-0.5 transition-all duration-300"
  >
    <!-- 封面图 (左侧封面) -->
    <div
      v-if="article.coverImage"
      class="w-full sm:w-52 h-40 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
    >
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      >
    </div>

    <!-- 文本内容 -->
    <div class="flex-1 flex flex-col justify-between space-y-3">
      <div>
        <!-- 标签与分类 -->
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <Badge v-if="article.isPinned" variant="brand" class="gap-1 font-semibold">
            <Pin class="w-3 h-3" />
            置顶
          </Badge>
          <Badge v-if="article.category" variant="default">
            {{ article.category.name }}
          </Badge>
          <span
            v-for="tag in article.tags"
            :key="tag.id"
            class="text-xs text-zinc-400 dark:text-zinc-500 font-mono"
          >
            #{{ tag.name }}
          </span>
        </div>

        <!-- 标题 -->
        <h2 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <NuxtLink :to="`/articles/${article.slug}`" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            {{ article.title }}
          </NuxtLink>
        </h2>

        <!-- 摘要 -->
        <p class="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {{ article.summary }}
        </p>
      </div>

      <!-- 底部元数据信息 -->
      <div class="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <span class="flex items-center gap-1 font-mono">
          <Calendar class="w-3.5 h-3.5" />
          {{ dayjs(article.createdAt).format('YYYY-MM-DD') }}
        </span>
        <span class="flex items-center gap-1 font-mono">
          <Clock class="w-3.5 h-3.5" />
          {{ article.readingTime }} 分钟阅读
        </span>
        <span class="flex items-center gap-1 font-mono">
          <Eye class="w-3.5 h-3.5" />
          {{ article.views }} 次阅读
        </span>
        <span v-if="article.commentCount !== undefined" class="flex items-center gap-1 font-mono">
          <MessageSquare class="w-3.5 h-3.5" />
          {{ article.commentCount }}
        </span>
      </div>
    </div>
  </article>
</template>
