import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'

export default defineEventHandler(async () => {
  const [
    articleCount,
    essayCount,
    noteCount,
    notebookCount,
    categoryCount,
    tagCount,
    commentCount,
    totalUsers,
    guestUsers,
    registeredUsers,
    articleViewsAgg,
    noteViewsAgg
  ] = await Promise.all([
    prisma.article.count({ where: { isPublished: true } }),
    prisma.essay.count({ where: { isPublished: true } }),
    prisma.note.count({ where: { isPublished: true } }),
    prisma.notebook.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.comment.count({ where: { isApproved: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: 'guest' } }),
    prisma.user.count({ where: { role: { in: ['user', 'admin'] } } }),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.note.aggregate({ _sum: { views: true } })
  ])

  const [recentArticles, recentEssays, recentNotes] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        views: true,
        category: { select: { name: true, slug: true } }
      }
    }),
    prisma.essay.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        content: true,
        mood: true,
        likes: true,
        createdAt: true
      }
    }),
    prisma.note.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        views: true,
        notebook: { select: { name: true, slug: true, icon: true } }
      }
    })
  ])

  const totalViews = (articleViewsAgg._sum.views || 0) + (noteViewsAgg._sum.views || 0)

  return successResponse({
    stats: {
      articles: articleCount,
      essays: essayCount,
      notes: noteCount,
      notebooks: notebookCount,
      categories: categoryCount,
      tags: tagCount,
      comments: commentCount,
      totalUsers,
      guestUsers,
      registeredUsers,
      totalViews
    },
    recentArticles,
    recentEssays,
    recentNotes
  })
})
