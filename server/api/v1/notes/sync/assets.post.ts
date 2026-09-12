import crypto from 'node:crypto'
import { successResponse } from '~~/server/utils/response'
import { requireNoteSyncToken } from '~~/server/utils/note-sync'
import { MAX_NOTE_IMAGE_SIZE, getValidatedImageType } from '~~/server/utils/image-upload'
import { uploadFileToStorage } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  requireNoteSyncToken(event)
  const files = await readMultipartFormData(event)
  const file = files?.find(item => item.name === 'image')
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: '未接收到笔记图片' })
  }

  const imageType = getValidatedImageType(file.filename, file.type || '')
  if (!imageType || imageType.ext === '.svg') {
    throw createError({ statusCode: 400, statusMessage: '仅支持 JPG、PNG、WebP、GIF、AVIF 图片' })
  }
  if (file.data.length === 0 || file.data.length > MAX_NOTE_IMAGE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: '单张笔记图片必须介于 1 B 与 10 MB 之间' })
  }

  const contentHash = crypto.createHash('sha256').update(file.data).digest('hex')
  const filename = `notes-${contentHash}${imageType.ext}`
  const url = await uploadFileToStorage(file.data, filename, imageType.mimeType, { scope: 'notes' })
  return successResponse({ url, filename, size: file.data.length }, '笔记图片同步成功')
})
