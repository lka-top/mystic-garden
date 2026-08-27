import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'
import { applyPublishFilter } from '~/server/utils/pagination'

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(15),
  mood: z.string().optional(),
  all: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const { page, pageSize, mood } = query
  const whereCondition = applyPublishFilter<Prisma.EssayWhereInput>(event, query.all, {})
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
