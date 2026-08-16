import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const paramSlug = getRouterParam(event, 'slug') || (event.context.params?.slug as string)
  const pathParts = event.path.split('?')[0].split('/')
  const slug = paramSlug || pathParts[pathParts.length - 1]

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: '缺少笔记 Slug' })
  }

  const note = await prisma.note.findUnique({
    where: { slug },
    include: {
      notebook: true,
      author: {
        select: { id: true, nickname: true, avatar: true }
      },
      tags: {
        include: { tag: true }
      }
    }
  })

  if (!note) {
    throw createError({ statusCode: 404, statusMessage: '笔记不存在或已被删除' })
  }

  prisma.note.update({
    where: { id: note.id },
    data: { views: { increment: 1 } }
  }).catch((err) => console.error('递增笔记浏览量失败:', err))

  const formattedNote = {
    ...note,
    tags: note.tags.map(t => t.tag)
  }

  return successResponse(formattedNote)
})
