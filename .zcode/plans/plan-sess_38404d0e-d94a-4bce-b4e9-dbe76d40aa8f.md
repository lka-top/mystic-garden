# 神秘花园（luokai-garden）架构优化方案

以「安全加固 + 基建」为先，按优先级分四个阶段执行。暂不引入 Pinia，沿用 useState 体系。

## 阶段一：安全加固（最高优先级）

1. **移除 JWT secret 硬编码 fallback**：删除 `nuxt.config.ts` 中 `'luokai-garden-secret-jwt-key-2025'` 默认值，在 `server/utils/auth.ts` 启动时校验 `runtimeConfig.jwtSecret` 缺失即抛错；同步清理 `docker-compose.yml` 中的明文密码/JWT_SECRET 默认值（改为 `${ENV:-}` 透传或 .env 引用，README 补充说明）。
2. **修复 `requireAdminUser` 403 被 catch 吞成 401 的 bug**（`server/utils/auth.ts`）：把 jwt.verify 与 role 检查拆出 try 块，401（token 无效/缺失）与 403（非管理员）语义正确。
3. **Note.password 改哈希存储**：写迁移把现有明文 bcrypt 化，`notes` 相关 API 校验改 `bcrypt.compare`。
4. **User cookie 瘦身**：`composables/useAuth.ts` 的 `luokai_user` cookie 只存 `{id, username, role}` 最小字段，展示信息走 `/auth/me`。
5. **comments/index.post.ts 手写 jwt.verify 改为复用 `server/utils/auth.ts`**（新增 `tryGetAuthUser`）。

## 阶段二：服务端公共层（消除样板重复）

1. 新建 `server/utils/validate.ts`：
   - `readValidated<T>(event, schema)`：统一封装 safeParse + 400 错误，替换 ~10 处手写样板；GET/POST 统一风格。
   - `parseIdParam(event)`：替换所有 `[id]` 路由重复的 parseInt 校验。
   - `getClientIp(event)` / `getClientUa(event)`：合并 register/comments 的重复提取。
2. 新建 `server/utils/pagination.ts`：导出通用 `PaginationQuerySchema` 与 `paginate(prismaModel, where, opts)` 工厂，改造 articles/notes/essays/comments 四个列表接口。
3. 新建 `server/plugins/error.ts` 全局错误处理：错误响应也统一为 `{code, message, data}` 格式；映射 Prisma 错误码（P2002→409 唯一冲突、P2025→404），前端不再需要两套解析。
4. 列表接口的「管理员 isAll」判断抽成 `buildPublishFilter(event, query)` 复用。

## 阶段三：前端可维护性

1. **统一 API client**：新建 `composables/useApi.ts`（基于 `$fetch.create`），自动携带 Authorization、统一错误 toast/跳转，替换 30+ 处裸 `$fetch` 和 17 处手拼 header；清除 `ApiResponse<any>`，全部落到具体类型。
2. **合并两个雷同编辑器**：抽取 `composables/useMarkdownEditor.ts`（上传、标签选择、notebook/category 加载、保存/更新流程）+ 共用 `components/admin/EditorShell.vue`，`articles/editor.vue` 与 `notes/editor.vue` 各自只剩差异部分。
3. **ui 组件去数据化**：`TagSelect` 内部的 `$fetch` 改为 props 传入；admin 表单逐步复用 `ui/`（Input、Textarea 新增 CVA 变体）。
4. **admin 中间件优化**：`/auth/me` 结果加 TTL 缓存（如 5 分钟），避免每次 admin 导航都发请求。
5. 拆分过大文件：`archive.vue`（搜索/筛选/分页抽 composable）、`admin/index.vue`（笔记本管理拆子组件）。

## 阶段四：类型共享与测试（CI 兜底）

1. **前后端类型打通**：`types/index.ts` 中的手写 interface 改为从服务端 Zod schema `z.infer<>` 推导或集中定义共享（新增 `shared/` 或在 `types/` 中 export schema），消除三层手工同步。
2. **引入 vitest**：为 auth 工具、validate/pagination 公共层、`useApi` 写单测；CI（`ci.yml`）加 `typecheck` + `test` 步骤。
3. `schema.prisma` 的 `role` String 改 enum（附数据迁移）。

## 验证方式

- 每阶段完成后 `npm run build` + `pnpm dev` 冒烟（列表/详情/评论/登录/admin 编辑保存）。
- 阶段四起 `vitest run` 与 `nuxt typecheck` 全绿。
- 多任务清单记录在 `task.md` 跟踪进度。

## 暂不做（记录理由）

- Pinia：当前规模 useState 够用，用户已确认不引入。
- Redis 限流：当前单实例部署，内存限流够用；若未来多副本再切换。
- @nuxt/image：图片量少，后续加图床功能时一并引入。