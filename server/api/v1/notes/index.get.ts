import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize as string) || 20))
  const notebookSlug = query.notebook as string | undefined
  const tagSlug = query.tag as string | undefined
  const keyword = query.keyword as string | undefined
  const isAdmin = !!tryGetAdminUser(event)
  const isAll = isAdmin && query.all === 'true'

  const whereCondition: any = {}

  if (!isAll) {
    whereCondition.isPublished = true
  }

  if (notebookSlug) {
    whereCondition.notebook = { slug: notebookSlug }
  }

  if (tagSlug) {
    whereCondition.tags = {
      some: { tag: { slug: tagSlug } }
    }
  }

  if (keyword) {
    whereCondition.OR = [
      { title: { contains: keyword } },
      { summary: { contains: keyword } },
      { content: { contains: keyword } }
    ]
  }

  const [total, notes] = await Promise.all([
    prisma.note.count({ where: whereCondition }),
    prisma.note.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        notebook: {
          select: { id: true, name: true, slug: true, icon: true }
        },
        tags: {
          select: {
            tag: { select: { id: true, name: true, slug: true } }
          }
        },
        author: {
          select: { id: true, nickname: true, avatar: true }
        }
      }
    })
  ])

  const list = notes.map(item => {
    const { password, ...rest } = item
    return {
      ...rest,
      tags: item.tags.map(t => t.tag)
    }
  })

  return paginationResponse(list, total, page, pageSize)
})
