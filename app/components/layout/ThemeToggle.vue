<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

interface Props {
  isTransparent?: boolean
}

defineProps<Props>()

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <button
    type="button"
    :class="[
      'p-2 rounded-full transition-all duration-300 transform active:scale-90 hover:rotate-12 focus-visible:outline-none',
      isTransparent
        ? 'text-white/90 hover:text-white hover:bg-white/20'
        : 'text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800/80'
    ]"
    :title="isDark ? '切换至明亮模式' : '切换至暗黑模式'"
    @click="isDark = !isDark"
  >
    <ClientOnly>
      <div class="relative w-4 h-4 flex items-center justify-center">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-50 rotate-90 opacity-0"
          enter-to-class="transform scale-100 rotate-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 rotate-0 opacity-100"
          leave-to-class="transform scale-50 -rotate-90 opacity-0"
          mode="out-in"
        >
          <Moon v-if="isDark" key="moon" class="w-4 h-4 text-sky-400" />
          <Sun v-else key="sun" class="w-4 h-4 text-amber-500" />
        </Transition>
      </div>
      <template #fallback>
        <div class="w-4 h-4" />
      </template>
    </ClientOnly>
    <span class="sr-only">切换主题</span>
  </button>
</template>
