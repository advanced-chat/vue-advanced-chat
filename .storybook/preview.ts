import type { Preview } from '@storybook/vue3-vite'

import '../src/assets/style.css'

import Layout from '../src/components/Layout.vue'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['auto', 'light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'auto',
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'auto'

      return {
        components: { Layout, story },
        setup () {
          return { theme }
        },
        template: `
          <Layout :theme="theme">
            <story />
          </Layout>
        `,
      }
    },
  ],
}

export default preview
