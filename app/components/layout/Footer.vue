<script setup lang="ts">
import { ShieldCheck, Compass, Heart } from 'lucide-vue-next'

const config = useRuntimeConfig()
const currentYear = new Date().getFullYear()
const icpNumber = config.public.icpNumber || '蜀ICP备2026049694号'
const authorName = config.public.authorName || 'lka'
</script>

<template>
  <footer class="relative z-10 w-full mt-auto border-t border-white/60 dark:border-white/10 bg-white/70 dark:bg-[#0d1527]/75 backdrop-blur-xl py-10 px-4 transition-colors duration-300">
    <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600 dark:text-slate-400">
      <div class="space-y-2 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-2">
          <span class="font-bold text-slate-900 dark:text-white">神秘花园</span>
          <span class="text-slate-300 dark:text-slate-700">/</span>
          <span class="font-mono text-sky-600 dark:text-sky-400 font-medium">Azure Garden</span>
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
          <span>© {{ currentYear }} {{ authorName }}. All rights reserved.</span>
          <span class="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors underline-offset-4 hover:underline"
          >
            {{ icpNumber }}
          </a>
        </p>
      </div>

      <div class="flex items-center gap-5 text-xs font-mono">
        <NuxtLink to="/archive" class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          归档索引
        </NuxtLink>
        <NuxtLink to="/about" class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          关于博主
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
