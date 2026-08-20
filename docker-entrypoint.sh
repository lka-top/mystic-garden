#!/bin/sh
set -e

echo "Starting LuoKai Garden..."

if [ -n "$DATABASE_URL" ]; then
  echo "Applying database migrations with Prisma..."
  npx prisma db push || echo "Warning: DB push failed, continuing startup..."

  # 仅在首次部署时运行 seed（通过标记文件判断）
  if [ ! -f /app/.seed_done ] && [ "$RUN_SEED" = "true" ]; then
    echo "Seeding initial blog data..."
    npx tsx prisma/seed.ts || echo "Warning: Seed failed, continuing startup..."
    touch /app/.seed_done
  fi
fi

echo "Starting Nuxt 3 server..."
exec node server/index.mjs
