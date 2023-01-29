import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

export default defineConfig({
  optimizeDeps: { exclude: ['capacitor-voice-recorder'] },
  plugins: [vue(
    {
      refTransform: true,
      customElement: true,
      reactivityTransform: resolve(__dirname, 'src'),
    })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.js'),
      name: 'vue-advanced-chat'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
