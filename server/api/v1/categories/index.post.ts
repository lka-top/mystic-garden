import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

const CreateCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(50, '分类名称最多50个字符'),
  slug: z.string().min(1, 'Slug 标识不能为空').max(50, 'Slug 最多50个字符'),
  description: z.string().max(200, '分类描述最多200个字符').optional().nullable()
})

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const body = await readBody(event)

  const parseResult = CreateCategorySchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors[0]?.message || '参数校验失败'
    })
  }

  const data = parseResult.data

  const existingSlug = await prisma.category.findUnique({
    where: { slug: data.slug }
  })
  if (existingSlug) {
    throw createError({ statusCode: 409, statusMessage: '该分类 Slug 标识已存在' })
  }

  const existingName = await prisma.category.findUnique({
    where: { name: data.name }
  })
  if (existingName) {
    throw createError({ statusCode: 409, statusMessage: '该分类名称已存在' })
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null
    }
  })

  return successResponse(category, '分类创建成功')
})
