import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

const UpdateArticleSchema = z.object({
  slug: z.string().min(2).optional(),
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  readingTime: z.number().int().min(0).optional(),
  categoryId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).optional()
})

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const idStr = getRouterParam(event, 'id')
  const id = parseInt(idStr || '0')
  if (!id) throw createError({ statusCode: 400, statusMessage: '无效的文章 ID' })

  const body = await readBody(event)
  const parseResult = UpdateArticleSchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors[0]?.message || '参数校验失败'
    })
  }

  const data = parseResult.data

  if (data.slug) {
    const existing = await prisma.article.findFirst({
      where: { slug: data.slug, NOT: { id } }
    })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: '该 Slug 标识已被占用' })
    }
  }

  let estimatedReadingTime = data.readingTime
  if (data.content && !estimatedReadingTime) {
    estimatedReadingTime = Math.max(1, Math.ceil(data.content.length / 350))
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (data.tagIds !== undefined) {
      await tx.articleTag.deleteMany({ where: { articleId: id } })
      if (data.tagIds.length > 0) {
        await tx.articleTag.createMany({
          data: data.tagIds.map(tagId => ({ articleId: id, tagId }))
        })
      }
    }

    return tx.article.update({
      where: { id },
      data: {
        ...(data.slug && { slug: data.slug }),
        ...(data.title && { title: data.title }),
        ...(data.summary && { summary: data.summary }),
        ...(data.content && { content: data.content }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
        ...(estimatedReadingTime !== undefined && { readingTime: estimatedReadingTime }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId })
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      }
    })
  })

  return successResponse(updated, '文章更新成功')
})
