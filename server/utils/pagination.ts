import type { H3Event } from 'h3'
import { tryGetAdminUser } from './auth'

function isAdminAll(event: H3Event, all: string | undefined): boolean {
  return !!tryGetAdminUser(event) && all === 'true'
}

/**
 * 列表接口通用的「已发布过滤」逻辑：
 * 管理员携带 all=true 时返回全部数据，否则仅返回已发布内容。
 * 用法：applyPublishFilter(event, query.all, whereCondition)
 */
export function applyPublishFilter<T extends object>(event: H3Event, all: string | undefined, where: T): T {
  if (!isAdminAll(event, all)) {
    ;(where as Record<string, unknown>).isPublished = true
  }
  return where
}

/** 评论列表变体：管理员 all=true 时返回含未审核评论。 */
export function applyApprovalFilter<T extends object>(event: H3Event, all: string | undefined, where: T): T {
  if (!isAdminAll(event, all)) {
    ;(where as Record<string, unknown>).isApproved = true
  }
  return where
}

/** 是否为管理员请求全部数据（含未发布/未审核）。 */
export function isAdminAllRequest(event: H3Event, all: string | undefined): boolean {
  return isAdminAll(event, all)
}
