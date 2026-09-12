import crypto from 'node:crypto'
import { requireAdminUser } from '~~/server/utils/auth'
import { successResponse } from '~~/server/utils/response'
import { MAX_ADMIN_IMAGE_SIZE, getValidatedImageType } from '~~/server/utils/image-upload'
import { uploadFileToStorage } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  requireAdminUser(event)

  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: '未接收到上传文件' })
  }

  const file = files?.[0]
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: '未接收到上传文件' })
  }
  const imageType = file.filename && file.type ? getValidatedImageType(file.filename, file.type) : null
  if (!imageType) {
    throw createError({ statusCode: 400, statusMessage: '仅支持 JPG、PNG、WebP、GIF、AVIF、SVG 图片，且文件扩展名必须与类型一致' })
  }
  if (file.data.length === 0 || file.data.length > MAX_ADMIN_IMAGE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: '单张图片必须介于 1 B 与 25 MB 之间' })
  }

  const randomName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${imageType.ext}`

  const publicUrl = await uploadFileToStorage(file.data, randomName, imageType.mimeType, { scope: 'admin' })

  return successResponse({
    url: publicUrl,
    filename: file.filename,
    size: file.data.length
  }, '图片上传成功')
})
