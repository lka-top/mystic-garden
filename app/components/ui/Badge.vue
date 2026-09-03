<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center font-medium rounded-md px-2 py-0.5 text-xs transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
        brand: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50',
        rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50',
        outline: 'border border-sky-200 dark:border-slate-800 text-slate-700 dark:text-slate-300',
        mood: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface Props {
  variant?: VariantProps<typeof badgeVariants>['variant']
  className?: string
}

defineProps<Props>()
</script>

<template>
  <span :class="cn(badgeVariants({ variant }), className)">
    <slot />
  </span>
</template>
