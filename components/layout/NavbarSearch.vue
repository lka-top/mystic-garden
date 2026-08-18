<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Search, X, Loader2, BookOpen, BookMarked, Feather, CornerDownLeft, ArrowRight } from 'lucide-vue-next'
import { useDebounceFn, onClickOutside } from '@vueuse/core'
import type { ApiResponse } from '~/types'

interface Props {
  isTransparent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isTransparent: false
})

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

interface FlatResultItem {
  type: 'article' | 'note' | 'essay'
  title: string
  snippet: string
  tag: string
  url: string
  date: string
}

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isExpanded = ref(false)
const keyword = ref('')
const loading = ref(false)
const selectedIndex = ref(0)

const articles = ref<SearchArticle[]>([])
const notes = ref<SearchNote[]>([])
const essays = ref<SearchEssay[]>([])

// 提取包含关键字的前后上下文片段 (关键：展示匹配正文)
function getContextSnippet(content: string, q: string, maxLength = 70): string {
  if (!content) return ''
  const trimmedQ = q.trim().toLowerCase()
  if (!trimmedQ) {
    return content.length > maxLength ? content.slice(0, maxLength) + '...' : content
  }

  const index = content.toLowerCase().indexOf(trimmedQ)
  if (index === -1) {
    return content.length > maxLength ? content.slice(0, maxLength) + '...' : content
  }

  const start = Math.max(0, index - 18)
  const end = Math.min(content.length, index + trimmedQ.length + 38)
  const prefix = start > 0 ? '...' : ''
  const suffix = end < content.length ? '...' : ''
  return prefix + content.slice(start, end) + suffix
}

// 展平成一维搜索结果列表
const flatResults = computed<FlatResultItem[]>(() => {
  const list: FlatResultItem[] = []
  const q = keyword.value

  articles.value.forEach(a => {
    list.push({
      type: 'article',
      title: a.title,
      snippet: getContextSnippet(a.summary || '', q),
      tag: a.category?.name || '技术文章',
      url: `/articles/${a.slug}`,
      date: new Date(a.createdAt).toLocaleDateString()
    })
  })

  notes.value.forEach(n => {
    list.push({
      type: 'note',
      title: n.title,
      snippet: getContextSnippet(n.summary || '', q),
      tag: n.notebook?.name || '速查笔记',
      url: `/notes/${n.slug}`,
      date: new Date(n.createdAt).toLocaleDateString()
    })
  })

  essays.value.forEach(e => {
    list.push({
      type: 'essay',
      title: e.content.length > 30 ? e.content.slice(0, 30) + '...' : e.content,
      snippet: getContextSnippet(e.content, q),
      tag: e.mood || '即时随笔',
      url: '/essays',
      date: new Date(e.createdAt).toLocaleDateString()
    })
  })

  return list
})

const hasResults = computed(() => flatResults.value.length > 0)

// 250ms 防抖实时检索
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

watch(keyword, (val) => {
  if (val.trim()) {
    loading.value = true
  }
  fetchSearchResults(val)
})

