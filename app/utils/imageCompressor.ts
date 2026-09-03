/**
 * 客户端高保真 WebP 图片智能压缩工具
 * - 自动将大图 (JPG, PNG, WebP 等) 转换为高压缩比 WebP 格式
 * - 限制最大宽度 (默认 2048px)，保持长宽比
 * - SVG / GIF (动图) 自动跳过压缩以保护矢量清晰度与帧动画
 */

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.82
}

/**
 * 将任意图片 File 对象转码压缩为 WebP File 对象
 */
export async function compressImageToWebP(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const { maxWidth, maxHeight, quality } = { ...DEFAULT_OPTIONS, ...options }

  // 1. 跳过 SVG 和 GIF (保持矢量与动图完整)
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  // 2. 非图片类型直接返回
  if (!file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        let { width, height } = img

        // 3. 计算等比例缩放后的尺寸
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width
          const heightRatio = maxHeight / height
          const ratio = Math.min(widthRatio, heightRatio)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        // 4. 利用 Canvas 进行硬件加速转码
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        // 改善缩放抗锯齿平滑度
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            // 5. 若转码后体积反而比原图大（极少见小图标），则保留原文件
            if (blob.size >= file.size && file.type === 'image/webp') {
              resolve(file)
              return
            }

            // 6. 生成新 .webp 文件名
            const baseName = file.name.replace(/\.[^/.]+$/, '')
            const newFileName = `${baseName}.webp`

            const compressedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            })

            console.log(
              `[ImageCompressor] ⚡ 压缩完成: ${file.name} (${(file.size / 1024).toFixed(1)} KB) -> ${newFileName} (${(compressedFile.size / 1024).toFixed(1)} KB), 节省 ${(100 - (compressedFile.size / file.size) * 100).toFixed(1)}%`
            )

            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        resolve(file)
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      resolve(file)
    }

    reader.readAsDataURL(file)
  })
}
