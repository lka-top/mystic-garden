import { z } from 'zod'
import { prisma } from '~~/server/utils/prisma'
import { requireAdminUser } from '~~/server/utils/auth'
import { successResponse } from '~~/server/utils/response'
import { readValidated } from '~~/server/utils/validate'

const CreateTagSchema = z.object({
  name: z.string().min(1, '标签名称不能为空').max(50),
  slug: z.string().max(50).optional()
})

export default defineEventHandler(async (event) => {
  requireAdminUser(event)
  const data = await readValidated(event, CreateTagSchema)
  const { name } = data
  const cleanName = name.trim()

  // 检查是否已有同名标签
  let tag = await prisma.tag.findFirst({
    where: { name: cleanName }
  })

  if (tag) {
    return successResponse(tag, '标签已存在')
  }

  // 自动生成 slug
  let slug = data.slug?.trim() || cleanName.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  if (!slug) slug = `tag-${Date.now()}`

  // 检查 slug 是否冲突
  const existingSlug = await prisma.tag.findUnique({
    where: { slug }
  })
  if (existingSlug) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`
  }

  tag = await prisma.tag.create({
    data: {
      name: cleanName,
      slug
    }
  })

  return successResponse(tag, '标签创建成功')
})
