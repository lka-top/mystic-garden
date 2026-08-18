import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const paramSlug = getRouterParam(event, 'slug') || (event.context.params?.slug as string)
  const pathParts = event.path.split('?')[0].split('/')
  const slug = paramSlug || pathParts[pathParts.length - 1]

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: '缺少文章 Slug' })
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: {
        select: { id: true, nickname: true, avatar: true, bio: true }
      },
      tags: {
        include: { tag: true }
      },
      _count: {
        select: { comments: { where: { isApproved: true } } }
      }
    }
  })

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在或已被删除' })
  }

  // 非管理员不可查看未发布文章
  if (!article.isPublished && !tryGetAdminUser(event)) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在或已被删除' })
  }

  prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } }
  }).catch((err) => console.error('递增浏览量失败:', err))

  const formattedArticle = {
    ...article,
    tags: article.tags.map(t => t.tag),
    commentCount: article._count.comments
  }

  return successResponse(formattedArticle)
})
