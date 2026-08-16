<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Calendar, Clock, Eye, ArrowLeft, List } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Article } from '~/types'
import MarkdownRenderer from '~/components/article/MarkdownRenderer.vue'
import CommentSection from '~/components/comment/CommentSection.vue'
import Badge from '~/components/ui/Badge.vue'

const route = useRoute()
const slug = route.params.slug as string

// SSR 预取文章详情
const { data: res, error } = await useFetch<ApiResponse<Article>>(`/api/v1/articles/${slug}`)

if (error.value || !res.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: '抱歉，文章不存在或已被移至草稿箱'
  })
}

const article = computed(() => res.value!.data)
const toc = ref<Array<{ id: string; text: string; level: number }>>([])
const readingProgress = ref(0)

function handleTocReady(headings: Array<{ id: string; text: string; level: number }>) {
  toc.value = headings
}

function updateReadingProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    readingProgress.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})

useSeoMeta({
  title: article.value.title,
  description: article.value.summary,
  ogTitle: article.value.title,
  ogDescription: article.value.summary,
  ogImage: article.value.coverImage || undefined,
  ogType: 'article'
})
</script>

<template>
  <div>
    <!-- 顶部固定阅读进度条 -->
    <div
      class="fixed top-0 left-0 h-1 bg-brand-500 z-50 transition-all duration-100"
      :style="{ width: `${readingProgress}%` }"
    />

    <!-- 返回按钮 -->
    <div class="mb-6">
      <NuxtLink to="/articles" class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        <ArrowLeft class="w-3.5 h-3.5" />
        返回文章列表
      </NuxtLink>
    </div>

    <!-- 文章主体双栏布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- 左侧主文章内容 -->
      <article class="lg:col-span-8 space-y-6">
        <!-- 头部元信息 -->
        <header class="space-y-3 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div class="flex flex-wrap items-center gap-2">
            <Badge v-if="article.category" variant="brand">
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

          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            {{ article.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              {{ dayjs(article.createdAt).format('YYYY年MM月DD日') }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5" />
              {{ article.readingTime }} 分钟阅读
            </span>
            <span class="flex items-center gap-1">
              <Eye class="w-3.5 h-3.5" />
              {{ article.views }} 次阅读
            </span>
          </div>
        </header>

        <!-- 封面图 -->
        <div v-if="article.coverImage" class="rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 max-h-96">
          <img :src="article.coverImage" :alt="article.title" class="w-full h-full object-cover">
        </div>

        <!-- Markdown 文章正文渲染器 -->
        <MarkdownRenderer
          :content="article.content || ''"
          @toc-ready="handleTocReady"
        />

        <!-- 评论互动区 -->
        <CommentSection
          target-type="article"
          :target-id="article.id"
        />
      </article>

      <!-- 右侧悬浮目录 (TOC) -->
      <aside class="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
        <div class="p-6 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <List class="w-4 h-4 text-brand-600" />
            <span>文章目录</span>
          </div>

          <nav v-if="toc.length > 0" class="space-y-1.5 text-xs max-h-[65vh] overflow-y-auto pr-2">
            <a
              v-for="item in toc"
              :key="item.id"
              :href="`#${item.id}`"
              :class="[
                'block py-1 text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate',
                item.level === 1 && 'font-bold text-zinc-900 dark:text-zinc-200',
                item.level === 2 && 'pl-2',
                item.level === 3 && 'pl-4 text-zinc-500'
              ]"
            >
              {{ item.text }}
            </a>
          </nav>
          <div v-else class="text-xs text-zinc-400">
            暂无子章节标题
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
