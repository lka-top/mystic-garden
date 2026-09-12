import { z } from 'zod'
import { requireAdminUser } from '~~/server/utils/auth'
import { successResponse } from '~~/server/utils/response'
import { readValidated } from '~~/server/utils/validate'
import { MAX_ADMIN_IMAGE_SIZE, getValidatedImageType } from '~~/server/utils/image-upload'
import { createDirectUploadSignature, createStorageObjectKey } from '~~/server/utils/storage'

const DirectUploadSchema = z.object({
  filename: z.string().trim().min(1, '文件名不能为空').max(255),
  contentType: z.string().trim().min(1, '图片类型不能为空').max(100),
  size: z.number().int().positive('图片不能为空').max(MAX_ADMIN_IMAGE_SIZE, '单张图片不能超过 25 MB')
})

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const data = await readValidated(event, DirectUploadSchema)
  const imageType = getValidatedImageType(data.filename, data.contentType)
  if (!imageType) {
    throw createError({ statusCode: 400, statusMessage: '仅支持 JPG、PNG、WebP、GIF、AVIF、SVG 图片，且文件扩展名必须与类型一致' })
  }

  const objectKey = createStorageObjectKey('admin', `${data.filename.slice(0, -imageType.ext.length)}${imageType.ext}`)
  const signature = await createDirectUploadSignature(objectKey, imageType.mimeType)
  if (!signature) {
    throw createError({ statusCode: 503, statusMessage: '当前存储模式不支持浏览器直传，已切换为服务端上传模式' })
  }

  return successResponse({
    ...signature,
    method: 'PUT' as const,
    headers: { 'Content-Type': imageType.mimeType },
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  }, '已生成 OSS 直传签名')
})
