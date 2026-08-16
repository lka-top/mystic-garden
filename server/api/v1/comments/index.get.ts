import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const targetType = (query.targetType as string) || 'article'
  const articleId = query.articleId ? parseInt(query.articleId as string) : undefined
  const essayId = query.essayId ? parseInt(query.essayId as string) : undefined
  const isAll = query.all === 'true'

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

  const comments = await prisma.comment.findMany({
    where: whereCondition,
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

  return successResponse(comments)
})
