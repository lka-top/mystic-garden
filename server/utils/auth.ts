import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: number
  username: string
  role: string
}

export function requireAdminUser(event: H3Event): AuthPayload {
  const config = useRuntimeConfig(event)
  const authHeader = getRequestHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供访问令牌，请先登录'
    })
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthPayload
    if (decoded.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: '权限不足：需要管理员权限'
      })
    }
    return decoded
  } catch (err: any) {
    throw createError({
      statusCode: 401,
      statusMessage: '令牌无效或已过期，请重新登录'
    })
  }
}

export function signAuthToken(payload: AuthPayload, secret: string, expiresIn = '7d'): string {
  return jwt.sign(payload, secret, { expiresIn })
}
