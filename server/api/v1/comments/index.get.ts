import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const targetType = (query.targetType as string) || 'article'
  const articleId = query.articleId ? parseInt(query.articleId as string) : undefined
  const essayId = query.essayId ? parseInt(query.essayId as string) : undefined
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize as string) || 50))
  const isAdmin = !!tryGetAdminUser(event)
  const isAll = isAdmin && query.all === 'true'

  const whereCondition: any = {
    targetType,
    parentId: null
  }

  if (!isAll) {
    whereCondition.isApproved = true
  }

  if (targetType === 'article' && articleId) {
    whereCondition.articleId = articleId
  } else if (targetType === 'essay' && essayId) {
    whereCondition.essayId = essayId
  }

  const [total, comments] = await Promise.all([
    prisma.comment.count({ where: whereCondition }),
    prisma.comment.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
            role: true
          }
        },
        replies: {
          where: isAll ? {} : { isApproved: true },
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
                role: true
              }
            }
          }
        }
      }
    })
  ])

  return paginationResponse(comments, total, page, pageSize)
})
