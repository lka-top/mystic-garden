<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm',
        brand: 'bg-brand-500 text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 shadow-sm shadow-brand-500/25',
        gradient: 'bg-gradient-to-r from-sky-500 to-rose-400 text-white shadow-md shadow-sky-500/20 hover:opacity-95',
        rose: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/20',
        outline: 'border border-sky-100 bg-transparent hover:bg-sky-50/80 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200',
        ghost: 'hover:bg-sky-50/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-9 px-4 text-sm gap-2',
        lg: 'h-11 px-6 text-base gap-2.5',
        icon: 'h-9 w-9 p-0',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

interface Props {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  className?: string
  disabled?: boolean
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <button
    :class="cn(buttonVariants({ variant, size }), className)"
    :disabled="disabled || loading"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>
