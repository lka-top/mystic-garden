import { z } from 'zod'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'
import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'
import { signAuthToken } from '~~/server/utils/auth'
import { readValidated, getClientIp, getClientUa } from '~~/server/utils/validate'

const RegisterSchema = z.object({
  username: z.string().min(3, '用户名至少 3 个字符').max(30, '用户名最多 30 个字符').regex(/^[a-zA-Z0-9_-]+$/, '用户名仅支持字母、数字、下划线及连字符'),
  password: z.string().min(6, '密码长度至少 6 位').max(50, '密码长度最多 50 位'),
  nickname: z.string().min(1, '请输入昵称').max(30, '昵称最多 30 个字符'),
  email: z.string().email('邮箱格式不正确').optional().or(z.literal('')).nullable(),
  guestUuid: z.string().optional().nullable() // 支持将已有访客指纹对应的历史足迹升级绑定
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { username, password, nickname, email, guestUuid } = await readValidated(event, RegisterSchema)

  // 1. 查重用户名
  const existingUsername = await prisma.user.findUnique({
    where: { username }
  })
  if (existingUsername) {
    throw createError({
      statusCode: 409,
      statusMessage: '该用户名已被占用，请换一个'
    })
  }

  // 2. 加盐哈希密码
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  // 3. 生成默认 DiceBear 头像
  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`
  const ipAddress = getClientIp(event)
  const userAgent = getClientUa(event)

  // 4. 检查是否需要无缝升级现有的游客记录
  const userSelect = {
    id: true,
    username: true,
    nickname: true,
    avatar: true,
    email: true,
    role: true,
    createdAt: true
  } satisfies Prisma.UserSelect

  let user: Prisma.UserGetPayload<{ select: typeof userSelect }> | null = null

  if (guestUuid) {
    const existingGuest = await prisma.user.findUnique({
      where: { guestUuid }
    })

    // 若该设备之前有游客记录，直接就地升级该记录为正式用户（保留历史所有评论外键关联）
    if (existingGuest && existingGuest.role === 'guest') {
      user = await prisma.user.update({
        where: { id: existingGuest.id },
        data: {
          username,
          passwordHash,
          nickname,
          email: email || null,
          avatar: existingGuest.avatar || defaultAvatar,
          role: 'user',
          ipAddress,
          userAgent
        },
        select: userSelect
      })
    }
  }

  // 5. 若无对应游客记录，正常创建新普通用户
  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        nickname,
        email: email || null,
        avatar: defaultAvatar,
        role: 'user',
        guestUuid: null, // 正式注册用户不占用 guestUuid 唯一约束
        ipAddress,
        userAgent
      },
      select: userSelect
    })
  }

  // 6. 注册成功后自动签发 JWT Token 便于直接登录
  const token = signAuthToken(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    config.jwtSecret,
    '7d'
  )

  return successResponse({
    token,
    user
  }, '注册成功，欢迎加入神秘花园！')
})
