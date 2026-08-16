import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const body = await readBody<Record<string, string>>(event)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: '无效的设置参数' })
  }

  const updates = Object.entries(body).map(([key, value]) => {
    return prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    })
  })

  await prisma.$transaction(updates)

  return successResponse(body, '设置保存成功')
})
