import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("开始初始化「神秘花园」全量测试种子数据...");

  // 1. 初始化管理员用户
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("LuokaiAdmin2025!", salt);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      nickname: "神秘人",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      email: "admin@luokai.me",
      bio: "全栈开发者 / 探索 Web 现代美学与工程架构。",
      role: "admin",
    },
  });

  // 2. 初始化分类 (Categories)
  const techCategory = await prisma.category.upsert({
    where: { slug: "technology" },
    update: {},
    create: {
      name: "技术探索",
      slug: "technology",
      description: "全栈开发、Nuxt 3 生态与现代工程实践",
    },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: "design" },
    update: {},
    create: {
      name: "设计美学",
      slug: "design",
      description: "Material Design 3、Tailwind CSS 与交互体验",
    },
  });

  const archCategory = await prisma.category.upsert({
    where: { slug: "architecture" },
    update: {},
    create: {
      name: "系统架构",
      slug: "architecture",
      description: "服务端架构、数据库优化与 DevOps 容器化",
    },
  });

  const lifeCategory = await prisma.category.upsert({
    where: { slug: "life" },
    update: {},
    create: {
      name: "生活杂谈",
      slug: "life",
      description: "读书笔记、生产力工具与成长碎碎念",
    },
  });

  // 3. 初始化标签 (Tags)
  const tagVue = await prisma.tag.upsert({
    where: { slug: "vue3" },
    update: {},
    create: { name: "Vue 3", slug: "vue3" },
  });
  const tagNuxt = await prisma.tag.upsert({
    where: { slug: "nuxt3" },
    update: {},
    create: { name: "Nuxt 3", slug: "nuxt3" },
  });
  const tagTailwind = await prisma.tag.upsert({
    where: { slug: "tailwindcss" },
    update: {},
    create: { name: "Tailwind CSS", slug: "tailwindcss" },
  });
  const tagTS = await prisma.tag.upsert({
    where: { slug: "typescript" },
    update: {},
    create: { name: "TypeScript", slug: "typescript" },
  });
  const tagDocker = await prisma.tag.upsert({
    where: { slug: "docker" },
    update: {},
    create: { name: "Docker", slug: "docker" },
  });
  const tagArch = await prisma.tag.upsert({
    where: { slug: "architecture" },
    update: {},
    create: { name: "架构设计", slug: "architecture" },
  });
  const tagUI = await prisma.tag.upsert({
    where: { slug: "ui-ux" },
    update: {},
    create: { name: "UI/UX", slug: "ui-ux" },
  });
  const tagPKM = await prisma.tag.upsert({
    where: { slug: "pkm" },
    update: {},
    create: { name: "知识管理", slug: "pkm" },
  });

  // 4. 初始化深度文章列表 (8篇)
  const articlesData = [
    {
      slug: "welcome-to-luokai-garden",
      title: "欢迎来到神秘花园：构建一个有生命力的数字花园",
      summary:
        "聊聊我为什么要搭建「神秘花园」，以及我是如何用 Nuxt 3、Tailwind CSS 和 MySQL 构建这方兼顾技术深度与灵感美学的数字自留地。",
      content: `# 欢迎来到神秘花园

> "数字花园（Digital Garden）不是一个只展示完美成品的展厅，而是一个随思想不断生长的生命力生态。"

## 为什么是「神秘花园」？

过去几年，信息流平台把我们的注意力切割得支离破碎。我们需要一个属于自己的阵地：
1. **深度长文（Articles）**：沉淀经过系统化验证的技术思考与架构实践。
2. **知识笔记（Notes）**：结构化工程规范与高效速查备忘。
3. **微言随笔（Essays）**：像朋友圈一样随时记录灵感火花。

\`\`\`typescript
interface DigitalGarden {
  philosophy: 'Craft over Clutter';
  stack: ['Nuxt 3', 'Vue 3', 'Tailwind CSS', 'MySQL', 'Prisma'];
  mindset: 'Keep building, keep writing';
}
\`\`\`

## 架构与技术选型
- **前端美学**：融合 Material Design 3 现代轻透毛玻璃与原子化 Tailwind CSS。
- **全栈一体**：借助 Nuxt 3 Nitro 引擎，前后端同构，无需额外独立后端。
- **极致速度**：SSR 服务端渲染 + 资源强缓存，秒开体验。

欢迎常来逛逛，在下方留言交流！`,
      coverImage: "/images/banner.png",
      isPinned: true,
      isPublished: true,
      views: 342,
      readingTime: 4,
      categoryId: techCategory.id,
      tagIds: [tagVue.id, tagNuxt.id, tagTailwind.id],
    },
    {
      slug: "nuxt3-ssr-hydration-performance-deep-dive",
      title: "深入浅出 Nuxt 3 SSR 水合原理与极致性能优化实践",
      summary:
        "剖析 Nuxt 3 服务端渲染（SSR）到客户端激活（Hydration）的全链路流程，彻底规避双重请求、内存泄漏与水合不匹配。",
      content: `# Nuxt 3 SSR 水合原理与性能深度优化

在现代全栈开发中，Nuxt 3 提供了开箱即用的 SSR 能力，但如果不理解其背后的水合（Hydration）机制，很容易踩进重复请求与性能衰减的泥潭。

## 1. 什么是水合（Hydration）？
服务端将 Vue 组件渲染为纯 HTML 字符串并注入初始状态序列化 Payload，浏览器加载静态 HTML 并下载客户端 JS Bundle，将事件监听器绑定到已存在的 DOM 节点上。

\`\`\`ts
// 推荐的最佳数据获取实践
const { data, pending, error } = await useFetch('/api/v1/articles', {
  key: 'article-list',
  lazy: false,
  server: true
})
\`\`\`

## 2. 避免常见水合不匹配（Hydration Mismatch）
- **时间与日期**：禁止在模板直接渲染 \`new Date()\`，应使用 \`<ClientOnly>\` 或统一定制计算属性。
- **浏览器专属对象**：如 \`localStorage\`、\`window.innerWidth\` 应置于 \`onMounted\` 钩子中执行。

## 3. 性能优化 Checklist
- [x] 使用 \`shallowRef\` 替代深层响应式 \`ref\` 处理文章大数组。
- [x] 开启 Nitro 强缓存头部 \`Cache-Control: s-maxage=3600\`。`,
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      isPinned: false,
      isPublished: true,
      views: 218,
      readingTime: 6,
      categoryId: techCategory.id,
      tagIds: [tagNuxt.id, tagVue.id, tagArch.id],
    },
    {
      slug: "material-design-3-modern-blog-design-system",
      title: "Material Design 3 现代轻透设计系统在个人博客中的实践",
      summary:
        "从色彩体系、MD3 药丸交互、动态视差毛玻璃到暗黑模式平滑过渡，打造极具呼吸感与辨识度的现代博客 UI。",
      content: `# Material Design 3 博客设计系统实践

现代前端设计不应只是模板的平庸堆砌，更在于对尺度、字距、动效与光影的精细雕琢。

## 1. 蔚蓝与珊瑚粉配色体系
我们从二次元夏日晴空插画中提炼出了具有高度感染力的色彩阶梯：
- **Azure Sky Blue (#0ea5e9)**：象征科技、澄澈与通透。
- **Coral Blossom Rose (#f43f5e)**：带来点睛的活力、浪漫与徽章高亮。

\`\`\`css
/* MD3 现代轻透卡片 */
.md3-card {
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(224, 242, 254, 0.6);
  box-shadow: 0 4px 20px -2px rgba(14, 165, 233, 0.05);
}
\`\`\`

## 2. 交互的呼吸感
- 导航栏在顶部全屏毛玻璃展开，滚动时收缩为居中圆角胶囊。
- 动态 SVG 视差波浪将 Banner 大图与页面底色无缝衔接。`,
      coverImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      isPinned: false,
      isPublished: true,
      views: 185,
      readingTime: 5,
      categoryId: designCategory.id,
      tagIds: [tagTailwind.id, tagUI.id],
    },
    {
      slug: "building-full-bleed-animated-svg-wave-banner",
      title: "从零构建高性能 Full-Bleed 视差动态波浪动画组件",
      summary:
        "如何利用纯 CSS 硬件加速与 SVG 视差分层，实现零卡顿、零 JS 算力开销的流体波浪自然交融效果。",
      content: `# 高性能 SVG 视差波浪组件实现

许多博客在顶图与内容衔接处采用生硬的直线切割，而使用 4 层视差波浪能极大提升视觉柔和度。

## 核心 SVG 结构
\`\`\`html
<svg viewBox="0 24 150 28" preserveAspectRatio="none">
  <defs>
    <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
  </defs>
  <g class="parallax">
    <use href="#wave" x="48" y="0" class="opacity-25 wave-1" />
    <use href="#wave" x="48" y="3" class="opacity-50 wave-2" />
    <use href="#wave" x="48" y="5" class="opacity-75 wave-3" />
    <use href="#wave" x="48" y="7" class="opacity-100 wave-4" />
  </g>
</svg>
\`\`\`

## 纯 CSS 硬件加速关键帧
使用 \`translate3d\` 触发 GPU 复合图层渲染，帧率稳健保持在 60/120 FPS。`,
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      isPinned: false,
      isPublished: true,
      views: 156,
      readingTime: 4,
      categoryId: designCategory.id,
      tagIds: [tagTailwind.id, tagUI.id, tagVue.id],
    },
    {
      slug: "typescript-5-modern-type-system-patterns",
      title: "TypeScript 5.x 现代高级类型编程与 Zod 运行时校验闭环",
      summary:
        "探索 Const Type Parameters、Satisfies 运算符与 Zod 运行时 Schema 如何构建端到端零 any 的严谨类型体系。",
      content: `# TypeScript 5.x 与 Zod 端到端类型安全

在大型全栈项目中，前端与后端的类型同步往往容易脱节。利用 Zod 与 TypeScript 5.x，我们可以实现一次定义、全链路受保护。

## 1. Zod Schema 驱动类型定义
\`\`\`ts
import { z } from 'zod'

export const ArticleCreateSchema = z.object({
  title: z.string().min(2, '标题至少2个字符').max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, '仅支持小写字母与连字符'),
  content: z.string().min(10),
  categoryId: z.number().int().positive()
})

export type ArticleCreateInput = z.infer<typeof ArticleCreateSchema>
\`\`\`

## 2. const 类型参数（Const Type Parameters）
允许泛型参数直接推断为常量字面量类型，极大减少 \`as const\` 的样板代码。`,
      coverImage:
        "https://images.unsplash.com/photo-1516116211227-bbc13c73335c?w=800&auto=format&fit=crop&q=80",
      isPinned: false,
      isPublished: true,
      views: 260,
      readingTime: 7,
      categoryId: techCategory.id,
      tagIds: [tagTS.id, tagArch.id],
    },
    {
      slug: "personal-knowledge-management-in-information-overload",
      title: "在信息过载时代打造专注的个人知识管理流（PKM）",
      summary:
        "从收集、提炼到公开输出，建立一套不依赖庞杂插件、直面核心思考的极简个人知识闭环。",
      content: `# 信息过载时代的个人知识管理流

知识不是你收藏了多少篇微信推文，而是你能够调用、重组并输出沉淀了多少体系。

## 输入 $\\rightarrow$ 处理 $\\rightarrow$ 输出 漏斗
1. **即时捕获（Capture）**：随手记录在随笔（Essays）微言中。
2. **结构化整理（Synthesize）**：将技术速查沉淀在笔记（Notes）代码库。
3. **系统化输出（Publish）**：以深度长文（Articles）形式公开交流。

> 输出是最高效的输入。当你要向别人讲清楚一门技术时，你才真正掌握了它。`,
      coverImage:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
      isPinned: false,
      isPublished: true,
      views: 194,
      readingTime: 5,
      categoryId: lifeCategory.id,
      tagIds: [tagPKM.id],
    },
    {
      slug: "docker-multi-stage-build-production-best-practices",
      title: "Docker 多阶段构建与生产级 Node/Prisma 容器化部署指南",
      summary:
        "构建体积缩减 80%！手把手打造精简、安全且具备健康检查与 Prisma 迁移机制的生产级镜像。",
      content: `# 生产级 Docker 镜像优化实践

许多初学者构建的 Node.js 镜像体积往往高达 1.2GB，通过多阶段构建可轻松缩减至 150MB 以下。

\`\`\`dockerfile
# 依赖构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN npx prisma generate && pnpm build

# 生产运行阶段
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./
EXPOSE 3000
CMD ["node", "server/index.mjs"]
\`\`\`
`,
      coverImage:
        "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80",
      isPinned: false,
      isPublished: true,
      views: 310,
      readingTime: 6,
      categoryId: archCategory.id,
      tagIds: [tagDocker.id, tagArch.id],
    },
    {
      slug: "dark-mode-color-transition-best-practices",
      title: "深色模式与 CSS 变量系统级平滑过渡实现指南",
      summary:
        "解决深色模式切换瞬间白屏闪烁、SVG 描边跳变，实现类似 iOS/macOS 级别的高质感全局色彩渐变。",
      content: `# 深色模式平滑切换实践

一个优雅的暗黑模式不应仅仅是反转背景色，而是需要在视觉舒适度、过渡平滑度与防闪烁上做到极致。

## 1. 防闪烁（Anti-FOTU）
在 HTML \`<head>\` 中注入极简内联脚本，优先从 LocalStorage 或系统偏好预读主题，杜绝 SSR 水合瞬间的白屏闪烁。

## 2. 全局 CSS 平滑渐变
\`\`\`css
body, header, nav, .md3-card {
  transition-property: background-color, border-color, color, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 280ms;
}
\`\`\`
`,
      coverImage:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      isPinned: false,
      isPublished: true,
      views: 245,
      readingTime: 4,
      categoryId: designCategory.id,
      tagIds: [tagTailwind.id, tagUI.id],
    },
  ];

  for (const item of articlesData) {
    const { tagIds, ...articleFields } = item;
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: articleFields,
      create: {
        ...articleFields,
        authorId: admin.id,
        tags: {
          create: tagIds.map((tId) => ({ tagId: tId })),
        },
      },
    });
  }

  // 5. 初始化笔记本 (Notebooks)
  const frontendNotebook = await prisma.notebook.upsert({
    where: { slug: "frontend-knowledge" },
    update: {},
    create: {
      name: "前端工程备忘录",
      slug: "frontend-knowledge",
      description: "Nuxt 3、Vue 3、TypeScript 与 Vite 核心技巧速查",
      icon: "terminal",
      isPrivate: false,
      sortOrder: 1,
    },
  });

  const archNotebook = await prisma.notebook.upsert({
    where: { slug: "backend-architecture" },
    update: {},
    create: {
      name: "服务端与架构笔记",
      slug: "backend-architecture",
      description: "MySQL 性能调优、Prisma 模式设计与 Docker 运维",
      icon: "layers",
      isPrivate: false,
      sortOrder: 2,
    },
  });

  const designNotebook = await prisma.notebook.upsert({
    where: { slug: "ui-design-guidelines" },
    update: {},
    create: {
      name: "UI/UX 设计规范",
      slug: "ui-design-guidelines",
      description: "Tailwind CVA、色彩阶梯与排版尺度速查",
      icon: "sparkles",
      isPrivate: false,
      sortOrder: 3,
    },
  });

  // 6. 初始化笔记 (Notes - 6篇)
  const notesData = [
    {
      slug: "nuxt3-nitro-middleware-tricks",
      title: "Nuxt 3 Nitro 引擎中间件与生命周期速查",
      summary: "梳理 Nitro 服务端中间件加载顺序与事件上下文注入机制",
      content: `# Nuxt 3 Nitro 中间件生命周期速查

## 核心阶段
1. **Request Ingress**: \`server/middleware/*\` 针对所有 HTTP 请求生效。
2. **Context Enrichment**: 使用 \`event.context\` 注入用户凭据。
3. **Route Match**: 命中具体 RESTful 端点。

\`\`\`ts
export default defineEventHandler((event) => {
  event.context.startTime = Date.now()
})
\`\`\`
`,
      isPinned: true,
      notebookId: frontendNotebook.id,
      tagIds: [tagNuxt.id, tagVue.id],
    },
    {
      slug: "prisma-mysql-connection-pooling",
      title: "Prisma Client 连接池优化与单例模式",
      summary: "解决生产容器高并发与开发 HMR 过程中的数据库连接耗尽问题",
      content: `# Prisma 与 MySQL 连接池配置

## 生产连接数建议公式
\`connection_limit = (num_physical_cpus * 2) + 1\`

在 \`.env\` 的 \`\` 中显式传递参数：
\`\`\`
mysql://user:pass@localhost:3306/db?connection_limit=10&pool_timeout=20
\`\`\`
`,
      isPinned: true,
      notebookId: archNotebook.id,
      tagIds: [tagArch.id],
    },
    {
      slug: "tailwind-cva-variants-pattern",
      title: "Tailwind CVA (Class Variance Authority) 组件多变体封装模式",
      summary:
        "使用 CVA + clsx + tailwind-merge 构建强类型、可复用的 UI 基础组件",
      content: `# CVA 多变体组件封装范例

\`\`\`ts
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-xs font-semibold transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-md',
        outline: 'border border-sky-200 dark:border-slate-700 bg-white/70 hover:bg-sky-50',
        ghost: 'text-slate-600 hover:bg-sky-50 dark:hover:bg-slate-800'
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)
\`\`\`
`,
      isPinned: false,
      notebookId: designNotebook.id,
      tagIds: [tagTailwind.id, tagUI.id],
    },
    {
      slug: "vue3-shallow-ref-performance-tips",
      title: "Vue 3 shallowRef 性能优化避坑手册",
      summary:
        "针对大型不变数组或 Markdown AST 节点，使用浅层响应式避免深层代理开销",
      content: `# Vue 3 shallowRef 性能指南

对于从 API 获取的只读列表或 Markdown 渲染产物，深层 \`ref()\` 会递归代理全部嵌套属性，引发不必要的内存与 CPU 开销。

\`\`\`ts
// 推荐对于大列表使用 shallowRef
const largeList = shallowRef<Article[]>([])

// 触发更新需替换整个引用，或使用 triggerRef
largeList.value = [...newList]
\`\`\`
`,
      isPinned: false,
      notebookId: frontendNotebook.id,
      tagIds: [tagVue.id],
    },
    {
      slug: "mysql-explain-query-optimization",
      title: "MySQL EXPLAIN 慢查询分析与复合索引原则",
      summary:
        "解读 EXPLAIN 中的 type、key、rows 与 Extra 字段，规避 filesort 与全表扫描",
      content: `# MySQL EXPLAIN 核心字段解读

- **type**: \`const\` > \`eq_ref\` > \`ref\` > \`range\` > \`index\` > \`ALL\` (ALL 为全表扫描，需重点优化)
- **key**: 实际使用的索引名称
- **Extra**:
  - \`Using index\`: 覆盖索引，无需回表（极佳）
  - \`Using filesort\`: 额外排序，需要建立排序索引
`,
      isPinned: false,
      notebookId: archNotebook.id,
      tagIds: [tagArch.id],
    },
    {
      slug: "flexbox-grid-responsive-layout-cheatsheet",
      title: "CSS Grid 与 Flexbox 黄金比例自适应排版速查",
      summary: "常用 4:8 双栏、Bento 卡片矩阵与自适应瀑布流网格代码片段",
      content: `# CSS Grid 黄金双栏常用写法

\`\`\`html
<!-- 4:8 黄金双栏网格 -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
  <aside class="lg:col-span-4 lg:sticky lg:top-20">左侧边栏</aside>
  <main class="lg:col-span-8">右侧主内容</main>
</div>
\`\`\`
`,
      isPinned: false,
      notebookId: designNotebook.id,
      tagIds: [tagTailwind.id, tagUI.id],
    },
  ];

  for (const n of notesData) {
    const { tagIds, ...noteFields } = n;
    await prisma.note.upsert({
      where: { slug: n.slug },
      update: noteFields,
      create: {
        ...noteFields,
        isPublished: true,
        authorId: admin.id,
        tags: {
          create: tagIds.map((tId) => ({ tagId: tId })),
        },
      },
    });
  }

  // 7. 初始化随笔 (Essays - 6条)
  const essaysData = [
    {
      content:
        "完成了「神秘花园」的全站 Mizuki 风格动态导航与 4 层动态波浪改造。在深色模式下的 Midnight Indigo 与晴空蓝搭配极其协调，呼吸感拉满！",
      mood: "专注",
      weather: "晴朗",
      location: "工作室",
      likes: 18,
      isPinned: true,
    },
    {
      content:
        "重新审视了许多顶尖博客的设计，发现真正耐看的产品往往不是堆砌复杂的阴影和渐变，而是对字距、行高、留白以及动画曲线的极致克制。",
      mood: "思考",
      weather: "多云",
      location: "书房",
      likes: 14,
      isPinned: false,
    },
    {
      content:
        "下午泡了一杯乌龙茶，一口气把 Nuxt 3 的服务端中间件和路由转场梳理完毕。当代码像交响乐一样流畅运转时，那种愉悦感无与伦比。",
      mood: "闲适",
      weather: "微风",
      location: "阳台",
      likes: 9,
      isPinned: false,
    },
    {
      content:
        "读完了《代码整洁之道》，好代码就像一篇通俗易懂的散文，不需要复杂的注释就能让人一目了然。重构永远是开发中最享受的环节。",
      mood: "阅读",
      weather: "晴朗",
      location: "图书馆",
      likes: 12,
      isPinned: false,
    },
    {
      content:
        "今天给站点加入了全局顶部蓝色流光阅读进度条，跟随整页滚动平滑延展，阅读长文时的交互体验直线上升。",
      mood: "日常",
      weather: "晴天",
      location: "咖啡厅",
      likes: 7,
      isPinned: false,
    },
    {
      content:
        "折腾了一下午 Docker 多阶段构建，成功把生产镜像体积从 1.1GB 压缩到 130MB，部署启动耗时缩短了整整 70%！",
      mood: "专注",
      weather: "阵雨",
      location: "工位",
      likes: 21,
      isPinned: false,
    },
  ];

  for (const e of essaysData) {
    await prisma.essay.create({
      data: {
        ...e,
        isPublished: true,
        authorId: admin.id,
      },
    });
  }

  console.log(
    "🎉「神秘花园」全量深度文章 (8篇)、知识笔记 (6篇)、微言随笔 (6条) 初始化完毕！",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
