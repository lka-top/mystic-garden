# 架构优化执行记录（2026-08-22）

依据「安全加固 + 基建优先」的四阶段优化方案，已完成内容如下。

## ✅ 阶段一：安全加固

- [x] 移除 `nuxt.config.ts` JWT secret 硬编码 fallback；`server/utils/auth.ts` 新增 `getJwtSecret()`，生产环境缺失/过弱直接抛错拒绝启动
- [x] 修复 `requireAdminUser` 中 403 被 catch 吞成 401 的 bug（verify 与角色检查拆分）
- [x] Note.password 写入侧 bcrypt 哈希（`notes/index.post.ts`、`notes/[id].put.ts`）；存量明文迁移脚本 `scripts/hash-note-passwords.mjs`（已执行，当前 0 条带密码笔记）
- [x] `luokai_user` cookie 瘦身为最小字段（`CookieUser` 类型，见 `composables/useAuth.ts`）
- [x] `comments/index.post.ts` 手写 jwt.verify 改为复用 `tryGetAuthUser()`
- [x] `docker-compose.yml` 移除明文密码/JWT 默认值（改为 `${VAR:?}` 强制要求）；`.env.example` 补充 MYSQL_* 变量说明

## ✅ 阶段二：服务端公共层

- [x] 新增 `server/utils/validate.ts`：`readValidated` / `getValidated` / `parseIdParam` / `getClientIp` / `getClientUa`，替换 11 个 handler 的 safeParse 样板与 8 个 [id] 路由的 ID 解析
- [x] 新增 `server/utils/pagination.ts`：`applyPublishFilter` / `applyApprovalFilter` / `isAdminAllRequest`，四个列表接口复用
- [x] 新增 `server/plugins/error.ts`：全局错误处理，Prisma P2002→409、P2025→404，开发环境打印请求日志

## ✅ 阶段三：前端可维护性

- [x] 新增 `composables/useApi.ts` 统一认证 API client（自动 Bearer 头、401 自动登出跳转），替换 17 处手拼 Authorization
- [x] `middleware/auth.global.ts` 增加 `/auth/me` 5 分钟 TTL 静默复验，避免每次导航请求
- [x] `components/ui/TagSelect.vue` 支持外部 `tags` prop 注入（不传则内部拉取兜底）
- [x] 新增 `composables/useAdminEditor.ts`（223 行）：`toSlug` / `useImageUpload` / `useInlineCreate` / `useEditorSave` / `loadEditorEntity`；两个 admin 编辑器 751 → 568 行，净减 183 行重复

## ✅ 阶段四：测试与 CI

- [x] 引入 vitest（`vitest.config.ts` + `tests/unit/`，6 个用例全绿）
- [x] `package.json` 新增 `test` 脚本；`ci.yml` 增加 Vitest 与 typecheck 步骤
- [x] 安装 vue-tsc 并修复全部存量类型错误（error.vue、Select.vue、notesCount 等），`nuxt typecheck` 零错误
- [x] 顺手修复 `toSlug` 首尾连字符未去除的问题

## 验证结果

- `npx vitest run`：6 passed
- `npx eslint .`：0 errors（86 warnings 为存量未使用导入，非本次引入）
- `npm run typecheck`：0 errors
- `npm run build`（mock env）：构建成功

## 遗留项（后续迭代）

- [ ] `schema.prisma` 的 `role` String → enum（需 `prisma db push`，涉及远程 TiDB，建议单独执行）
- [ ] 前后端类型打通：`types/index.ts` 改为从服务端 Zod schema `z.infer<>` 推导（涉及面广，建议单独 PR）
- [ ] 拆分 `pages/archive.vue`（482 行）与 `pages/admin/index.vue`（438 行）
- [ ] admin 表单复用 ui/ 组件（Input/Textarea CVA 变体）
- [ ] 限流中间件多副本部署时切换 Redis（当前单实例内存版够用）
- [ ] `.env` 中 JWT_SECRET 偏弱（31 字符），建议换 `openssl rand -base64 48` 生成的强密钥
