<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit3, Trash2, ExternalLink } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Article } from '~/types'
import { useAuth } from '~/composables/useAuth'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'

definePageMeta({
  layout: 'admin'
})

const { token } = useAuth()
const { data: res, refresh } = await useFetch<ApiResponse<{ list: Article[] }>>('/api/v1/articles', {
  query: { all: 'true', pageSize: 50 }
})

const articles = computed(() => res.value?.data?.list || [])

async function deleteArticle(id: number, title: string) {
  if (!confirm(`确定要删除文章《${title}》吗？`)) return
  try {
    const r = await $fetch<ApiResponse<any>>(`/api/v1/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (r.code === 200) {
      await refresh()
    }
  } catch (err: any) {
    alert(err?.data?.statusMessage || '删除失败')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          文章管理
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5">
          管理所有已发布与草稿状态的技术博文
        </p>
      </div>

      <NuxtLink to="/admin/articles/editor">
        <Button variant="brand" size="sm" class="gap-1.5">
          <Plus class="w-4 h-4" />
          新建文章
        </Button>
      </NuxtLink>
    </div>

    <div class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th class="p-4">标题 / Slug</th>
            <th class="p-4">分类</th>
            <th class="p-4">状态</th>
            <th class="p-4">阅读 / 评论</th>
            <th class="p-4">发布时间</th>
            <th class="p-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
          <tr v-for="a in articles" :key="a.id" class="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
            <td class="p-4">
              <div class="font-bold text-zinc-900 dark:text-zinc-100 max-w-sm truncate">{{ a.title }}</div>
              <div class="text-[11px] text-zinc-400 font-mono">/articles/{{ a.slug }}</div>
            </td>
            <td class="p-4">
              <Badge v-if="a.category" variant="default">{{ a.category.name }}</Badge>
              <span v-else class="text-zinc-400">未分类</span>
            </td>
            <td class="p-4">
              <Badge :variant="a.isPublished ? 'brand' : 'outline'">
                {{ a.isPublished ? '已发布' : '草稿' }}
              </Badge>
            </td>
            <td class="p-4 text-zinc-500 font-mono">
              {{ a.views }} 阅 · {{ a.commentCount || 0 }} 评
            </td>
            <td class="p-4 text-zinc-400 font-mono">
              {{ dayjs(a.createdAt).format('YYYY-MM-DD') }}
            </td>
            <td class="p-4 text-right space-x-2">
              <NuxtLink :to="`/articles/${a.slug}`" target="_blank" class="p-1.5 inline-block text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <ExternalLink class="w-3.5 h-3.5" />
              </NuxtLink>
              <NuxtLink :to="`/admin/articles/editor?slug=${a.slug}`" class="p-1.5 inline-block text-brand-600 hover:text-brand-700">
                <Edit3 class="w-3.5 h-3.5" />
              </NuxtLink>
              <button type="button" class="p-1.5 text-rose-500 hover:text-rose-700" @click="deleteArticle(a.id, a.title)">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
