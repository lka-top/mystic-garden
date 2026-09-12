import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { PrismaClient, type Prisma } from '@prisma/client'

const prisma = new PrismaClient()
const shouldApply = process.argv.includes('--apply')
const uploadDirectory = process.env.UPLOAD_DIR || '/data/luokai-blog/uploads'
const publicBaseUrl = (process.env.UPLOAD_PUBLIC_BASE_URL || 'https://mysgarden.top/uploads').replace(/\/+$/, '')

const configuredDomains = process.env.IMAGE_MIGRATION_SOURCE_DOMAINS
  || [process.env.OSS_PUBLIC_DOMAIN, process.env.OSS_BUCKET && process.env.OSS_ENDPOINT
    ? `https://${process.env.OSS_BUCKET}.${process.env.OSS_ENDPOINT.replace(/^https?:\/\//, '')}`
    : ''].filter(Boolean).join(',')

const sourceOrigins = new Set(configuredDomains.split(',').map(item => item.trim()).filter(Boolean).map((item) => {
  try {
    return new URL(item).origin
  } catch {
    throw new Error(`IMAGE_MIGRATION_SOURCE_DOMAINS 包含无效地址：${item}`)
  }
}))

interface ImageTarget {
  sourceUrl: string
  relativePath: string
  destinationPath: string
  publicUrl: string
}

interface MigrationReport {
  discovered: number
  downloaded: number
  alreadyPresent: number
  failed: Array<{ sourceUrl: string; reason: string }>
  articleUpdates: number
  noteUpdates: number
  essayUpdates: number
  userUpdates: number
  settingUpdates: number
}

function toImageTarget(value: string): ImageTarget | null {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return null
  }
  if (!sourceOrigins.has(parsed.origin)) return null

  const segments = parsed.pathname.split('/').filter(Boolean).map(segment => decodeURIComponent(segment))
  if (segments.shift() !== 'uploads' || segments.length === 0 || segments.some(segment => segment === '.' || segment === '..')) {
    return null
  }

  const relativePath = segments.join('/')
  const destinationPath = path.resolve(uploadDirectory, relativePath)
  const resolvedUploadDirectory = path.resolve(uploadDirectory)
  if (!destinationPath.startsWith(`${resolvedUploadDirectory}${path.sep}`)) return null

  return {
    sourceUrl: parsed.href,
    relativePath,
    destinationPath,
    publicUrl: `${publicBaseUrl}/${segments.map(segment => encodeURIComponent(segment)).join('/')}`
  }
}

