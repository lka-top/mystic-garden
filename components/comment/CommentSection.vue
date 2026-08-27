<script setup lang="ts">
import { ref, watch } from 'vue'
import { Send, CornerDownRight, MessageCircle, ShieldCheck, Sparkles } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Comment, ApiResponse } from '~/types'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import { useAuth } from '~/composables/useAuth'
import { useGuestUser } from '~/composables/useGuestUser'

const props = defineProps<{
  targetType: 'article' | 'essay' | 'guestbook'
  targetId?: number
}>()

const api = useApi()
const { currentUser: loggedInUser } = useAuth()
const { getGuestUuid } = useGuestUser()

const comments = ref<Comment[]>([])
const loading = ref(false)
const submitting = ref(false)

const form = ref({
  content: '',
  parentId: null as number | null
})

const replyToName = ref('')

async function fetchComments() {
  loading.value = true
  try {
    const params: any = { targetType: props.targetType }
    if (props.targetType === 'article') params.articleId = props.targetId
    if (props.targetType === 'essay') params.essayId = props.targetId

    const res = await $fetch<ApiResponse<{ list: Comment[]; pagination: { total: number } }>>('/api/v1/comments', { params })
    if (res.code === 200) {
      comments.value = res.data.list
    }
  } catch (err) {
    console.error('获取评论失败:', err)
  } finally {
    loading.value = false
  }
}

watch(() => props.targetId, fetchComments, { immediate: true })

function handleReply(comment: Comment) {
  form.value.parentId = comment.id
  replyToName.value = comment.user.nickname
}

function cancelReply() {
  form.value.parentId = null
  replyToName.value = ''
}

async function submitComment() {
  if (!form.value.content.trim()) {
    alert('请输入评论内容')
    return
  }

  submitting.value = true
  try {
    const guestUuid = getGuestUuid()
    const payload: any = {
      targetType: props.targetType,
      content: form.value.content.trim(),
      parentId: form.value.parentId,
      guestUuid
    }

    if (props.targetType === 'article') payload.articleId = props.targetId
    if (props.targetType === 'essay') payload.essayId = props.targetId

    const res = await api<Comment>('/api/v1/comments', {
      method: 'POST',
      body: payload
    })

    if (res.code === 200) {
      form.value.content = ''
      cancelReply()
      await fetchComments()
    }
  } catch (err: any) {
    alert(err?.data?.statusMessage || '提交评论失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
        <MessageCircle class="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <span>花园留言 ({{ comments.length }})</span>
      </div>

      <div class="flex items-center gap-1.5 text-xs text-zinc-400">
        <Sparkles class="w-3.5 h-3.5 text-brand-500" />
        <span>免注册即刻畅言 · 自动归档</span>
      </div>
    </div>

    <!-- 评论输入框 -->
    <div class="p-5 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 shadow-sm mb-8 transition-all focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/10">
      <div v-if="replyToName" class="mb-3 flex items-center justify-between text-xs bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 px-3 py-1.5 rounded-xl border border-brand-200/50">
        <span>正在回复 @{{ replyToName }}</span>
        <button type="button" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" @click="cancelReply">
          取消回复
        </button>
      </div>

      <textarea
        v-model="form.content"
        rows="3"
        placeholder="写下你的想法、思考或与博主交流（无需注册，直接发表）..."
        class="w-full p-3 text-sm rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/40 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-200"
      />

      <div class="mt-3 flex items-center justify-between">
        <div class="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <span v-if="loggedInUser?.nickname" class="text-brand-600 dark:text-brand-400 font-medium">
            以 {{ loggedInUser.nickname }} ({{ loggedInUser.role === 'admin' ? '博主' : '用户' }}) 身份发言
          </span>
          <span v-else>
            以「访客友邻」身份发布
          </span>
        </div>

        <Button variant="brand" size="sm" :loading="submitting" @click="submitComment">
          <Send class="w-3.5 h-3.5 mr-1" />
          发送留言
        </Button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="space-y-4">
      <div
        v-for="c in comments"
        :key="c.id"
        class="p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/40"
      >
        <!-- 主评论 -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2.5">
            <img
              v-if="c.user?.avatar"
              :src="c.user.avatar"
              :alt="c.user.nickname"
              class="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover bg-zinc-100 dark:bg-zinc-800"
            />
            <div v-else class="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xs">
              {{ (c.user?.nickname || '友').charAt(0).toUpperCase() }}
            </div>

            <div>
              <div class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <span>{{ c.user?.nickname || '花园访客' }}</span>
                <span
                  v-if="c.user?.role === 'admin'"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-brand-500 text-white rounded-md tracking-wider shadow-sm"
                >
                  <ShieldCheck class="w-2.5 h-2.5" />
                  博主
                </span>
                <span
                  v-else-if="c.user?.role === 'guest'"
                  class="inline-flex items-center px-1.5 py-0.2 text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded"
                >
                  访客
                </span>
              </div>
              <div class="text-[11px] text-zinc-400 font-mono">
                {{ dayjs(c.createdAt).format('YYYY-MM-DD HH:mm') }}
              </div>
            </div>
          </div>

          <button
            type="button"
            class="text-xs text-zinc-400 hover:text-brand-600 transition-colors flex items-center gap-1"
            @click="handleReply(c)"
          >
            <CornerDownRight class="w-3 h-3" />
            回复
          </button>
        </div>

        <div class="mt-2.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-10 whitespace-pre-line">
          {{ c.content }}
        </div>

        <!-- 楼中楼子回复列表 -->
        <div v-if="c.replies && c.replies.length > 0" class="mt-4 pl-10 space-y-3">
          <div
            v-for="reply in c.replies"
            :key="reply.id"
            class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-800"
          >
            <div class="flex items-center justify-between text-xs mb-1.5">
              <div class="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                <img
                  v-if="reply.user?.avatar"
                  :src="reply.user.avatar"
                  :alt="reply.user.nickname"
                  class="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                />
                <span>{{ reply.user?.nickname || '花园访客' }}</span>
                <span
                  v-if="reply.user?.role === 'admin'"
                  class="inline-flex items-center px-1 py-0.2 text-[9px] font-bold bg-brand-500 text-white rounded tracking-wider"
                >
                  博主
                </span>
              </div>
              <span class="text-zinc-400 text-[10px] font-mono">{{ dayjs(reply.createdAt).format('MM-DD HH:mm') }}</span>
            </div>
            <div class="text-xs text-zinc-600 dark:text-zinc-300 whitespace-pre-line">
              {{ reply.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-xs text-zinc-400">
      花开无声，暂无留言。留下第一条足迹吧~
    </div>
  </div>
</template>
