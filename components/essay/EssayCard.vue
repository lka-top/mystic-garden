<script setup lang="ts">
import { ref } from 'vue'
import { Heart, MapPin, MessageSquare, Pin, Sparkles } from 'lucide-vue-next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { Essay, ApiResponse } from '~/types'
import Badge from '~/components/ui/Badge.vue'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Props {
  essay: Essay
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0
})

const emit = defineEmits<{
  (e: 'liked', id: number, newLikes: number): void
  (e: 'commentClick', essay: Essay): void
}>()

const currentLikes = ref(props.essay.likes)
const isLiked = ref(false)
const isLiking = ref(false)

async function handleLike() {
  if (isLiked.value || isLiking.value) return
  isLiking.value = true
  try {
    const res = await $fetch<ApiResponse<{ id: number; likes: number }>>(`/api/v1/essays/${props.essay.id}/like`, {
      method: 'POST'
    })
    if (res.code === 200) {
      currentLikes.value = res.data.likes
      isLiked.value = true
      emit('liked', props.essay.id, res.data.likes)
    }
  } catch (err) {
    console.error('点赞失败:', err)
  } finally {
    isLiking.value = false
  }
}
</script>

<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 28, scale: 0.97 }"
    :visible-once="{
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 600,
        delay: Math.min((props.index % 10) * 110, 750),
        ease: 'easeOut'
      }
    }"
    class="relative p-6 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs hover:shadow-sm"
  >
    <!-- 头部信息 (作者、时间、置顶、心情/天气) -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <img
            :src="essay.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'"
            :alt="essay.author?.nickname || '神秘人'"
            class="w-full h-full object-cover"
          >
        </div>
        <div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            {{ essay.author?.nickname || '神秘人' }}
            <Badge v-if="essay.isPinned" variant="brand" class="text-[10px] py-0 px-1.5 font-mono">
              <Pin class="w-2.5 h-2.5 mr-0.5" />
              置顶
            </Badge>
          </div>
          <div class="text-xs text-zinc-400 font-mono">
            {{ dayjs(essay.createdAt).fromNow() }}
          </div>
        </div>
      </div>

      <!-- 心情与天气标签 (纯文字无 emoji) -->
      <div class="flex items-center gap-1.5 font-mono">
        <span v-if="essay.mood" class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700">
          {{ essay.mood.replace(/[^\u4e00-\u9fa5\w]/g, '') }}
        </span>
        <span v-if="essay.weather" class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700">
          {{ essay.weather.replace(/[^\u4e00-\u9fa5\w]/g, '') }}
        </span>
      </div>
    </div>

    <!-- 正文内容 -->
    <div class="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
      {{ essay.content }}
    </div>

    <!-- 图片展示网格 (如果有) -->
    <div
      v-if="essay.images && essay.images.length > 0"
      class="mt-3 grid gap-2"
      :class="essay.images.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-2 sm:grid-cols-3'"
    >
      <div
        v-for="(img, idx) in essay.images"
        :key="idx"
        class="aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
      >
        <img :src="img" alt="随笔配图" class="w-full h-full object-cover hover:scale-105 transition-transform">
      </div>
    </div>

    <!-- 底部位置与互动栏 -->
    <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
      <div class="flex items-center gap-1">
        <MapPin v-if="essay.location" class="w-3.5 h-3.5" />
        <span>{{ essay.location || '神秘花园' }}</span>
      </div>

      <div class="flex items-center gap-4">
        <!-- 点赞按钮 -->
        <button
          type="button"
          class="flex items-center gap-1 transition-colors hover:text-rose-500 font-mono"
          :class="isLiked ? 'text-rose-500 font-semibold' : 'text-zinc-500 dark:text-zinc-400'"
          @click="handleLike"
        >
          <Heart class="w-3.5 h-3.5 transition-transform active:scale-125" :class="isLiked && 'fill-rose-500'" />
          <span>{{ currentLikes }}</span>
        </button>

        <!-- 评论按钮 -->
        <button
          type="button"
          class="flex items-center gap-1 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200 text-zinc-500 dark:text-zinc-400 font-mono"
          @click="emit('commentClick', essay)"
        >
          <MessageSquare class="w-3.5 h-3.5" />
          <span>{{ essay.commentCount || 0 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
