<script setup lang="ts">
import { ref, computed } from 'vue'
import { Feather, X, Sparkles, MessageSquare, Terminal, Eye, Sun, Cloud, Moon, BookOpen } from 'lucide-vue-next'
import type { ApiResponse, Essay } from '~/types'
import EssayCard from '~/components/essay/EssayCard.vue'
import CommentSection from '~/components/comment/CommentSection.vue'

const selectedMood = ref('')
const activeEssayForComment = ref<Essay | null>(null)

const { data: res } = await useFetch<ApiResponse<{ list: Essay[]; pagination: any }>>('/api/v1/essays', {
  query: computed(() => ({
    pageSize: 20,
    mood: selectedMood.value || undefined
  }))
})

const essays = computed(() => res.value?.data?.list || [])
const moods = ['思考', '专注', '闲适', '日常', '阅读']

function filterMood(mood: string) {
  selectedMood.value = selectedMood.value === mood ? '' : mood
}

function openComments(essay: Essay) {
  activeEssayForComment.value = essay
}

function closeComments() {
  activeEssayForComment.value = null
}

useSeoMeta({
  title: '随笔动态',
  description: '神秘花园随笔时间轴 - 随时随地记录灵感、技术碎片与日常思考'
})
</script>

<template>
  <div class="space-y-8 max-w-3xl mx-auto">
    <!-- 头部介绍与心情筛选 -->
    <div class="space-y-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2 justify-center sm:justify-start">
          <Feather class="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
          随笔微言
        </h1>
        <p class="text-xs text-zinc-400 mt-1 font-mono">
          即时记录 · 灵感碎片与生活动态
        </p>
      </div>

      <!-- 心情筛选 Tags -->
      <div class="flex flex-wrap gap-1.5 justify-center sm:justify-end">
        <button
          v-for="m in moods"
          :key="m"
          type="button"
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium transition-all font-mono',
            selectedMood === m
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
          ]"
          @click="filterMood(m)"
        >
          #{{ m }}
        </button>
      </div>
    </div>

    <!-- 随笔时间轴流 -->
    <div v-if="essays.length > 0" class="space-y-6">
      <EssayCard
        v-for="(essay, idx) in essays"
        :key="essay.id"
        :essay="essay"
        :index="idx"
        @comment-click="openComments"
      />
    </div>

    <div v-else class="py-16 text-center text-xs text-zinc-400 font-mono">
      暂无对应随笔记录
    </div>

    <!-- 随笔评论弹窗 -->
    <div
      v-if="activeEssayForComment"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeComments"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <MessageSquare class="w-4 h-4 text-zinc-400" />
            讨论与留言
          </span>
          <button type="button" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" @click="closeComments">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="mt-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {{ activeEssayForComment.content }}
        </div>

        <CommentSection
          target-type="essay"
          :target-id="activeEssayForComment.id"
        />
      </div>
    </div>
  </div>
</template>
