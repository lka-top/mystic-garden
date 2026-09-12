import crypto from 'node:crypto'
import { z } from 'zod'
import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'
import { readValidated } from '~~/server/utils/validate'
import { requireNoteSyncToken } from '~~/server/utils/note-sync'

const DirectorySchema = z.object({
  name: z.string().trim().min(1).max(50),
  slug: z.string().trim().min(1).max(50),
  path: z.string().trim().min(1).max(500),
  parentPath: z.string().trim().min(1).max(500).nullable(),
  description: z.string().trim().max(200),
  icon: z.string().trim().min(1).max(50)
})

const SyncNoteSchema = z.object({
  title: z.string().trim().min(1, '笔记标题不能为空').max(200),
  slug: z.string().trim().min(1, '笔记 Slug 不能为空').max(100),
  summary: z.string().trim().min(1).max(500),
  content: z.string().min(1, '笔记正文不能为空').max(2_000_000),
  sourcePath: z.string().trim().min(1).max(500),
  directoryPath: z.string().trim().min(1).max(500).nullable(),
  tags: z.array(z.string().trim().min(1).max(50)).max(30).transform(tags => [...new Set(tags)])
})

const SyncRequestSchema = z.object({
  directories: z.array(DirectorySchema).max(500, '单次最多同步 500 个目录').default([]),
  notes: z.array(SyncNoteSchema).min(1, '至少需要同步一篇笔记').max(50, '单次最多同步 50 篇笔记')
})

function createTagSlug(name: string): string {
  const normalized = name.toLowerCase().trim().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '') || 'tag'
  const suffix = crypto.createHash('sha256').update(name).digest('hex').slice(0, 8)
  return `${normalized.slice(0, 40)}-${suffix}`
}

export default defineEventHandler(async (event) => {
  requireNoteSyncToken(event)
  const { directories, notes } = await readValidated(event, SyncRequestSchema)
  const author = await prisma.user.findFirst({
    where: { role: 'admin' },
    select: { id: true }
  })
  if (!author) {
    throw createError({ statusCode: 409, statusMessage: '尚未初始化管理员账号，无法同步笔记' })
  }

  const result = await prisma.$transaction(async (tx) => {
    let created = 0
    let updated = 0
    const notebookIds = new Map<string, number>()

    for (const directory of [...directories].sort((left, right) => left.path.split('/').length - right.path.split('/').length)) {
      const parentId = directory.parentPath ? notebookIds.get(directory.parentPath) : null
      if (directory.parentPath && !parentId) {
        throw createError({ statusCode: 422, statusMessage: `目录缺少父级：${directory.path}` })
      }
      const notebook = await tx.notebook.upsert({
        where: { path: directory.path },
        update: {
          name: directory.name,
          slug: directory.slug,
          description: directory.description,
          icon: directory.icon,
          parentId
        },
        create: {
          name: directory.name,
          slug: directory.slug,
          path: directory.path,
          description: directory.description,
          icon: directory.icon,
          parentId
        }
      })
      notebookIds.set(directory.path, notebook.id)
    }

    for (const item of notes) {
      const notebook = item.directoryPath
        ? await tx.notebook.findUnique({ where: { path: item.directoryPath }, select: { id: true } })
        : null
      if (item.directoryPath && !notebook) {
        throw createError({ statusCode: 422, statusMessage: `笔记目录不存在：${item.directoryPath}` })
      }
      const tags = await Promise.all(item.tags.map(async (name) => {
        return tx.tag.upsert({
          where: { name },
          update: {},
          create: { name, slug: createTagSlug(name) }
        })
      }))
      const existing = await tx.note.findUnique({ where: { sourcePath: item.sourcePath }, select: { id: true } })
      const noteFields = {
        title: item.title,
        summary: item.summary,
        content: item.content,
        sourcePath: item.sourcePath,
        notebookId: notebook?.id || null,
        isPublished: true,
        isEncrypted: false
      }

      if (existing) {
        await tx.note.update({
          where: { id: existing.id },
          data: {
            ...noteFields,
            tags: {
              deleteMany: {},
              create: tags.map(tag => ({ tagId: tag.id }))
            }
          }
        })
        updated += 1
      } else {
        await tx.note.create({
          data: {
            ...noteFields,
            slug: item.slug,
            authorId: author.id,
            tags: { create: tags.map(tag => ({ tagId: tag.id })) }
          }
        })
        created += 1
      }
    }
    return { created, updated }
  })

  return successResponse(result, `笔记同步完成：新增 ${result.created} 篇，更新 ${result.updated} 篇`)
})
