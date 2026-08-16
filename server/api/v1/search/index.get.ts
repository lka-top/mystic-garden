import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = (query.q as string || '').trim()

  if (!q) {
    return successResponse({ articles: [], essays: [] })
  }

  const [articles, essays] = await Promise.all([
    prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } }
        ]
      },
      take: 10,
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
    prisma.essay.findMany({
      where: {
        isPublished: true,
        content: { contains: q }
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        mood: true,
        createdAt: true
      }
    })
  ])

  return successResponse({ articles, essays })
})
