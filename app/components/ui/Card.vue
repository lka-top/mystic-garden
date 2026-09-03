<script setup lang="ts">
import { cn } from '~/utils/cn'

interface Props {
  className?: string
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: false
})
</script>

<template>
  <div
    :class="cn(
      'rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65 p-6 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]',
      props.hoverable && 'hover:border-sky-300/60 dark:hover:border-sky-500/40 hover:shadow-xl hover:bg-white/85 dark:hover:bg-slate-900/80 hover:-translate-y-0.5',
      props.className
    )"
  >
    <slot />
  </div>
</template>
