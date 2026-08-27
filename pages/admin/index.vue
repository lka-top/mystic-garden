<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  BookOpen,
  Feather,
  MessageSquare,
  Eye,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  BookMarked,
  Users,
  UserCheck,
  User,
  X,
  Save,
  Check
} from 'lucide-vue-next'
import type { ApiResponse, Notebook } from '~/types'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import Select from '~/components/ui/Select.vue'

definePageMeta({
  layout: 'admin'
})

const api = useApi()
const { data: res, refresh } = await useFetch<ApiResponse<any>>('/api/v1/stats/overview')

const stats = computed(() => res.value?.data?.stats || {})
const recentArticles = computed(() => res.value?.data?.recentArticles || [])
const recentEssays = computed(() => res.value?.data?.recentEssays || [])
const recentNotes = computed(() => res.value?.data?.recentNotes || [])

// 快速速记笔记弹窗
const showQuickNoteModal = ref(false)
const quickNoteForm = ref({
  title: '',
  slug: '',
  notebookId: null as number | null,
  content: '',
  isPublished: true
})
const notebooks = ref<Notebook[]>([])
const savingQuickNote = ref(false)
const quickNoteError = ref('')

async function openQuickNoteModal() {
  quickNoteForm.value = {
    title: '',
    slug: '',
    notebookId: null,
    content: '',
    isPublished: true
  }
  quickNoteError.value = ''
  showQuickNoteModal.value = true

  // 加载分区
  try {
    const nbRes = await $fetch<ApiResponse<Notebook[]>>('/api/v1/notebooks')
    if (nbRes.code === 200) {
      notebooks.value = nbRes.data
    }
  } catch (err) {
    console.error('加载笔记本列表失败', err)
  }
}

function handleQuickNoteTitleChange() {
  if (!quickNoteForm.value.slug) {
    quickNoteForm.value.slug = quickNoteForm.value.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  }
}

