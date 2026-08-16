<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, BookOpen, X, FileText } from 'lucide-vue-next'
import type { ApiResponse, Article, Category, Tag } from '~/types'
import ArticleCard from '~/components/article/ArticleCard.vue'
import Button from '~/components/ui/Button.vue'

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
    pageSize: 10,
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
  <div class="space-y-8">
    <!-- 头部说明与搜索框 -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookOpen class="w-6 h-6 text-zinc-800 dark:text-zinc-200" />
          深度长文
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-mono text-xs">
          共收录 {{ pagination.total }} 篇工程实践与技术思考
        </p>
      </div>

      <!-- 搜索输入框 -->
      <div class="relative w-full sm:w-64">
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文章标题或摘要..."
          class="w-full pl-9 pr-3 py-1.5 text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
        >
      </div>
    </div>

    <!-- 分类筛选 Pill 标签栏 -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
          !selectedCategory
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
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
          'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
          selectedCategory === cat.slug
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
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

      <!-- 分页控制 -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 pt-6">
        <Button
          variant="outline"
          size="sm"
          :disabled="page <= 1"
          @click="page--"
        >
          上一页
        </Button>
        <span class="px-4 py-1.5 text-xs text-zinc-500 flex items-center font-mono">
          {{ page }} / {{ pagination.totalPages }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="page >= pagination.totalPages"
          @click="page++"
        >
          下一页
        </Button>
      </div>
    </div>

    <!-- 空状态 (干净矢量无 emoji) -->
    <div v-else class="py-16 text-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
        <FileText class="w-6 h-6" />
      </div>
      <div class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        未检索到匹配的文章
      </div>
      <div class="text-xs text-zinc-400">
        请尝试调整关键词或切换分类分类
      </div>
      <Button variant="outline" size="sm" @click="clearFilters">
        重置所有筛选
      </Button>
    </div>
  </div>
</template>
