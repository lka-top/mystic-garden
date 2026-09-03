<script setup lang="ts">
import { ref, computed } from 'vue'
import { Feather, Send, Trash2, Tag, MapPin, Sparkles } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Essay } from '~/types'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'

definePageMeta({
  layout: 'admin'
})

const api = useApi()
const { data: res, refresh } = await useFetch<ApiResponse<{ list: Essay[] }>>('/api/v1/essays', {
  query: { all: 'true', pageSize: 50 }
})

const essays = computed(() => res.value?.data?.list || [])

const form = ref({
  content: '',
  mood: '思考',
  weather: '晴朗',
  location: '工作室',
  isPinned: false
})

const moods = ['思考', '专注', '闲适', '日常', '阅读']
const weathers = ['晴朗', '多云', '阴雨', '夜晚']
const publishing = ref(false)

async function publishEssay() {
  if (!form.value.content.trim()) {
    alert('请输入随笔内容')
    return
  }

  publishing.value = true
  try {
    const r = await api<Essay>('/api/v1/essays', {
      method: 'POST',
      body: form.value
    })
    if (r.code === 200) {
      form.value.content = ''
      await refresh()
    }
  } catch (err: any) {
    alert(err?.data?.statusMessage || '发布失败')
  } finally {
    publishing.value = false
  }
}

async function deleteEssay(id: number) {
  if (!confirm('确定要删除这条随笔吗？')) return
  try {
    const r = await api<any>(`/api/v1/essays/${id}`, {
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
  <div class="space-y-8">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        随笔微言管理
      </h1>
      <p class="text-xs text-zinc-400 mt-0.5 font-mono">
        Moments & Stream Management
      </p>
    </div>

    <div class="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4">
      <div class="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 font-mono">
        <Feather class="w-4 h-4 text-zinc-500" />
        <span>发布随笔动态</span>
      </div>

      <textarea
        v-model="form.content"
        rows="3"
        placeholder="记录此刻的技术思考、调试心得或生活碎片..."
        class="w-full p-4 text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none leading-relaxed"
      />

      <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div class="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div class="flex items-center gap-1">
            <span class="text-zinc-400">状态:</span>
            <select v-model="form.mood" class="rounded-xl px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs border-none focus:ring-1 focus:ring-zinc-400">
              <option v-for="m in moods" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>

          <div class="flex items-center gap-1">
            <span class="text-zinc-400">环境:</span>
            <select v-model="form.weather" class="rounded-xl px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs border-none focus:ring-1 focus:ring-zinc-400">
              <option v-for="w in weathers" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>

          <div class="flex items-center gap-1">
            <span class="text-zinc-400">地点:</span>
            <input v-model="form.location" type="text" placeholder="工作室" class="w-20 px-2 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none">
          </div>

          <label class="flex items-center gap-1 text-zinc-500 cursor-pointer">
            <input v-model="form.isPinned" type="checkbox" class="rounded text-zinc-900 focus:ring-zinc-500">
            <span>置顶</span>
          </label>
        </div>

        <Button variant="default" size="sm" :loading="publishing" @click="publishEssay">
          <Send class="w-3.5 h-3.5 mr-1" />
          立即发布
        </Button>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="e in essays"
        :key="e.id"
        class="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-4"
      >
        <div class="space-y-2 flex-1">
          <div class="flex items-center gap-2 text-xs font-mono">
            <Badge v-if="e.isPinned" variant="brand">置顶</Badge>
            <span v-if="e.mood" class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[11px]">{{ e.mood }}</span>
            <span v-if="e.weather" class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px]">{{ e.weather }}</span>
            <span class="text-zinc-400 font-mono text-[11px]">{{ dayjs(e.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
          </div>

          <div class="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {{ e.content }}
          </div>

          <div class="text-xs text-zinc-400 font-mono">
            {{ e.likes }} 点赞 · {{ e.commentCount || 0 }} 评论
          </div>
        </div>

        <button type="button" class="p-2 text-zinc-400 hover:text-rose-500 transition-colors" @click="deleteEssay(e.id)">
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
