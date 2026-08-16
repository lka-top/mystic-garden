import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { signAuthToken } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

const LoginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码')
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parseResult = LoginSchema.safeParse(body)

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors[0]?.message || '参数校验失败'
    })
  }

  const { username, password } = parseResult.data

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: '用户名或密码错误'
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: '用户名或密码错误'
    })
  }

  const config = useRuntimeConfig(event)
  const token = signAuthToken(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    config.jwtSecret
  )

  return successResponse({
    token,
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role
    }
  }, '登录成功')
})
