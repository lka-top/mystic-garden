# 神秘花园 · 发展记录与路线图

> 合并历史优化计划、当前执行记录与网站长期待办，是项目演进与未来开发的唯一事实来源。

## 当前状态

- 已完成：Nuxt 3、Prisma/MySQL、Docker Compose、Nginx、Certbot、Watchtower、GitHub Actions 生产部署。
- 已完成：本地 Markdown 知识库、多级分类、图片上传、SHA-256 增量同步与 ECS 本地图片存储。
- 生产资产：MySQL 与 `/data/luokai-blog/uploads`；两者必须异地备份。

## 已完成演进

- 安全与代码质量：移除仓库中的 `.env` 凭证、清理 `any`、Zod 请求校验、统一分页和错误响应、笔记密码散列。
- 服务端与前端：统一认证 API Client、后台编辑器复用、认证静默复验、Vitest、类型检查和构建验证。
- 基础设施：ACR 镜像、Watchtower、HTTPS 自动续期、ECS 本地图片持久化。
- 内容能力：RSS、Sitemap、文章 JSON-LD；知识库支持多级目录、私密过滤、图片上传、并发进度、超限过滤、超时重试与哈希增量同步。

## 近期待办

### P0：安全与可恢复性

- [x] 收紧 MySQL 3306：已取消 ECS 公网端口映射，仅允许 Docker 内部网络访问。
- [ ] 配置 NAS/本地异地备份、每日 cron 和每月恢复演练。
- [ ] 完善 SSH：禁用密码登录、fail2ban、非 root 管理用户。
- [x] 加密笔记与私密笔记本（含子目录）仅管理员可读；公开列表、搜索、统计、站点地图与计数同步过滤。
- [x] 上传增加文件签名校验，禁止同源 SVG 主动内容，并为上传路径补齐 `nosniff` / sandbox CSP。
- [ ] 为 JWT Cookie 补齐 `httpOnly`、`secure` 等安全属性。
- [ ] 修复导航搜索高亮中的 `v-html` 转义问题。
- [ ] 建立 90 天凭证轮换日历。

### P1：知识库

- [ ] Obsidian PDF、音频、视频、Canvas 与附件的展示或跳过提示。
- [ ] 复制粘贴内容清理：`data:` 图片、损坏链接和超大图片。
- [ ] 同步预览：确认新增、更新、跳过项后再写入。

### P2：产品与性能

- [ ] 图片画廊：相册、标签、缩略图、懒加载与后台管理。
- [ ] API 限流覆盖与 Redis 多实例支持。
- [ ] Docker 生产镜像瘦身、骨架屏和大型页面拆分。
- [ ] 将 Prisma `role` 字符串迁移为枚举；由 Zod 类型逐步贯通前后端。
- [ ] 持续维护 RSS、Sitemap、JSON-LD，拆分大型页面。

## Java 后端渐进迁移（Spring Boot 4 + Java 21 + Spring Data JPA）

- [x] Phase 0：启动本地 Docker MySQL（`127.0.0.1:33306`），导出并校验 Flyway `V1__baseline.sql` 与现有库 93 列 / 39 索引 / 14 外键完全一致。
- [x] Phase 1：参照 `OpenIsle/backend` 分层架构（`config` / `controller` / `service` / `repository` / `model` / `dto` / `mapper` / `exception` / `util`）搭建基础设施、安全鉴权、限流、异常映射与 11 张表 JPA 实体。
- [x] Phase 2：实现全部公开只读接口（分类、标签、笔记本、文章、笔记、随笔、评论、搜索、统计、设置）及 SEO 路由（`/feed.xml`、`/sitemap.xml`）与 Caffeine 缓存。
- [x] Phase 3：实现认证（登录、注册含游客指纹无缝升级、`/auth/me`）与管理端全部写接口。
- [x] Phase 4：实现本地文件上传存储（路径穿越防护）、签名直传降级（503）与本地知识库同步接口（`/notes/sync`、`/notes/sync/assets`）及种子数据初始化器。
- [x] Phase 5：编写完整 JUnit 5 + MockMvc + Service + Testcontainers MySQL 8.0.36 集成测试（当前 24/24 通过）与新旧后端实时契约对比脚本 `scripts/contract-diff.mjs`（迁移初版实库 16/16 项匹配），配置 Nuxt 开发/SSR 代理（`NUXT_BACKEND_URL`）与 Docker/Nginx/CI。
- [x] 迁移安全收口：新旧后端统一笔记可见性；公开评论隐藏 IP/UA；搜索按字面处理 LIKE 通配符；浏览量任务队列满时不影响详情读取。
- [x] 部署前置检查：Compose 中 JWT 与 MySQL 密码必填；Nuxt 启动不再自动执行 Prisma `db push`；后端结构由 Flyway 管理。
- [x] 迁移代码审计首轮：收紧评论多态目标/父子关系，防止已删除 JWT 主体绕过评论审核，校验标签与笔记本父级关联，复用单次请求内的私密目录计算结果，并通过 Flyway V2 为 `users.role` 增加索引。
- [x] 本地验证：Spring 24 项测试、Nuxt 类型检查、12 项前端测试和生产构建通过。
- [ ] 审计后续：扩充写接口/管理员视图的契约对比，批量化笔记同步查询，校正 OpenAPI 公开/受保护端点标注，设计管理员 JWT 立即撤销机制。
- [ ] 发布验证：在测试环境用当前数据库备份恢复后运行新旧接口契约对比，检查管理员与匿名访问，再观察日志与指标；生产切换需按 `docs/DEPLOYMENT.md` 执行。
- [ ] Phase 6（稳定运行后手动退役旧栈）：生产稳定运行 1~2 周后移除 `server/api/`、`server/routes/`、`prisma/` 及前端 `package.json` 中的服务端专用依赖。

## 可选基础设施演进

- [ ] 评估 Cloudflare Tunnel / CDN：隐藏源站 IP、增强 DDoS 防护；启用前确认中国大陆访问体验与备案要求。
- [ ] 对图片生成 WebP 缩略图和尺寸变体，降低带宽与首屏负载。

## 发布原则

1. 推送 `main` 后 GitHub Actions 构建镜像，Watchtower 更新应用。
2. Compose、Nginx、宿主机挂载、`.env` 与证书不随镜像自动更新。
3. 数据库结构变更先备份 MySQL，再执行 Flyway 迁移、校验 JPA 实体及过渡期 Prisma Schema，并验证接口。
4. 运行步骤写入 `MAINTENANCE.md`，接口变更写入 `API.md`。
