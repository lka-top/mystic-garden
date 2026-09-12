import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import type OSS from 'ali-oss'

export type StorageScope = 'admin' | 'notes'
export type StorageDriver = 'local' | 'oss'

interface OssStorageConfig {
  client: OSS
  publicDomain: string
}

const STORAGE_PREFIX = 'uploads'

function getStorageDriver(): StorageDriver {
  return process.env.STORAGE_DRIVER === 'oss' ? 'oss' : 'local'
}

function toOssRegion(value: string | undefined): string {
  if (!value) return 'oss-cn-hangzhou'
  return value.startsWith('oss-') ? value : `oss-${value}`
}

function hasOssStorageConfiguration(): boolean {
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET || process.env.S3_SECRET_ACCESS_KEY
  const bucket = process.env.OSS_BUCKET || process.env.S3_BUCKET_NAME
  return Boolean(accessKeyId && accessKeySecret && bucket)
}

async function getOssStorageConfig(): Promise<OssStorageConfig | null> {
  const endpoint = process.env.OSS_ENDPOINT || process.env.S3_ENDPOINT
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET || process.env.S3_SECRET_ACCESS_KEY
  const bucket = process.env.OSS_BUCKET || process.env.S3_BUCKET_NAME
  const region = toOssRegion(process.env.OSS_REGION || process.env.S3_REGION)
  const publicDomain = process.env.OSS_PUBLIC_DOMAIN || process.env.S3_PUBLIC_DOMAIN || ''

  if (!accessKeyId || !accessKeySecret || !bucket) return null

  const { default: OssClient } = await import('ali-oss') as { default: typeof OSS }
  const client = new OssClient({
    region,
    bucket,
    ...(endpoint ? { endpoint } : {}),
    accessKeyId,
    accessKeySecret,
    secure: true,
    authorizationV4: true
  })

  const endpointDomain = endpoint?.replace(/^https?:\/\//, '').replace(/\/+$/, '')
  const derivedPublicDomain = endpointDomain ? `https://${bucket}.${endpointDomain}` : `https://${bucket}.${region}.aliyuncs.com`
  return { client, publicDomain: (publicDomain || derivedPublicDomain).replace(/\/+$/, '') }
}

function getLocalUploadDirectory(): string {
  return process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'public', STORAGE_PREFIX)
}

function getLocalPublicBaseUrl(): string {
  return (process.env.UPLOAD_PUBLIC_BASE_URL || `/${STORAGE_PREFIX}`).replace(/\/+$/, '')
}

function getMonthPrefix(scope: StorageScope): string {
  const date = new Date()
  return `${STORAGE_PREFIX}/${scope}/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function normalizeFilename(filename: string): string {
  const baseName = path.basename(filename)
  return baseName.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || 'image'
}

function toPublicUrl(publicDomain: string, objectKey: string): string {
  return `${publicDomain}/${objectKey.split('/').map(segment => encodeURIComponent(segment)).join('/')}`
}

/** 将 provider 内部 key 转为本地 uploads 根目录下的安全相对路径。 */
export function getLocalRelativePath(objectKey: string): string {
  const prefix = `${STORAGE_PREFIX}/`
  if (!objectKey.startsWith(prefix)) {
    throw new Error(`无效的上传对象路径：${objectKey}`)
  }

  const relativePath = objectKey.slice(prefix.length)
  const normalizedPath = path.posix.normalize(relativePath)
  if (!relativePath || normalizedPath.startsWith('../') || normalizedPath === '..' || path.isAbsolute(normalizedPath)) {
    throw new Error(`不安全的上传对象路径：${objectKey}`)
  }
  return normalizedPath
}

export function getLocalFilePath(objectKey: string, uploadDirectory = getLocalUploadDirectory()): string {
  const resolvedDirectory = path.resolve(uploadDirectory)
  const filePath = path.resolve(resolvedDirectory, getLocalRelativePath(objectKey))
  if (!filePath.startsWith(`${resolvedDirectory}${path.sep}`)) {
    throw new Error(`不安全的上传对象路径：${objectKey}`)
  }
  return filePath
}

export function getLocalPublicUrl(objectKey: string): string {
  return toPublicUrl(getLocalPublicBaseUrl(), getLocalRelativePath(objectKey))
}

export function isOssStorageConfigured(): boolean {
  return getStorageDriver() === 'oss' && hasOssStorageConfiguration()
}

export function createStorageObjectKey(scope: StorageScope, filename: string): string {
  const extension = path.extname(filename).toLowerCase()
  const uniqueName = `${crypto.randomUUID()}${extension}`
  return `${getMonthPrefix(scope)}/${uniqueName}`
}

export interface StorageUploadOptions {
  scope: StorageScope
  objectKey?: string
}

/**
 * 统一文件上传适配器。
 * 默认写入本地 UPLOAD_DIR；STORAGE_DRIVER=oss 时写入阿里云 OSS。
 */
export async function uploadFileToStorage(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  options: StorageUploadOptions = { scope: 'admin' }
): Promise<string> {
  const objectKey = options.objectKey || `${getMonthPrefix(options.scope)}/${normalizeFilename(filename)}`
  const ossConfig = isOssStorageConfigured() ? await getOssStorageConfig() : null

  if (ossConfig) {
    await ossConfig.client.put(objectKey, fileBuffer, {
      mime: mimeType,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
    })
    return toPublicUrl(ossConfig.publicDomain, objectKey)
  }

  const filePath = getLocalFilePath(objectKey)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, fileBuffer)
  return getLocalPublicUrl(objectKey)
}

/**
 * 仅 OSS 模式可生成浏览器直传签名；本地模式由前端自动回退服务端上传。
 */
export async function createDirectUploadSignature(
  objectKey: string,
  mimeType: string,
  expiresInSeconds = 5 * 60
): Promise<{ uploadUrl: string; publicUrl: string } | null> {
  const ossConfig = isOssStorageConfigured() ? await getOssStorageConfig() : null
  if (!ossConfig) return null

  const uploadUrl = await ossConfig.client.signatureUrlV4('PUT', expiresInSeconds, {
    headers: { 'Content-Type': mimeType }
  }, objectKey)
  return { uploadUrl, publicUrl: toPublicUrl(ossConfig.publicDomain, objectKey) }
}