async function handleSaveQuickNote() {
  if (!quickNoteForm.value.title.trim()) {
    quickNoteError.value = '请输入笔记标题'
    return
  }
  if (!quickNoteForm.value.content.trim()) {
    quickNoteError.value = '请输入笔记正文内容'
    return
  }
  if (!quickNoteForm.value.slug.trim()) {
    quickNoteForm.value.slug = quickNoteForm.value.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  }

  savingQuickNote.value = true
  quickNoteError.value = ''
  try {
    const r = await api<any>('/api/v1/notes', {
      method: 'POST',
      body: quickNoteForm.value
    })
    if (r.code === 200) {
      showQuickNoteModal.value = false
      await refresh()
    }
  } catch (err: any) {
    quickNoteError.value = err?.data?.statusMessage || '速记笔记保存失败'
  } finally {
    savingQuickNote.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- 顶部状态栏与操作矩阵 -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Terminal class="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
          控制大盘
        </h1>
        <p class="text-xs text-zinc-500 font-mono mt-1">
          Digital Garden Operations & Content Matrix
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <Button variant="default" size="sm" class="gap-1.5 shadow-xs" @click="openQuickNoteModal">
          <BookMarked class="w-4 h-4 text-emerald-400" />
          速记笔记
        </Button>
        <NuxtLink to="/admin/articles/editor">
          <Button variant="brand" size="sm" class="gap-1.5 shadow-xs">
            <Plus class="w-4 h-4" />
            撰写文章
          </Button>
        </NuxtLink>
        <NuxtLink to="/admin/essays">
          <Button variant="outline" size="sm" class="gap-1.5">
            <Feather class="w-4 h-4" />
            发布动态
          </Button>
        </NuxtLink>
      </div>
    </div>

    <!-- 数据指标卡片矩阵 (自适应响应式网格布局，彻底杜绝小屏幕内容折行挤压溢出) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
      <!-- 1. 全站独立访客 (UV) -->
      <Card className="p-4 flex flex-col justify-between space-y-2.5 min-w-0">
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-400 font-mono font-medium truncate">访客 (UV)</div>
          <div class="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users class="w-3.5 h-3.5" />
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
            {{ stats.totalUsers || 0 }}
          </div>
          <div class="text-[10.5px] text-zinc-400 mt-1 flex items-center gap-1 font-mono truncate">
            <span>免登:{{ stats.guestUsers || 0 }}</span>
            <span>·</span>
            <span>注册:{{ stats.registeredUsers || 0 }}</span>
          </div>
        </div>
      </Card>

      <!-- 2. 全站总阅读量 (PV) -->
      <Card className="p-4 flex flex-col justify-between space-y-2.5 min-w-0">
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-400 font-mono font-medium truncate">浏览 (PV)</div>
          <div class="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Eye class="w-3.5 h-3.5" />
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
            {{ stats.totalViews || 0 }}
          </div>
          <div class="text-[10.5px] text-zinc-400 mt-1 font-mono truncate" title="文章与知识库累计浏览">
            文章 + 笔记累计
          </div>
        </div>
      </Card>

      <!-- 3. 文章总数 -->
      <Card className="p-4 flex flex-col justify-between space-y-2.5 min-w-0">
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-400 font-mono font-medium truncate">深度博文</div>
          <div class="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
            <BookOpen class="w-3.5 h-3.5" />
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
            {{ stats.articles || 0 }}
          </div>
          <div class="text-[10.5px] text-zinc-400 mt-1 font-mono truncate">
            {{ stats.categories || 0 }} 个分类收录
          </div>
        </div>
      </Card>

      <!-- 4. 知识库笔记 -->
      <Card className="p-4 flex flex-col justify-between space-y-2.5 min-w-0">
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-400 font-mono font-medium truncate">知识库笔记</div>
          <div class="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
            <BookMarked class="w-3.5 h-3.5" />
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
            {{ stats.notes || 0 }}
          </div>
          <div class="text-[10.5px] text-zinc-400 mt-1 font-mono truncate">
            {{ stats.notebooks || 0 }} 个分区归档
          </div>
        </div>
      </Card>

      <!-- 5. 随笔总数 -->
      <Card className="p-4 flex flex-col justify-between space-y-2.5 min-w-0">
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-400 font-mono font-medium truncate">随笔微言</div>
          <div class="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
            <Feather class="w-3.5 h-3.5" />
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
            {{ stats.essays || 0 }}
          </div>
          <div class="text-[10.5px] text-zinc-400 mt-1 font-mono truncate">
            灵感与生活动态
          </div>
        </div>
      </Card>

      <!-- 6. 留言互动 -->
      <Card className="p-4 flex flex-col justify-between space-y-2.5 min-w-0">
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-400 font-mono font-medium truncate">留言互动</div>
          <div class="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
            <MessageSquare class="w-3.5 h-3.5" />
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
            {{ stats.comments || 0 }}
          </div>
          <div class="text-[10.5px] text-zinc-400 mt-1 font-mono truncate">
            全站已审评论
          </div>
        </div>
      </Card>
    </div>

    <!-- 最近内容流三栏展示 (文章 + 笔记 + 随笔) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 1. 最近文章 -->
      <div class="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-mono uppercase">
            <BookOpen class="w-4 h-4 text-zinc-500" />
            最近发布文章
          </h2>
          <NuxtLink to="/admin/articles" class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-0.5 font-mono">
            全部
            <ArrowUpRight class="w-3 h-3" />
          </NuxtLink>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="a in recentArticles"
            :key="a.id"
            class="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between text-xs"
          >
            <span class="font-medium text-zinc-800 dark:text-zinc-200 truncate pr-3">{{ a.title }}</span>
            <span class="text-zinc-400 shrink-0 font-mono text-[11px]">{{ a.views }} 阅</span>
          </div>
          <div v-if="!recentArticles.length" class="text-center py-6 text-xs text-zinc-400">
            暂无文章
          </div>
        </div>
      </div>

      <!-- 2. 最近知识库笔记 -->
      <div class="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-mono uppercase">
            <BookMarked class="w-4 h-4 text-zinc-500" />
            最近知识库笔记
          </h2>
          <NuxtLink to="/admin/notes" class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-0.5 font-mono">
            全部
            <ArrowUpRight class="w-3 h-3" />
          </NuxtLink>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="n in recentNotes"
            :key="n.id"
            class="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between text-xs"
          >
            <div class="truncate pr-3">
              <span class="font-medium text-zinc-800 dark:text-zinc-200">{{ n.title }}</span>
              <span v-if="n.notebook" class="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300">
                {{ n.notebook.name }}
              </span>
            </div>
            <span class="text-zinc-400 shrink-0 font-mono text-[11px]">{{ n.views }} 阅</span>
          </div>
          <div v-if="!recentNotes.length" class="text-center py-6 text-xs text-zinc-400">
            暂无笔记
          </div>
        </div>
      </div>

      <!-- 3. 最近随笔动态 -->
      <div class="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-mono uppercase">
            <Feather class="w-4 h-4 text-zinc-500" />
            最近随笔动态
          </h2>
          <NuxtLink to="/admin/essays" class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-0.5 font-mono">
            全部
            <ArrowUpRight class="w-3 h-3" />
          </NuxtLink>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="e in recentEssays"
            :key="e.id"
            class="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2"
          >
            {{ e.content }}
          </div>
          <div v-if="!recentEssays.length" class="text-center py-6 text-xs text-zinc-400">
            暂无随笔
          </div>
        </div>
      </div>
    </div>

    <!-- 速记笔记极简弹窗 -->
    <div
      v-if="showQuickNoteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div class="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookMarked class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-100">速记知识库笔记</h3>
              <p class="text-[11px] text-zinc-400 font-mono">Quick Capture to Digital Garden</p>
            </div>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            @click="showQuickNoteModal = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div v-if="quickNoteError" class="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400">
          {{ quickNoteError }}
        </div>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-semibold text-zinc-700 dark:text-zinc-300">笔记标题 <span class="text-rose-500">*</span></label>
              <input
                v-model="quickNoteForm.title"
                type="text"
                placeholder="例如：Vue 3.5 响应式新特性"
                class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                @input="handleQuickNoteTitleChange"
              >
            </div>

            <div class="space-y-1">
              <label class="font-semibold text-zinc-700 dark:text-zinc-300">所属笔记本 / 分区</label>
              <Select
                v-model="quickNoteForm.notebookId"
                placeholder="未指定笔记本"
                :options="notebooks.map(nb => ({ label: nb.name, value: nb.id }))"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-zinc-700 dark:text-zinc-300">笔记 Markdown 内容 <span class="text-rose-500">*</span></label>
            <textarea
              v-model="quickNoteForm.content"
              rows="6"
              placeholder="在此快速记录代码片段、速查清单或要点备忘..."
              class="w-full px-3 py-2 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <label class="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
            <input v-model="quickNoteForm.isPublished" type="checkbox" class="rounded text-emerald-600 focus:ring-emerald-500">
            <span>立即公开可见</span>
          </label>

          <div class="flex items-center gap-2">
            <Button variant="ghost" size="sm" @click="showQuickNoteModal = false">
              取消
            </Button>
            <Button variant="default" size="sm" :loading="savingQuickNote" @click="handleSaveQuickNote">
              <Save class="w-4 h-4 mr-1" />
              保存笔记
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
