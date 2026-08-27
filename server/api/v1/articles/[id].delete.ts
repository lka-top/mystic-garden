import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'
import { parseIdParam } from '~/server/utils/validate'

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const id = parseIdParam(event)

  await prisma.article.delete({
    where: { id }
  })

  return successResponse(null, '文章已删除')
})
