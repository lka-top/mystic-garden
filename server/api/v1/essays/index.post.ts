import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireAdminUser } from '~/server/utils/auth'
import { successResponse } from '~/server/utils/response'
import { readValidated } from '~/server/utils/validate'

const CreateEssaySchema = z.object({
  content: z.string().min(1, '随笔内容不能为空'),
  mood: z.string().optional().nullable(),
  weather: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  images: z.array(z.string().url()).optional().nullable(),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(true)
})

export default defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event)
  const data = await readValidated(event, CreateEssaySchema)

  const essay = await prisma.essay.create({
    data: {
      content: data.content,
      mood: data.mood,
      weather: data.weather,
      location: data.location,
      images: data.images ? JSON.parse(JSON.stringify(data.images)) : null,
      isPinned: data.isPinned,
      isPublished: data.isPublished,
      authorId: authUser.userId
    },
    include: {
      author: {
        select: { id: true, nickname: true, avatar: true }
      }
    }
  })

  return successResponse(essay, '随笔发布成功')
})
