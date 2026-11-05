# 神秘花园 · 发展记录与路线图

> 合并历史优化计划、当前执行记录与网站长期待办，是项目演进与未来开发的唯一事实来源。

## 当前状态

- 已完成：Nuxt 3、Prisma/MySQL、Docker Compose、Nginx、Certbot、GitHub Actions 双镜像 SHA 生产部署。
- 已完成：本地 Markdown 知识库、多级分类、图片上传、SHA-256 增量同步与 ECS 本地图片存储。
- 生产资产：MySQL 与 `/data/luokai-blog/uploads`；两者必须异地备份。

## 已完成演进

- 安全与代码质量：移除仓库中的 `.env` 凭证、清理 `any`、Zod 请求校验、统一分页和错误响应、笔记密码散列。
- 服务端与前端：统一认证 API Client、后台编辑器复用、认证静默复验、Vitest、类型检查和构建验证。
- 基础设施：ACR 前后端镜像、CI 成功门禁、SSH 自动发布与镜像回滚、HTTPS 自动续期、ECS 本地图片持久化。
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
- [x] 本地验证：Spring 27 项测试、Nuxt 类型检查、12 项前端测试和生产构建通过。
- [ ] 审计后续：扩充写接口/管理员视图的契约对比，批量化笔记同步查询，校正 OpenAPI 公开/受保护端点标注，设计管理员 JWT 立即撤销机制。
- [ ] 发布验证：在测试环境用当前数据库备份恢复后运行新旧接口契约对比，检查管理员与匿名访问，再观察日志与指标；生产切换需按 `docs/DEPLOYMENT.md` 执行。
- [ ] Phase 6（稳定运行后手动退役旧栈）：生产稳定运行 1~2 周后移除 `server/api/`、`server/routes/`、`prisma/` 及前端 `package.json` 中的服务端专用依赖。

## 可选基础设施演进

- [ ] 评估 Cloudflare Tunnel / CDN：隐藏源站 IP、增强 DDoS 防护；启用前确认中国大陆访问体验与备案要求。
- [ ] 对图片生成 WebP 缩略图和尺寸变体，降低带宽与首屏负载。

## 生产 CI/CD 自动化改造

- [x] 修复 Maven Wrapper Git 执行权限，升级 GitHub Actions 的 Node 24 兼容版本。
- [x] 前端与后端验证均成功后，才允许构建生产镜像。
- [x] 前后端镜像统一使用完整 Git SHA，生产不再跟随 `latest`。
- [x] 移除 Watchtower，由 GitHub Actions 串行部署后端、前端与 Nginx。
- [x] 发布前创建 MySQL 本地快照，容器或健康检查失败时恢复旧镜像和配置。
- [x] 为 Nuxt 容器增加健康检查，并对生产首页执行冒烟验证。
- [ ] 在 GitHub `production` Environment 配置 `ACR_BACKEND_IMAGE`、SSH Known Hosts 与服务器 Variables。
- [ ] 首次自动发布后确认两个容器使用相同 SHA，并完成一次失败回滚演练。
- [ ] 若运维文档中的旧数据库密码曾用于真实环境，完成密码轮换。

## 发布原则

1. 推送 `main` 后只有前后端 CI 全绿才构建并自动部署两个同 SHA 镜像。
2. 受版本控制的 Compose 与 Nginx 配置随发布包更新；宿主机 `.env`、证书、MySQL 数据卷和上传目录绝不覆盖。
3. 每次生产发布先创建 MySQL 快照；Flyway 迁移必须采用 expand/contract 并至少兼容上一个镜像版本。
4. 健康检查失败时自动恢复旧镜像和配置，但不自动反向恢复数据库。
5. 运行步骤写入 `MAINTENANCE.md`，接口变更写入 `API.md`。
