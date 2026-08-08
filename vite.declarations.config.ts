import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const source = (file: string) => fileURLToPath(new URL(`./src/${file}`, import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.lib.json',
      include: ['env.d.ts', 'src/**/*'],
      exclude: [
        'src/**/*.stories.ts',
        'src/**/*.spec.ts',
        'src/**/stories.fixtures.ts',
        'src/styles.d.ts',
      ],
      rollupTypes: true,
      declarationOnly: true,
    }),
  ],
  resolve: {
    alias: {
      '@': source(''),
    },
  },
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    lib: {
      entry: {
        index: source('index.ts'),
        'web-component': source('web-component.ts'),
        'web-component-core': source('web-component-core.ts'),
        styles: source('styles-entry.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
})
