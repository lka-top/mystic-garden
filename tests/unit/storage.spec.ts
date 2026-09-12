import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getLocalFilePath, getLocalPublicUrl, getLocalRelativePath, isOssStorageConfigured, uploadFileToStorage } from '~/server/utils/storage'

const temporaryDirectories: string[] = []

afterEach(async () => {
  vi.unstubAllEnvs()
  await Promise.all(temporaryDirectories.splice(0).map(directory => fs.rm(directory, { recursive: true, force: true })))
})

describe('本地图片存储', () => {
  it('将 uploads 对象键映射到宿主机目录和公开地址', () => {
    vi.stubEnv('STORAGE_DRIVER', 'local')
    vi.stubEnv('UPLOAD_PUBLIC_BASE_URL', 'https://mysgarden.top/uploads')

    expect(getLocalRelativePath('uploads/notes/2026/09/example.png')).toBe('notes/2026/09/example.png')
    expect(getLocalPublicUrl('uploads/notes/2026/09/example.png')).toBe('https://mysgarden.top/uploads/notes/2026/09/example.png')
    expect(isOssStorageConfigured()).toBe(false)
  })

  it('拒绝路径穿越和非 uploads 前缀', () => {
    expect(() => getLocalRelativePath('notes/example.png')).toThrow('无效的上传对象路径')
    expect(() => getLocalRelativePath('uploads/../secret.png')).toThrow('不安全的上传对象路径')
  })

  it('在本地模式写入独立上传目录', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mystic-garden-storage-'))
    temporaryDirectories.push(directory)
    vi.stubEnv('STORAGE_DRIVER', 'local')
    vi.stubEnv('UPLOAD_DIR', directory)
    vi.stubEnv('UPLOAD_PUBLIC_BASE_URL', '/uploads')

    const objectKey = 'uploads/admin/2026/09/test.png'
    const url = await uploadFileToStorage(Buffer.from('image-data'), 'test.png', 'image/png', {
      scope: 'admin',
      objectKey
    })

    expect(url).toBe('/uploads/admin/2026/09/test.png')
    expect(await fs.readFile(getLocalFilePath(objectKey, directory), 'utf8')).toBe('image-data')
  })
})
