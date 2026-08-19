# 「神秘花园」项目架构优化执行计划

## 项目概况
- 项目：神秘花园（Mystic Garden）个人博客系统
- 技术栈：Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS + Prisma + MySQL
- 仓库：https://github.com/lka-top/mystic-garden.git

## 已完成的优化（P0-P1）

### 🔴 P0-1: .env 凭证泄露修复
- `.env` 已从 Git 跟踪中移除（`git rm --cached`）
- `.env.example` 已替换为纯占位变量（无真实凭证）
- 新增 commit: `security: remove .env from git tracking and sanitize .env.example placeholders`

### 🔴 P0-2: TypeScript `any` 类型清理
- `server/api/v1/articles/index.get.ts` — `whereCondition: Prisma.ArticleWhereInput`
- `server/api/v1/essays/index.get.ts` — `whereCondition: Prisma.EssayWhereInput`
- `server/api/v1/notes/index.get.ts` — `whereCondition: Prisma.NoteWhereInput`
- `server/api/v1/comments/index.get.ts` — `whereCondition: Prisma.CommentWhereInput`
- `server/api/v1/auth/register.post.ts` — `let user: any` → `Prisma.UserGetPayload<>` + 提取 `userSelect` 复用
- `server/utils/auth.ts` — `catch (err: any)` → `catch`
- `server/utils/response.ts` — `successResponse<T = any>` → `successResponse<T>`
- `types/index.ts` — 新增 `Pagination`, `PaginatedList<T>`, `AuthUser`, `StatsOverview`, `FetchErrorLike` 类型

### 🟠 P1-1: API Query 参数 Zod 校验
- `articles/index.get.ts` → 使用 Zod Schema + `getValidatedQuery`
- `essays/index.get.ts` → 同上
- `notes/index.get.ts` → 同上
- `comments/index.get.ts` → 同上（含 `z.enum` 枚举校验 `targetType`）

### 🟠 P1-2: 分页响应统一
- 各 GET 端点已统一使用 `paginationResponse` 工具函数
- 无需额外改动

## 待执行的优化（P2-P3）

### 🟡 P2-1: 公开 API 速率限制（登录/评论防刷）
- `pages/admin/login.vue` — 登录请求
- `server/api/v1/comments/index.post.ts` — 评论提交
- 建议方案：在 Nitro 插件或 `server/middleware` 中实现基于内存的令牌桶限流，限制登录 5次/分钟/IP，评论 10次/分钟/IP
- 涉及文件：`server/middleware/rate-limit.ts`（新建）

### 🟡 P2-2: Docker 镜像瘦身
- 当前问题：`Dockerfile` 的 runner 阶段完整复制了 `node_modules`，包含大量 devDependencies
- 优化方案：
  - 移除 `COPY --from=builder /app/node_modules ./node_modules`
  - 改为 `pnpm install --prod --frozen-lockfile`
  - `tsx` 从 devDependencies 移到 dependencies（或使用 `npx prisma` 的替代方案）
- 涉及文件：`Dockerfile`, `package.json`

### 🟡 P2-3: 骨架屏与加载态组件
- 为文章列表、随笔流、笔记卡片创建对应的 Skeleton 骨架组件
- 组件名：`components/ui/ArticleCardSkeleton.vue`, `EssayCardSkeleton.vue`, `NoteCardSkeleton.vue`
- 利用 `useAsyncData` 的 `pending` 状态控制显示
- 骨架保持与真实卡片相同宽高，避免 CLS

### 🟢 P3-1: SEO 增强
- JSON-LD Article Schema 注入 `pages/articles/[slug].vue`
- `@nuxtjs/sitemap` 模块自动生成 `sitemap.xml`
- 新增 `/api/v1/feed.xml` RSS 订阅端点
- 涉及文件：`nuxt.config.ts`, `pages/articles/[slug].vue`, `server/api/v1/feed.xml.ts`

### 🟢 P3-2: `useAuth` SSR 跨请求状态隔离
- 当前问题：`useState` 在 SSR 中跨请求共享
- 优化方案：`useCookie` 替代 `useState` 存储 `currentUser`，或使用 `useRequestEvent` 注入请求上下文
- 涉及文件：`composables/useAuth.ts`, `middleware/auth.global.ts`

## 核心文件清单
```
D:\luo_kai_blog\
├── server/api/v1/
│   ├── articles/index.get.ts   ← 已优化 (P0+P1)
│   ├── essays/index.get.ts     ← 已优化 (P0+P1)
│   ├── notes/index.get.ts      ← 已优化 (P0+P1)
│   ├── comments/index.get.ts   ← 已优化 (P0+P1)
│   └── auth/register.post.ts   ← 已优化 (P0)
├── server/utils/
│   ├── auth.ts                 ← 已优化 (P0)
│   └── response.ts             ← 已优化 (P0)
├── types/index.ts              ← 已优化 (P0)
├── .env.example                ← 已优化 (P0)
├── Dockerfile                  ← 待优化 (P2)
├── package.json                ← 待优化 (P2)
├── composables/useAuth.ts      ← 待优化 (P3)
├── middleware/auth.global.ts   ← 待优化 (P3)
└── pages/articles/[slug].vue   ← 待优化 (P3)
```