import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAdminUser(event)

  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: '未接收到上传文件' })
  }

  const file = files[0]
  if (!file.type || !file.type.startsWith('image/')) {
    throw createError({ statusCode: 400, statusMessage: '仅支持上传图片文件 (JPG, PNG, WebP, GIF, SVG)' })
  }

  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
  const ext = path.extname(file.filename || '').toLowerCase()
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: '不支持的文件格式，仅允许: JPG, PNG, WebP, GIF, SVG' })
  }

  const randomName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
  
  const uploadDir = path.resolve(process.cwd(), 'public/uploads')
  await fs.mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, randomName)
  await fs.writeFile(filePath, file.data)

  const publicUrl = `/uploads/${randomName}`

  return successResponse({
    url: publicUrl,
    filename: file.filename,
    size: file.data.length
  }, '图片上传成功')
})
