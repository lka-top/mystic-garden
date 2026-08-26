<script setup lang="ts">
import { Code2, ShieldCheck, Github, Radio } from 'lucide-vue-next'
</script>

<template>
  <footer class="mt-20 border-t border-zinc-200/80 dark:border-zinc-800/80 py-12 px-4">
    <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400">
      <div class="space-y-1.5 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-2">
          <span class="font-bold text-zinc-900 dark:text-zinc-100">神秘花园</span>
          <span class="text-zinc-300 dark:text-zinc-700">/</span>
          <span>Digital Garden</span>
        </div>
        <p class="text-[11px] text-zinc-400">
          © 2025 神秘人. Built with Nuxt 3, Tailwind CSS & MySQL.
        </p>
      </div>

      <div class="flex items-center gap-6 text-xs font-mono">
        <NuxtLink to="/archive" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          归档索引
        </NuxtLink>
        <NuxtLink to="/about" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          关于博主
        </NuxtLink>
        <NuxtLink to="/admin/login" class="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <ShieldCheck class="w-3.5 h-3.5" />
          控制台
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
