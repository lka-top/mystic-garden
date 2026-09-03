<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Calendar, Activity } from 'lucide-vue-next'
import { useNow } from '@vueuse/core'

// 实时时钟计算 (年月日时分秒 + 星期)
const now = useNow()
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const currentWeekday = computed(() => weekdays[now.value.getDay()])
const currentYear = computed(() => now.value.getFullYear())
const currentMonth = computed(() => String(now.value.getMonth() + 1).padStart(2, '0'))
const currentDay = computed(() => String(now.value.getDate()).padStart(2, '0'))
const currentHours = computed(() => String(now.value.getHours()).padStart(2, '0'))
const currentMinutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))
const currentSeconds = computed(() => String(now.value.getSeconds()).padStart(2, '0'))
</script>

<template>
  <div class="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
    <span class="flex items-center gap-1.5 font-mono">
      <Clock class="w-3.5 h-3.5 text-sky-500" />
      <span>时钟记录仪</span>
    </span>
    <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/50 text-[10px] text-rose-600 dark:text-rose-400 font-mono font-bold">
      <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
      <span>LIVE</span>
    </div>
  </div>

  <div class="py-1">
    <div class="text-2xl sm:text-3xl font-extrabold font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-1">
      <span class="px-1.5 py-0.5 rounded-lg bg-sky-100/60 dark:bg-slate-800/80 shadow-xs">{{ currentHours }}</span>
      <span class="text-sky-300 dark:text-slate-500 animate-pulse">:</span>
      <span class="px-1.5 py-0.5 rounded-lg bg-sky-100/60 dark:bg-slate-800/80 shadow-xs">{{ currentMinutes }}</span>
      <span class="text-rose-300 dark:text-slate-500 animate-pulse">:</span>
      <span class="px-1.5 py-0.5 rounded-lg bg-gradient-to-tr from-sky-500/15 to-rose-400/15 text-sky-600 dark:text-sky-300 border border-sky-300/40 dark:border-sky-700/40 shadow-xs">{{ currentSeconds }}</span>
    </div>
    <div class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-2.5 flex items-center gap-1.5">
      <Calendar class="w-3.5 h-3.5 text-slate-400" />
      <span>{{ currentYear }}年{{ currentMonth }}月{{ currentDay }}日</span>
      <span>·</span>
      <span>{{ currentWeekday }}</span>
    </div>
  </div>

  <div class="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-sky-100/60 dark:border-slate-800/60">
    <span class="text-[10px]">东八区 · UTC+8</span>
    <span class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
      <Activity class="w-2.5 h-2.5 text-sky-500" />
      晴空全栈运行中
    </span>
  </div>
</template>
