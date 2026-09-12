import path from 'node:path'

export const MAX_ADMIN_IMAGE_SIZE = 25 * 1024 * 1024
export const MAX_NOTE_IMAGE_SIZE = 10 * 1024 * 1024

export const IMAGE_MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml'
} as const

export type SupportedImageMimeType = (typeof IMAGE_MIME_TYPES)[keyof typeof IMAGE_MIME_TYPES]

export function getValidatedImageType(filename: string, mimeType: string): { ext: string; mimeType: SupportedImageMimeType } | null {
  const ext = path.extname(filename).toLowerCase()
  const expectedMimeType = IMAGE_MIME_TYPES[ext as keyof typeof IMAGE_MIME_TYPES]
  if (!expectedMimeType || expectedMimeType !== mimeType) return null
  return { ext, mimeType: expectedMimeType }
}
