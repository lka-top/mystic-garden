---
name: web-performance-seo
description: Web 性能优化与 SEO 最佳实践。涵盖 Core Web Vitals、SSR/SSG 渲染优化、Nuxt SEO Meta 元数据与静态资源交付。
---

# Web Performance & SEO Skill

## 1. 核心 Web 指标优化 (Core Web Vitals)
- **LCP (Largest Contentful Paint)**：
  - 核心 Hero 区域图片开启预加载并使用正确尺寸。
  - 首屏字体使用 `font-display: swap`，避免阻塞文字渲染。
- **CLS (Cumulative Layout Shift)**：
  - 为所有图片、视频、骨架屏显式指定宽高比（Aspect Ratio）或 `width`/`height` 属性。
  - 避免动态插入无占位的高内容块。
- **INP (Interaction to Next Paint)**：
  - 避免在主线程执行长任务，耗时计算使用 Web Worker 或分片。

## 2. Nuxt 3 SEO & Meta 管理
- **结构化元数据**：
  在页面级使用 `useSeoMeta` 或 `useHead`：
  ```ts
  useSeoMeta({
    title: () => `${post.value?.title} - 博客名称`,
    description: () => post.value?.summary || '文章描述',
    ogTitle: () => post.value?.title,
    ogDescription: () => post.value?.summary,
    ogImage: () => post.value?.coverImage || '/default-og.png',
    twitterCard: 'summary_large_image',
  })
  ```
- **语义化 HTML 结构**：
  - 页面保留唯一且明确的 `<h1>` 标签。
  - 文章结构合理嵌套 `<h2>`, `<h3>`，配合 `<article>`, `<nav>`, `<aside>`, `<time>` 增强可读性与爬虫解析能力。

## 3. 资源加载与打包优化
- **静态资源优化**：利用 Nuxt 的自动懒加载，路由组件自动分割（Code Splitting）。
- **图片现代化**：优先输出 WebP / AVIF 格式。
- **缓存策略**：对于 SSR 接口与静态资源，合理配置 Nitro Cache 与 HTTP 缓存头。
