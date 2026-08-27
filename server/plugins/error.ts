import type { NitroApp } from 'nitropack'

/** 沿 cause 链查找 Prisma 已知请求错误（钩子收到的是 H3 包装错误，原始错误在 cause 中） */
function findPrismaError(err: unknown): { code?: string } | null {
  let cur: unknown = err
  for (let i = 0; cur && i < 5; i++) {
    const e = cur as { code?: string; cause?: unknown }
    if (e.code && /^P\d{4}$/.test(e.code)) return e
    cur = e.cause
  }
  return null
}

/**
 * 服务端全局错误处理：
 * 将 Prisma 已知错误码映射为友好的 HTTP 语义（P2002→409 唯一冲突、P2025→404 不存在），
 * 避免数据库错误以裸 500 暴露给前端。
 */
export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.hooks.hook('error', (error, ctx) => {
    const event = ctx?.event
    if (!event) return

    const httpError = error as Error & { statusCode?: number; statusMessage?: string }
    const prismaError = findPrismaError(error)
    if (prismaError) {
      if (prismaError.code === 'P2002') {
        httpError.statusCode = 409
        httpError.statusMessage = '资源已存在：唯一字段冲突，请更换后重试'
      } else if (prismaError.code === 'P2025') {
        httpError.statusCode = 404
        httpError.statusMessage = '资源不存在或已被删除'
      } else if (!httpError.statusCode || httpError.statusCode >= 500) {
        httpError.statusCode = 500
        httpError.statusMessage = '数据库操作失败，请稍后重试'
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error(`[server:error] ${event.path} →`, prismaError?.code || httpError.statusMessage || error.message)
    }
  })
})
