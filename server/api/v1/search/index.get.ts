import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = (query.q as string || '').trim()

  if (!q) {
    return successResponse({ articles: [], notes: [], essays: [] })
  }

  const [articles, notes, essays] = await Promise.all([
    // 1. 检索公开文章
    prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } }
        ]
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        createdAt: true,
        category: { select: { name: true, slug: true } }
      }
    }),
    // 2. 检索公开笔记
    prisma.note.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } }
        ]
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        createdAt: true,
        notebook: { select: { name: true, slug: true } }
      }
    }),
    // 3. 检索公开随笔
    prisma.essay.findMany({
      where: {
        isPublished: true,
        content: { contains: q }
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        mood: true,
        createdAt: true
      }
    })
  ])

  return successResponse({ articles, notes, essays })
})
