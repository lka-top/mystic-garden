<script setup lang="ts" generic="T extends string | number | null">
import { ref, computed } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { cn } from '~/utils/cn'

export interface SelectOption<V = string | number | null> {
  label: string
  value: V
  disabled?: boolean
}

interface Props {
  modelValue?: T | null
  options?: SelectOption<T>[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  placeholder: '请选择...',
  disabled: false,
  className: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue' | 'change', value: T): void
}>()

const isOpen = ref(false)
const targetRef = ref<HTMLElement | null>(null)

onClickOutside(targetRef, () => {
  isOpen.value = false
})

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function handleSelect(opt: SelectOption<T>) {
  if (opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  isOpen.value = false
}
</script>

<template>
  <div ref="targetRef" :class="cn('relative w-full select-none', className)">
    <!-- 触发按钮 -->
    <button
      type="button"
      :disabled="disabled"
      :class="cn(
        'w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200',
        'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100',
        'hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/80',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400',
        'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        isOpen && 'ring-2 ring-brand-500/20 border-brand-500 dark:border-brand-400 bg-white dark:bg-zinc-800'
      )"
      @click="toggleDropdown"
    >
      <span v-if="selectedOption" class="truncate text-zinc-900 dark:text-zinc-100">
        {{ selectedOption.label }}
      </span>
      <span v-else class="text-zinc-400 dark:text-zinc-500 truncate">
        {{ placeholder }}
      </span>

      <ChevronDown
        :class="cn(
          'w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 ml-2 transition-transform duration-200',
          isOpen && 'rotate-180 text-brand-500 dark:text-brand-400'
        )"
      />
    </button>

    <!-- 下拉浮层面板 -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 top-full mt-1.5 z-50 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-60 overflow-y-auto"
      >
        <!-- 清空/占位项 -->
        <div
          v-if="placeholder"
          :class="cn(
            'flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer',
            modelValue === null
              ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-medium'
              : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
          )"
          @click="handleSelect({ label: placeholder, value: null as T })"
        >
          <span>{{ placeholder }}</span>
          <Check v-if="modelValue === null" class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        </div>

        <!-- 选项列表 -->
        <div
          v-for="opt in options"
          :key="String(opt.value)"
          :class="cn(
            'flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors',
            opt.disabled
              ? 'opacity-40 cursor-not-allowed'
              : 'cursor-pointer',
            modelValue === opt.value
              ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold'
              : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
          )"
          @click="handleSelect(opt)"
        >
          <span class="truncate">{{ opt.label }}</span>
          <Check
            v-if="modelValue === opt.value"
            class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0 ml-2"
          />
        </div>

        <!-- 空数据提示 -->
        <div
          v-if="!options.length"
          class="px-3 py-4 text-center text-xs text-zinc-400 dark:text-zinc-500"
        >
          暂无可用选项
        </div>
      </div>
    </Transition>
  </div>
</template>
