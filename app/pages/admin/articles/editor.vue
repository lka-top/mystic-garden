<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, ArrowLeft, Plus, X, FolderPlus } from 'lucide-vue-next'
import type { ApiResponse, Article, Category } from '~/types'
import { useImageUpload, useInlineCreate, useEditorSave, loadEditorEntity } from '~/composables/useAdminEditor'
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

const slugQuery = route.query.slug as string | undefined
const isEditMode = ref(!!slugQuery)
const articleId = ref<number | null>(null)

const form = ref({
  slug: '',
  title: '',
  summary: '',
  content: '# 新文章标题\n\n在此开始撰写您的技术思考与探索...',
  coverImage: '',
  categoryId: null as number | null,
  tagIds: [] as number[],
  isPublished: true,
  isPinned: false
})

const categories = ref<Category[]>([])

// 快速新建分类弹窗（公共内联创建流程）
const {
  showModal: showCreateCategoryModal,
  form: newCategoryForm,
  creating: creatingCategory,
  error: categoryError,
  openModal: openCreateCategoryModal,
  handleNameChange: handleCategoryNameChange,
  handleCreate: handleCreateCategory
} = useInlineCreate<Category>({
  endpoint: '/api/v1/categories',
  list: categories,
  onCreated: (category) => {
    form.value.categoryId = category.id
  },
  nameRequiredMessage: '请输入分类名称',
  fallbackErrorMessage: '新建分类失败，请检查名称或 Slug 是否重复',
  defaultExtra: {}
})

onMounted(async () => {
  const catRes = await $fetch<ApiResponse<{ categories: Category[] }>>('/api/v1/categories')
  if (catRes.code === 200) {
    categories.value = catRes.data.categories
  }

  if (slugQuery) {
    const a = await loadEditorEntity<Article>('/api/v1/articles', slugQuery, '加载文章失败')
    if (a) {
      articleId.value = a.id
      form.value = {
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        content: a.content || '',
        coverImage: a.coverImage || '',
        categoryId: a.categoryId || null,
        tagIds: (a.tags || []).map((t: { id: number }) => t.id),
        isPublished: a.isPublished,
        isPinned: a.isPinned
      }
    }
  }
})

const { handleUploadImg } = useImageUpload()

const { saving, handleSave } = useEditorSave<Article>({
  form,
  isEditMode,
  entityId: articleId,
  resourceBase: '/api/v1/articles',
  buildBody: () => ({ ...form.value }),
  redirectTo: '/admin/articles',
  titleRequiredMessage: '请输入文章标题',
  updatedMessage: '文章已更新',
  createdMessage: '文章发布成功',
  failedMessage: '保存文章失败'
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/articles">
          <Button variant="ghost" size="icon">
            <ArrowLeft class="w-4 h-4" />
          </Button>
        </NuxtLink>
        <h1 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {{ isEditMode ? '编辑文章' : '撰写新博文' }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <label class="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
          <input v-model="form.isPublished" type="checkbox" class="rounded text-brand-600 focus:ring-brand-500">
          <span>立即发布</span>
        </label>
        <label class="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
          <input v-model="form.isPinned" type="checkbox" class="rounded text-brand-600 focus:ring-brand-500">
          <span>置顶推荐</span>
        </label>
        <Button variant="brand" size="sm" :loading="saving" @click="handleSave">
          <Save class="w-4 h-4 mr-1" />
          保存文章
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div class="sm:col-span-2 space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">文章标题</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="输入醒目的文章主标题"
          class="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
        >
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">URL Slug 唯一标识</label>
        <input
          v-model="form.slug"
          type="text"
          placeholder="welcome-to-luokai-garden"
          class="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
        >
      </div>

      <div class="sm:col-span-2 space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">文章摘要</label>
        <input
          v-model="form.summary"
          type="text"
          placeholder="简明扼要的一句话摘要，用于 SEO 与列表展示"
          class="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">所属分类</label>
          <button
            type="button"
            class="text-[11px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
            @click="openCreateCategoryModal"
          >
            <Plus class="w-3 h-3" />
            新建分类
          </button>
        </div>
        <Select
          v-model="form.categoryId"
          placeholder="请选择文章分类"
          :options="categories.map(c => ({ label: c.name, value: c.id }))"
        />
      </div>

      <!-- 封面图 URL -->
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">封面图片 URL (可选)</label>
        <input
          v-model="form.coverImage"
          type="text"
          placeholder="https://images.unsplash.com/..."
          class="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-xs"
        >
      </div>

      <!-- 标签交互选择与回车创建器 -->
      <div class="sm:col-span-2 space-y-1.5">
        <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          文章关联标签
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

    <!-- 快速新建分类弹窗 -->
    <div
      v-if="showCreateCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div class="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <FolderPlus class="w-4 h-4" />
            </div>
            <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-100">新增文章分类</h3>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            @click="showCreateCategoryModal = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div v-if="categoryError" class="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400">
          {{ categoryError }}
        </div>

        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-zinc-700 dark:text-zinc-300">分类名称 <span class="text-rose-500">*</span></label>
            <input
              v-model="newCategoryForm.name"
              type="text"
              placeholder="例如：系统架构、前端进阶"
              class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
              @input="handleCategoryNameChange"
            >
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-zinc-700 dark:text-zinc-300">Slug 路由标识 <span class="text-rose-500">*</span></label>
            <input
              v-model="newCategoryForm.slug"
              type="text"
              placeholder="例如：system-architecture"
              class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            >
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-zinc-700 dark:text-zinc-300">分类定位描述 (可选)</label>
            <textarea
              v-model="newCategoryForm.description"
              rows="2"
              placeholder="简要概括该分类收录的文章主题与方向..."
              class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" @click="showCreateCategoryModal = false">
            取消
          </Button>
          <Button variant="brand" size="sm" :loading="creatingCategory" @click="handleCreateCategory">
            确认创建并选中
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
