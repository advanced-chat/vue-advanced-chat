import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'decode-named-character-reference': fileURLToPath(
        new URL('./node_modules/decode-named-character-reference/index.js', import.meta.url),
      ),
    },
  },
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/web-component.ts'),
      name: 'VueAdvancedChatElement',
      formats: ['es'],
      fileName: () => 'vue-advanced-chat.js',
      cssFileName: 'vue-advanced-chat',
    },
  },
})
