<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { List, ChevronRight } from 'lucide-vue-next'

interface TocItem {
  id: string
  text: string
  level: number
}

interface Props {
  items: TocItem[]
}

const props = defineProps<Props>()

const activeId = ref('')

function updateActiveHeading() {
  if (!props.items || props.items.length === 0) return
  
  const headingElements = props.items
    .map(item => document.getElementById(item.id))
    .filter((el): el is HTMLElement => el !== null)

  const scrollPosition = window.scrollY + 120

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const el = headingElements[i]
    if (el.offsetTop <= scrollPosition) {
      activeId.value = el.id
      return
    }
  }

  if (headingElements.length > 0) {
    activeId.value = headingElements[0].id
  }
}

function scrollToHeading(id: string, e: Event) {
  e.preventDefault()
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
    activeId.value = id
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
  updateActiveHeading()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<template>
  <div class="md3-card p-5 space-y-3 sticky top-20 select-none">
    <!-- 目录头部 -->
    <div class="flex items-center justify-between pb-2.5 border-b border-sky-100/60 dark:border-slate-800/80">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
        <List class="w-4 h-4 text-sky-500" />
        <span>文章大纲 (TOC)</span>
      </div>
      <span class="text-[10px] font-mono text-sky-600/80 dark:text-sky-400/80 font-bold">
        {{ items.length }} 节
      </span>
    </div>

    <!-- 目录列表导航 -->
    <nav v-if="items.length > 0" class="space-y-1 text-xs max-h-[60vh] overflow-y-auto pr-1">
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        :class="[
          'group flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-all duration-200 truncate cursor-pointer',
          activeId === item.id
            ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 font-bold shadow-2xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-sky-50/70 dark:hover:bg-slate-800/50 hover:text-sky-600 dark:hover:text-sky-300',
          item.level === 1 ? 'font-bold text-slate-900 dark:text-white' : '',
          item.level === 2 ? 'pl-3' : '',
          item.level === 3 ? 'pl-6 text-[11px] text-slate-500' : ''
        ]"
        @click="scrollToHeading(item.id, $event)"
      >
        <span class="truncate">{{ item.text }}</span>
        <ChevronRight
          v-if="activeId === item.id"
          class="w-3.5 h-3.5 text-sky-500 shrink-0 ml-1"
        />
      </a>
    </nav>

    <div v-else class="text-xs text-slate-400 py-3 text-center">
      本文未包含子章节标题
    </div>
  </div>
</template>
