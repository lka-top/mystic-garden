import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

const UpdateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  summary: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  isPinned: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  isEncrypted: z.boolean().optional(),
  password: z.string().optional().nullable(),
  notebookId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).optional()
})

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const idStr = getRouterParam(event, 'id')
  const id = parseInt(idStr || '0')
  if (!id) throw createError({ statusCode: 400, statusMessage: '无效的笔记 ID' })

  const body = await readBody(event)
  const parseResult = UpdateNoteSchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors[0]?.message || '参数校验失败'
    })
  }

  const data = parseResult.data

  if (data.slug) {
    const existing = await prisma.note.findFirst({
      where: { slug: data.slug, NOT: { id } }
    })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: '该 Slug 标识已被占用' })
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (data.tagIds !== undefined) {
      await tx.noteTag.deleteMany({ where: { noteId: id } })
      if (data.tagIds.length > 0) {
        await tx.noteTag.createMany({
          data: data.tagIds.map(tagId => ({ noteId: id, tagId }))
        })
      }
    }

    return tx.note.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.content && { content: data.content }),
        ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        ...(data.isEncrypted !== undefined && { isEncrypted: data.isEncrypted }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.notebookId !== undefined && { notebookId: data.notebookId })
      },
      include: {
        notebook: true,
        tags: { include: { tag: true } }
      }
    })
  })

  return successResponse(updated, '笔记更新成功')
})
