<script setup lang="ts">
import { ref, computed } from 'vue'
import { BookMarked, Search, Folder, Terminal, Layers, ArrowRight, Clock, Tag as TagIcon, X, Pin, FileText } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Note, Notebook, Tag } from '~/types'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import Pagination from '~/components/ui/Pagination.vue'

const route = useRoute()

const selectedNotebook = ref((route.query.notebook as string) || '')
const searchKeyword = ref((route.query.q as string) || '')
const page = ref(1)

// 获取笔记本列表
const { data: notebooksRes } = await useFetch<ApiResponse<Notebook[]>>('/api/v1/notebooks')
const notebooks = computed(() => notebooksRes.value?.data || [])

// 获取笔记列表
const { data: notesRes } = await useFetch<ApiResponse<{ list: Note[]; pagination: any }>>('/api/v1/notes', {
  query: computed(() => ({
    page: page.value,
    pageSize: 15,
    notebook: selectedNotebook.value || undefined,
    keyword: searchKeyword.value || undefined
  }))
})

const notes = computed(() => notesRes.value?.data?.list || [])
const pagination = computed(() => notesRes.value?.data?.pagination || { total: 0, totalPages: 1 })

function selectNotebook(slug: string) {
  selectedNotebook.value = selectedNotebook.value === slug ? '' : slug
  page.value = 1
}

function clearFilters() {
  selectedNotebook.value = ''
  searchKeyword.value = ''
  page.value = 1
}

useSeoMeta({
  title: '知识库笔记',
  description: '神秘花园知识库 - 前端工程规范、全栈架构技巧与结构化速查备忘录'
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-8">
    <!-- 头部说明与搜索框 -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookMarked class="w-6 h-6 text-zinc-800 dark:text-zinc-200" />
          知识库笔记
        </h1>
        <p class="text-xs text-zinc-400 mt-1 font-mono">
          结构化卡片 · 速查手册与工程备忘 (共 {{ pagination.total }} 篇)
        </p>
      </div>

      <!-- 搜索输入框 -->
      <div class="relative w-full sm:w-64">
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索知识库内容..."
          class="w-full pl-9 pr-3 py-1.5 text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all font-mono text-xs"
        >
      </div>
    </div>

    <!-- 笔记本知识库分类卡片网格 (Notebooks Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        class="p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between"
        :class="[
          !selectedNotebook
            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-md'
            : 'border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
        ]"
        @click="selectNotebook('')"
      >
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Folder class="w-5 h-5" />
            <span class="text-xs font-mono opacity-70">All Notes</span>
          </div>
          <div class="font-bold text-sm">全部知识库</div>
          <p class="text-xs opacity-75 line-clamp-1">汇总全站所有结构化技术笔记</p>
        </div>
        <div class="pt-3 text-xs font-mono font-semibold">
          {{ pagination.total }} 条收录
        </div>
      </div>

      <div
        v-for="nb in notebooks"
        :key="nb.id"
        class="p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between"
        :class="[
          selectedNotebook === nb.slug
            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-md'
            : 'border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
        ]"
        @click="selectNotebook(nb.slug)"
      >
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Layers v-if="nb.icon === 'layers'" class="w-5 h-5" />
            <Terminal v-else-if="nb.icon === 'terminal'" class="w-5 h-5" />
            <Folder v-else class="w-5 h-5" />
            <span class="text-xs font-mono opacity-70">{{ nb.slug }}</span>
          </div>
          <div class="font-bold text-sm">{{ nb.name }}</div>
          <p class="text-xs opacity-75 line-clamp-1">{{ nb.description || '知识卡片归档' }}</p>
        </div>
        <div class="pt-3 text-xs font-mono font-semibold">
          {{ nb.noteCount || 0 }} 篇笔记
        </div>
      </div>
    </div>

    <!-- 笔记卡片流 -->
    <div v-if="notes.length > 0" class="space-y-4">
      <div
        v-for="(note, idx) in notes"
        :key="note.id"
        v-motion
        :initial="{ opacity: 0, y: 28, scale: 0.97 }"
        :visible-once="{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 600,
            delay: Math.min((idx % 10) * 100, 700),
            ease: 'easeOut'
          }
        }"
        class="group p-6 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all space-y-3"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <Badge v-if="note.isPinned" variant="brand" class="text-[10px] font-mono gap-1">
              <Pin class="w-3 h-3" />
              置顶
            </Badge>
            <span v-if="note.notebook" class="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700">
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

          <span class="text-xs text-zinc-400 font-mono">
            {{ dayjs(note.createdAt).format('YYYY-MM-DD') }}
          </span>
        </div>

        <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          <NuxtLink :to="`/notes/${note.slug}`">
            {{ note.title }}
          </NuxtLink>
        </h2>

        <p class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {{ note.summary || note.content?.substring(0, 150) }}
        </p>

        <div class="pt-2 flex items-center justify-between text-xs text-zinc-400 font-mono border-t border-zinc-100 dark:border-zinc-800/60">
          <span>{{ note.views }} 次查看</span>
          <NuxtLink :to="`/notes/${note.slug}`" class="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-300 hover:underline">
            阅读笔记
            <ArrowRight class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>

      <!-- 分页控制 -->
      <Pagination v-model:page="page" :total-pages="pagination.totalPages" />
    </div>

    <!-- 空状态 -->
    <div v-else class="py-16 text-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
        <FileText class="w-6 h-6" />
      </div>
      <div class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
        暂无匹配笔记
      </div>
      <Button variant="outline" size="sm" @click="clearFilters">
        重置筛选
      </Button>
    </div>
  </div>
</template>
