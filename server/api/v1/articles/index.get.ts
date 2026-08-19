import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  keyword: z.string().optional(),
  all: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const { page, pageSize, category: categorySlug, tag: tagSlug, keyword } = query
  const isAdmin = !!tryGetAdminUser(event)
  const isAll = isAdmin && query.all === 'true'

  const whereCondition: Prisma.ArticleWhereInput = {}

  if (!isAll) {
    whereCondition.isPublished = true
  }

  if (categorySlug) {
    whereCondition.category = { slug: categorySlug }
  }

  if (tagSlug) {
    whereCondition.tags = {
      some: {
        tag: { slug: tagSlug }
      }
    }
  }

  if (keyword) {
    whereCondition.OR = [
      { title: { contains: keyword } },
      { summary: { contains: keyword } }
    ]
  }

  const [total, articles] = await Promise.all([
    prisma.article.count({ where: whereCondition }),
    prisma.article.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        coverImage: true,
        isPublished: true,
        isPinned: true,
        views: true,
        readingTime: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          select: {
            tag: { select: { id: true, name: true, slug: true } }
          }
        },
        _count: {
          select: { comments: { where: { isApproved: true } } }
        }
      }
    })
  ])

  const list = articles.map(item => ({
    ...item,
    tags: item.tags.map(t => t.tag),
    commentCount: item._count.comments
  }))

  return paginationResponse(list, total, page, pageSize)
})
