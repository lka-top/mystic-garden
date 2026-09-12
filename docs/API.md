# 神秘花园 API 文档

> 基础路径：`/api/v1`。请求字段以对应服务端 Zod Schema 为准。

## 响应与鉴权

```json
{ "code": 200, "message": "success", "data": {} }
```

- 管理员接口：`Authorization: Bearer <JWT>`。
- 笔记同步：`Authorization: Bearer <NOTE_SYNC_TOKEN>`，与 JWT 独立。
- 公开 GET 接口无需令牌。

## 路由索引

| 资源 | 公开读取 | 管理写入/操作 |
|---|---|---|
| 认证 | `POST /auth/login`、`POST /auth/register`、`GET /auth/me` | 登录后取得 JWT |
| 文章 | `GET /articles`、`GET /articles/:slug` | `POST /articles`、`PUT /articles/:id`、`DELETE /articles/:id` |
| 笔记 | `GET /notes`、`GET /notes/:slug`、`GET /notebooks` | `POST /notes`、`PUT /notes/:id`、`DELETE /notes/:id`、`POST /notebooks` |
| 随笔 | `GET /essays` | `POST /essays`、`DELETE /essays/:id`、`POST /essays/:id/like` |
| 评论 | `GET /comments`、`POST /comments` | `PATCH /comments/:id/approve`、`DELETE /comments/:id` |
| 分类/标签 | `GET /categories`、`GET /tags` | `POST /categories`、`POST /tags` |
| 设置/图片 | `GET /settings` | `PATCH /settings`、`POST /upload`、`POST /uploads/sign` |
| 搜索/统计 | `GET /search`、`GET /stats/overview` | — |

## 笔记同步

### `POST /notes/sync`

供本地 `pnpm sync:notes` 调用。目录按 `path` Upsert，笔记按 `sourcePath` Upsert；单次最多 500 个目录、50 篇笔记。

### `POST /notes/sync/assets`

使用 `multipart/form-data` 上传字段 `image`。只接受 JPG、PNG、WebP、GIF、AVIF，单张最大 10MB；成功返回公开 URL。

## 排错

1. 同步 401：确认本地和服务器的 `NOTE_SYNC_TOKEN` 一致。
2. 写接口 401/403：确认 JWT、管理员角色和 `Authorization`。
3. API Schema 变更后，同步更新本文和测试。
