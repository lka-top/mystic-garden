import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

const CreateArticleSchema = z.object({
  slug: z.string().min(2, 'Slug 长度至少 2 个字符'),
  title: z.string().min(1, '标题不能为空'),
  summary: z.string().min(1, '摘要不能为空'),
  content: z.string().min(1, '内容不能为空'),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  readingTime: z.number().int().min(0).default(0),
  categoryId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).default([])
})

export default defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event)
  const body = await readBody(event)

  const parseResult = CreateArticleSchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors[0]?.message || '参数校验失败'
    })
  }

  const data = parseResult.data

  const existing = await prisma.article.findUnique({
    where: { slug: data.slug }
  })
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: '该 Slug 标识已存在，请更换'
    })
  }

  const estimatedReadingTime = data.readingTime || Math.max(1, Math.ceil(data.content.length / 350))

  const article = await prisma.article.create({
    data: {
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      content: data.content,
      coverImage: data.coverImage,
      isPublished: data.isPublished,
      isPinned: data.isPinned,
      readingTime: estimatedReadingTime,
      categoryId: data.categoryId,
      authorId: authUser.userId,
      tags: {
        create: data.tagIds.map(tagId => ({ tagId }))
      }
    },
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  })

  return successResponse(article, '文章创建成功')
})
