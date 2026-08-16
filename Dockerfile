FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl
RUN npm install -g pnpm@9

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

RUN apk add --no-cache openssl
RUN npm install -g tsx prisma

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

COPY --from=builder /app/.output ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY docker-entrypoint.sh ./

RUN chmod +x ./docker-entrypoint.sh && \
    mkdir -p /app/public/uploads && \
    chown -R nuxtjs:nodejs /app

USER nuxtjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
