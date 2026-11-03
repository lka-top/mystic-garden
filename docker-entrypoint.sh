#!/bin/sh
set -e

echo "Starting LuoKai Garden..."

if [ "${RUN_SEED:-false}" = "true" ] && [ ! -f /app/.seed_done ]; then
  if [ -z "${DATABASE_URL:-}" ]; then
    echo "RUN_SEED requires DATABASE_URL" >&2
    exit 1
  fi

  # 仅显式启用时初始化数据；表结构由 Spring Boot Flyway 管理。
  echo "Seeding initial blog data..."
  npx tsx prisma/seed.ts
  touch /app/.seed_done
fi

echo "Starting Nuxt 3 server..."
exec node server/index.mjs
