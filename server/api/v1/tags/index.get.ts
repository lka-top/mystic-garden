import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'

export default defineEventHandler(async () => {
  const tags = await prisma.tag.findMany({
    orderBy: { id: 'asc' },
    include: {
      _count: {
        select: {
          articles: true,
          notes: true
        }
      }
    }
  })

  return successResponse(
    tags.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      articleCount: t._count.articles,
      noteCount: t._count.notes
    }))
  )
})
