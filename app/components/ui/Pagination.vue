<script setup lang="ts">
import Button from '~/components/ui/Button.vue'

interface Props {
  page: number
  totalPages: number
}

defineProps<Props>()

defineEmits<{
  'update:page': [page: number]
}>()
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center gap-2 pt-6">
    <Button
      variant="outline"
      size="sm"
      :disabled="page <= 1"
      @click="$emit('update:page', page - 1)"
    >
      上一页
    </Button>
    <span class="px-4 py-1.5 text-xs text-zinc-500 flex items-center font-mono">
      {{ page }} / {{ totalPages }}
    </span>
    <Button
      variant="outline"
      size="sm"
      :disabled="page >= totalPages"
      @click="$emit('update:page', page + 1)"
    >
      下一页
    </Button>
  </div>
</template>
