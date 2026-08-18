import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize as string) || 15))
  const mood = query.mood as string | undefined
  const isAdmin = !!tryGetAdminUser(event)
  const isAll = isAdmin && query.all === 'true'

  const whereCondition: any = {}
  if (!isAll) {
    whereCondition.isPublished = true
  }
  if (mood) {
    whereCondition.mood = { contains: mood }
  }

  const [total, essays] = await Promise.all([
    prisma.essay.count({ where: whereCondition }),
    prisma.essay.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true }
        },
        _count: {
          select: { comments: { where: { isApproved: true } } }
        }
      }
    })
  ])

  const list = essays.map(e => ({
    ...e,
    commentCount: e._count.comments
  }))

  return paginationResponse(list, total, page, pageSize)
})
