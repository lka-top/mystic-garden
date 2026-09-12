import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

interface DirectoryPayload {
  name: string
  slug: string
  path: string
  parentPath: string | null
  description: string
  icon: string
}

interface SyncNotePayload {
  title: string
  slug: string
  summary: string
  content: string
  sourcePath: string
  directoryPath: string | null
  tags: string[]
}

interface Frontmatter {
  title?: string
  summary?: string
  tags: string[]
  draft: boolean
  private: boolean
}

interface SyncResponse {
  code: number
  message: string
  data: {
    created: number
    updated: number
  }
}

interface AssetSyncResponse {
  code: number
  message: string
  data: { url: string }
}

interface PayloadResult {
  directories: DirectoryPayload[]
  notes: SyncNotePayload[]
  skipped: number
  filledEmptyNotes: number
  imageCount: number
  warnings: string[]
}

const DEFAULT_NOTEBOOK_DIR = '/run/media/li/Develop/notebook'
const DEFAULT_SYNC_URL = 'http://127.0.0.1:3000/api/v1/notes/sync'
const DEFAULT_BATCH_SIZE = 25

function loadLocalEnvironment(): void {
  const overrides = new Map([
    ['NOTE_SYNC_TOKEN', process.env.NOTE_SYNC_TOKEN],
    ['NOTE_SYNC_URL', process.env.NOTE_SYNC_URL],
    ['NOTEBOOK_DIR', process.env.NOTEBOOK_DIR],
    ['NOTE_SYNC_BATCH_SIZE', process.env.NOTE_SYNC_BATCH_SIZE],
    ['NOTE_SYNC_ASSET_URL', process.env.NOTE_SYNC_ASSET_URL]
  ])
  if (fs.existsSync('.env') && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile('.env')
  }
  for (const [name, value] of overrides) {
    if (value !== undefined) process.env[name] = value
  }
}

function makeSlug(value: string, seed: string): string {
  const cleaned = value
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const hash = crypto.createHash('md5').update(seed).digest('hex').slice(0, 6)
  return `${cleaned.slice(0, 70) || 'note'}-${hash}`
}

function parseBoolean(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true'
}

function parseTags(value: string | undefined): string[] {
  if (!value) return []
  const trimmed = value.trim()
  const rawTags = trimmed.startsWith('[') && trimmed.endsWith(']')
    ? trimmed.slice(1, -1).split(',')
    : trimmed.split(',')

  return [...new Set(rawTags
    .map(tag => tag.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean))]
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const normalized = content.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  const empty: Frontmatter = { tags: [], draft: false, private: false }
  if (lines[0] !== '---') return { frontmatter: empty, body: normalized }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line === '---')
  if (closingIndex === -1) return { frontmatter: empty, body: normalized }

  const fields = new Map<string, string>()
  for (const line of lines.slice(1, closingIndex)) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex <= 0) continue
    fields.set(line.slice(0, separatorIndex).trim().toLowerCase(), line.slice(separatorIndex + 1).trim())
  }

  return {
    frontmatter: {
      title: fields.get('title'),
      summary: fields.get('summary'),
      tags: parseTags(fields.get('tags')),
      draft: parseBoolean(fields.get('draft')),
      private: parseBoolean(fields.get('private'))
    },
    body: lines.slice(closingIndex + 1).join('\n').replace(/^\n+/, '')
  }
}

