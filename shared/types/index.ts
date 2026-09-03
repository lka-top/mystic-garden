export interface User {
  id: number
  username: string
  nickname: string
  avatar?: string | null
  email?: string | null
  bio?: string | null
  role: 'admin' | 'user' | 'guest'
  guestUuid?: string | null
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  articleCount?: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  articleCount?: number
  noteCount?: number
}

export interface Notebook {
  id: number
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  isPrivate: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  noteCount?: number
}

export interface Note {
  id: number
  title: string
  slug: string
  content?: string
  summary?: string | null
  isPinned: boolean
  isPublished: boolean
  isEncrypted: boolean
  views: number
  notebookId?: number | null
  authorId: number
  createdAt: string
  updatedAt: string
  notebook?: Notebook | null
  tags?: Tag[]
  author?: {
    id: number
    nickname: string
    avatar?: string | null
  }
}

export interface Article {
  id: number
  slug: string
  title: string
  summary: string
  content?: string
  coverImage?: string | null
  isPublished: boolean
  isPinned: boolean
  views: number
  readingTime: number
  categoryId?: number | null
  createdAt: string
  updatedAt: string
  category?: Category | null
  tags?: Tag[]
  author?: {
    id: number
    nickname: string
    avatar?: string | null
    bio?: string | null
  }
  commentCount?: number
}

export interface Essay {
  id: number
  content: string
  mood?: string | null
  weather?: string | null
  location?: string | null
  images?: string[] | null
  isPinned: boolean
  isPublished: boolean
  likes: number
  createdAt: string
  updatedAt: string
  author?: {
    id: number
    nickname: string
    avatar?: string | null
  }
  commentCount?: number
}

export interface Comment {
  id: number
  targetType: 'article' | 'essay' | 'guestbook'
  articleId?: number | null
  essayId?: number | null
  parentId?: number | null
  userId: number
  content: string
  isApproved: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: number
    username?: string
    nickname: string
    avatar?: string | null
    role: string
  }
  replies?: Comment[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 统一分页元数据，与服务端 paginationResponse 的 pagination 结构对齐 */
export interface Pagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 分页列表响应结构 */
export interface PaginatedList<T> {
  list: T[]
  pagination: Pagination
}

/** 登录/注册成功后返回的用户精简信息 */
export interface AuthUser {
  id: number
  username: string
  nickname: string
  avatar?: string | null
  email?: string | null
  role: 'admin' | 'user' | 'guest'
  createdAt: string
}

/** 全站统计数据概览 */
export interface StatsOverview {
  articles: number
  essays: number
  notes: number
  notebooks: number
  categories: number
  tags: number
  comments: number
  totalUsers: number
  guestUsers: number
  registeredUsers: number
  totalViews: number
}

/** `$fetch` 抛出的标准错误结构，用于安全提取后端 statusMessage */
export interface FetchErrorLike {
  data?: {
    statusMessage?: string
    message?: string
  }
  statusMessage?: string
  message?: string
}
