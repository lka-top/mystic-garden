import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'

export default defineEventHandler(async () => {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { isPublished: true } } }
        }
      }
    }),
    prisma.tag.findMany({
      include: {
        _count: {
          select: { articles: { where: { article: { isPublished: true } } } }
        }
      }
    })
  ])

  return successResponse({
    categories: categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      articleCount: c._count.articles
    })),
    tags: tags.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      articleCount: t._count.articles
    }))
  })
})
