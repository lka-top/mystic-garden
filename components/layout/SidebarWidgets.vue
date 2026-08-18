<script setup lang="ts">
import { FolderTree, Tag as TagIcon, ChevronRight, Sparkles } from 'lucide-vue-next'
import type { ApiResponse, Category, Tag } from '~/types'

// 获取全站分类与标签
const { data: catRes } = await useFetch<ApiResponse<{ categories: Category[]; tags: Tag[] }>>('/api/v1/categories')
const categories = computed(() => catRes.value?.data?.categories || [])
const tags = computed(() => catRes.value?.data?.tags || [])

// 糖果多彩颜色循环 (蔚蓝、珊瑚粉、薄荷绿、琥珀黄、浅紫)
const tagColors = [
  'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/50 hover:bg-sky-500 hover:text-white',
  'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50 hover:bg-rose-500 hover:text-white',
  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50 hover:bg-emerald-500 hover:text-white',
  'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50 hover:bg-amber-500 hover:text-white',
  'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/50 hover:bg-indigo-500 hover:text-white'
]
</script>

<template>
  <div class="space-y-5 select-none">
    <!-- 1. 分类列表微件 -->
    <div class="md3-card p-5">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-sky-100/70 dark:border-slate-800/80">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <FolderTree class="w-4 h-4 text-sky-500" />
          <span>全站专栏分类</span>
        </div>
        <span class="text-[10px] font-mono text-sky-500/80 font-semibold">({{ categories.length }})</span>
      </div>

      <div v-if="categories.length > 0" class="space-y-1">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/articles?category=${cat.slug}`"
          class="flex items-center justify-between px-3 py-2 rounded-2xl text-xs text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 dark:hover:text-sky-300 transition-all duration-200 group"
        >
          <span class="font-medium group-hover:translate-x-1 transition-transform duration-200">
            {{ cat.name }}
          </span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-100/60 dark:bg-slate-800 text-sky-700 dark:text-sky-300 group-hover:bg-sky-500 group-hover:text-white transition-colors">
            {{ cat.articleCount || 0 }}
          </span>
        </NuxtLink>
      </div>
      <div v-else class="text-xs text-slate-400 text-center py-2">
        暂无分类
      </div>
    </div>

    <!-- 2. 糖果色标签云微件 -->
    <div class="md3-card p-5">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-sky-100/70 dark:border-slate-800/80">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <TagIcon class="w-4 h-4 text-rose-500" />
          <span>二次元灵感标签</span>
        </div>
        <span class="text-[10px] font-mono text-rose-500/80 font-semibold">({{ tags.length }})</span>
      </div>

      <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="(tag, i) in tags"
          :key="tag.id"
          :to="`/articles?tag=${tag.slug}`"
          :class="[
            'px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 shadow-2xs',
            tagColors[i % tagColors.length]
          ]"
        >
          #{{ tag.name }}
        </NuxtLink>
      </div>
      <div v-else class="text-xs text-slate-400 text-center py-2">
        暂无标签
      </div>
    </div>
  </div>
</template>
