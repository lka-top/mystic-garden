<script setup lang="ts">
import { ref, computed } from 'vue'
import { BookMarked, Search, FolderTree, ArrowRight, X, Pin, FileText } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Note, Notebook, PaginatedList, Pagination as PaginationMeta } from '~/types'
import Button from '~/components/ui/Button.vue'
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import Pagination from '~/components/ui/Pagination.vue'
import HeroBanner from '~/components/layout/HeroBanner.vue'
import NotebookTree from '~/components/note/NotebookTree.vue'

const route = useRoute()

const selectedNotebook = ref((route.query.notebook as string) || '')
const searchKeyword = ref((route.query.q as string) || '')
const page = ref(1)

// 0ms 非阻塞获取笔记本列表
const { data: notebooksRes } = await useLazyFetch<ApiResponse<Notebook[]>>('/api/v1/notebooks', {
  key: 'notes-notebooks'
})
const notebooks = computed(() => notebooksRes.value?.data || [])

// 0ms 非阻塞获取笔记列表
const { data: notesRes, pending: notesPending } = await useLazyFetch<ApiResponse<PaginatedList<Note>>>('/api/v1/notes', {
  key: 'notes-list',
  query: computed(() => ({
    page: page.value,
    pageSize: 15,
    notebook: selectedNotebook.value || undefined,
    keyword: searchKeyword.value || undefined
  }))
})

const notes = computed(() => notesRes.value?.data?.list || [])
const pagination = computed<PaginationMeta>(() => notesRes.value?.data?.pagination || {
  total: 0,
  page: 1,
  pageSize: 15,
  totalPages: 1
})
const selectedNotebookLabel = computed(() => notebooks.value.find(notebook => notebook.slug === selectedNotebook.value)?.path
  || notebooks.value.find(notebook => notebook.slug === selectedNotebook.value)?.name
  || '')

function notebookPath(notebook: Note['notebook']): string {
  return notebook?.path || notebook?.name || '未分类'
}

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
  <div>
    <!-- 顶部全宽 HeroBanner + 动态波浪 -->
    <HeroBanner
      title="知识库与速查备忘"
      subtitle="结构化卡片 · 前端工程规范 · 现代架构技巧与速查备忘录"
      height="md"
      :show-wave="true"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
      <!-- 头部说明与搜索框 -->
      <div class="md3-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked class="w-5 h-5 text-sky-500" />
            <span>结构化笔记本</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1 font-mono">
            共收录 {{ pagination.total }} 条速查笔记与代码片段
          </p>
        </div>

        <!-- 搜索输入框 -->
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索知识库内容..."
            class="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-sky-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      <!-- 移动端将目录树折叠，避免占用笔记阅读空间。 -->
      <details class="md3-card p-4 lg:hidden">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-800 marker:hidden dark:text-slate-100">
          <span class="flex items-center gap-2"><FolderTree class="size-4 text-sky-500" />知识目录</span>
          <span class="max-w-[58vw] truncate text-xs font-medium text-slate-400">{{ selectedNotebookLabel || '全部笔记' }}</span>
        </summary>
        <div class="mt-3 border-t border-sky-100/70 pt-3 dark:border-slate-800">
          <button
            type="button"
            class="mb-2 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors"
            :class="!selectedNotebook ? 'bg-sky-500 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="selectNotebook('')"
          >
            全部笔记
          </button>
          <NotebookTree :notebooks="notebooks" :selected-slug="selectedNotebook" @select="selectNotebook" />
        </div>
      </details>

      <div class="grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside class="md3-card sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto p-3 lg:block">
          <div class="mb-3 flex items-center gap-2 px-2 pt-1 text-xs font-black tracking-wide text-slate-800 dark:text-slate-100">
            <FolderTree class="size-4 text-sky-500" />
            知识目录
          </div>
          <button
            type="button"
            class="mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors"
            :class="!selectedNotebook ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="selectNotebook('')"
          >
            <BookMarked class="size-3.5" />
            全部笔记
          </button>
          <NotebookTree :notebooks="notebooks" :selected-slug="selectedNotebook" @select="selectNotebook" />
        </aside>

        <section class="min-w-0 space-y-4">
          <div class="flex min-h-7 items-center justify-between gap-3">
            <p class="min-w-0 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span v-if="selectedNotebookLabel">当前目录：<span class="font-mono text-sky-600 dark:text-sky-400">{{ selectedNotebookLabel }}</span></span>
              <span v-else>浏览全部公开笔记</span>
            </p>
            <button
              v-if="selectedNotebook || searchKeyword"
              type="button"
              class="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-rose-500 hover:underline"
              @click="clearFilters"
            >
              <X class="size-3.5" />重置
            </button>
          </div>

          <!-- 加载中骨架屏 -->
          <div v-if="notesPending && notes.length === 0" class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <SkeletonCard v-for="i in 6" :key="i" type="note" />
          </div>

          <!-- 笔记网格卡片 -->
          <div v-else-if="notes.length > 0" class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="note in notes"
          :key="note.id"
          :to="`/notes/${note.slug}`"
          class="md3-card p-5 group flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <!-- 装饰与置顶 -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span v-if="note.notebook" class="max-w-[78%] truncate rounded-lg border border-sky-200/50 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-sky-700 dark:border-sky-800/50 dark:bg-sky-500/20 dark:text-sky-300" :title="notebookPath(note.notebook)">
                {{ notebookPath(note.notebook) }}
              </span>
              <span v-if="note.isPinned" class="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-500">
                <Pin class="w-3 h-3" />
                置顶
              </span>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
              {{ note.title }}
            </h3>

            <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-light">
              {{ note.summary || '点击进入查看详细笔记内容...' }}
            </p>
          </div>

          <!-- 底部元信息 -->
          <div class="flex items-center justify-between text-[11px] text-slate-400 pt-3 mt-4 border-t border-sky-100/60 dark:border-slate-800/80 font-mono">
            <span>{{ dayjs(note.createdAt).format('YYYY-MM-DD') }}</span>
            <span class="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-sky-500 font-bold">
              阅读笔记 <ArrowRight class="w-3 h-3" />
            </span>
          </div>
        </NuxtLink>
          </div>

          <Pagination v-if="pagination.totalPages > 1" v-model:page="page" :total-pages="pagination.totalPages" />

          <!-- 空状态 -->
          <div v-else-if="!notesPending && notes.length === 0" class="md3-card space-y-3 py-16 text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-slate-400 dark:bg-slate-800">
              <FileText class="size-6" />
            </div>
            <div class="text-sm font-semibold text-slate-700 dark:text-slate-300">暂无匹配笔记</div>
            <div class="text-xs text-slate-400">请尝试选择其他目录或清除关键词</div>
            <Button variant="outline" size="sm" @click="clearFilters">重置所有筛选</Button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
