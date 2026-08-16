<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Eye, ArrowLeft, BookMarked, Layers, Terminal, Folder } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Note } from '~/types'
import MarkdownRenderer from '~/components/article/MarkdownRenderer.vue'
import Badge from '~/components/ui/Badge.vue'

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

useSeoMeta({
  title: note.value.title,
  description: note.value.summary || `${note.value.title} - 神秘花园知识库笔记`,
  ogTitle: note.value.title
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 返回按钮 -->
    <div>
      <NuxtLink to="/notes" class="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-mono">
        <ArrowLeft class="w-3.5 h-3.5" />
        返回知识库
      </NuxtLink>
    </div>

    <!-- 笔记正文卡片 -->
    <article class="p-8 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-xs space-y-6">
      <header class="space-y-3 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="note.notebook" class="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700 flex items-center gap-1">
            <BookMarked class="w-3.5 h-3.5 text-zinc-500" />
            {{ note.notebook.name }}
          </span>
          <span
            v-for="tag in note.tags"
            :key="tag.id"
            class="text-xs text-zinc-400 font-mono"
          >
            #{{ tag.name }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
          {{ note.title }}
        </h1>

        <div class="flex items-center gap-4 text-xs text-zinc-400 font-mono">
          <span class="flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5" />
            {{ dayjs(note.createdAt).format('YYYY-MM-DD') }}
          </span>
          <span class="flex items-center gap-1">
            <Eye class="w-3.5 h-3.5" />
            {{ note.views }} 次查看
          </span>
        </div>
      </header>

      <!-- Markdown 渲染 -->
      <MarkdownRenderer :content="note.content || ''" />
    </article>
  </div>
</template>
