import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'
import { parseIdParam } from '~~/server/utils/validate'

export default defineEventHandler(async (event) => {
  const id = parseIdParam(event)

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
