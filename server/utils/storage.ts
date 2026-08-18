import fs from 'node:fs/promises'
import path from 'node:path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * 获取初始化的 S3 客户端实例（若未配置环境变量则返回 null）
 */
function getS3Client(): { client: S3Client; bucket: string; publicDomain: string } | null {
  const endpoint = process.env.S3_ENDPOINT
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  const bucket = process.env.S3_BUCKET_NAME
  const publicDomain = process.env.S3_PUBLIC_DOMAIN || ''
  const region = process.env.S3_REGION || 'auto'

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    return null
  }

  const client = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })

  return { client, bucket, publicDomain }
}

/**
 * 统一文件上传适配器
 * - 若配置了 S3/R2/COS 环境变量：直传云端对象存储并返回 CDN 公开外链
 * - 未配置（本地开发环境）：自动保存至 public/uploads 目录并返回相对路径
 */
export async function uploadFileToStorage(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const s3Config = getS3Client()

  if (s3Config) {
    // 1. 云端 OSS / S3 上传模式 (Cloudflare R2 / 腾讯云 COS / 阿里云 OSS)
    const key = `uploads/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${filename}`

    await s3Config.client.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable'
      })
    )

    // 格式化输出外链域名
    const baseDomain = s3Config.publicDomain.replace(/\/+$/, '')
    if (baseDomain) {
      return `${baseDomain}/${key}`
    }
    return `/${key}`
  }

  // 2. 本地磁盘回退模式 (用于本地快速开发调试)
  const uploadDir = path.resolve(process.cwd(), 'public/uploads')
  await fs.mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, filename)
  await fs.writeFile(filePath, fileBuffer)

  return `/uploads/${filename}`
}
