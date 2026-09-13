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
- [ ] 修复加密笔记读取时的访问控制；上传增加文件魔数校验。
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

## 可选基础设施演进

- [ ] 评估 Cloudflare Tunnel / CDN：隐藏源站 IP、增强 DDoS 防护；启用前确认中国大陆访问体验与备案要求。
- [ ] 对图片生成 WebP 缩略图和尺寸变体，降低带宽与首屏负载。

## 发布原则

1. 推送 `main` 后 GitHub Actions 构建镜像，Watchtower 更新应用。
2. Compose、Nginx、宿主机挂载、`.env` 与证书不随镜像自动更新。
3. Prisma Schema 变更先备份 MySQL，再同步结构并验证接口。
4. 运行步骤写入 `MAINTENANCE.md`，接口变更写入 `API.md`。
