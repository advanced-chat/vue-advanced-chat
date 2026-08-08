import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../docs/**/*.mdx'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-mcp',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: {
        plugin: 'vue-component-meta',
        tsconfig: 'tsconfig.lib.json',
      },
    },
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      // Honored by GitHub Pages deploy where the site lives under
      // `/vue-advanced-chat/`. Default keeps local dev at `/`.
      base: process.env.STORYBOOK_BASE_URL ?? '/',
      build: {
        // Storybook docs bundles vendor-heavy preview assets that exceed Vite's
        // default generic warning threshold without indicating a product build issue.
        chunkSizeWarningLimit: 1200,
      },
    }),
}
export default config
