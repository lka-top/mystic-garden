<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, ArrowLeft, BookMarked, Plus, X, FolderPlus } from 'lucide-vue-next'
import type { ApiResponse, Note, Notebook } from '~/types'
import { useAuth } from '~/composables/useAuth'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import Button from '~/components/ui/Button.vue'
import Select from '~/components/ui/Select.vue'
import TagSelect from '~/components/ui/TagSelect.vue'

const colorMode = useColorMode()

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { token } = useAuth()

const slugQuery = route.query.slug as string | undefined
const isEditMode = ref(!!slugQuery)
const noteId = ref<number | null>(null)

const form = ref({
  slug: '',
  title: '',
  summary: '',
  content: '# 笔记标题\n\n- 核心知识点 1\n- 核心知识点 2\n\n```ts\n// 代码速查片段\n```',
  notebookId: null as number | null,
  tagIds: [] as number[],
  isPublished: true,
  isPinned: false
})

const notebooks = ref<Notebook[]>([])
const saving = ref(false)

// 快速新建笔记本分区弹窗状态
const showCreateNotebookModal = ref(false)
const newNotebookForm = ref({
  name: '',
  slug: '',
  description: '',
  isPrivate: false
})
const creatingNotebook = ref(false)
const notebookError = ref('')

function openCreateNotebookModal() {
  newNotebookForm.value = { name: '', slug: '', description: '', isPrivate: false }
  notebookError.value = ''
  showCreateNotebookModal.value = true
}

function handleNotebookNameChange() {
  if (!newNotebookForm.value.slug) {
    newNotebookForm.value.slug = newNotebookForm.value.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  }
}

async function handleCreateNotebook() {
  if (!newNotebookForm.value.name.trim()) {
    notebookError.value = '请输入笔记本分区名称'
    return
  }
  if (!newNotebookForm.value.slug.trim()) {
    newNotebookForm.value.slug = newNotebookForm.value.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  }

  creatingNotebook.value = true
  notebookError.value = ''
  try {
    const res = await $fetch<ApiResponse<Notebook>>('/api/v1/notebooks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: newNotebookForm.value
    })

    if (res.code === 200) {
      notebooks.value.push(res.data)
      form.value.notebookId = res.data.id
      showCreateNotebookModal.value = false
    }
  } catch (err: any) {
    notebookError.value = err?.data?.statusMessage || '新建笔记本分区失败，请检查名称或 Slug 是否重复'
  } finally {
    creatingNotebook.value = false
  }
}

onMounted(async () => {
  const nbRes = await $fetch<ApiResponse<Notebook[]>>('/api/v1/notebooks')
  if (nbRes.code === 200) {
    notebooks.value = nbRes.data
  }

  if (slugQuery) {
    try {
      const res = await $fetch<ApiResponse<Note>>(`/api/v1/notes/${slugQuery}`)
      if (res.code === 200) {
        const n = res.data
        noteId.value = n.id
        form.value = {
          slug: n.slug,
          title: n.title,
          summary: n.summary || '',
          content: n.content || '',
          notebookId: n.notebookId || null,
          tagIds: (n.tags || []).map((t: any) => t.id),
          isPublished: n.isPublished,
          isPinned: n.isPinned
        }
      }
    } catch (err) {
      alert('加载笔记失败')
    }
  }
})

async function handleUploadImg(files: File[], callback: (urls: string[]) => void) {
  const uploadedUrls: string[] = []
  for (const file of files) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await $fetch<ApiResponse<{ url: string }>>('/api/v1/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: formData
      })
      if (res.code === 200 && res.data?.url) {
        uploadedUrls.push(res.data.url)
      }
    } catch (err: any) {
      alert(err?.data?.statusMessage || '图片上传失败')
    }
  }
  callback(uploadedUrls)
}

