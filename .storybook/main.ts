import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
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
      build: {
        // Storybook docs bundles vendor-heavy preview assets that exceed Vite's
        // default generic warning threshold without indicating a product build issue.
        chunkSizeWarningLimit: 1200,
      },
    }),
}
export default config
