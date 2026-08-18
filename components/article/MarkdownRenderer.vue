<script setup lang="ts">
import { computed } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

interface Props {
  content: string
  editorId?: string
}

const props = withDefaults(defineProps<Props>(), {
  editorId: 'article-markdown-preview'
})

const emit = defineEmits<{
  (e: 'tocReady', toc: Array<{ id: string; text: string; level: number }>): void
}>()

const colorMode = useColorMode()
const theme = computed<'light' | 'dark'>(() => (colorMode.value === 'dark' ? 'dark' : 'light'))

// 统一标题 ID 生成器，保证与 TOC 目录锚点跳转 100% 对齐
function headingIdGenerator(text: string, _level: number, index: number): string {
  const cleanId = text.toLowerCase().trim().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  return cleanId || `heading-${index}`
}

function handleGetCatalog(list: Array<{ text: string; level: number }>) {
  const headings = list.map((item, idx) => ({
    id: headingIdGenerator(item.text, item.level, idx + 1),
    text: item.text,
    level: item.level
  }))
  emit('tocReady', headings)
}
</script>

<template>
  <div class="md-preview-wrapper select-text">
    <ClientOnly>
      <MdPreview
        :editor-id="props.editorId"
        :model-value="props.content || ''"
        :theme="theme"
        preview-theme="default"
        code-theme="atom"
        :marked-heading-id="headingIdGenerator"
        :show-code-row-number="true"
        class="bg-transparent! p-0!"
        @on-get-catalog="handleGetCatalog"
      />
      <template #fallback>
        <div class="py-12 text-center text-xs text-slate-400 font-mono">
          正在排版渲染文章内容...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style>
/* md-editor-v3 沉浸式透明背景与样式定制 */
.md-preview-wrapper .md-editor-preview-wrapper {
  padding: 0 !important;
  background-color: transparent !important;
}

.md-preview-wrapper .default-theme {
  font-family: inherit !important;
  color: inherit !important;
  line-height: 1.8 !important;
}

.md-preview-wrapper .default-theme p {
  line-height: 1.8 !important;
  margin-bottom: 1.25rem !important;
}

.md-preview-wrapper .default-theme h1,
.md-preview-wrapper .default-theme h2,
.md-preview-wrapper .default-theme h3 {
  scroll-margin-top: 5.5rem;
  font-weight: 800 !important;
  letter-spacing: -0.025em !important;
}

/* 代码块美化与圆角 */
.md-preview-wrapper .md-editor-code {
  border-radius: 1rem !important;
  overflow: hidden !important;
  margin: 1.5rem 0 !important;
  border: 1px solid rgba(224, 242, 254, 0.4);
}

.dark .md-preview-wrapper .md-editor-code {
  border: 1px solid rgba(30, 41, 59, 0.8);
}
</style>
