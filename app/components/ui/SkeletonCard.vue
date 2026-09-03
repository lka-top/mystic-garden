<script setup lang="ts">
interface Props {
  type?: 'article' | 'note' | 'essay'
}

withDefaults(defineProps<Props>(), {
  type: 'article'
})
</script>

<template>
  <!-- 1. 文章卡片骨架屏 (1:1 结构复刻 ArticleCard) -->
  <div
    v-if="type === 'article'"
    class="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 animate-pulse"
  >
    <!-- 封面图占位 (w-full sm:w-52 h-40) -->
    <div class="w-full sm:w-52 h-40 shrink-0 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

    <!-- 文本内容占位 -->
    <div class="flex-1 flex flex-col justify-between space-y-3 min-w-0">
      <div class="space-y-3">
        <!-- 分类与标签占位 -->
        <div class="flex items-center gap-2">
          <div class="w-16 h-5 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div class="w-12 h-5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>

        <!-- 标题占位 -->
        <div class="space-y-1.5">
          <div class="w-4/5 h-6 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <!-- 摘要占位 -->
        <div class="space-y-1.5 pt-1">
          <div class="w-full h-4 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
          <div class="w-3/4 h-4 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
        </div>
      </div>

      <!-- 底部元数据占位 -->
      <div class="flex items-center gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <div class="w-20 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div class="w-16 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div class="w-12 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  </div>

  <!-- 2. 知识库笔记骨架屏 (1:1 结构复刻 NoteCard) -->
  <div
    v-else-if="type === 'note'"
    class="p-6 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-3.5 animate-pulse"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-20 h-5 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div class="w-14 h-5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
      </div>
      <div class="w-20 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>

    <div class="w-3/5 h-6 rounded-xl bg-zinc-200 dark:bg-zinc-800" />

    <div class="space-y-1.5">
      <div class="w-full h-4 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
      <div class="w-4/5 h-4 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
    </div>
  </div>

  <!-- 3. 随笔卡片骨架屏 (1:1 结构复刻 EssayCard) -->
  <div
    v-else
    class="p-6 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-4 animate-pulse"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div class="space-y-1">
          <div class="w-16 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div class="w-12 h-3 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>
      </div>
      <div class="w-14 h-5 rounded-md bg-zinc-200 dark:bg-zinc-800" />
    </div>

    <div class="space-y-2">
      <div class="w-full h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div class="w-5/6 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div class="w-1/2 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
    </div>

    <div class="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
      <div class="w-16 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div class="flex items-center gap-3">
        <div class="w-10 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div class="w-10 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  </div>
</template>
