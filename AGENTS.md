# AGENT 协同与技能执行规范

本项目为基于 **Nuxt 3 + Prisma + MySQL + TailwindCSS** 构建的个人博客系统（`luokai-garden` / 神秘花园）。

---

## 1. 项目架构概览

```
├── pages/                  # 页面路由（Nuxt 文件路由）
│   ├── index.vue           # 首页（Bento Grid 布局）
│   ├── articles/           # 文章列表与详情
│   ├── essays/             # 随笔
│   ├── notes/              # 笔记
│   ├── archive.vue         # 归档
│   ├── about.vue           # 关于
│   ├── register.vue        # 注册
│   └── admin/              # 后台管理
├── components/
│   ├── ui/                 # 通用 UI 组件
│   ├── layout/             # 布局组件（导航、侧栏等）
│   ├── article/            # 文章相关组件
│   ├── comment/            # 评论组件
│   └── essay/              # 随笔组件
├── composables/            # 组合式函数（useAuth, useGuestUser）
├── utils/                  # 工具函数（cn.ts 等）
├── server/
│   ├── api/v1/             # RESTful API（按资源分目录）
│   │   ├── articles/       ├── auth/        ├── categories/
│   │   ├── comments/       ├── essays/      ├── notebooks/
│   │   ├── notes/          ├── search/      ├── settings/
│   │   ├── stats/          ├── tags/        └── upload.post.ts
│   └── utils/              # 服务端工具（prisma, auth, response）
├── layouts/                # 布局（default, admin）
├── middleware/             # 路由中间件（auth.global.ts）
├── prisma/
│   └── schema.prisma       # 数据模型定义（MySQL）
├── assets/css/             # 全局样式
├── types/                  # TypeScript 类型声明
├── docker-compose.yml      # Docker MySQL 服务
└── nuxt.config.ts          # Nuxt 配置
```

---

## 2. 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| **框架** | Nuxt 3 / Vue 3 | Composition API / `<script setup lang="ts">` |
| **样式** | Tailwind CSS + CVA | `cn()` = `clsx` + `tailwind-merge` |
| **图标** | Lucide Icons / `@nuxt/icon` | `lucide-vue-next` |
| **数据库** | MySQL 8.0 | Docker 容器运行，Prisma ORM |
| **认证** | JWT + bcryptjs | `server/utils/auth.ts` |
| **内容渲染** | markdown-it + Shiki | 支持 anchor / container / task-lists |
| **动效** | @vueuse/motion | 页面过渡 `page` / `out-in` |
| **暗色模式** | @nuxtjs/color-mode | `preference: 'system'`，`classSuffix: ''` |

---

## 3. 开发命令

```bash
# 启动数据库（Docker）
docker compose up -d mysql

# 启动前端开发服务器
pnpm dev                        # → http://localhost:3000

# 数据库操作
npx prisma db push              # Schema 同步到数据库
npx prisma generate             # 重新生成 Prisma Client
npx prisma migrate dev          # 创建迁移
npx prisma studio               # 数据库可视化管理

# 数据填充与构建
npm run db:seed                  # 执行种子数据
npm run build                    # 生产构建
```

### 环境变量（`.env`）

