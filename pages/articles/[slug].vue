<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Calendar, Clock, Eye, ArrowLeft, Sparkles, Heart } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Article } from '~/types'
import MarkdownRenderer from '~/components/article/MarkdownRenderer.vue'
import CommentSection from '~/components/comment/CommentSection.vue'
import TableOfContents from '~/components/article/TableOfContents.vue'
import ProfileCard from '~/components/layout/ProfileCard.vue'

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
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
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
  <div class="space-y-8">
    <!-- 顶部固定阅读进度条 (蔚蓝到珊瑚粉流光渐变) -->
    <div
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-sky-400 via-teal-300 to-rose-400 z-50 transition-all duration-100 shadow-xs"
      :style="{ width: `${readingProgress}%` }"
    />

    <!-- 1. 顶部沉浸式文章封面与元信息卡片 (MD3 Hero Card) -->
    <div class="md3-card-elevated p-6 sm:p-10 relative overflow-hidden">
      <!-- 背景光晕装饰 -->
      <div class="absolute -top-24 -right-24 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 space-y-4">
        <!-- 返回面包屑导航 -->
        <NuxtLink
          to="/articles"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>返回文章专栏</span>
        </NuxtLink>

        <!-- 分类与标签 -->
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <span
            v-if="article.category"
            class="px-3.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-sky-500 to-rose-400 text-white shadow-xs"
          >
            {{ article.category.name }}
          </span>

          <span
            v-for="tag in article.tags"
            :key="tag.id"
            class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-slate-700"
          >
            #{{ tag.name }}
          </span>
        </div>

        <!-- 文章大标题 -->
        <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          {{ article.title }}
        </h1>

        <!-- 摘要引用框 -->
        <div v-if="article.summary" class="p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-900/60 border-l-4 border-sky-400 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
          {{ article.summary }}
        </div>

        <!-- 底部元信息 (作者、发布日期、阅读时间、浏览量) -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-sky-100/70 dark:border-slate-800/80 text-xs text-slate-400 font-mono">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold font-sans">
              <img
                v-if="article.author?.avatar"
                :src="article.author.avatar"
                :alt="article.author.nickname"
                class="w-5 h-5 rounded-full object-cover"
              />
              <span>{{ article.author?.nickname || '神秘人' }}</span>
            </span>
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5 text-sky-500" />
              {{ dayjs(article.createdAt).format('YYYY-MM-DD') }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5 text-rose-400" />
              {{ article.readingTime }} 分钟阅读
            </span>
            <span class="flex items-center gap-1">
              <Eye class="w-3.5 h-3.5 text-amber-400" />
              {{ article.views }} 次阅读
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 文章主体双栏网格 (左侧正文 + 右侧粘性目录 TOC) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- 左侧正文与互动区 (8列) -->
      <article class="lg:col-span-8 space-y-8">
        <!-- 封面大图 (若有) -->
        <div v-if="article.coverImage" class="rounded-3xl overflow-hidden shadow-card border border-sky-100 dark:border-slate-800 max-h-96">
          <img :src="article.coverImage" :alt="article.title" class="w-full h-full object-cover">
        </div>

        <!-- 正文卡片 -->
        <div class="md3-card p-6 sm:p-10">
          <MarkdownRenderer
            :content="article.content || ''"
            @toc-ready="handleTocReady"
          />
        </div>

        <!-- 底部评论留言区 -->
        <CommentSection
          target-type="article"
          :target-id="article.id"
        />
      </article>

      <!-- 右侧侧边栏 (4列): TOC 文章目录 + 简短个人卡片 -->
      <aside class="hidden lg:block lg:col-span-4 space-y-6">
        <TableOfContents :items="toc" />
        <ProfileCard />
      </aside>
    </div>
  </div>
</template>
