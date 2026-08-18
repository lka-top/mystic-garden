import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'
import type { AuthPayload } from '~/server/utils/auth'

const CreateCommentSchema = z.object({
  targetType: z.enum(['article', 'essay', 'guestbook']).default('article'),
  articleId: z.number().int().optional().nullable(),
  essayId: z.number().int().optional().nullable(),
  parentId: z.number().int().optional().nullable(),
  guestUuid: z.string().min(8).max(64).optional(),
  content: z.string().min(1, '评论内容不能为空').max(1000, '评论字数最多 1000 字')
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parseResult = CreateCommentSchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors[0]?.message || '参数校验失败'
    })
  }

  const data = parseResult.data
  const ipAddress = (getRequestHeader(event, 'x-forwarded-for') || getRequestHeader(event, 'x-real-ip') || '127.0.0.1').toString().split(',')[0].trim()
  const userAgent = (getRequestHeader(event, 'user-agent') || '').toString().substring(0, 250)

  // 1. 尝试识别是否为已登录的管理员/正式用户
  let userId: number | null = null
  const authHeader = getRequestHeader(event, 'authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const config = useRuntimeConfig(event)
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthPayload
      if (decoded && decoded.userId) {
        const loggedInUser = await prisma.user.findUnique({
          where: { id: decoded.userId }
        })
        if (loggedInUser) {
          userId = loggedInUser.id
        }
      }
    } catch {
      // Token 无效或过期时作为游客处理
    }
  }

  // 2. 若未登录，则基于 guestUuid 查重或自动注册游客用户 (User)
  if (!userId) {
    const guestUuid = data.guestUuid || `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    
    let guestUser = await prisma.user.findUnique({
      where: { guestUuid }
    })

    if (!guestUser) {
      // 提取简短标识用于友好展示
      const cleanId = guestUuid.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toLowerCase() || Math.random().toString(36).slice(2, 6)
      const guestNickname = `漫步花友_${cleanId}`
      const guestAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanId}`
      
      guestUser = await prisma.user.create({
        data: {
          username: `guest_${guestUuid.slice(0, 16)}_${Math.random().toString(36).slice(2, 6)}`,
          passwordHash: null,
          nickname: guestNickname,
          avatar: guestAvatar,
          role: 'guest',
          guestUuid,
          ipAddress,
          userAgent
        }
      })
    }

    userId = guestUser.id
  }

  // 3. 创建评论记录并强关联 userId
  const comment = await prisma.comment.create({
    data: {
      targetType: data.targetType,
      articleId: data.articleId || null,
      essayId: data.essayId || null,
      parentId: data.parentId || null,
      userId,
      content: data.content,
      ipAddress,
      userAgent,
      isApproved: !!authHeader
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
          role: true
        }
      }
    }
  })

  return successResponse(comment, '评论提交成功')
})