function extractMetadata(content: string, fallbackTitle: string, frontmatter: Frontmatter): Pick<SyncNotePayload, 'title' | 'summary'> {
  const lines = content.split('\n')
  let title = frontmatter.title?.trim() || fallbackTitle
  let headingIndex = -1

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() || ''
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      if (!frontmatter.title) title = line.replace(/^#\s+/, '').trim()
      headingIndex = index
      break
    }
  }

  let summary = frontmatter.summary?.trim() || ''
  if (!summary) {
    for (let index = 0; index < lines.length; index += 1) {
      if (index === headingIndex) continue
      const line = lines[index]?.trim() || ''
      if (!line || line.startsWith('#') || line.startsWith('>')) continue
      const plainText = line.replace(/[`*_~[\]()]/g, '').trim()
      if (plainText.length > 10) {
        summary = plainText.slice(0, 200)
        break
      }
    }
  }

  return {
    title: title.slice(0, 200),
    summary: (summary || `${title} - 知识库速查备忘`).slice(0, 500)
  }
}

function isPrivatePath(relativePath: string): boolean {
  return relativePath.split(path.sep).some(part => part.startsWith('_') || part.startsWith('.'))
}

function collectMarkdownFiles(directory: string, baseDirectory: string): Array<{ fullPath: string; relativePath: string }> {
  const files: Array<{ fullPath: string; relativePath: string }> = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath, baseDirectory))
      continue
    }
    if (!entry.isFile() || !/\.(?:md|markdown)$/i.test(entry.name)) continue
    files.push({ fullPath, relativePath: path.relative(baseDirectory, fullPath) })
  }
  return files
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/')
}

function createDirectories(files: ReadonlyArray<{ relativePath: string }>): DirectoryPayload[] {
  const directories = new Map<string, DirectoryPayload>()
  for (const file of files) {
    const parts = toPosixPath(file.relativePath).split('/')
    parts.pop()
    for (let depth = 1; depth <= parts.length; depth += 1) {
      const directoryPath = parts.slice(0, depth).join('/')
      if (directories.has(directoryPath)) continue
      const name = parts[depth - 1] || directoryPath
      const parentPath = depth > 1 ? parts.slice(0, depth - 1).join('/') : null
      directories.set(directoryPath, {
        name: name.slice(0, 50),
        slug: makeSlug(name, directoryPath).slice(0, 50),
        path: directoryPath,
        parentPath,
        description: `${directoryPath} 知识目录`.slice(0, 200),
        icon: depth === 1 ? 'folder' : 'folder-tree'
      })
    }
  }
  return [...directories.values()].sort((left, right) => left.path.localeCompare(right.path, 'zh-CN'))
}

const IMAGE_MIME_TYPES: Readonly<Record<string, string>> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif'
}

function isRemoteReference(reference: string): boolean {
  return /^(?:https?:)?\/\//i.test(reference) || reference.startsWith('data:')
}

function resolveLocalImage(notebookDirectory: string, notePath: string, reference: string): string | null {
  if (isRemoteReference(reference)) return null
  const cleanReference = reference.split(/[?#]/, 1)[0] || ''
  const decodedReference = (() => {
    try {
      return decodeURIComponent(cleanReference)
    } catch {
      return cleanReference
    }
  })()
  const ext = path.extname(decodedReference).toLowerCase()
  if (!IMAGE_MIME_TYPES[ext]) return null

  const root = path.resolve(notebookDirectory)
  const candidates = decodedReference.startsWith('/')
    ? [path.resolve(root, `.${decodedReference}`)]
    : [path.resolve(path.dirname(notePath), decodedReference), path.resolve(root, decodedReference)]
  for (const candidate of candidates) {
    const relative = path.relative(root, candidate)
    if (!relative.startsWith('..') && !path.isAbsolute(relative) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate
    }
  }
  return null
}

async function uploadImage(
  assetUrl: string,
  token: string,
  imagePath: string
): Promise<string> {
  const imageBuffer = fs.readFileSync(imagePath)
  const ext = path.extname(imagePath).toLowerCase()
  const mimeType = IMAGE_MIME_TYPES[ext]
  if (!mimeType) throw new Error(`不支持的图片格式：${imagePath}`)

  const formData = new FormData()
  formData.append('image', new Blob([new Uint8Array(imageBuffer)], { type: mimeType }), path.basename(imagePath))
  const response = await fetch(assetUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  const payload = await response.json().catch(() => null) as AssetSyncResponse | null
  if (!response.ok || !payload?.data.url) {
    throw new Error(payload?.message || `图片上传失败（HTTP ${response.status}）：${imagePath}`)
  }
  return payload.data.url
}

async function replaceEmbeddedImages(
  content: string,
  notePath: string,
  notebookDirectory: string,
  assetUrl: string,
  token: string,
  imageCache: Map<string, Promise<string>>,
  warnings: string[]
): Promise<string> {
  const resolveUpload = async (reference: string): Promise<string | null> => {
    if (isRemoteReference(reference)) return null
    const imagePath = resolveLocalImage(notebookDirectory, notePath, reference)
    if (!imagePath) {
      const ext = path.extname(reference.split(/[?#]/, 1)[0] || '').toLowerCase()
      if (IMAGE_MIME_TYPES[ext]) warnings.push(`未找到图片：${reference}（来自 ${toPosixPath(notePath)}）`)
      return null
    }
    let task = imageCache.get(imagePath)
    if (!task) {
      task = uploadImage(assetUrl, token, imagePath)
      imageCache.set(imagePath, task)
    }
    return task
  }

  let replaced = content
  const markdownImages = [...content.matchAll(/!\[([^\]]*)\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g)]
  for (const match of markdownImages) {
    const reference = match[2] || match[3] || ''
    const url = await resolveUpload(reference)
    if (url) replaced = replaced.replace(match[0], `![${match[1] || ''}](${url})`)
  }

  const obsidianImages = [...replaced.matchAll(/!\[\[([^\]|#]+)(?:#[^|\]]*)?(?:\|[^\]]*)?\]\]/g)]
  for (const match of obsidianImages) {
    const reference = match[1] || ''
    const url = await resolveUpload(reference)
    if (url) replaced = replaced.replace(match[0], `![](${url})`)
  }
  return replaced
}

async function createPayloads(notebookDirectory: string, assetUrl: string, token: string): Promise<PayloadResult> {
  let skipped = 0
  let filledEmptyNotes = 0
  const warnings: string[] = []
  const notes: SyncNotePayload[] = []
  const files = collectMarkdownFiles(notebookDirectory, notebookDirectory)
  const imageCache = new Map<string, Promise<string>>()

  for (const file of files) {
    if (isPrivatePath(file.relativePath)) {
      skipped += 1
      continue
    }
    const rawContent = fs.readFileSync(file.fullPath, 'utf8')
    const { frontmatter, body } = parseFrontmatter(rawContent)
    if (frontmatter.draft || frontmatter.private) {
      skipped += 1
      continue
    }
    const filename = path.basename(file.fullPath, path.extname(file.fullPath))
    const metadata = extractMetadata(body, filename, frontmatter)
    const content = body.trim()
      ? await replaceEmbeddedImages(body, file.fullPath, notebookDirectory, assetUrl, token, imageCache, warnings)
      : `# ${metadata.title}\n`
    if (!body.trim()) filledEmptyNotes += 1
    notes.push({
      ...metadata,
      slug: makeSlug(filename, file.relativePath),
      content,
      sourcePath: toPosixPath(file.relativePath),
      directoryPath: path.dirname(file.relativePath) === '.' ? null : toPosixPath(path.dirname(file.relativePath)),
      tags: frontmatter.tags
    })
  }

  return {
    directories: createDirectories(notes.map(note => ({ relativePath: note.sourcePath }))),
    notes,
    skipped,
    filledEmptyNotes,
    imageCount: imageCache.size,
    warnings
  }
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const batches: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    batches.push([...items.slice(index, index + size)])
  }
  return batches
}

async function syncBatch(
  url: string,
  token: string,
  notes: SyncNotePayload[],
  directories: DirectoryPayload[]
): Promise<SyncResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ directories, notes })
  })
  const payload = await response.json().catch(() => null) as SyncResponse | null
  if (!response.ok || !payload) {
    throw new Error(payload?.message || `同步接口请求失败（HTTP ${response.status}）`)
  }
  return payload
}

