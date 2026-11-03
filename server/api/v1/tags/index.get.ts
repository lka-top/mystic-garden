import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'
import { getPublicNoteWhere } from '~~/server/utils/note-visibility'

export default defineEventHandler(async () => {
  const publicNoteWhere = await getPublicNoteWhere()
  const tags = await prisma.tag.findMany({
    orderBy: { id: 'asc' },
    include: {
      _count: {
        select: {
          articles: true,
          notes: { where: { note: publicNoteWhere } }
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
