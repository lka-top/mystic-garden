<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, BookMarked, ChevronRight } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Note } from '~/types'
import MarkdownRenderer from '~/components/article/MarkdownRenderer.vue'
import HeroBanner from '~/components/layout/HeroBanner.vue'

const route = useRoute()
const slug = route.params.slug as string

// SSR 预取笔记详情
const { data: res, error } = await useFetch<ApiResponse<Note>>(`/api/v1/notes/${slug}`)

if (error.value || !res.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: '抱歉，笔记不存在或已被移至私密空间'
  })
}

const note = computed(() => res.value!.data)

const notebookSegments = computed(() => {
  const notebook = note.value.notebook
  if (!notebook) return []
  return (notebook.path || notebook.name).split('/').filter(Boolean)
})

useSeoMeta({
  title: note.value.title,
  description: note.value.summary || `${note.value.title} - 神秘花园知识库笔记`,
  ogTitle: note.value.title
})
</script>

<template>
  <div>
    <!-- 顶部全宽 HeroBanner + 动态波浪 -->
    <HeroBanner
      :title="note.title"
      :subtitle="note.summary || `${dayjs(note.createdAt).format('YYYY-MM-DD')} · 知识库速查备忘`"
      height="md"
      :show-wave="true"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
      <!-- 返回按钮与笔记本元信息卡片 -->
      <div class="md3-card p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
        <NuxtLink
          :to="note.notebook ? `/notes?notebook=${encodeURIComponent(note.notebook.slug)}` : '/notes'"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-rose-500 transition-colors font-mono"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>返回知识库列表</span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <NuxtLink
            v-if="note.notebook"
            :to="`/notes?notebook=${encodeURIComponent(note.notebook.slug)}`"
            class="inline-flex max-w-full items-center gap-1.5 rounded-full border border-sky-200/50 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-500/20 dark:border-sky-800/50 dark:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-500/30"
          >
            <BookMarked class="w-3.5 h-3.5 text-sky-500" />
            <span class="flex min-w-0 items-center truncate">
              <template v-for="(segment, index) in notebookSegments" :key="`${segment}-${index}`">
                <ChevronRight v-if="index > 0" class="mx-0.5 size-3 shrink-0 opacity-60" />
                <span class="truncate">{{ segment }}</span>
              </template>
            </span>
          </NuxtLink>
          <span
            v-for="tag in note.tags"
            :key="tag.id"
            class="text-xs text-slate-400 font-mono"
          >
            #{{ tag.name }}
          </span>
        </div>
      </div>

      <!-- 笔记正文卡片 (采用统一容器毛玻璃背景) -->
      <article class="md3-card p-6 sm:p-10 space-y-6">
        <MarkdownRenderer :content="note.content || ''" />

        <div class="pt-4 border-t border-sky-100/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>记录于 {{ dayjs(note.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
          <span v-if="note.views !== undefined">{{ note.views }} 次查看</span>
        </div>
      </article>
    </div>
  </div>
</template>
