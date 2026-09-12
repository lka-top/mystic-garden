<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronRight, Folder, FolderOpen } from 'lucide-vue-next'
import type { Notebook } from '~/types'
import { cn } from '~/utils/cn'

defineOptions({ name: 'NotebookTree' })

interface Props {
  notebooks: readonly Notebook[]
  selectedSlug?: string
  parentId?: number | null
  depth?: number
}

const props = withDefaults(defineProps<Props>(), {
  selectedSlug: '',
  parentId: null,
  depth: 0
})

const emit = defineEmits<{
  (event: 'select', slug: string): void
}>()

const expandedIds = ref<ReadonlySet<number>>(new Set())

const nodes = computed(() => props.notebooks
  .filter(notebook => (notebook.parentId ?? null) === props.parentId)
  .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, 'zh-CN')))

function childrenOf(notebookId: number): Notebook[] {
  return props.notebooks.filter(notebook => notebook.parentId === notebookId)
}

function toggle(notebookId: number) {
  const next = new Set(expandedIds.value)
  if (next.has(notebookId)) {
    next.delete(notebookId)
  } else {
    next.add(notebookId)
  }
  expandedIds.value = next
}

function selectNotebook(slug: string) {
  emit('select', slug)
}

watch(
  () => props.selectedSlug,
  (slug) => {
    const selected = props.notebooks.find(notebook => notebook.slug === slug)
    if (!selected) return

    const next = new Set(expandedIds.value)
    let parentId = selected.parentId
    while (parentId) {
      next.add(parentId)
      parentId = props.notebooks.find(notebook => notebook.id === parentId)?.parentId ?? null
    }
    expandedIds.value = next
  },
  { immediate: true }
)
</script>

<template>
  <ul class="space-y-0.5" :class="depth > 0 ? 'mt-0.5' : ''">
    <li v-for="notebook in nodes" :key="notebook.id">
      <div
        :class="cn(
          'group flex min-w-0 items-center gap-1 rounded-xl py-1 transition-colors',
          selectedSlug === notebook.slug
            ? 'bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300'
            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
        )"
        :style="{ paddingLeft: `${depth * 12 + 4}px` }"
      >
        <button
          v-if="childrenOf(notebook.id).length > 0"
          type="button"
          class="grid size-6 shrink-0 place-items-center rounded-md text-slate-400 transition-colors hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-slate-700 dark:hover:text-sky-300"
          :aria-label="`${expandedIds.has(notebook.id) ? '收起' : '展开'} ${notebook.name}`"
          :aria-expanded="expandedIds.has(notebook.id)"
          @click="toggle(notebook.id)"
        >
          <ChevronRight
            class="size-3.5 transition-transform"
            :class="expandedIds.has(notebook.id) ? 'rotate-90' : ''"
          />
        </button>
        <span v-else class="size-6 shrink-0" aria-hidden="true" />

        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-2 rounded-lg py-1 pr-2 text-left text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
          @click="selectNotebook(notebook.slug)"
        >
          <FolderOpen v-if="selectedSlug === notebook.slug || expandedIds.has(notebook.id)" class="size-3.5 shrink-0 text-sky-500" />
          <Folder v-else class="size-3.5 shrink-0 text-slate-400 group-hover:text-sky-500" />
          <span class="truncate">{{ notebook.name }}</span>
          <span v-if="notebook.noteCount !== undefined" class="ml-auto shrink-0 text-[10px] font-mono opacity-60">
            {{ notebook.noteCount }}
          </span>
        </button>
      </div>

      <NotebookTree
        v-if="childrenOf(notebook.id).length > 0 && expandedIds.has(notebook.id)"
        :notebooks="notebooks"
        :selected-slug="selectedSlug"
        :parent-id="notebook.id"
        :depth="depth + 1"
        @select="selectNotebook"
      />
    </li>
  </ul>
</template>
