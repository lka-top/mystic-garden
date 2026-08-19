FROM node:22-alpine AS builder

WORKDIR /app

# 1. 替换为阿里云 Alpine 软件源与 npm 淘宝镜像加速 (提升国内构建速度 100 倍)
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache openssl && \
    npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@9 && \
    pnpm config set registry https://registry.npmmirror.com

ENV PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile
RUN npx prisma generate

COPY . .
RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache openssl && \
    npm config set registry https://registry.npmmirror.com && \
    npm install -g tsx prisma

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# 仅复制独立构建产物与必要的数据库迁移文件，避免复制臃肿的开发阶段 node_modules
COPY --from=builder /app/.output ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY docker-entrypoint.sh ./

RUN chmod +x ./docker-entrypoint.sh && \
    mkdir -p /app/public/uploads && \
    chown -R nuxtjs:nodejs /app

USER nuxtjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
