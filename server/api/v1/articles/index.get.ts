import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize as string) || 10))
  const categorySlug = query.category as string | undefined
  const tagSlug = query.tag as string | undefined
  const keyword = query.keyword as string | undefined
  const isAll = query.all === 'true'

  const whereCondition: any = {}

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
