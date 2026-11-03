import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'
import { getPublicNoteWhere } from '~~/server/utils/note-visibility'

export default defineEventHandler(async (event) => {
  const paramSlug = getRouterParam(event, 'slug') || (event.context.params?.slug as string)
  const pathParts = (event.path.split('?')[0] || '').split('/')
  const slug = paramSlug || pathParts[pathParts.length - 1]

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: '缺少笔记 Slug' })
  }

  const isAdmin = !!tryGetAdminUser(event)
  const note = await prisma.note.findFirst({
    where: isAdmin ? { slug } : { slug, ...await getPublicNoteWhere() },
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

  const { password: _password, ...noteWithoutPassword } = note
  const formattedNote = {
    ...noteWithoutPassword,
    tags: note.tags.map(t => t.tag)
  }

  return successResponse(formattedNote)
})
