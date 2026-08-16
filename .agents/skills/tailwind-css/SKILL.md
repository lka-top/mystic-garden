---
name: tailwind-css
description: Tailwind CSS 最佳实践。规范原子化 CSS 架构、CVA 多变体组件设计、Tailwind Merge 与样式动态组合。
---

# Tailwind CSS Skill

## 1. 架构与工具链规范
- **类名合并策略**：在 Vue/Nuxt 中动态拼接类名时，统一封装 `cn()` 工具函数：
  ```ts
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```
- **多变体组件设计 (CVA)**：复杂 UI 组件（如 Button, Badge, Alert）使用 `class-variance-authority` 管理变体：
  ```ts
  import { cva, type VariantProps } from 'class-variance-authority'

  export const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
        },
        size: {
          default: 'h-10 px-4 py-2',
          sm: 'h-9 rounded-md px-3',
          lg: 'h-11 rounded-md px-8',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    }
  )
  ```

## 2. 类名编排与顺序 (Class Ordering)
遵循逻辑排序以提高可读性：
1. **布局与定位 (Layout)**：`relative`, `absolute`, `flex`, `grid`, `items-center`, `justify-between`
2. **盒模型与尺寸 (Box Model)**：`w-*`, `h-*`, `p-*`, `m-*`, `gap-*`
3. **排版 (Typography)**：`text-*`, `font-*`, `leading-*`, `tracking-*`
4. **视觉样式 (Visuals)**：`bg-*`, `border-*`, `rounded-*`, `shadow-*`
5. **交互与状态 (State/Interactive)**：`hover:*`, `focus:*`, `active:*`, `disabled:*`, `dark:*`

## 3. 暗黑模式与色彩变量
- 统一通过 `@nuxtjs/color-mode` 驱动，样式中使用 `dark:` 前缀或 CSS 变量（如 `bg-background text-foreground dark:bg-zinc-950`）。
- 严禁硬编码 hex 颜色，优先使用 Tailwind 主题系统预设色阶或 CSS 变量。
