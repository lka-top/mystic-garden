<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Tag as TagIcon, Plus, X, Check, Loader2 } from 'lucide-vue-next'
import type { ApiResponse, Tag } from '~/types'
import { useAuth } from '~/composables/useAuth'

const props = withDefaults(
  defineProps<{
    modelValue: number[] // 选中的 tag ID 列表
    placeholder?: string
  }>(),
  {
    modelValue: () => [],
    placeholder: '输入新标签并回车添加...'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
}>()

const { token } = useAuth()
const availableTags = ref<Tag[]>([])
const loading = ref(false)
const addingNewTag = ref(false)
const inputTagText = ref('')
const inputError = ref('')

// 已选中的完整标签对象列表
const selectedTags = computed(() => {
  return availableTags.value.filter(t => props.modelValue.includes(t.id))
})

// 获取全量标签列表
async function fetchTags() {
  loading.value = true
  try {
    const res = await $fetch<ApiResponse<Tag[]>>('/api/v1/tags')
    if (res.data) {
      availableTags.value = res.data
    }
  } catch (err) {
    console.error('获取标签列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 切换标签选中/取消选中
function toggleTag(tag: Tag) {
  const current = [...props.modelValue]
  const idx = current.indexOf(tag.id)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(tag.id)
  }
  emit('update:modelValue', current)
}

// 移除单个已选标签
function removeTag(tagId: number) {
  const current = props.modelValue.filter(id => id !== tagId)
  emit('update:modelValue', current)
}

// 回车或点击添加新标签
async function handleAddNewTag() {
  const name = inputTagText.value.trim()
  if (!name) return

  inputError.value = ''

  // 1. 如果已有同名标签，直接选中
  const existing = availableTags.value.find(
    t => t.name.toLowerCase() === name.toLowerCase()
  )
  if (existing) {
    if (!props.modelValue.includes(existing.id)) {
      emit('update:modelValue', [...props.modelValue, existing.id])
    }
    inputTagText.value = ''
    return
  }

  // 2. 如果不存在，调用接口创建新标签并自动选中
  addingNewTag.value = true
  try {
    const res = await $fetch<ApiResponse<Tag>>('/api/v1/tags', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { name }
    })
    if (res.data) {
      const newTag = res.data
      if (!availableTags.value.some(t => t.id === newTag.id)) {
        availableTags.value.push(newTag)
      }
      if (!props.modelValue.includes(newTag.id)) {
        emit('update:modelValue', [...props.modelValue, newTag.id])
      }
      inputTagText.value = ''
    }
  } catch (err: any) {
    inputError.value = err.data?.message || '创建标签失败'
  } finally {
    addingNewTag.value = false
  }
}

onMounted(() => {
  fetchTags()
})
</script>

<template>
  <div class="space-y-3">
    <!-- 1. 标签输入框与已选徽标容器 -->
    <div class="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500/80 transition-all flex flex-wrap items-center gap-1.5 min-h-[44px]">
      <!-- 已选标签胶囊 -->
      <span
        v-for="tag in selectedTags"
        :key="tag.id"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-medium bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 shadow-xs select-none group"
      >
        <span>#{{ tag.name }}</span>
        <button
          type="button"
          class="p-0.5 rounded-md hover:bg-brand-200/50 dark:hover:bg-brand-800/50 text-brand-400 hover:text-brand-700 dark:hover:text-brand-200 transition-colors cursor-pointer"
          title="移除标签"
          @click.stop="removeTag(tag.id)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- 快速输入框 -->
      <div class="flex-1 flex items-center min-w-[140px]">
        <input
          v-model="inputTagText"
          type="text"
          :placeholder="modelValue.length === 0 ? placeholder : '添加更多标签...'"
          :disabled="addingNewTag"
          class="w-full px-2 py-1 text-xs bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          @keydown.enter.prevent="handleAddNewTag"
        >
        <button
          v-if="inputTagText.trim()"
          type="button"
          :disabled="addingNewTag"
          class="p-1 px-2 text-[11px] rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer shrink-0 font-medium font-mono"
          @click="handleAddNewTag"
        >
          <Loader2 v-if="addingNewTag" class="w-3 h-3 animate-spin" />
          <Plus v-else class="w-3 h-3" />
          <span>添加</span>
        </button>
      </div>
    </div>

    <!-- 错误信息提示 -->
    <div v-if="inputError" class="text-[11px] text-red-500 font-mono">
      {{ inputError }}
    </div>

    <!-- 2. 全部可选标签列表 (点击即选 / 取消勾选) -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span class="flex items-center gap-1">
          <TagIcon class="w-3 h-3" />
          快捷点击选择或取消 (已有 {{ availableTags.length }} 个标签)
        </span>
        <span v-if="loading" class="flex items-center gap-1">
          <Loader2 class="w-3 h-3 animate-spin" />
          加载中...
        </span>
      </div>

      <div class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
        <button
          v-for="tag in availableTags"
          :key="tag.id"
          type="button"
          :class="[
            'px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1 select-none cursor-pointer',
            modelValue.includes(tag.id)
              ? 'bg-brand-500 text-white font-bold shadow-xs shadow-brand-500/20'
              : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50'
          ]"
          @click="toggleTag(tag)"
        >
          <Check v-if="modelValue.includes(tag.id)" class="w-3 h-3" />
          <span>#{{ tag.name }}</span>
        </button>

        <div v-if="availableTags.length === 0 && !loading" class="text-xs text-zinc-400 font-mono py-1">
          暂无已有标签，可在上方输入框中键入新标签按回车快速创建。
        </div>
      </div>
    </div>
  </div>
</template>