function extractImageTargets(value: string): ImageTarget[] {
  const candidates = value.match(/https?:\/\/[^\s<>"'`\])}]+/g) || []
  return candidates.map(toImageTarget).filter((target): target is ImageTarget => target !== null)
}

function replaceUrls(value: string, replacements: ReadonlyMap<string, string>): string {
  let result = value
  for (const [sourceUrl, publicUrl] of replacements) {
    result = result.replaceAll(sourceUrl, publicUrl)
  }
  return result
}

function replaceImageArray(value: Prisma.JsonArray, replacements: ReadonlyMap<string, string>): Prisma.InputJsonArray {
  return value.map(item => typeof item === 'string' ? (replacements.get(item) || item) : item) as Prisma.InputJsonArray
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function downloadImage(target: ImageTarget): Promise<'downloaded' | 'already-present'> {
  if (await exists(target.destinationPath)) return 'already-present'

  const response = await fetch(target.sourceUrl)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) throw new Error(`非图片响应：${contentType || 'unknown'}`)

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length === 0) throw new Error('下载内容为空')

  await fs.mkdir(path.dirname(target.destinationPath), { recursive: true })
  const temporaryPath = `${target.destinationPath}.${crypto.randomUUID()}.part`
  await fs.writeFile(temporaryPath, buffer)
  await fs.rename(temporaryPath, target.destinationPath)
  return 'downloaded'
}

async function main(): Promise<void> {
  if (sourceOrigins.size === 0) {
    throw new Error('请配置 IMAGE_MIGRATION_SOURCE_DOMAINS，或保留 OSS_PUBLIC_DOMAIN/OSS_BUCKET/OSS_ENDPOINT 用于识别旧图片地址')
  }

  const [articles, notes, essays, users, settings] = await Promise.all([
    prisma.article.findMany({ select: { id: true, content: true, coverImage: true } }),
    prisma.note.findMany({ select: { id: true, content: true } }),
    prisma.essay.findMany({ select: { id: true, images: true } }),
    prisma.user.findMany({ select: { id: true, avatar: true } }),
    prisma.setting.findMany({ select: { key: true, value: true } })
  ])

  const targets = new Map<string, ImageTarget>()
  const collect = (value: string | null): void => {
    if (!value) return
    for (const target of extractImageTargets(value)) targets.set(target.sourceUrl, target)
  }

  for (const article of articles) {
    collect(article.content)
    collect(article.coverImage)
  }
  for (const note of notes) collect(note.content)
  for (const essay of essays) {
    if (Array.isArray(essay.images)) {
      for (const item of essay.images) if (typeof item === 'string') collect(item)
    }
  }
  for (const user of users) collect(user.avatar)
  for (const setting of settings) collect(setting.value)

  const report: MigrationReport = {
    discovered: targets.size,
    downloaded: 0,
    alreadyPresent: 0,
    failed: [],
    articleUpdates: 0,
    noteUpdates: 0,
    essayUpdates: 0,
    userUpdates: 0,
    settingUpdates: 0
  }

  if (!shouldApply) {
    console.log(JSON.stringify({ mode: 'dry-run', sourceOrigins: [...sourceOrigins], uploadDirectory, discovered: report.discovered }, null, 2))
    return
  }

  const replacements = new Map<string, string>()
  for (const target of targets.values()) {
    try {
      const result = await downloadImage(target)
      report[result === 'downloaded' ? 'downloaded' : 'alreadyPresent'] += 1
      replacements.set(target.sourceUrl, target.publicUrl)
    } catch (error) {
      report.failed.push({ sourceUrl: target.sourceUrl, reason: error instanceof Error ? error.message : '未知错误' })
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const article of articles) {
      const content = replaceUrls(article.content, replacements)
      const coverImage = article.coverImage ? replacements.get(article.coverImage) || article.coverImage : null
      if (content !== article.content || coverImage !== article.coverImage) {
        await tx.article.update({ where: { id: article.id }, data: { content, coverImage } })
        report.articleUpdates += 1
      }
    }
    for (const note of notes) {
      const content = replaceUrls(note.content, replacements)
      if (content !== note.content) {
        await tx.note.update({ where: { id: note.id }, data: { content } })
        report.noteUpdates += 1
      }
    }
    for (const essay of essays) {
      if (!Array.isArray(essay.images)) continue
      const images = replaceImageArray(essay.images as Prisma.JsonArray, replacements)
      if (JSON.stringify(images) !== JSON.stringify(essay.images)) {
        await tx.essay.update({ where: { id: essay.id }, data: { images } })
        report.essayUpdates += 1
      }
    }
    for (const user of users) {
      const avatar = user.avatar ? replacements.get(user.avatar) || user.avatar : null
      if (avatar !== user.avatar) {
        await tx.user.update({ where: { id: user.id }, data: { avatar } })
        report.userUpdates += 1
      }
    }
    for (const setting of settings) {
      const value = replaceUrls(setting.value, replacements)
      if (value !== setting.value) {
        await tx.setting.update({ where: { key: setting.key }, data: { value } })
        report.settingUpdates += 1
      }
    }
  })

  console.log(JSON.stringify({ mode: 'apply', ...report }, null, 2))
  if (report.failed.length > 0) process.exitCode = 1
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : '迁移失败')
  process.exitCode = 1
}).finally(async () => {
  await prisma.$disconnect()
})
