import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/storybook-static/**',
    '**/*.d.ts',
  ]),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // The single-word component names (`Chat`, `Chats`, `Layout`,
      // `Loader`, `Message`) are deliberate — they're the public API
      // surface re-exported from `src/index.ts`. Renaming them would
      // be a breaking change with no real ergonomics win.
      'vue/multi-word-component-names': 'off',
    },
  },
)
