import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const idStr = getRouterParam(event, 'id')
  const id = parseInt(idStr || '0')
  if (!id) throw createError({ statusCode: 400, statusMessage: '无效的随笔 ID' })

  await prisma.essay.delete({
    where: { id }
  })

  return successResponse(null, '随笔已删除')
})
