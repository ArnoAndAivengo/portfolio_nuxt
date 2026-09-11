import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  define: {
    'import.meta.client': JSON.stringify(true),
  },
  test: {
    environment: 'happy-dom',
    include: ['app/**/*.test.ts'],
    exclude: ['node_modules/**', '.output/**', '.nuxt/**', 'e2e/**', 'public/**'],
  },
})
