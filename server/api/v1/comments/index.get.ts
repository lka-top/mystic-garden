import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'

const QuerySchema = z.object({
  targetType: z.enum(['article', 'essay', 'guestbook']).default('article'),
  articleId: z.coerce.number().int().positive().optional(),
  essayId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
  all: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const { targetType, articleId, essayId, page, pageSize } = query
  const isAdmin = !!tryGetAdminUser(event)
  const isAll = isAdmin && query.all === 'true'

  const whereCondition: Prisma.CommentWhereInput = {
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
