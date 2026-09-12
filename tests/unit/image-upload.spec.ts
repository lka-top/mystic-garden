import { describe, expect, it } from 'vitest'
import { MAX_ADMIN_IMAGE_SIZE, MAX_NOTE_IMAGE_SIZE, getValidatedImageType } from '~/server/utils/image-upload'

describe('getValidatedImageType', () => {
  it('接受扩展名与 MIME 类型一致的图片', () => {
    expect(getValidatedImageType('cover.webp', 'image/webp')).toEqual({ ext: '.webp', mimeType: 'image/webp' })
  })

  it('拒绝伪造扩展名或不支持的格式', () => {
    expect(getValidatedImageType('cover.png', 'image/jpeg')).toBeNull()
    expect(getValidatedImageType('archive.pdf', 'application/pdf')).toBeNull()
  })
})

describe('image upload limits', () => {
  it('区分后台直传与笔记同步图片上限', () => {
    expect(MAX_ADMIN_IMAGE_SIZE).toBe(25 * 1024 * 1024)
    expect(MAX_NOTE_IMAGE_SIZE).toBe(10 * 1024 * 1024)
  })
})
