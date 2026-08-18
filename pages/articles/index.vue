<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, BookOpen, X, FileText, Sparkles } from 'lucide-vue-next'
import type { ApiResponse, Article, Category, Tag } from '~/types'
import ArticleCard from '~/components/article/ArticleCard.vue'
import Button from '~/components/ui/Button.vue'
import Pagination from '~/components/ui/Pagination.vue'
import ProfileCard from '~/components/layout/ProfileCard.vue'
import SidebarWidgets from '~/components/layout/SidebarWidgets.vue'

const route = useRoute()

const selectedCategory = ref((route.query.category as string) || '')
const selectedTag = ref((route.query.tag as string) || '')
const searchKeyword = ref((route.query.q as string) || '')
const page = ref(1)

// 获取分类与标签数据
const { data: catRes } = await useFetch<ApiResponse<{ categories: Category[]; tags: Tag[] }>>('/api/v1/categories')
const categories = computed(() => catRes.value?.data?.categories || [])
const tags = computed(() => catRes.value?.data?.tags || [])

// 获取文章列表
const { data: articlesRes } = await useFetch<ApiResponse<{ list: Article[]; pagination: any }>>('/api/v1/articles', {
  query: computed(() => ({
    page: page.value,
    pageSize: 8,
    category: selectedCategory.value || undefined,
    tag: selectedTag.value || undefined,
    keyword: searchKeyword.value || undefined
  }))
})

const articles = computed(() => articlesRes.value?.data?.list || [])
const pagination = computed(() => articlesRes.value?.data?.pagination || { total: 0, totalPages: 1 })

function setCategory(slug: string) {
  selectedCategory.value = selectedCategory.value === slug ? '' : slug
  page.value = 1
}

function clearFilters() {
  selectedCategory.value = ''
  selectedTag.value = ''
  searchKeyword.value = ''
  page.value = 1
}

useSeoMeta({
  title: '深度文章',
  description: '神秘花园文章专栏 - 系统沉淀前端设计系统、Nuxt 3 全栈架构与开发实践'
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <!-- ========================================================================= -->
    <!-- 1. 左侧边栏 (MD3 粘性个人名片 + 分类/标签云微件) -->
    <!-- ========================================================================= -->
    <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
      <ProfileCard />
      <SidebarWidgets />
    </aside>

    <!-- ========================================================================= -->
    <!-- 2. 右侧主体文章流 -->
    <!-- ========================================================================= -->
    <main class="lg:col-span-8 space-y-6">
      <!-- 头部控制栏 (标题 + 搜索框) -->
      <div class="md3-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen class="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>深度长文库</span>
          </h1>
          <p class="text-xs text-zinc-400 font-mono mt-1">
            共收录 {{ pagination.total }} 篇工程实践与技术思考
          </p>
        </div>

        <!-- 搜索框 -->
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索文章..."
            class="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>

      <!-- 分类筛选 Pill 标签栏 -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
            !selectedCategory
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          ]"
          @click="setCategory('')"
        >
          全部 ({{ pagination.total }})
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
            selectedCategory === cat.slug
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          ]"
          @click="setCategory(cat.slug)"
        >
          {{ cat.name }} ({{ cat.articleCount }})
        </button>

        <!-- 清空筛选 -->
        <button
          v-if="selectedCategory || selectedTag || searchKeyword"
          type="button"
          class="inline-flex items-center gap-1 text-xs text-rose-500 hover:underline ml-2"
          @click="clearFilters"
        >
          <X class="w-3.5 h-3.5" />
          重置筛选
        </button>
      </div>

      <!-- 文章列表 -->
      <div v-if="articles.length > 0" class="space-y-4">
        <ArticleCard
          v-for="(article, idx) in articles"
          :key="article.id"
          :article="article"
          :index="idx"
        />

        <!-- 通用分页 -->
        <Pagination v-model:page="page" :total-pages="pagination.totalPages" />
      </div>

      <!-- 空状态 -->
      <div v-else class="md3-card py-16 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
          <FileText class="w-6 h-6" />
        </div>
        <div class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          未检索到匹配的文章
        </div>
        <div class="text-xs text-zinc-400">
          请尝试调整搜索词或切换分类
        </div>
        <Button variant="outline" size="sm" @click="clearFilters">
          重置所有筛选
        </Button>
      </div>
    </main>
  </div>
</template>
