#!/bin/sh
set -e

echo "Starting LuoKai Garden..."

if [ -n "$DATABASE_URL" ]; then
  echo "Syncing database schema with Prisma..."
  npx prisma db push --skip-generate || true
  echo "Seeding initial blog data..."
  npx tsx prisma/seed.ts || true
fi

echo "Starting Nuxt 3 server..."
exec node server/index.mjs
