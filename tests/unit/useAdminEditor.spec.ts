import { describe, expect, it } from 'vitest'
import { toSlug } from '~/composables/useAdminEditor'

describe('toSlug', () => {
  it('保留中文字符并折叠非法字符为连字符', () => {
    expect(toSlug('Hello World')).toBe('hello-world')
    expect(toSlug('神秘花园 记录')).toBe('神秘花园-记录')
    expect(toSlug('A_B/C  D!')).toBe('a_b-c-d')
  })

  it('去除首尾连字符', () => {
    expect(toSlug('--hello--')).toBe('hello')
  })

  it('空输入返回空字符串', () => {
    expect(toSlug('')).toBe('')
    expect(toSlug('!!!')).toBe('')
  })
})
