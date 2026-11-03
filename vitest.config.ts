import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts']
  },
  resolve: {
    alias: {
      '~/server': fileURLToPath(new URL('./server', import.meta.url)),
      '~/types': fileURLToPath(new URL('./shared/types', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url))
    }
  }
})
