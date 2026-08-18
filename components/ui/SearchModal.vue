<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Search, X, Loader2, BookOpen, BookMarked, Feather, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import { useSearchModal } from '~/composables/useSearchModal'
import type { ApiResponse } from '~/types'

interface SearchArticle {
  id: number
  slug: string
  title: string
  summary: string
  createdAt: string
  category?: { name: string; slug: string }
}

interface SearchNote {
  id: number
  slug: string
  title: string
  summary: string
  createdAt: string
  notebook?: { name: string; slug: string }
}

interface SearchEssay {
  id: number
  content: string
  mood: string
  createdAt: string
}

const { isOpen, close, toggle } = useSearchModal()

const inputRef = ref<HTMLInputElement | null>(null)
const keyword = ref('')
const loading = ref(false)
const selectedIndex = ref(0)

const articles = ref<SearchArticle[]>([])
const notes = ref<SearchNote[]>([])
const essays = ref<SearchEssay[]>([])

// 展平成一维搜索结果列表，供键盘上下导航
interface FlatResultItem {
  type: 'article' | 'note' | 'essay'
  title: string
  description: string
  tag: string
  url: string
  date: string
}

const flatResults = computed<FlatResultItem[]>(() => {
  const list: FlatResultItem[] = []

  articles.value.forEach(a => {
    list.push({
      type: 'article',
      title: a.title,
      description: a.summary || '',
      tag: a.category?.name || '文章',
      url: `/articles/${a.slug}`,
      date: new Date(a.createdAt).toLocaleDateString()
    })
  })

  notes.value.forEach(n => {
    list.push({
      type: 'note',
      title: n.title,
      description: n.summary || '',
      tag: n.notebook?.name || '笔记',
      url: `/notes/${n.slug}`,
      date: new Date(n.createdAt).toLocaleDateString()
    })
  })

  essays.value.forEach(e => {
    list.push({
      type: 'essay',
      title: e.content.length > 50 ? e.content.slice(0, 50) + '...' : e.content,
      description: e.content,
      tag: e.mood || '随笔',
      url: '/essays',
      date: new Date(e.createdAt).toLocaleDateString()
    })
  })

  return list
})

const hasResults = computed(() => flatResults.value.length > 0)
const totalCount = computed(() => flatResults.value.length)

// 250ms 防抖实时检索后端 MySQL 接口
const fetchSearchResults = useDebounceFn(async (q: string) => {
  const trimmed = q.trim()
  if (!trimmed) {
    articles.value = []
    notes.value = []
    essays.value = []
    loading.value = false
    return
  }

  loading.value = true
  try {
    const res = await $fetch<ApiResponse<{
      articles: SearchArticle[]
      notes: SearchNote[]
      essays: SearchEssay[]
    }>>('/api/v1/search', {
      params: { q: trimmed }
    })

    if (res.code === 200 && res.data) {
      articles.value = res.data.articles || []
      notes.value = res.data.notes || []
      essays.value = res.data.essays || []
      selectedIndex.value = 0
    }
  } catch (err) {
    console.error('搜索请求失败:', err)
  } finally {
    loading.value = false
  }
}, 250)

watch(keyword, (newVal) => {
  if (newVal.trim()) {
    loading.value = true
  }
  fetchSearchResults(newVal)
})

// 弹窗打开时自动聚焦输入框
watch(isOpen, (val) => {
  if (val) {
    selectedIndex.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  } else {
    keyword.value = ''
    articles.value = []
    notes.value = []
    essays.value = []
  }
})

function handleSelect(item: FlatResultItem) {
  close()
  navigateTo(item.url)
}

function handleKeydown(e: KeyboardEvent) {
  // 全局快捷键 Ctrl+K / Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggle()
    return
  }

  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (flatResults.value.length > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % flatResults.value.length
      scrollToSelected()
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (flatResults.value.length > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + flatResults.value.length) % flatResults.value.length
      scrollToSelected()
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (flatResults.value.length > 0 && flatResults.value[selectedIndex.value]) {
      handleSelect(flatResults.value[selectedIndex.value])
    }
  }
}

