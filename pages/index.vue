<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Sparkles,
  BookOpen,
  Feather,
  ArrowRight,
  Github,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Pin,
  Tag as TagIcon,
  Compass,
  Radio,
  FileCode2,
  Terminal,
  Layers,
  Flame,
  Activity
} from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Article, Essay, Category, Tag } from '~/types'
import ArticleCard from '~/components/article/ArticleCard.vue'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import { useNow } from '@vueuse/core'

// 实时时钟计算 (年月日时分秒 + 星期)
const now = useNow()
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const currentWeekday = computed(() => weekdays[now.value.getDay()])
const currentYear = computed(() => now.value.getFullYear())
const currentMonth = computed(() => String(now.value.getMonth() + 1).padStart(2, '0'))
const currentDay = computed(() => String(now.value.getDate()).padStart(2, '0'))
const currentHours = computed(() => String(now.value.getHours()).padStart(2, '0'))
const currentMinutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))
const currentSeconds = computed(() => String(now.value.getSeconds()).padStart(2, '0'))

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
  title: '首页 - 记录思考与沉淀工程实践',
  description: '欢迎来到神秘花园，这里是记录全栈开发探索、前端架构沉淀与碎片随想的一方数字空间。'
})
</script>

<template>
  <div class="space-y-12">
    <!-- ========================================================================= -->
    <!-- 1. BENTO GRID 模块化个人名片 & 灵感速递 -->
    <!-- ========================================================================= -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <!-- 1.1 主名片卡片 (8列) - 弹性弹入 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20, scale: 0.98 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 400, ease: 'easeOut' } }"
        class="md:col-span-8 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs relative overflow-hidden flex flex-col justify-between group"
      >
        <!-- 装饰微光晕背景 -->
        <div class="absolute -top-24 -right-24 w-72 h-72 bg-zinc-200/40 dark:bg-zinc-800/40 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        <div class="space-y-4 relative z-10">
          <div class="flex items-center gap-4">
            <!-- 头像与微边框 -->
            <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden p-0.5 bg-zinc-200 dark:bg-zinc-700 shadow-sm shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="神秘人"
                class="w-full h-full object-cover rounded-[14px]"
              >
            </div>

            <div>
              <div class="flex items-center gap-2.5">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  神秘人
                </h1>
                <span class="text-xs font-mono text-zinc-400 font-normal">/ Mystic Garden</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1 flex items-center gap-1.5">
                <Terminal class="w-3.5 h-3.5 text-zinc-400" />
                Full-stack Developer · Design Systems
              </p>
            </div>
          </div>

          <!-- 个人理念 -->
          <p class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            欢迎来到「神秘花园」。这里是一方沉淀全栈开发探索、前端现代架构与长青设计思考的数字花园。崇尚克制、清晰与扎实的工程底座。
          </p>

          <!-- 技能标签栈 -->
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">Nuxt 3</span>
            <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">Vue 3</span>
            <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">Tailwind CSS</span>
            <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">TypeScript</span>
            <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">MySQL & Prisma</span>
          </div>
        </div>

        <!-- 底部社交矩阵与快速行动入口 -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 relative z-10 text-xs">
          <div class="flex items-center gap-3">
            <NuxtLink to="/articles">
              <Button variant="default" size="sm" class="gap-1.5 shadow-xs">
                <BookOpen class="w-3.5 h-3.5" />
                阅读博文
              </Button>
            </NuxtLink>
            <NuxtLink to="/essays">
              <Button variant="outline" size="sm" class="gap-1.5">
                <Feather class="w-3.5 h-3.5" />
                随笔动态
              </Button>
            </NuxtLink>
          </div>

          <div class="flex items-center gap-1.5 text-zinc-400">
            <a
              href="https://space.bilibili.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[#00AEEC] dark:hover:text-[#00AEEC] transition-colors"
              title="哔哩哔哩 Bilibili"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.144 2.86a.998.998 0 0 1 .374 1.365l-1.42 2.378h1.9a3.003 3.003 0 0 1 3 3v8.397a3.003 3.003 0 0 1-3 3H5a3.003 3.003 0 0 1-3-3V9.603a3.003 3.003 0 0 1 3-3h1.9L5.48 4.225a.998.998 0 0 1 1.714-1.025l1.954 3.403h5.704L16.806 3.2a1 1 0 0 1 1.338-.34zm.856 5.743H5a1 1 0 0 0-1 1v8.397a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.603a1 1 0 0 0-1-1zm-10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="GitHub"
            >
              <Github class="w-4 h-4" />
            </a>
            <NuxtLink
              to="/about"
              class="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="关于本站"
            >
              <Compass class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 1.2 右侧便签与全站数据 Bento 卡片 (4列) - 延时阶梯弹入 -->
      <div class="md:col-span-4 flex flex-col gap-4">
        <!-- 实时计时器与历法卡片 (年/月/日/时/分/秒) -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.98 }"
          :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 400, delay: 100, ease: 'easeOut' } }"
          class="p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs relative flex flex-col justify-between space-y-3"
        >
          <div class="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <span class="flex items-center gap-1.5 font-mono">
              <Clock class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              时钟记录仪
            </span>
            <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          <div class="py-1">
            <div class="text-2xl sm:text-3xl font-extrabold font-mono tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
              <span class="px-1.5 py-0.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/80 shadow-xs">{{ currentHours }}</span>
              <span class="text-zinc-400 animate-pulse">:</span>
              <span class="px-1.5 py-0.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/80 shadow-xs">{{ currentMinutes }}</span>
              <span class="text-zinc-400 animate-pulse">:</span>
              <span class="px-1.5 py-0.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-xs">{{ currentSeconds }}</span>
            </div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-2.5 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-zinc-400" />
              <span>{{ currentYear }}年{{ currentMonth }}月{{ currentDay }}日</span>
              <span>·</span>
              <span>{{ currentWeekday }}</span>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-zinc-200/50 dark:border-zinc-800/50">
            <span class="text-[10px]">东八区 · UTC+8</span>
            <span class="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Activity class="w-2.5 h-2.5 text-emerald-500" />
              全栈平稳运行
            </span>
          </div>
        </div>

        <!-- 站点数据矩阵 (Stats Matrix) -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.98 }"
          :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 400, delay: 180, ease: 'easeOut' } }"
          class="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs grid grid-cols-2 gap-3 flex-1 content-center"
        >
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-center">
            <div class="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">{{ stats.articles }}</div>
            <div class="text-[11px] text-zinc-400 mt-0.5 font-mono">深度长文</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-center">
            <div class="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">{{ stats.essays }}</div>
            <div class="text-[11px] text-zinc-400 mt-0.5 font-mono">随笔微言</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-center">
            <div class="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">{{ runningDays }}</div>
            <div class="text-[11px] text-zinc-400 mt-0.5 font-mono">运行天数</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-center">
            <div class="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">{{ stats.totalViews }}</div>
            <div class="text-[11px] text-zinc-400 mt-0.5 font-mono">总阅读量</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 2. 主体双栏内容流 (左侧文章流 + 右侧侧边栏) -->
    <!-- ========================================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- 2.1 左侧主内容区 (8 列) -->
      <div class="lg:col-span-8 space-y-8">
        <!-- 分类切换导航 Tabs -->
        <div class="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div class="flex items-center gap-2">
            <BookOpen class="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <h2 class="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              文章列表
            </h2>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              :class="[
                'px-3 py-1 rounded-xl font-medium transition-colors',
                !activeCategory
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
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
                'px-3 py-1 rounded-xl font-medium transition-colors',
                activeCategory === cat.slug
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              ]"
              @click="activeCategory = cat.slug"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- 置顶推荐精选卡片 (Featured Hero Article) -->
        <div
          v-if="heroArticle && !activeCategory"
          class="group relative rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl dark:hover:shadow-brand-950/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-stretch"
        >
          <!-- 封面图 (比例自适应且高度紧凑) -->
          <div class="w-full sm:w-52 h-40 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              :src="heroArticle.coverImage || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80'"
              :alt="heroArticle.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            >
          </div>

          <!-- 文本内容区 -->
          <div class="flex-1 flex flex-col justify-between space-y-2.5 min-w-0">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <Badge variant="brand" class="gap-1 font-semibold text-[11px]">
                  <Pin class="w-3 h-3" />
                  精选置顶
                </Badge>
                <Badge v-if="heroArticle.category" variant="default" class="text-[11px]">
                  {{ heroArticle.category.name }}
                </Badge>
              </div>

              <h3 class="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                <NuxtLink :to="`/articles/${heroArticle.slug}`" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true" />
                  {{ heroArticle.title }}
                </NuxtLink>
              </h3>

              <p class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {{ heroArticle.summary }}
              </p>
            </div>

            <div class="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 font-mono">
              <span class="flex items-center gap-1">
                <Calendar class="w-3.5 h-3.5" />
                {{ dayjs(heroArticle.createdAt).format('YYYY-MM-DD') }}
              </span>
              <span class="flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" />
                {{ heroArticle.readingTime }} 分钟
              </span>
              <span class="flex items-center gap-1">
                <Eye class="w-3.5 h-3.5" />
                {{ heroArticle.views }}
              </span>
            </div>
          </div>
        </div>

        <!-- 普通文章流列表 -->
        <div class="space-y-4">
          <ArticleCard
            v-for="(article, idx) in regularArticles"
            :key="article.id"
            :article="article"
            :index="idx"
          />
        </div>

        <!-- 查看更多链接 -->
        <div class="pt-4 text-center">
          <NuxtLink to="/articles">
            <Button variant="outline" class="gap-1.5 text-xs px-6">
              查看全部文章专栏
              <ArrowRight class="w-3.5 h-3.5" />
            </Button>
          </NuxtLink>
        </div>
      </div>

      <!-- 2.2 右侧精美侧边栏 (4 列) -->
      <aside class="lg:col-span-4 space-y-6">
        <!-- 随笔微言流 -->
        <div class="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
            <div class="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Feather class="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>随笔微言流</span>
            </div>
            <NuxtLink to="/essays" class="text-[11px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-mono">
              更多 →
            </NuxtLink>
          </div>

          <div class="space-y-3.5">
            <div
              v-for="essay in recentEssays"
              :key="essay.id"
              class="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div class="flex items-center justify-between text-[11px]">
                <span v-if="essay.mood" class="font-mono text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700">
                  {{ essay.mood }}
                </span>
                <span class="text-zinc-400 font-mono text-[10px]">{{ dayjs(essay.createdAt).format('MM-DD HH:mm') }}</span>
              </div>
              <p class="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                {{ essay.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- 标签云卡片 -->
        <div class="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs space-y-4">
          <div class="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
            <TagIcon class="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>探索标签云</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in tags"
              :key="tag.id"
              :to="`/articles?tag=${tag.slug}`"
              class="px-2.5 py-1 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-mono"
            >
              #{{ tag.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- 站点架构与关于 -->
        <div class="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs space-y-3 text-xs text-zinc-500 leading-relaxed">
          <div class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Activity class="w-3.5 h-3.5 text-zinc-500" />
            <span>架构说明</span>
          </div>
          <p>
            基于 Nuxt 3 (SSR + Nitro) + Tailwind CSS + MySQL 8.0 架构全栈构建，专注于沉淀技术、工程规范与结构化笔记。
          </p>
          <div class="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
            <span>Nuxt 3 SSR</span>
            <NuxtLink to="/about" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">了解更多 →</NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
