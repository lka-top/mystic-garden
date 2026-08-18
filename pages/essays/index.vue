<script setup lang="ts">
import { ref, computed } from 'vue'
import { Feather, X, Sparkles, MessageSquare, Terminal, Eye, Sun, Cloud, Moon, BookOpen } from 'lucide-vue-next'
import type { ApiResponse, Essay } from '~/types'
import EssayCard from '~/components/essay/EssayCard.vue'
import CommentSection from '~/components/comment/CommentSection.vue'
import HeroBanner from '~/components/layout/HeroBanner.vue'

const selectedMood = ref('')
const activeEssayForComment = ref<Essay | null>(null)

// 0ms 非阻塞获取随笔列表
const { data: res, pending } = await useLazyFetch<ApiResponse<{ list: Essay[]; pagination: any }>>('/api/v1/essays', {
  key: 'essays-list',
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
  <div>
    <!-- 顶部全宽 HeroBanner + 动态波浪 -->
    <HeroBanner
      title="随笔微言与生活动态"
      subtitle="灵感碎片 · 日常思考 · 即时微言与技术碎碎念时间轴"
      height="md"
      :show-wave="true"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
      <!-- 头部说明与心情筛选 -->
      <div class="md3-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Feather class="w-5 h-5 text-rose-500" />
            <span>即时微言流</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1 font-mono">
            记录生活瞬间、技术灵感与碎片化思考
          </p>
        </div>

        <!-- 心情筛选 Tags -->
        <div class="flex flex-wrap gap-1.5 justify-center sm:justify-end">
          <button
            type="button"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-all font-mono',
              !selectedMood
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700'
            ]"
            @click="selectedMood = ''"
          >
            全部
          </button>
          <button
            v-for="m in moods"
            :key="m"
            type="button"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-all font-mono',
              selectedMood === m
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700'
            ]"
            @click="filterMood(m)"
          >
            #{{ m }}
          </button>
        </div>
      </div>

      <!-- 随笔时间轴流 -->
      <div v-if="essays.length > 0" class="space-y-5">
        <EssayCard
          v-for="(essay, idx) in essays"
          :key="essay.id"
          :essay="essay"
          :index="idx"
          @comment-click="openComments"
        />
      </div>

      <div v-else class="md3-card py-16 text-center text-xs text-slate-400 font-mono">
        暂无对应随笔记录
      </div>

      <!-- 随笔评论弹窗 -->
      <div
        v-if="activeEssayForComment"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="closeComments"
      >
        <div class="md3-card-elevated w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-slate-800">
            <span class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquare class="w-4 h-4 text-sky-500" />
              随笔留言讨论
            </span>
            <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" @click="closeComments">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="mt-4 p-3.5 rounded-2xl bg-sky-50/60 dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ activeEssayForComment.content }}
          </div>

          <CommentSection
            target-type="essay"
            :target-id="activeEssayForComment.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>
