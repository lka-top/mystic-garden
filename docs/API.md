# 神秘花园 API 文档

> 基础路径：`/api/v1`。服务端已渐进迁移至 Spring Boot 4 (`backend/`)，请求校验以 `backend/src/main/java/top/mysgarden/garden/dto/` 中的 Jakarta Bean Validation 注解为准。迁移期以合法请求兼容为目标；对非法关联、隐私字段和上传内容会做更严格的校验。
> OpenAPI 3 文档：`GET /v3/api-docs`；健康探针：`GET /actuator/health`；双栈契约对比：`pnpm contract:diff`。

## 响应与鉴权

```json
{ "code": 200, "message": "success", "data": {} }
```

- 管理员接口：`Authorization: Bearer <JWT>`。
- 笔记同步：`Authorization: Bearer <NOTE_SYNC_TOKEN>`，与 JWT 独立。
- 公开 GET 接口无需令牌。
- 标记为 `isEncrypted` 的笔记、私密笔记本及其子目录中的笔记仅管理员可读；匿名或普通用户请求笔记详情返回 404，列表、搜索、统计与 Sitemap 不包含这些内容。管理员读取详情和 `?all=true` 列表时需携带 JWT。
- 公开评论列表及提交响应不返回评论者 IP 和 User-Agent；管理员使用 `?all=true` 读取时可查看审核所需信息。

## 路由索引

| 资源 | 公开读取 | 管理写入/操作 |
|---|---|---|
| 认证 | `POST /auth/login`、`POST /auth/register` | `GET /auth/me`（管理员 JWT） |
| 文章 | `GET /articles`、`GET /articles/:slug` | `POST /articles`、`PUT /articles/:id`、`DELETE /articles/:id` |
| 笔记 | `GET /notes`、`GET /notes/:slug`、`GET /notebooks` | `POST /notes`、`PUT /notes/:id`、`DELETE /notes/:id`、`POST /notebooks` |
| 随笔 | `GET /essays` | `POST /essays`、`DELETE /essays/:id`、`POST /essays/:id/like` |
| 评论 | `GET /comments`、`POST /comments` | `PATCH /comments/:id/approve`、`DELETE /comments/:id` |
| 分类/标签 | `GET /categories`、`GET /tags` | `POST /categories`、`POST /tags` |
| 设置/图片 | `GET /settings` | `PATCH /settings`、`POST /upload`、`POST /uploads/sign` |
| 搜索/统计 | `GET /search`、`GET /stats/overview` | — |

评论目标必须保持一致：`article` 必须且只能携带 `articleId`，`essay` 必须且只能携带 `essayId`，`guestbook` 不携带两种内容 ID；回复必须与父评论属于同一目标，并且只支持两级结构。

## 图片上传

`POST /upload` 与 `POST /notes/sync/assets` 只接受 JPG、PNG、WebP、GIF、AVIF。服务端同时校验扩展名、MIME 和文件签名；SVG 因可包含主动内容，不写入同源上传目录。管理员上传上限为 25MB，笔记同步图片上限为 10MB。

## 笔记同步

### `POST /notes/sync`

供本地 `pnpm sync:notes` 调用。目录按 `path` Upsert，笔记按 `sourcePath` Upsert；单次最多 500 个目录、50 篇笔记。

### `POST /notes/sync/assets`

使用 `multipart/form-data` 上传字段 `image`。单张最大 10MB；成功返回公开 URL。

## 排错

1. 同步 401：确认本地和服务器的 `NOTE_SYNC_TOKEN` 一致。
2. 写接口 401/403：确认 JWT、管理员角色和 `Authorization`。
3. API Schema 变更后，同步更新本文和测试。
