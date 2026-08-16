import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const idStr = getRouterParam(event, 'id')
  const id = parseInt(idStr || '0')
  if (!id) throw createError({ statusCode: 400, statusMessage: '无效的评论 ID' })

  const body = await readBody(event)
  const isApproved = body.isApproved !== undefined ? Boolean(body.isApproved) : true

  const updated = await prisma.comment.update({
    where: { id },
    data: { isApproved }
  })

  return successResponse(updated, isApproved ? '评论已通过审核' : '评论已下线')
})
