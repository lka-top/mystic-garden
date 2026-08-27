import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'
import { readValidated } from '~/server/utils/validate'

const CreateNotebookSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(50),
  slug: z.string().min(1, 'Slug不能为空').max(50),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isPrivate: z.boolean().default(false),
  sortOrder: z.number().int().default(0)
})

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const data = await readValidated(event, CreateNotebookSchema)
  const existing = await prisma.notebook.findUnique({
    where: { slug: data.slug }
  })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: '该笔记本 Slug 已存在' })
  }

  const notebook = await prisma.notebook.create({
    data
  })

  return successResponse(notebook, '笔记本创建成功')
})