async function main(): Promise<void> {
  loadLocalEnvironment()
  const notebookDirectoryArgument = process.argv.slice(2).find(argument => argument !== '--')
  const notebookDirectory = process.env.NOTEBOOK_DIR || notebookDirectoryArgument || DEFAULT_NOTEBOOK_DIR
  const syncUrl = process.env.NOTE_SYNC_URL || DEFAULT_SYNC_URL
  const assetUrl = process.env.NOTE_SYNC_ASSET_URL || `${syncUrl.replace(/\/$/, '')}/assets`
  const syncToken = process.env.NOTE_SYNC_TOKEN || process.env.NUXT_NOTE_SYNC_TOKEN
  const configuredBatchSize = Number.parseInt(process.env.NOTE_SYNC_BATCH_SIZE || '', 10)
  const batchSize = Number.isInteger(configuredBatchSize) && configuredBatchSize > 0 && configuredBatchSize <= 50
    ? configuredBatchSize
    : DEFAULT_BATCH_SIZE

  if (!syncToken || syncToken.length < 32) {
    throw new Error('缺少或过弱的 NOTE_SYNC_TOKEN（至少 32 个字符），请先在 .env 中配置')
  }
  if (!fs.existsSync(notebookDirectory)) throw new Error(`未找到笔记目录：${notebookDirectory}`)

  const { directories, notes, skipped, filledEmptyNotes, imageCount, warnings } = await createPayloads(notebookDirectory, assetUrl, syncToken)
  let created = 0
  let updated = 0
  const batches = chunk(notes, batchSize)
  console.log(`📚 扫描完成：${notes.length} 篇待同步，${directories.length} 个分类，${imageCount} 张图片，${skipped} 篇已跳过`)
  if (filledEmptyNotes > 0) console.log(`📝 ${filledEmptyNotes} 篇空 Markdown 将以标题占位同步`)
  console.log(`🌐 同步地址：${syncUrl}`)

  for (const [index, batch] of batches.entries()) {
    const result = await syncBatch(syncUrl, syncToken, batch, index === 0 ? directories : [])
    created += result.data.created
    updated += result.data.updated
    console.log(`✅ 已完成批次 ${index + 1}/${batches.length}（新增 ${result.data.created}，更新 ${result.data.updated}）`)
  }
  for (const warning of warnings) console.warn(`⚠️ ${warning}`)
  console.log(`🎉 同步完成：新增 ${created} 篇，更新 ${updated} 篇，跳过 ${skipped} 篇`)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : '未知同步错误'
  console.error(`❌ 同步失败：${message}`)
  process.exitCode = 1
})