async function handleSave() {
  if (!form.value.title.trim()) {
    alert('请输入笔记标题')
    return
  }
  if (!form.value.slug.trim()) {
    form.value.slug = form.value.title.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  }

  saving.value = true
  try {
    if (isEditMode.value && noteId.value) {
      const res = await $fetch<ApiResponse<Note>>(`/api/v1/notes/${noteId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body: form.value
      })
      if (res.code === 200) {
        alert('笔记已更新')
        router.push('/admin/notes')
      }
    } else {
      const res = await $fetch<ApiResponse<Note>>('/api/v1/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: form.value
      })
      if (res.code === 200) {
        alert('笔记创建成功')
        router.push('/admin/notes')
      }
    }
  } catch (err: any) {
    alert(err?.data?.statusMessage || '保存笔记失败')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/notes">
          <Button variant="ghost" size="icon">
            <ArrowLeft class="w-4 h-4" />
          </Button>
        </NuxtLink>
        <h1 class="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookMarked class="w-4 h-4 text-zinc-500" />
          {{ isEditMode ? '编辑笔记' : '新建知识库笔记' }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <label class="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer font-mono">
          <input v-model="form.isPublished" type="checkbox" class="rounded text-zinc-900 focus:ring-zinc-500">
          <span>公开可见</span>
        </label>
        <label class="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer font-mono">
          <input v-model="form.isPinned" type="checkbox" class="rounded text-zinc-900 focus:ring-zinc-500">
          <span>置顶卡片</span>
        </label>
        <Button variant="default" size="sm" :loading="saving" @click="handleSave">
          <Save class="w-4 h-4 mr-1" />
          保存笔记
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div class="sm:col-span-2 space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">笔记标题</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="输入结构化笔记名称或速查主题"
          class="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400 font-bold"
        >
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">URL Slug 唯一标识</label>
        <input
          v-model="form.slug"
          type="text"
          placeholder="nuxt3-nitro-middleware-tricks"
          class="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
        >
      </div>

      <div class="sm:col-span-2 space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">摘要备忘 (可选)</label>
        <input
          v-model="form.summary"
          type="text"
          placeholder="简短一句话说明该笔记的核心作用与技巧"
          class="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">所属笔记本 / 分区</label>
          <button
            type="button"
            class="text-[11px] text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
            @click="openCreateNotebookModal"
          >
            <Plus class="w-3 h-3" />
            新建分区
          </button>
        </div>
        <Select
          v-model="form.notebookId"
          placeholder="未指定笔记本"
          :options="notebooks.map(nb => ({ label: nb.name, value: nb.id }))"
        />
      </div>

      <!-- 标签交互选择与回车创建器 -->
      <div class="sm:col-span-3 space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          笔记关联标签
          <span class="text-[10px] font-normal text-zinc-400">（点击多选/取消，或直接输入新标签回车添加）</span>
        </label>
        <TagSelect v-model="form.tagIds" />
      </div>
    </div>

    <!-- 现代 Markdown 富文本全功能编辑器 (MdEditor) -->
    <div class="rounded-3xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-[#131c31] overflow-hidden shadow-card">
      <ClientOnly>
        <MdEditor
          v-model="form.content"
          :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
          preview-theme="default"
          code-theme="atom"
          style="height: 640px;"
          :show-code-row-number="true"
          @on-upload-img="handleUploadImg"
        />
        <template #fallback>
          <div class="p-12 text-center text-xs text-slate-400 font-mono">
            正在加载编辑器组件...
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- 快速新建笔记本分区弹窗 -->
    <div
      v-if="showCreateNotebookModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div class="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <FolderPlus class="w-4 h-4" />
            </div>
            <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-100">新增笔记本分区</h3>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            @click="showCreateNotebookModal = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div v-if="notebookError" class="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400">
          {{ notebookError }}
        </div>

        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-zinc-700 dark:text-zinc-300">分区名称 <span class="text-rose-500">*</span></label>
            <input
              v-model="newNotebookForm.name"
              type="text"
              placeholder="例如：架构实战、Linux 速查"
              class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              @input="handleNotebookNameChange"
            >
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-zinc-700 dark:text-zinc-300">Slug 路由标识 <span class="text-rose-500">*</span></label>
            <input
              v-model="newNotebookForm.slug"
              type="text"
              placeholder="例如：architecture-in-action"
              class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
            >
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-zinc-700 dark:text-zinc-300">分区说明简介 (可选)</label>
            <textarea
              v-model="newNotebookForm.description"
              rows="2"
              placeholder="简要概括该笔记本分区收录的内容定位..."
              class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" @click="showCreateNotebookModal = false">
            取消
          </Button>
          <Button variant="default" size="sm" :loading="creatingNotebook" @click="handleCreateNotebook">
            确认创建并选中
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
