import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async () => {
  const notebooks = await prisma.notebook.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'asc' }
    ],
    include: {
      _count: {
        select: { notes: { where: { isPublished: true } } }
      }
    }
  })

  return successResponse(notebooks.map(nb => ({
    ...nb,
    noteCount: nb._count.notes
  })))
})