// 展开搜索框
function expandSearch() {
  isExpanded.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 收起搜索框
function collapseSearch() {
  isExpanded.value = false
  keyword.value = ''
  articles.value = []
  notes.value = []
  essays.value = []
  selectedIndex.value = 0
}

// 点击空白区域自动收起
onClickOutside(containerRef, () => {
  if (isExpanded.value) {
    collapseSearch()
  }
})

// 关键词高亮
function highlightText(text: string, q: string) {
  if (!text || !q.trim()) return text
  const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="bg-sky-500/25 text-sky-600 dark:text-sky-300 font-bold px-0.5 rounded">$1</mark>')
}

function handleSelect(item: FlatResultItem) {
  collapseSearch()
  navigateTo(item.url)
}

function handleKeydown(e: KeyboardEvent) {
  if (!isExpanded.value) {
    // 全局快捷键 Ctrl+K 触发展开
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      expandSearch()
    }
    return
  }

  if (e.key === 'Escape') {
    e.preventDefault()
    collapseSearch()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (flatResults.value.length > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % flatResults.value.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (flatResults.value.length > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + flatResults.value.length) % flatResults.value.length
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (flatResults.value.length > 0 && flatResults.value[selectedIndex.value]) {
      handleSelect(flatResults.value[selectedIndex.value])
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="containerRef" class="relative inline-flex items-center">
    <!-- 1. 导航栏内部伸缩搜索框容器 -->
    <div
      :class="[
        'relative flex items-center transition-all duration-300 ease-out rounded-full overflow-hidden',
        isExpanded
          ? 'w-52 sm:w-64 pl-3 pr-2 py-1.5 ' + (props.isTransparent
              ? 'bg-black/40 backdrop-blur-xl border border-white/20 shadow-lg text-white'
              : 'bg-white/95 dark:bg-[#1a2542]/95 backdrop-blur-xl border border-sky-200/80 dark:border-slate-700 shadow-md text-slate-800 dark:text-slate-100')
          : 'w-8 h-8 sm:w-9 sm:h-9 justify-center cursor-pointer ' + (props.isTransparent
              ? 'text-white/90 hover:text-white hover:bg-white/20'
              : 'text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800/80')
      ]"
      @click="!isExpanded && expandSearch()"
    >
      <!-- 放大镜图标 (常驻) -->
      <Search
        :class="[
          'w-4 h-4 shrink-0 transition-colors',
          isExpanded ? (props.isTransparent ? 'text-white/90 mr-2' : 'text-sky-500 dark:text-sky-400 mr-2') : ''
        ]"
      />

      <!-- 原地展开的单行输入框 (只在 isExpanded 时展示) -->
      <input
        v-if="isExpanded"
        ref="inputRef"
        v-model="keyword"
        type="text"
        placeholder="搜索文章或笔记..."
        class="w-full text-xs bg-transparent focus:outline-none placeholder:text-slate-400/80"
        @keydown="handleKeydown"
      />

      <!-- 右侧辅助按钮 (加载中、清空/收起) -->
      <div v-if="isExpanded" class="flex items-center gap-1 shrink-0 ml-1">
        <Loader2 v-if="loading" class="w-3 h-3 text-sky-400 animate-spin" />

        <button
          type="button"
          class="p-0.5 rounded-full hover:bg-white/20 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="收起搜索"
          @click.stop="collapseSearch"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- 2. 正下方悬浮联想气泡卡片 (无任何全屏遮罩, 随打字弹出) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isExpanded && keyword.trim()"
        class="absolute right-0 top-full mt-2.5 w-80 sm:w-96 max-h-[70vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-2xl border border-sky-100 dark:border-slate-800 shadow-2xl z-50 p-2 space-y-1"
      >
        <!-- 加载中 -->
        <div v-if="loading && flatResults.length === 0" class="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 class="w-4 h-4 animate-spin text-sky-500" />
          <span>正在检索知识库...</span>
        </div>

        <!-- 无匹配结果 -->
        <div v-else-if="!loading && !hasResults" class="py-8 text-center space-y-1">
          <div class="text-xs text-slate-500 dark:text-slate-400">
            未找到与「<span class="text-sky-500 font-bold">{{ keyword }}</span>」相关的结果
          </div>
          <p class="text-[10px] text-slate-400">
            尝试更换更简短的关键词
          </p>
        </div>

        <!-- 联想条目列表 -->
        <div v-else class="space-y-1">
          <div class="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>联想结果 ({{ flatResults.length }})</span>
            <span class="text-[9px] font-mono text-sky-500">按 ↑ ↓ 键选择</span>
          </div>

          <div
            v-for="(item, index) in flatResults"
            :key="`${item.type}-${index}`"
            :class="[
              'group flex items-start gap-2.5 p-2.5 rounded-2xl cursor-pointer transition-all duration-150 text-left',
              selectedIndex === index
                ? 'bg-sky-50 dark:bg-slate-800/90 border border-sky-200/60 dark:border-sky-500/30 shadow-xs'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
            ]"
            @click="handleSelect(item)"
            @mouseenter="selectedIndex = index"
          >
            <!-- 类型图标 -->
            <div
              :class="[
                'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                item.type === 'article' ? 'bg-sky-100/80 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400' :
                item.type === 'note' ? 'bg-emerald-100/80 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' :
                'bg-rose-100/80 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
              ]"
            >
              <BookOpen v-if="item.type === 'article'" class="w-3.5 h-3.5" />
              <BookMarked v-else-if="item.type === 'note'" class="w-3.5 h-3.5" />
              <Feather v-else class="w-3.5 h-3.5" />
            </div>

            <!-- 文本与正文上下文高亮 -->
            <div class="flex-1 min-w-0 space-y-0.5">
              <div class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 shrink-0">
                  {{ item.tag }}
                </span>
                <h4
                  class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
                  v-html="highlightText(item.title, keyword)"
                />
              </div>

              <!-- 正文关键字上下文片段高亮展示 -->
              <p
                v-if="item.snippet"
                class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal"
                v-html="highlightText(item.snippet, keyword)"
              />
            </div>

            <!-- 回车图标 -->
            <div class="shrink-0 self-center">
              <CornerDownLeft
                v-if="selectedIndex === index"
                class="w-3 h-3 text-sky-500"
              />
              <ArrowRight
                v-else
                class="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
