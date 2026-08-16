---
name: frontend-design
description: 现代前端与高质量 UI/UX 设计规范。指导构建独特、精致、非模板化的用户界面与交互体验。
---

# Frontend Design Skill

## 1. 核心设计哲学
- **拒绝模板化 (Anti-Generic)**：避免千篇一律的居中卡片和无意义渐变，根据博客主题（知识花园、技术沉淀）定制独特的视觉风格。
- **内容先导 (Content-First)**：视觉层次服从于长文阅读与代码展示体验，确保行高、字距、对比度在深浅色模式下均达到最优舒适度。
- **克制而精致的微动效 (Intentional Motion)**：微交互（按钮悬停、页面过渡、卡片悬浮）需自然轻量，强化操作反馈而非干扰视线。

## 2. 排版与排版系统 (Typography)
- **字体族配对**：正文使用高可读性无衬线字体（如 Inter, system-ui, PingFang SC），标题与关键引用可搭配优雅衬线或特色无衬线字体。
- **字阶与行高**：
  - 正文：`text-base` / `leading-relaxed` (1.625~1.75)，段间距适度宽松。
  - 标题：`text-2xl` ~ `text-4xl`，`font-bold` 或 `font-semibold`，搭配 `tracking-tight`。
  - 代码块：使用等宽字体（JetBrains Mono, Fira Code），保持 14px~15px 最佳阅读字号。

## 3. 色彩系统与层次 (Color & Palette)
- **语义化调色盘**：
  - Primary / Accent：定义 1~2 个主品牌色，其余使用中性色（Zinc / Neutral / Slate）构筑层次。
  - Background & Surface：区分背景层（Base）、容器层（Card/Surface）、悬浮层（Popovers/Dialogs）。
- **暗黑模式一致性**：避免纯黑（`#000000`），采用深石墨灰（如 `zinc-900`/`zinc-950`），减少强对比度造成的视觉疲劳。

## 4. 响应式布局与断点
- 采用移动端优先（Mobile-First）原则设计弹性容器（Flexbox / CSS Grid）。
- 关键断点：`sm (640px)`, `md (768px)`, `lg (1024px)`, `xl (1280px)`。
