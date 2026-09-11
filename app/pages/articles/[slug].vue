<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Calendar, Clock, Eye, ArrowLeft, Sparkles, Heart } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Article } from '~/types'
import MarkdownRenderer from '~/components/article/MarkdownRenderer.vue'
import CommentSection from '~/components/comment/CommentSection.vue'
import TableOfContents from '~/components/article/TableOfContents.vue'
import ProfileCard from '~/components/layout/ProfileCard.vue'
import HeroBanner from '~/components/layout/HeroBanner.vue'

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

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'http://localhost:3000'

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.value.title,
        description: article.value.summary,
        image: article.value.coverImage ? [article.value.coverImage] : [],
        datePublished: article.value.createdAt,
        dateModified: article.value.updatedAt || article.value.createdAt,
        author: {
          '@type': 'Person',
          name: article.value.author?.nickname || config.public.authorName || 'lka'
        },
        publisher: {
          '@type': 'Organization',
          name: config.public.siteName || '神秘花园',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/favicon.svg`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}/articles/${article.value.slug}`
        }
      })
    }
  ]
}))
</script>

<template>
  <div>
    <!-- 顶部固定阅读进度条 (蔚蓝到珊瑚粉流光渐变) -->
    <div
      class="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-sky-400 via-teal-300 to-rose-400 z-[60] transition-all duration-100 shadow-xs"
      :style="{ width: `${readingProgress}%` }"
    />

    <!-- 1. 顶部沉浸式大图 Hero Banner + 动态波浪 -->
    <HeroBanner
      :title="article.title"
      :subtitle="article.summary || `${dayjs(article.createdAt).format('YYYY-MM-DD')} · ${article.readingTime} 分钟阅读 · ${article.views} 次浏览`"
      :bg-image="article.coverImage || ''"
      height="md"
      :show-wave="true"
    />

    <!-- 2. 文章主体双栏网格 (左侧正文 + 右侧粘性目录 TOC) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
      <!-- 返回面包屑与分类元信息卡片 -->
      <div class="md3-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <NuxtLink
          to="/articles"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>返回文章专栏</span>
        </NuxtLink>

        <!-- 分类与标签 -->
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-if="article.category"
            class="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-sky-500 to-rose-400 text-white shadow-xs"
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

        <div class="flex items-center gap-4 text-xs text-slate-400 font-mono">
          <span class="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
            <img
              v-if="article.author?.avatar"
              :src="article.author.avatar"
              :alt="article.author.nickname"
              class="w-4 h-4 rounded-full object-cover"
            />
            <span>{{ article.author?.nickname || 'lka' }}</span>
          </span>
          <span class="flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5 text-sky-500" />
            {{ dayjs(article.createdAt).format('YYYY-MM-DD') }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- 左侧正文与互动区 (8列) -->
        <article class="lg:col-span-8 space-y-8">
          <!-- 正文卡片 (采用实体纯色卡片，统一为组件 3 纯白/深色实底) -->
          <div class="md3-card-solid p-6 sm:p-10">
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
        <aside class="hidden lg:block lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <TableOfContents :items="toc" />
        </aside>
      </div>
    </div>
  </div>
</template>
