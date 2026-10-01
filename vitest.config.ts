import path from 'node:path'
import process from 'node:process'
import { parseJson } from '@dcloudio/uni-cli-shared'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      // pages.json 是包含生成注释的 JSONC，测试复用 uni-app 的解析器。
      name: 'test-pages-jsonc',
      enforce: 'pre',
      transform(code, id) {
        if (id.split('?')[0] !== path.resolve(process.cwd(), 'src/pages.json')) return
        return { code: JSON.stringify(parseJson(code, true, 'pages.json')), map: null }
      },
    },
    vue(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'src/uni_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@img': path.resolve(process.cwd(), 'src/static/images'),
    },
  },
})
