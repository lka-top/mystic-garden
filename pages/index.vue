<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Sparkles,
  BookOpen,
  Feather,
  ArrowRight,
  Pin,
  Tag as TagIcon,
  Calendar,
  Clock,
  Eye,
  Activity,
  Layers,
  Flame
} from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Article, Essay, Category, Tag } from '~/types'
import ArticleCard from '~/components/article/ArticleCard.vue'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import LiveClock from '~/components/ui/LiveClock.vue'
import HeroBanner from '~/components/layout/HeroBanner.vue'
import ProfileCard from '~/components/layout/ProfileCard.vue'
import SidebarWidgets from '~/components/layout/SidebarWidgets.vue'

// SSR 预取全站数据
const { data: statsRes } = await useFetch<ApiResponse<any>>('/api/v1/stats/overview')
const { data: articlesRes } = await useFetch<ApiResponse<{ list: Article[] }>>('/api/v1/articles', {
  params: { pageSize: 6 }
})
const { data: essaysRes } = await useFetch<ApiResponse<{ list: Essay[] }>>('/api/v1/essays', {
  params: { pageSize: 4 }
})
const { data: catRes } = await useFetch<ApiResponse<{ categories: Category[]; tags: Tag[] }>>('/api/v1/categories')

const stats = computed(() => statsRes.value?.data?.stats || { articles: 0, essays: 0, categories: 0, totalViews: 0 })
const articles = computed(() => articlesRes.value?.data?.list || [])
const recentEssays = computed(() => essaysRes.value?.data?.list || [])
const categories = computed(() => catRes.value?.data?.categories || [])
const tags = computed(() => catRes.value?.data?.tags || [])

// 选中的分类筛选
const activeCategory = ref('')
const filteredArticles = computed(() => {
  if (!activeCategory.value) return articles.value
  return articles.value.filter(a => a.category?.slug === activeCategory.value)
})

// 置顶或首篇精选文章
const heroArticle = computed(() => articles.value.find(a => a.isPinned) || articles.value[0])
const regularArticles = computed(() => {
  if (!heroArticle.value) return filteredArticles.value
  return filteredArticles.value.filter(a => a.id !== heroArticle.value?.id)
})

// 计算建站运行天数 (从 2024-10-01 启程)
const runningDays = computed(() => {
  const startDate = dayjs('2024-10-01')
  return Math.max(1, dayjs().diff(startDate, 'day'))
})

useSeoMeta({
  title: '神秘花园 - 记录思考与沉淀工程实践',
  description: '欢迎来到神秘花园，这里是记录全栈开发探索、前端架构沉淀与碎片随想的一方数字空间。'
})
</script>