function scrollToSelected() {
  nextTick(() => {
    const el = document.querySelector(`.search-result-item[data-index="${selectedIndex.value}"]`)
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

// 关键词高亮
function highlightText(text: string, q: string) {
  if (!text || !q.trim()) return text
  const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold px-0.5 rounded">$1</mark>')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 dark:bg-black/75 backdrop-blur-md"
        @click.self="close"
      >
        <!-- 核心弹窗容器 -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-4"
        >
          <div
            class="w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-2xl border border-sky-100/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
          >
            <!-- 1. 顶部输入栏 -->
            <div class="relative flex items-center px-5 py-4 border-b border-sky-100/60 dark:border-slate-800/80">
              <Search class="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0 mr-3" />
              
              <input
                ref="inputRef"
                v-model="keyword"
                type="text"
                placeholder="搜索文章、速查笔记、即时随笔..."
                class="w-full text-base sm:text-lg bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />

              <div class="flex items-center gap-2">
                <Loader2 v-if="loading" class="w-4 h-4 text-sky-500 animate-spin" />

                <button
                  v-if="keyword"
                  type="button"
                  class="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  @click="keyword = ''"
                >
                  <X class="w-4 h-4" />
                </button>

                <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 select-none">
                  ESC
                </kbd>
              </div>
            </div>

            <!-- 2. 搜索结果展示区 -->
            <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              <!-- 空输入引导状态 -->
              <div v-if="!keyword.trim()" class="py-12 text-center space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-800/60 text-sky-500 dark:text-sky-400 flex items-center justify-center mx-auto shadow-xs">
                  <Sparkles class="w-6 h-6" />
                </div>
                <div class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  开始在神秘花园中探索
                </div>
                <p class="text-xs text-slate-400 max-w-xs mx-auto">
                  输入关键词即可实时检索文章、工程备忘录与日常随笔灵感
                </p>
              </div>

              <!-- 无结果空状态 -->
              <div v-else-if="!loading && !hasResults" class="py-12 text-center space-y-2">
                <div class="text-sm font-medium text-slate-500 dark:text-slate-400">
                  未找到与「<span class="text-sky-500 font-bold">{{ keyword }}</span>」相关的结果
                </div>
                <p class="text-xs text-slate-400">
                  尝试更换更精简的搜索词或浏览其他分类
                </p>
              </div>

              <!-- 搜索列表条目 -->
              <div v-else class="space-y-1.5">
                <div class="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>匹配条目 ({{ totalCount }})</span>
                  <span class="text-[10px] font-mono text-sky-500">按 ↑ ↓ 键快速选择</span>
                </div>

                <div
                  v-for="(item, index) in flatResults"
                  :key="`${item.type}-${index}`"
                  :data-index="index"
                  :class="[
                    'search-result-item group flex items-start gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-150',
                    selectedIndex === index
                      ? 'bg-sky-50 dark:bg-slate-800/90 shadow-sm border border-sky-200/60 dark:border-sky-500/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                  ]"
                  @click="handleSelect(item)"
                  @mouseenter="selectedIndex = index"
                >
                  <!-- 左侧类型图标 -->
                  <div
                    :class="[
                      'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      item.type === 'article' ? 'bg-sky-100/70 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400' :
                      item.type === 'note' ? 'bg-emerald-100/70 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
                      'bg-rose-100/70 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                    ]"
                  >
                    <BookOpen v-if="item.type === 'article'" class="w-4 h-4" />
                    <BookMarked v-else-if="item.type === 'note'" class="w-4 h-4" />
                    <Feather v-else class="w-4 h-4" />
                  </div>

                  <!-- 中间文字区域 -->
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center gap-2">
                      <span
                        class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 shrink-0"
                      >
                        {{ item.tag }}
                      </span>
                      <h4
                        class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
                        v-html="highlightText(item.title, keyword)"
                      />
                    </div>

                    <p
                      v-if="item.description"
                      class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed"
                      v-html="highlightText(item.description, keyword)"
                    />
                  </div>

                  <!-- 右侧箭头与快捷键提示 -->
                  <div class="flex items-center gap-2 shrink-0 self-center">
                    <span class="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
                      {{ item.date }}
                    </span>
                    <div
                      :class="[
                        'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                        selectedIndex === index
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-500'
                      ]"
                    >
                      <CornerDownLeft v-if="selectedIndex === index" class="w-3.5 h-3.5" />
                      <ArrowRight v-else class="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. 底部操作指引栏 -->
            <div class="px-5 py-3 bg-slate-50/80 dark:bg-slate-900/60 border-t border-sky-100/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 select-none">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">↑</kbd>
                  <kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">↓</kbd>
                  切换选择
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">↵</kbd>
                  打开跳转
                </span>
              </div>
              <div class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">ESC</kbd>
                关闭
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
