import { prisma } from '~~/server/utils/prisma'
import { requireAdminUser } from '~~/server/utils/auth'
import { successResponse } from '~~/server/utils/response'
import { parseIdParam } from '~~/server/utils/validate'

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const id = parseIdParam(event)

  const body = await readBody(event)
  const isApproved = body.isApproved !== undefined ? Boolean(body.isApproved) : true

  const updated = await prisma.comment.update({
    where: { id },
    data: { isApproved }
  })

  return successResponse(updated, isApproved ? '评论已通过审核' : '评论已下线')
})
