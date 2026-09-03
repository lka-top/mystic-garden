<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2, Check, X, ShieldCheck, User as UserIcon } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { ApiResponse, Comment } from '~/types'
import Badge from '~/components/ui/Badge.vue'

definePageMeta({
  layout: 'admin'
})

const api = useApi()
const { data: res, refresh } = await useFetch<ApiResponse<{ list: Comment[]; pagination: { total: number } }>>('/api/v1/comments', {
  query: { all: 'true', pageSize: 100 }
})

const comments = computed(() => res.value?.data?.list || [])

async function toggleApprove(id: number, currentStatus: boolean) {
  try {
    const r = await api<any>(`/api/v1/comments/${id}/approve`, {
      method: 'PATCH',
      body: { isApproved: !currentStatus }
    })
    if (r.code === 200) {
      await refresh()
    }
  } catch (err: any) {
    alert(err?.data?.statusMessage || '操作失败')
  }
}

async function deleteComment(id: number) {
  if (!confirm('确定要彻底删除该条留言吗？')) return
  try {
    const r = await api<any>(`/api/v1/comments/${id}`, {
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
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        评论与留言审核
      </h1>
      <p class="text-xs text-zinc-400 mt-0.5">
        统一归档免登录访客与注册用户的互动留言，支持快速上线/下线与违规清理
      </p>
    </div>

    <div v-if="comments.length > 0" class="space-y-4">
      <div
        v-for="c in comments"
        :key="c.id"
        class="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-4 transition-all"
      >
        <div class="space-y-2.5 flex-1">
          <div class="flex items-center gap-2 text-xs">
            <img
              v-if="c.user?.avatar"
              :src="c.user.avatar"
              :alt="c.user.nickname"
              class="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
            />
            <div v-else class="w-6 h-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-[10px]">
              {{ (c.user?.nickname || '友').charAt(0).toUpperCase() }}
            </div>

            <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ c.user?.nickname || '花园访客' }}</span>

            <span
              v-if="c.user?.role === 'admin'"
              class="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-brand-500 text-white rounded tracking-wider shadow-xs"
            >
              <ShieldCheck class="w-2.5 h-2.5" />
              博主
            </span>
            <span
              v-else
              class="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded font-mono"
            >
              <UserIcon class="w-2.5 h-2.5" />
              {{ c.user?.role === 'guest' ? '游客自动建档' : '正式用户' }}
            </span>

            <Badge :variant="c.isApproved ? 'brand' : 'outline'">
              {{ c.isApproved ? '已过审' : '待审核' }}
            </Badge>

            <span class="text-zinc-400 font-mono text-[11px]">{{ dayjs(c.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
          </div>

          <div class="text-sm text-zinc-700 dark:text-zinc-300 pl-8 leading-relaxed whitespace-pre-line">
            {{ c.content }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-1.5 rounded-xl border text-xs flex items-center gap-1 transition-colors"
            :class="c.isApproved ? 'text-amber-600 border-amber-200 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/30' : 'text-emerald-600 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'"
            @click="toggleApprove(c.id, c.isApproved)"
          >
            <component :is="c.isApproved ? X : Check" class="w-3.5 h-3.5" />
            <span>{{ c.isApproved ? '下线' : '通过' }}</span>
          </button>

          <button
            type="button"
            class="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
            @click="deleteComment(c.id)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="p-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
      暂无任何待审核或已发布的评论数据。
    </div>
  </div>
</template>
