import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { paginationResponse } from '~/server/utils/response'
import { applyPublishFilter } from '~/server/utils/pagination'

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  notebook: z.string().optional(),
  tag: z.string().optional(),
  keyword: z.string().optional(),
  all: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse)
  const { page, pageSize, notebook: notebookSlug, tag: tagSlug, keyword } = query

  const whereCondition = applyPublishFilter<Prisma.NoteWhereInput>(event, query.all, {})

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
