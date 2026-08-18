<script setup lang="ts">
interface Props {
  type?: 'article' | 'note' | 'essay'
}

withDefaults(defineProps<Props>(), {
  type: 'article'
})
</script>

<template>
  <!-- 文章卡片骨架屏 (1:1 完美复刻 ArticleCard 布局) -->
  <div
    v-if="type === 'article'"
    class="relative overflow-hidden rounded-3xl border border-sky-100/60 dark:border-slate-800 bg-white/80 dark:bg-[#131c31]/80 backdrop-blur-md shadow-sm p-4 flex flex-col justify-between animate-pulse"
  >
    <div class="space-y-3">
      <!-- 封面图占位 (带呼吸渐变) -->
      <div class="w-full h-44 sm:h-48 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800" />

      <!-- 分类标签与阅读时间 -->
      <div class="flex items-center justify-between pt-1">
        <div class="w-16 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
        <div class="w-12 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
      </div>

      <!-- 标题骨架行 -->
      <div class="space-y-1.5">
        <div class="w-4/5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div class="w-1/2 h-4 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      <!-- 摘要骨架行 -->
      <div class="space-y-1.5 pt-1">
        <div class="w-full h-3.5 rounded bg-slate-200/80 dark:bg-slate-800/80" />
        <div class="w-5/6 h-3.5 rounded bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
    </div>

    <!-- 底部作者与数据指标 -->
    <div class="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-3">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div class="w-14 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
        <div class="w-8 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  </div>

  <!-- 笔记卡片骨架屏 -->
  <div
    v-else-if="type === 'note'"
    class="relative overflow-hidden rounded-2xl border border-sky-100/60 dark:border-slate-800 bg-white/80 dark:bg-[#131c31]/80 backdrop-blur-md p-4 space-y-3 animate-pulse"
  >
    <div class="flex items-center justify-between">
      <div class="w-20 h-5 rounded-md bg-emerald-100/60 dark:bg-emerald-950/40" />
      <div class="w-16 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
    <div class="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
    <div class="w-full h-3.5 rounded bg-slate-200/80 dark:bg-slate-800/80" />
    <div class="w-4/5 h-3.5 rounded bg-slate-200/80 dark:bg-slate-800/80" />
    <div class="pt-2 flex items-center gap-2">
      <div class="w-12 h-4 rounded bg-slate-200/60 dark:bg-slate-800/60" />
      <div class="w-12 h-4 rounded bg-slate-200/60 dark:bg-slate-800/60" />
    </div>
  </div>

  <!-- 随笔卡片骨架屏 -->
  <div
    v-else
    class="relative overflow-hidden rounded-3xl border border-sky-100/60 dark:border-slate-800 bg-white/80 dark:bg-[#131c31]/80 backdrop-blur-md p-5 space-y-4 animate-pulse"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div class="space-y-1.5">
          <div class="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          <div class="w-14 h-3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div class="w-12 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
    <div class="space-y-2">
      <div class="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
      <div class="w-5/6 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      <div class="w-2/3 h-4 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
</template>
