---
name: vue-best-practices
description: Vue 3 与 Nuxt 3 开发最佳实践。涵盖 Composition API、响应式性能优化、组件设计与数据流规范。
---

# Vue & Nuxt Best Practices Skill

## 1. 语法与组件规范
- **统一使用 `<script setup lang="ts">`**：保持组件简洁与类型安全。
- **Props 与 Emits 纯类型声明**：
  ```vue
  <script setup lang="ts">
  interface Props {
    title: string
    tags?: string[]
    publishedAt?: string | Date
  }

  const props = withDefaults(defineProps<Props>(), {
    tags: () => [],
  })

  const emit = defineEmits<{
    (e: 'select', id: string): void
    (e: 'delete', id: string): void
  }>()
  </script>
  ```

## 2. 响应式与性能优化 (Reactivity & Performance)
- **避免过度响应式**：对于大体积静态数据（如已解析的 Markdown AST、长文章列表、图标元数据），使用 `shallowRef` 或 `markRaw` 替代深层 `ref` / `reactive`，减少 Proxy 包装开销。
- **合理使用 `computed`**：派生状态必须使用 `computed` 缓存，避免在模板中书写复杂计算逻辑。
- **清理副作用**：使用 `onUnmounted` 或 `@vueuse/core` 中的自动清理工具函数，防止事件监听器或定时器泄漏。

## 3. Nuxt 3 数据请求与服务端渲染 (SSR) 规范
- **SSR 数据获取**：
  - 页面初次加载与服务端预取统一使用 `useAsyncData` 或 `useFetch`。
  - 确保传入稳定的请求 `key`（如 `useAsyncData('posts', () => $fetch('/api/posts'))`），避免客户端水合不一致（Hydration Mismatch）。
- **跨组件共享状态**：服务端与客户端状态同步优先使用 `useState`，避免使用全局 module 变量导致多请求状态污染。
