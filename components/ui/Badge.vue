<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center font-medium rounded-md px-2 py-0.5 text-xs transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
        brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50',
        outline: 'border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300',
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