<template>
  <div>
    <!-- ========================================================================= -->
    <!-- 1. 顶部沉浸式全屏宽幅 Hero Banner + 动态波浪过渡 (Full-Bleed with Waves) -->
    <!-- ========================================================================= -->
    <HeroBanner
      title="神秘花园 · 晴空之下"
      subtitle="漫步夏日微风 · 记录全栈探索 · 沉淀技术与美学思考"
      height="lg"
      :show-wave="true"
    />

    <!-- ========================================================================= -->
    <!-- 2. 主体双栏内容流 (去除冗余大 Bento 名片，直接进入双栏内容矩阵) -->
    <!-- ========================================================================= -->
    <div id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- 2.1 左侧边栏 (MD3 个人名片 + 实时时钟 + 分类标签微件) -->
        <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <!-- 个人名片 -->
          <ProfileCard />

          <!-- 实时时钟微件 -->
          <div class="md3-card p-5 space-y-3">
            <LiveClock />
          </div>

          <!-- 分类与标签云微件 -->
          <SidebarWidgets />

          <!-- 站点架构小卡片 -->
          <div class="md3-card p-5 space-y-3 text-xs text-slate-500 leading-relaxed">
            <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Activity class="w-4 h-4 text-sky-500" />
              <span>架构说明</span>
            </div>
            <p>
              基于 Nuxt 3 (SSR + Nitro) + Tailwind CSS + MySQL 8.0 构建，融合 Material Design 3 现代轻透美学。
            </p>
            <div class="pt-2 border-t border-sky-100/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span class="text-sky-600 dark:text-sky-400 font-semibold">Nuxt 3 SSR</span>
              <NuxtLink to="/about" class="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">了解更多 →</NuxtLink>
            </div>
          </div>
        </aside>

        <!-- 2.2 右侧主内容流 (8 列) -->
        <main class="lg:col-span-8 space-y-8">
          <!-- 头部控制栏：分类筛选 Tabs -->
          <div class="md3-card p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-2">
              <BookOpen class="w-4 h-4 text-sky-500" />
              <h2 class="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                精选文章流
              </h2>
            </div>

            <!-- 分类药丸 Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-full font-semibold transition-all duration-200',
                  !activeCategory
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-sky-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-700'
                ]"
                @click="activeCategory = ''"
              >
                全部
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-full font-semibold transition-all duration-200',
                  activeCategory === cat.slug
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-sky-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-700'
                ]"
                @click="activeCategory = cat.slug"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- 置顶精选大卡片 (Featured Hero Article) -->
          <div
            v-if="heroArticle && !activeCategory"
            class="md3-card-elevated group relative p-6 sm:p-7 hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-stretch overflow-hidden"
          >
            <!-- 装饰微光晕 -->
            <div class="absolute -top-16 -right-16 w-56 h-56 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

            <!-- 封面图 -->
            <div class="w-full sm:w-60 h-44 sm:h-auto shrink-0 rounded-2xl overflow-hidden bg-sky-50 dark:bg-slate-800 relative">
              <img
                :src="heroArticle.coverImage || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80'"
                :alt="heroArticle.title"
                class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <span class="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md">
                <Pin class="w-3 h-3" />
                精选置顶
              </span>
            </div>

            <!-- 文本内容区 -->
            <div class="flex-1 flex flex-col justify-between space-y-3 min-w-0">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span v-if="heroArticle.category" class="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50">
                    {{ heroArticle.category.name }}
                  </span>
                </div>

                <h3 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  <NuxtLink :to="`/articles/${heroArticle.slug}`" class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true" />
                    {{ heroArticle.title }}
                  </NuxtLink>
                </h3>

                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                  {{ heroArticle.summary }}
                </p>
              </div>

              <div class="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-sky-100/60 dark:border-slate-800/80 font-mono">
                <span class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5 text-sky-500" />
                  {{ dayjs(heroArticle.createdAt).format('YYYY-MM-DD') }}
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5 text-rose-400" />
                  {{ heroArticle.readingTime }} 分钟
                </span>
                <span class="flex items-center gap-1">
                  <Eye class="w-3.5 h-3.5 text-amber-400" />
                  {{ heroArticle.views }}
                </span>
              </div>
            </div>
          </div>

          <!-- 普通文章流列表 (横向卡片) -->
          <div class="space-y-4">
            <ArticleCard
              v-for="(article, idx) in regularArticles"
              :key="article.id"
              :article="article"
              :index="idx"
            />
          </div>

          <!-- 查看更多文章链接按钮 -->
          <div class="pt-4 text-center">
            <NuxtLink to="/articles">
              <Button variant="outline" class="gap-2 text-xs px-8 py-2.5 rounded-full shadow-xs">
                <span>浏览全部专栏长文</span>
                <ArrowRight class="w-3.5 h-3.5 text-sky-500" />
              </Button>
            </NuxtLink>
          </div>

          <!-- 随笔微言横向微件卡片 -->
          <div v-if="recentEssays.length > 0" class="md3-card p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-sky-100/60 dark:border-slate-800/80">
              <div class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Feather class="w-4 h-4 text-rose-500" />
                <span>最新随笔与日常动态</span>
              </div>
              <NuxtLink to="/essays" class="text-xs text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-mono">
                全部随笔 →
              </NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="essay in recentEssays"
                :key="essay.id"
                class="p-4 rounded-2xl bg-sky-50/50 dark:bg-slate-900/50 border border-sky-100/60 dark:border-slate-800/60 space-y-2 hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
              >
                <div class="flex items-center justify-between text-[11px]">
                  <span v-if="essay.mood" class="font-mono text-[10px] px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200/50">
                    {{ essay.mood }}
                  </span>
                  <span class="text-slate-400 font-mono text-[10px]">{{ dayjs(essay.createdAt).format('MM-DD HH:mm') }}</span>
                </div>
                <p class="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {{ essay.content }}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
