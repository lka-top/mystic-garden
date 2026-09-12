import crypto from 'node:crypto'
import type { H3Event } from 'h3'

/** 验证仅供本地同步工具使用的独立凭证。 */
export function requireNoteSyncToken(event: H3Event): void {
  const expectedToken = process.env.NUXT_NOTE_SYNC_TOKEN || process.env.NOTE_SYNC_TOKEN || useRuntimeConfig(event).noteSyncToken
  if (!expectedToken || expectedToken.length < 32) {
    throw createError({ statusCode: 503, statusMessage: '笔记同步服务未配置' })
  }

  const authorization = getRequestHeader(event, 'authorization')
  const actualToken = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  const expectedBuffer = Buffer.from(expectedToken)
  const actualBuffer = Buffer.from(actualToken)
  if (!actualToken || actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw createError({ statusCode: 401, statusMessage: '笔记同步凭证无效' })
  }
}