```
DATABASE_URL="mysql://luokai:LuokaiSecurePass2025!@localhost:3306/luokai_blog"
JWT_SECRET="..."
NUXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 4. 代码规范

### 4.1 通用准则
- **先读后改**：编辑现有文件前，必须先读取文件内容了解上下文。
- **精准替换**：优先使用局部替换（`edit` 工具），禁止无意义的整文件重写。
- **保留注释**：不删除与修改无关的已有注释和文档字符串。

### 4.2 TypeScript
- 严格类型定义，**禁止 `any`**。
- API 请求/响应使用 **Zod Schema** 做运行时验证，并通过 `z.infer<>` 推导类型。
- Prisma 关联查询使用 `Prisma.XXXGetPayload<>` 复用类型。

### 4.3 Vue / Nuxt
- 统一使用 `<script setup lang="ts">`。
- Props / Emits 使用纯类型声明（`defineProps<{ ... }>()`）。
- 数据获取使用 `useAsyncData` / `useFetch`，注意 SSR 水合一致性。
- 大型列表或不变数据使用 `shallowRef` 优化性能。

### 4.4 样式
- 使用 `cn()` （`utils/cn.ts`）合并动态类名。
- 可复用组件使用 CVA（`class-variance-authority`）封装变体。
- Tailwind 类名遵循排序规范：布局 → 定位 → 盒模型 → 视觉 → 交互。

### 4.5 API 约定
- 路由格式：`server/api/v1/{resource}/[...].{method}.ts`
- 统一响应封装：使用 `server/utils/response.ts` 中的工具函数。
- 认证守卫：使用 `server/utils/auth.ts` 中的中间件。

---

## 5. 技能触发规则

工作区内的专业技能位于 `.agents/skills/` 目录。执行对应任务前，Agent **必须**先阅读对应 `SKILL.md`：

| 任务类型 | 技能 | 触发时机 |
|----------|------|----------|
| **UI/UX 设计** | `frontend-design` | 新页面布局、主题风格、排版、视觉提升 |
| **Tailwind 样式** | `tailwind-css` | CVA 组件、`cn()` 使用、动态类名、样式组织 |
| **Vue / Nuxt 架构** | `vue-best-practices` | 组件设计、响应式优化、SSR 数据流 |
| **性能 / SEO** | `web-performance-seo` | Core Web Vitals、Meta 标签、图片懒加载 |
| **TypeScript 类型** | `typescript-web` | Zod 校验、Prisma 类型、泛型设计 |
| **资源推荐与选型** | `resource-recommendation` | 寻找第三方库、框架调研、开源项目对比、闭环迭代选型 |
| **视觉分析** | `vision-tools`（内置） | 截图识别、UI 对比、取色、OCR |

### 执行原则
1. **Skill 优先**：开发需求匹配上述场景时，先加载对应技能再动手。
2. **视觉任务强制加载**：涉及图像或 UI 分析时，**必须加载 `vision-tools`**，不得凭空推测。
3. **大规模重构**：拆分为 Subagent 子任务并发执行，保持单轮上下文精简。

---

## 6. 协同与交付

1. **任务跟踪**：多步骤复杂任务使用 `task.md` 维护执行清单与进度。
2. **文件引用**：交付说明中的文件路径使用 Markdown 链接（如 [`nuxt.config.ts`](file:///d:/luo_kai_blog/nuxt.config.ts)），确保可点击导航。
3. **修改验证**：代码修改后应确认构建通过或开发服务器无报错。

---

## 7. 问答与技术讨论规范（Consultation & Q&A 铁律）

1. **纯探讨/问答不改动代码（No Premature Editing）**：
   - 当用户提出问题、技术咨询或发起方案讨论时，**严禁擅自修改代码或项目内容**。
   - 必须先根据用户提出的问题和讨论主题，结合项目实际架构给出合理、客观的专业见解与方案建议。

2. **主动反向提问以对齐需求（Reverse Questioning & Clarification）**：
   - 当用户在寻求帮助性建议，但在用户提出的设想或需求不够完善、边界模糊的情况下，**必须主动向用户反向提问**。
   - 紧密结合项目现有的技术栈、数据模型与业务场景，向用户询问关键细节与权衡取舍，避免盲目猜测。

3. **循序渐进辅助理解（Educational & Conceptual Support）**：
   - 若属于用户不太理解的概念、技术术语或架构机制（如 SSR 水合、响应式断点、CVA 模式等），**必须耐心、通俗易懂地帮助用户建立认知**，用直观比喻与项目实例拆解原理，消除认知壁垒。

4. **每次回答附带相关链接（Relevant Links & References）**：
   - 每次回答用户问题、提供技术建议、介绍云服务权益或活动方案时，**必须主动附带准确、相关的官方文档、活动入口或项目内链接**（如官网地址、活动页面、控制台入口、GitHub 仓库等），方便用户一键查阅和跳转操作。

