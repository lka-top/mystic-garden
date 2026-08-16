# AGENT 协同与技能执行规范 (AGENTS.md)

本项目为基于 **Nuxt 3 + Prisma + TailwindCSS** 构建的博客系统 (`luokai-garden`)。
为确保 AI Agent 在日常协作、代码开发以及多模态任务中高效、稳定地执行，特制定本规范。

---

## 1. Agent Skills 规范库与触发准则

工作区内的专业技能文件存放于 `.agents/skills/` 目录，已接入 DSH 原生技能系统（支持通过 `skill` 工具直接动态加载）。在执行对应类型的任务前，Agent 应主动调用或阅读相应技能指南：

### 1.1 技能触发矩阵 (Skill Trigger Matrix)
| 任务场景 | 技能名称 | 规范文件路径 | 核心指导与目标 |
| :--- | :--- | :--- | :--- |
| **视觉/UI分析**<br>（截图识别、UI 差异对比、组件定位、取色、OCR 等） | `vision-tools` | 原生 Session 工具库 | 1. 调用 `skill(name: "vision-tools")`<br>2. 使用 `vision_glance` / `vision_ground` 定位元素<br>3. 使用 `vision_dominant_colors` 提取主题色<br>4. 使用 `vision_pixel_diff` 校验 UI 还原度 |
| **前端设计与 UI/UX 规划**<br>（新页面布局、主题风格、排版、组件视觉提升） | `frontend-design` | `.agents/skills/frontend-design/SKILL.md` | 调用 `skill(name: "frontend-design")`，告别模板化，制定清晰排版、微交互、优雅暗黑模式与定制化视觉风格 |
| **Tailwind 样式开发**<br>（原子类组织、CVA 变体组件、动态类名合并） | `tailwind-css` | `.agents/skills/tailwind-css/SKILL.md` | 调用 `skill(name: "tailwind-css")`，使用 `cn()` 管理类名，CVA 变体封装，规范类名书写顺序 |
| **Vue 3 / Nuxt 3 架构实践**<br>（组件设计、响应式优化、SSR 数据流） | `vue-best-practices` | `.agents/skills/vue-best-practices/SKILL.md` | 调用 `skill(name: "vue-best-practices")`，`<script setup lang="ts">` 纯类型 Props/Emits、`shallowRef` 性能优化、`useAsyncData`/`useFetch` 防水合不一致 |
| **Web 性能与 SEO 优化**<br>（Core Web Vitals、Meta 标签、资源加载与结构化数据） | `web-performance-seo` | `.agents/skills/web-performance-seo/SKILL.md` | 调用 `skill(name: "web-performance-seo")`，`useSeoMeta` 完善 OpenGraph，优化 LCP/CLS 指标，语义化 HTML 与图片懒加载 |
| **TypeScript 类型工程**<br>（严格类型约束、Zod 接口校验、Prisma 类型同步） | `typescript-web` | `.agents/skills/typescript-web/SKILL.md` | 调用 `skill(name: "typescript-web")`，杜绝 `any`，Zod 端到端 Schema 验证与推导，Prisma Payload 关联类型复用 |
| **大规模文件检索与批量重构** | Subagent / Workflow | 运行时调度 | 拆分为子任务并发执行，保持单轮上下文精简 |

### 1.2 执行规则 (Execution Rules)
1. **优先调用 Skill 工具**：当用户提出对应领域的开发需求（如重构组件、添加 API、优化页面速度、设计 UI）时，应首先通过 `skill` 工具加载对应技能。
2. **多模态工具优先**：凡涉及图像处理或 UI 分析任务，**必须优先加载 `vision-tools`**，严禁在未加载技能的情况下凭空推测视觉细节。
3. **工具化与类型化契约**：严格落实 Zod 运行时验证与 TypeScript 静态编译检查。

---

## 2. 项目工程与代码规范

### 2.1 技术栈概览
- **框架**：Nuxt 3 (Vue 3 Composition API / `<script setup>`)
- **样式**：Tailwind CSS (`@nuxtjs/tailwindcss`)、CVA (`class-variance-authority`)、`clsx` / `tailwind-merge`
- **图标**：Lucide Icons (`lucide-vue-next`)、`@nuxt/icon`
- **ORM / 数据层**：Prisma (`@prisma/client`)、SQLite / PostgreSQL
- **内容渲染**：Markdown-it (`markdown-it-anchor`, `markdown-it-container` 等)、Shiki 代码高亮

### 2.2 常用命令
- 开发环境：`pnpm dev` 或 `npm run dev`
- 数据库同步：`npx prisma db push` / `npm run db:push`
- Prisma 客户端生成：`npx prisma generate`
- 构建打包：`npm run build`

### 2.3 开发与修改规范
- **文件观察策略**：在编辑现有文件前，必须先使用 `read` 工具读取上下文。
- **精准替换**：修改文件时优先使用 `edit` 工具进行局部替换，避免无意义的整文件重写。
- **TypeScript 严格类型**：确保类型定义完整，尽量避免使用 `any`。

---

## 3. 长任务与协同最佳实践
1. **结构化任务跟踪**：多步骤复杂任务主动使用 `todo_write` 维护任务清单与执行状态。
2. **产物引用**：在最终交付与说明中，创建或修改的文件路径统一使用 Markdown 行内代码（如 `server/api/...`），确保在 Web 界面可直接点击导航。
