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
      'rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 p-6 transition-all duration-200 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] dark:shadow-none',
      props.hoverable && 'hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:bg-zinc-900/80',
      props.className
    )"
  >
    <slot />
  </div>
</template>
