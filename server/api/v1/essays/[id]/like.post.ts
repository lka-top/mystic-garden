import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = parseInt(idStr || '0')
  if (!id) throw createError({ statusCode: 400, statusMessage: '无效的随笔 ID' })

  const updated = await prisma.essay.update({
    where: { id },
    data: {
      likes: { increment: 1 }
    },
    select: {
      id: true,
      likes: true
    }
  })

  return successResponse(updated, '点赞成功')
})
