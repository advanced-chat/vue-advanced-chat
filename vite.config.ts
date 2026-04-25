/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import vueDevTools from 'vite-plugin-vue-devtools'

import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

const npmLifecycleEvent = process.env.npm_lifecycle_event || ''
const isVitestStorybookProcess =
  process.env.VITEST === 'true' &&
  (npmLifecycleEvent === 'test' ||
    npmLifecycleEvent === 'test:storybook' ||
    npmLifecycleEvent === 'test:coverage' ||
    npmLifecycleEvent === 'test:unit' ||
    npmLifecycleEvent === 'verify')
const isStorybookProcess =
  npmLifecycleEvent === 'storybook' ||
  npmLifecycleEvent === 'build-storybook' ||
  isVitestStorybookProcess

export default defineConfig({
  plugins: [
    vue(),
    !isStorybookProcess &&
      dts({
        tsconfigPath: './tsconfig.lib.json',
        exclude: ['**/*.stories.ts'],
        copyDtsFiles: true,
      }),
    !isStorybookProcess && vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueAdvancedChat',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.stories.ts',
        'src/**/*.spec.ts',
        'src/**/stories.fixtures.ts',
        'src/index.ts',
        'src/styles.d.ts',
        'src/assets/**',
        // Type-only modules — no runtime code to cover
        'src/models/index.ts',
        'src/models/id.ts',
        'src/models/action.ts',
        'src/models/message.ts',
        'src/utils/deep-partial.ts',
        'src/plugin/symbols.ts',
      ],
    },
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.spec.ts'],
        },
      },
    ],
  },
})
