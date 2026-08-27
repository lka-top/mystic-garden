<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit3, Trash2, ExternalLink, BookMarked, Eye } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Note, Notebook } from '~/types'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'

definePageMeta({
  layout: 'admin'
})

const api = useApi()
const { data: res, refresh } = await useFetch<ApiResponse<{ list: Note[] }>>('/api/v1/notes', {
  query: { all: 'true', pageSize: 50 }
})

const notes = computed(() => res.value?.data?.list || [])

async function deleteNote(id: number, title: string) {
  if (!confirm(`确定要删除笔记《${title}》吗？`)) return
  try {
    const r = await api<any>(`/api/v1/notes/${id}`, {
      method: 'DELETE'
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
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookMarked class="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          知识库笔记管理
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5 font-mono">
          Manage structural notes, cheat sheets & notebooks
        </p>
      </div>

      <NuxtLink to="/admin/notes/editor">
        <Button variant="default" size="sm" class="gap-1.5 shadow-xs">
          <Plus class="w-4 h-4" />
          新建笔记
        </Button>
      </NuxtLink>
    </div>

    <div class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-800 font-mono">
          <tr>
            <th class="p-4">标题 / Slug</th>
            <th class="p-4">所属笔记本</th>
            <th class="p-4">状态</th>
            <th class="p-4">查看量</th>
            <th class="p-4">创建时间</th>
            <th class="p-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
          <tr v-for="n in notes" :key="n.id" class="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
            <td class="p-4">
              <div class="font-bold text-zinc-900 dark:text-zinc-100 max-w-sm truncate">{{ n.title }}</div>
              <div class="text-[11px] text-zinc-400 font-mono">/notes/{{ n.slug }}</div>
            </td>
            <td class="p-4">
              <span v-if="n.notebook" class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px]">
                {{ n.notebook.name }}
              </span>
              <span v-else class="text-zinc-400">未分类</span>
            </td>
            <td class="p-4">
              <Badge :variant="n.isPublished ? 'brand' : 'outline'">
                {{ n.isPublished ? '公开' : '草稿' }}
              </Badge>
            </td>
            <td class="p-4 text-zinc-500 font-mono">
              {{ n.views }} 次
            </td>
            <td class="p-4 text-zinc-400 font-mono">
              {{ dayjs(n.createdAt).format('YYYY-MM-DD') }}
            </td>
            <td class="p-4 text-right space-x-2">
              <NuxtLink :to="`/notes/${n.slug}`" target="_blank" class="p-1.5 inline-block text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <ExternalLink class="w-3.5 h-3.5" />
              </NuxtLink>
              <NuxtLink :to="`/admin/notes/editor?slug=${n.slug}`" class="p-1.5 inline-block text-zinc-700 dark:text-zinc-300 hover:underline">
                <Edit3 class="w-3.5 h-3.5" />
              </NuxtLink>
              <button type="button" class="p-1.5 text-rose-500 hover:text-rose-700" @click="deleteNote(n.id, n.title)">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
