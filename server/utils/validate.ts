import type { H3Event } from 'h3'
import type { z, ZodTypeAny } from 'zod'

/**
 * 统一的 body 校验封装：safeParse 失败时抛出 400，
 * 返回推导后的强类型数据，消除各 handler 重复的样板代码。
 */
export async function readValidated<S extends ZodTypeAny>(event: H3Event, schema: S): Promise<z.output<S>> {
  const body = await readBody(event)
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.errors[0]?.message || '参数校验失败'
    })
  }
  return result.data
}

/**
 * 统一的 query 校验封装（h3 原生 getValidatedQuery 的 400 消息格式化版本）。
 */
export async function getValidated<S extends ZodTypeAny>(event: H3Event, schema: S): Promise<z.output<S>> {
  const result = await getValidatedQuery(event, schema.safeParse)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.errors[0]?.message || '参数校验失败'
    })
  }
  return result.data
}

/** 解析路由中的数字 ID，非法时抛 400。 */
export function parseIdParam(event: H3Event, name = 'id'): number {
  const id = parseInt(getRouterParam(event, name) || '0')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '无效的资源 ID' })
  }
  return id
}

/** 提取客户端真实 IP（兼容代理头）。 */
export function getClientIp(event: H3Event): string {
  return (getRequestHeader(event, 'x-forwarded-for') || getRequestHeader(event, 'x-real-ip') || '127.0.0.1')
    .toString()
    .split(',')[0]
    .trim()
}

/** 提取截断后的 User-Agent。 */
export function getClientUa(event: H3Event): string {
  return (getRequestHeader(event, 'user-agent') || '').toString().substring(0, 250)
}
