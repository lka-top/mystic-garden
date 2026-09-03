import { prisma } from '~~/server/utils/prisma'
import { requireAdminUser } from '~~/server/utils/auth'
import { successResponse } from '~~/server/utils/response'

export default defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event)

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      username: true,
      nickname: true,
      avatar: true,
      email: true,
      bio: true,
      role: true,
      createdAt: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: '用户不存在'
    })
  }

  return successResponse(user)
})
