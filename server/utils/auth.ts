import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: number
  username: string
  role: string
}

/**
 * 获取 JWT 密钥。生产环境缺失时直接抛错启动失败，避免静默使用弱密钥。
 */
export function getJwtSecret(event?: H3Event): string {
  const config = useRuntimeConfig(event)
  const secret = config.jwtSecret
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('缺少或过弱的 JWT_SECRET 环境变量（至少 16 字符），拒绝启动')
    }
    console.warn('[auth] JWT_SECRET 未配置或过弱，仅允许开发环境运行')
  }
  return secret as string
}

/** 解析并校验 Bearer token，失败返回 null。不区分 401/403，仅做身份识别。 */
function verifyToken(token: string, event: H3Event): AuthPayload | null {
  try {
    return jwt.verify(token, getJwtSecret(event)) as AuthPayload
  } catch {
    return null
  }
}

export function requireAdminUser(event: H3Event): AuthPayload {
  const authHeader = getRequestHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未提供访问令牌，请先登录'
    })
  }

  const decoded = verifyToken(authHeader.substring(7), event)
  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: '令牌无效或已过期，请重新登录'
    })
  }
  if (decoded.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: '权限不足：需要管理员权限'
    })
  }
  return decoded
}

/**
 * 静默鉴权：尝试获取管理员身份，失败时返回 null 而非抛出异常。
 * 用于 GET 端点中条件性地允许 `?all=true` 等管理员专属参数。
 */
export function tryGetAdminUser(event: H3Event): AuthPayload | null {
  try {
    return requireAdminUser(event)
  } catch {
    return null
  }
}

/**
 * 静默获取任意已登录用户（管理员或普通用户），用于评论区等
 * 「登录用户直接署名」场景。失败返回 null，交由调用方走游客逻辑。
 */
export function tryGetAuthUser(event: H3Event): AuthPayload | null {
  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return verifyToken(authHeader.substring(7), event)
}

export function signAuthToken(payload: AuthPayload, secret: string, expiresIn = '7d'): string {
  return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] })
}
