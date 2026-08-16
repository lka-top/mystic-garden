---
name: typescript-web
description: 现代 TypeScript Web 工程实践。规范严格类型推导、Zod Schema 校验、泛型与 API/数据层端到端类型安全。
---

# TypeScript Web Engineering Skill

## 1. 严格模式与类型设计准则
- **零 `any` 策略**：禁止在业务代码中直接使用 `any`，未知数据类型使用 `unknown` 并配合类型守卫（Type Narrowing）收窄。
- **不可变性优先**：对象与数组尽量使用 `readonly` 修饰符或 `as const` 断言。
- **工具类型的高效使用**：熟练运用 `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `Extract<T, U>`, `ReturnType<F>` 减少重复类型定义。

## 2. API 与数据流端到端类型校验 (Zod 集成)
- **输入校验与类型推导一体化**：
  ```ts
  import { z } from 'zod'

  export const createPostSchema = z.object({
    title: z.string().min(1, '标题不能为空').max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug 格式不合法'),
    content: z.string().min(10, '内容过短'),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(false),
  })

  export type CreatePostInput = z.infer<typeof createPostSchema>
  ```
- **服务端处理与校验**：
  ```ts
  // server/api/posts.post.ts
  export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (b) => createPostSchema.parse(b))
    // 此时 body 具备严格类型安全的 CreatePostInput
    return await prisma.post.create({ data: body })
  })
  ```

## 3. Prisma 与前端实体类型同步
- 充分利用 `@prisma/client` 自动生成的模型类型，避免手动编写与数据库 schema 脱节的重复 interface。
- 复杂关联查询使用 `Prisma.PostGetPayload<{ include: { author: true } }>` 精确推导关联类型。
