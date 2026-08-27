import { describe, expect, it } from 'vitest'
import { applyPublishFilter, applyApprovalFilter, isAdminAllRequest } from '~/server/utils/pagination'

// 测试环境无 nitro 自动导入上下文，tryGetAdminUser 会静默失败返回 null，
// 恰好覆盖「非管理员」分支；管理员分支依赖 JWT 上下文，由集成测试覆盖。
const fakeEvent = {} as Parameters<typeof applyPublishFilter>[0]

describe('applyPublishFilter', () => {
  it('非管理员强制只返回已发布内容', () => {
    const where = applyPublishFilter(fakeEvent, undefined, { targetType: 'article' })
    expect(where).toEqual({ targetType: 'article', isPublished: true })
  })

  it('非管理员即使传 all=true 也不生效', () => {
    const where = applyPublishFilter(fakeEvent, 'true', {})
    expect(where).toEqual({ isPublished: true })
    expect(isAdminAllRequest(fakeEvent, 'true')).toBe(false)
  })
})

describe('applyApprovalFilter', () => {
  it('非管理员强制只返回已审核评论', () => {
    const where = applyApprovalFilter(fakeEvent, undefined, { parentId: null })
    expect(where).toEqual({ parentId: null, isApproved: true })
  })
})
