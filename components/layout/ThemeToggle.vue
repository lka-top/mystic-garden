<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

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
    class="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    :title="isDark ? '切换至明亮模式' : '切换至暗黑模式'"
    @click="isDark = !isDark"
  >
    <ClientOnly>
      <Moon v-if="isDark" class="w-4 h-4" />
      <Sun v-else class="w-4 h-4" />
      <template #fallback>
        <div class="w-4 h-4" />
      </template>
    </ClientOnly>
    <span class="sr-only">Toggle theme</span>
  </button>
</template>
