import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ApiResponse } from '~/types'

/** 内联新建（分类/笔记本分区）的表单结构，E 为资源特有字段（如笔记本的 isPrivate） */
export interface InlineCreateForm<E extends Record<string, unknown> = Record<string, never>> {
  name: string
  slug: string
  description: string
  extra: E
}

/** 从 unknown 错误对象中安全提取 statusMessage（兼容 ofetch 错误结构） */
function extractStatusMessage(err: unknown): string | undefined {
  if (typeof err === 'object' && err !== null && 'data' in err) {
    const data = (err as { data?: unknown }).data
    if (typeof data === 'object' && data !== null && 'statusMessage' in data) {
      const msg = (data as { statusMessage?: unknown }).statusMessage
      if (typeof msg === 'string') return msg
    }
  }
  return undefined
}

/** 将名称转换为 URL Slug（保留中文，其余非法字符折叠为 -，并去除首尾 -） */
export function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')
}

import { compressImageToWebP } from '~/utils/imageCompressor'

/**
 * Markdown 编辑器图片上传：逐个自动 WebP 压缩并上传到 /api/v1/upload，成功后回调 URL 列表
 */
export function useImageUpload() {
  const api = useApi()

  async function handleUploadImg(files: File[], callback: (urls: string[]) => void): Promise<void> {
    const uploadedUrls: string[] = []
    for (const file of files) {
      try {
        // ⚡ 客户端智能 WebP 硬件加速转码与尺寸约束（体积节省 70%+）
        const optimizedFile = await compressImageToWebP(file)

        const formData = new FormData()
        formData.append('file', optimizedFile)
        const res = await api<{ url: string }>('/api/v1/upload', {
          method: 'POST',
          body: formData
        })
        if (res.code === 200 && res.data?.url) {
          uploadedUrls.push(res.data.url)
        }
      } catch (err: unknown) {
        alert(extractStatusMessage(err) || '图片上传失败')
      }
    }
    callback(uploadedUrls)
  }

  return { handleUploadImg }
}

/**
 * 「输入名称 → 内联创建 → 追加到下拉列表并选中」的通用流程
 * 泛型 T 为下拉列表中的资源（须含 id），E 为创建表单的资源特有字段
 */
export function useInlineCreate<
  T extends { id: number },
  E extends Record<string, unknown> = Record<string, never>
>(options: {
  /** 创建接口地址，如 /api/v1/categories */
  endpoint: string
  /** 下拉列表数据源，创建成功后 push 进去 */
  list: Ref<T[]>
  /** 创建成功后的回调（通常用于选中新建项） */
  onCreated: (item: T) => void
  /** 名称必填校验的提示文案 */
  nameRequiredMessage: string
  /** 创建失败的兜底提示文案 */
  fallbackErrorMessage: string
  /** 资源特有字段的默认值（提交时展开到 body） */
  defaultExtra: E
}) {
  const showModal = ref(false)
  const form = ref<InlineCreateForm<E>>({
    name: '',
    slug: '',
    description: '',
    extra: { ...options.defaultExtra }
  })
  const creating = ref(false)
  const error = ref('')

  function openModal(): void {
    form.value = {
      name: '',
      slug: '',
      description: '',
      extra: { ...options.defaultExtra }
    }
    error.value = ''
    showModal.value = true
  }

  function handleNameChange(): void {
    if (!form.value.slug) {
      form.value.slug = toSlug(form.value.name)
    }
  }

  async function handleCreate(): Promise<void> {
    if (!form.value.name.trim()) {
      error.value = options.nameRequiredMessage
      return
    }
    if (!form.value.slug.trim()) {
      form.value.slug = toSlug(form.value.name)
    }

    const api = useApi()
    creating.value = true
    error.value = ''
    try {
      const res = await api<T>(options.endpoint, {
        method: 'POST',
        body: {
          name: form.value.name,
          slug: form.value.slug,
          description: form.value.description,
          ...form.value.extra
        }
      })

      if (res.code === 200) {
        options.list.value.push(res.data)
        options.onCreated(res.data)
        showModal.value = false
      }
    } catch (err: unknown) {
      error.value = extractStatusMessage(err) || options.fallbackErrorMessage
    } finally {
      creating.value = false
    }
  }

  return { showModal, form, creating, error, openModal, handleNameChange, handleCreate }
}

/**
 * 后台编辑器保存流程骨架：校验标题、补全 slug、按编辑/新建模式提交并提示跳转
 */
export function useEditorSave<T>(options: {
  form: Ref<{ title: string; slug: string }>
  isEditMode: Ref<boolean>
  /** 编辑模式的资源 id（与 isEditMode 共同决定 PUT/POST） */
  entityId: Ref<number | null>
  /** 资源集合路径，如 /api/v1/articles */
  resourceBase: string
  /** 提交的表单负载（通常为整个 form 的展开） */
  buildBody: () => Record<string, unknown>
  /** 提交成功后跳转地址 */
  redirectTo: string
  titleRequiredMessage: string
  updatedMessage: string
  createdMessage: string
  failedMessage: string
}) {
  const saving = ref(false)
  const api = useApi()
  const router = useRouter()

  async function handleSave(): Promise<void> {
    if (!options.form.value.title.trim()) {
      alert(options.titleRequiredMessage)
      return
    }
    if (!options.form.value.slug.trim()) {
      options.form.value.slug = toSlug(options.form.value.title)
    }

    saving.value = true
    try {
      if (options.isEditMode.value && options.entityId.value) {
        const res = await api<T>(`${options.resourceBase}/${options.entityId.value}`, {
          method: 'PUT',
          body: options.buildBody()
        })
        if (res.code === 200) {
          alert(options.updatedMessage)
          router.push(options.redirectTo)
        }
      } else {
        const res = await api<T>(options.resourceBase, {
          method: 'POST',
          body: options.buildBody()
        })
        if (res.code === 200) {
          alert(options.createdMessage)
          router.push(options.redirectTo)
        }
      }
    } catch (err: unknown) {
      alert(extractStatusMessage(err) || options.failedMessage)
    } finally {
      saving.value = false
    }
  }

  return { saving, handleSave }
}

/**
 * 编辑模式下按 slug 加载既有内容（GET {resourceBase}/{slug}），失败时提示
 * 返回原始数据，由各编辑器映射到自身表单结构
 */
export async function loadEditorEntity<T>(resourceBase: string, slug: string, loadFailedMessage: string): Promise<T | null> {
  try {
    const res = await $fetch<ApiResponse<T>>(`${resourceBase}/${slug}`)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch {
    alert(loadFailedMessage)
    return null
  }
}
