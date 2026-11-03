# Backend 协作指引（Mystic Garden）

## 1) 适用范围

- 作用于 `backend/` 目录及其子目录。
- 本后端基于 **Java 21 + Spring Boot 4 + Spring Data JPA + Flyway + MySQL 8.0**，架构对齐 `OpenIsle/backend`。

## 2) 代码结构心智模型

- `controller/`：接口层（入参校验、权限边界、OpenAPI 注解、统一 `ApiResult` / `ErrorBody` 响应）。
- `service/`：业务编排、领域规则与事务边界（核心逻辑放这里）。
- `repository/`：Spring Data JPA 数据访问（实体查询、`Specification` 动态筛选与原子计数更新）。
- `model/`：11 张数据表对应的 JPA 实体（与 Flyway `V1__baseline.sql` 严格对齐，`ddl-auto: validate`）。
- `dto/` + `mapper/`：对外请求/响应契约与实体到 DTO 的转换（禁止直接对外序列化 JPA 实体）。
- `config/`：安全鉴权（`SecurityConfig`）、进程内缓存（`CachingConfig`）、异步执行器（`AsyncConfig`）、JSON 时间格式（`JacksonConfig`）、OpenAPI（`OpenApiConfig`）。
- `exception/`：业务异常、404 异常与限流异常定义。
- `util/`：客户端信息提取、图片扩展名/MIME 严格校验、Slug 生成与鉴权上下文读取。

## 3) 后端修改规则

- 控制器保持“薄”，禁止在 Controller 直接注入或调用 `Repository`。
- 对外响应契约必须保持与 Nuxt 前端兼容：
  - 成功：`{ "code": 200, "message": "...", "data": ... }`
  - 分页：`data: { "list": [...], "pagination": { "total", "page", "pageSize", "totalPages" } }`
  - 错误：`{ "statusCode": 4xx/5xx, "statusMessage": "...", "message": "..." }`（前端读取 `err.data.statusMessage`）
- 新增接口时：
  - 在 `SecurityConfig` 中明确配置公开或管理员权限规则。
  - 补齐 `@Operation` 等 OpenAPI 注解。
  - 若涉及缓存，确认 `CachingConfig` 中缓存名称、TTL 及写操作 `@CacheEvict` 失效策略一致。

## 4) 数据与事务注意事项

- 多表写入（如文章/笔记标签重绑、笔记目录同步、多键设置更新）必须在 Service 层标注 `@Transactional`。
- `spring.jpa.open-in-view=false`，所有懒加载关联必须在 `@Transactional(readOnly = true)` 内通过 `mapper/` 完成 DTO 转换。
- 公开 GET 接口采用宽松 JWT 校验（`LenientJwtAuthFilter`）：令牌过期或无效时按匿名访客降级处理，绝不在公开接口抛 401，避免前端误清登录态。

## 5) 测试与验证

- 全量测试：`./mvnw -B test` 或 `./mvnw -B verify`
- 指定单测：`./mvnw -Dtest=ArticleControllerTest test`
- 新旧后端契约对比：`node ../scripts/contract-diff.mjs`
