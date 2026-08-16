import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

const CreateNoteSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200),
  slug: z.string().min(1, 'Slug 不能为空').max(100),
  summary: z.string().optional().nullable(),
  content: z.string().min(1, '内容不能为空'),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  isEncrypted: z.boolean().default(false),
  password: z.string().optional().nullable(),
  notebookId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).default([])
})

export default defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event)
  const body = await readBody(event)

  const parseResult = CreateNoteSchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors[0]?.message || '参数校验失败'
    })
  }

  const data = parseResult.data
  const existing = await prisma.note.findUnique({
    where: { slug: data.slug }
  })
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: '该 Slug 标识已存在，请更换'
    })
  }

  const note = await prisma.note.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      isPinned: data.isPinned,
      isPublished: data.isPublished,
      isEncrypted: data.isEncrypted,
      password: data.password,
      notebookId: data.notebookId,
      authorId: authUser.userId,
      tags: {
        create: data.tagIds.map(tagId => ({ tagId }))
      }
    },
    include: {
      notebook: true,
      tags: { include: { tag: true } }
    }
  })

  return successResponse(note, '笔记创建成功')
})
