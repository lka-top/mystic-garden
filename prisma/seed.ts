import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化「洛凯花园」数据库种子数据...')

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash('LuokaiAdmin2025!', salt)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      nickname: '洛凯',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      email: 'luokai@example.com',
      bio: '热爱全栈开发、现代前端设计系统与数字花园建设。',
      role: 'admin'
    }
  })

  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: '技术探索',
      slug: 'technology',
      description: '全栈开发、架构设计与现代工程实践'
    }
  })

  const designCategory = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: {
      name: '设计美学',
      slug: 'design',
      description: 'UI/UX 交互、排版与现代设计系统'
    }
  })

  const lifeCategory = await prisma.category.upsert({
    where: { slug: 'life' },
    update: {},
    create: {
      name: '生活杂谈',
      slug: 'life',
      description: '阅读思考、日常随想与成长记录'
    }
  })

  const vueTag = await prisma.tag.upsert({
    where: { slug: 'vue3' },
    update: {},
    create: { name: 'Vue 3', slug: 'vue3' }
  })
  const nuxtTag = await prisma.tag.upsert({
    where: { slug: 'nuxt3' },
    update: {},
    create: { name: 'Nuxt 3', slug: 'nuxt3' }
  })
  const tailwindTag = await prisma.tag.upsert({
    where: { slug: 'tailwindcss' },
    update: {},
    create: { name: 'Tailwind CSS', slug: 'tailwindcss' }
  })
  const architectureTag = await prisma.tag.upsert({
    where: { slug: 'architecture' },
    update: {},
    create: { name: '架构设计', slug: 'architecture' }
  })

  // 1. 初始化深度文章
  await prisma.article.upsert({
    where: { slug: 'welcome-to-luokai-garden' },
    update: {},
    create: {
      slug: 'welcome-to-luokai-garden',
      title: '欢迎来到洛凯花园：构建一个有生命力的数字花园',
      summary: '聊聊我为什么要重构并搭建「洛凯花园」，以及我是如何用 Nuxt 3、Tailwind CSS 和 MySQL 构建这方兼顾技术深度与碎片灵感的数字自留地的。',
      content: `# 欢迎来到洛凯花园

> "数字花园（Digital Garden）不是一个只展示完美成品的展厅，而是一个随思想生长的生态。"

## 为什么是「洛凯花园」？

过去几年，信息流平台把我们的注意力切割得支离破碎。我们需要一个属于自己的阵地：
1. **深度长文（Articles）**：沉淀经过系统化验证的技术思考与架构实践。
2. **微言随笔（Essays）**：像朋友圈或 Twitter 一样随时记录灵感与生活火花。

\`\`\`typescript
interface DigitalGarden {
  philosophy: 'Craft over Clutter';
  stack: ['Nuxt 3', 'Vue 3', 'Tailwind CSS', 'MySQL', 'Prisma'];
  mindset: 'Keep building, keep writing';
}
\`\`\`

## 架构与技术选型

- **前端美学**：基于 Slate/Zinc 配色体系与严格的排版尺度，杜绝花哨的 AI 模板感。
- **全栈一体**：借助 Nuxt 3 Nitro 引擎，前后端同构，无须维护额外的独立 Node 后端进程。
- **极致速度**：SSR 服务端渲染 + 资源强缓存，秒开体验。

欢迎常来逛逛，在下方留言交流！`,
      coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&auto=format&fit=crop&q=80',
      isPublished: true,
      isPinned: true,
      views: 128,
      readingTime: 4,
      categoryId: techCategory.id,
      authorId: admin.id,
      tags: {
        create: [
          { tagId: vueTag.id },
          { tagId: nuxtTag.id },
          { tagId: tailwindTag.id }
        ]
      }
    }
  })

  // 2. 初始化随笔
  await prisma.essay.createMany({
    data: [
      {
        content: '完成了「洛凯花园」的核心架构设计与 Bento Grid 布局重构。在深色模式下的 Zinc 质感非常耐看，文字呼吸感极佳。',
        mood: '专注',
        weather: '晴朗',
        location: '工作室',
        likes: 12,
        isPinned: true,
        isPublished: true,
        authorId: admin.id
      },
      {
        content: '重新审视了许多设计系统，发现真正耐看的产品往往不是堆砌复杂的渐变和阴影，而是对字距、行高和留白的极致克制。',
        mood: '思考',
        weather: '多云',
        location: '书房',
        likes: 8,
        isPinned: false,
        isPublished: true,
        authorId: admin.id
      }
    ],
    skipDuplicates: true
  })

  // 3. 初始化笔记本 (Notebooks)
  const frontendNotebook = await prisma.notebook.upsert({
    where: { slug: 'frontend-knowledge' },
    update: {},
    create: {
      name: '前端工程备忘录',
      slug: 'frontend-knowledge',
      description: 'Nuxt 3、Vue 3、TypeScript 与 Vite 核心技巧速查',
      icon: 'terminal',
      isPrivate: false,
      sortOrder: 1
    }
  })

  const archNotebook = await prisma.notebook.upsert({
    where: { slug: 'backend-architecture' },
    update: {},
    create: {
      name: '服务端与架构笔记',
      slug: 'backend-architecture',
      description: 'MySQL 性能调优、Prisma 模式设计与 Docker 运维',
      icon: 'layers',
      isPrivate: false,
      sortOrder: 2
    }
  })

  // 4. 初始化结构化笔记 (Notes)
  await prisma.note.upsert({
    where: { slug: 'nuxt3-nitro-middleware-tricks' },
    update: {},
    create: {
      title: 'Nuxt 3 Nitro 引擎中间件与生命周期速查',
      slug: 'nuxt3-nitro-middleware-tricks',
      summary: '梳理 Nitro 服务端中间件加载顺序与事件上下文注入机制',
      content: `# Nuxt 3 Nitro 引擎中间件速查

## 核心生命周期点
1. **Request Ingress**: \`server/middleware/*\` 针对所有 HTTP 请求生效。
2. **Context Enrichment**: 使用 \`event.context\` 注入解析后的管理员凭据或请求 traceId。
3. **Route Match**: 命中 \`server/api/*\` 具体 RESTful 处理函数。

\`\`\`ts
export default defineEventHandler((event) => {
  event.context.startTime = Date.now()
})
\`\`\`
`,
      isPinned: true,
      isPublished: true,
      notebookId: frontendNotebook.id,
      authorId: admin.id,
      tags: {
        create: [
          { tagId: nuxtTag.id },
          { tagId: vueTag.id }
        ]
      }
    }
  })

  await prisma.note.upsert({
    where: { slug: 'prisma-mysql-connection-pooling' },
    update: {},
    create: {
      title: 'Prisma Client 连接池优化与单例模式',
      slug: 'prisma-mysql-connection-pooling',
      summary: '解决生产容器高并发与开发 HMR 过程中的数据库连接耗尽问题',
      content: `# Prisma 与 MySQL 连接池最佳实践

## 生产连接数配置公式
\`connection_limit = (num_physical_cpus * 2) + 1\`

在 \`DATABASE_URL\` 中显式传递：
\`\`\`
mysql://user:pass@host:3306/db?connection_limit=10&pool_timeout=20
\`\`\`
`,
      isPinned: false,
      isPublished: true,
      notebookId: archNotebook.id,
      authorId: admin.id,
      tags: {
        create: [
          { tagId: architectureTag.id }
        ]
      }
    }
  })

  console.log('「洛凯花园」全量数据库种子数据（含笔记、笔记本）填充完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
