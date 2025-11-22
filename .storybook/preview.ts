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
      const skipLayout = context.parameters.skipLayout || false

      if (skipLayout) {
        return {
          template: `<story/>`,
        }
      }

      const height = context.parameters.height

      const theme = context.globals.theme || 'auto'

      return {
        components: { Layout, story },
        setup() {
          return { height, theme }
        },
        template: `
          <Layout :height="height" :theme="theme">
            <story/>
          </Layout>
        `,
      }
    },
  ],
  args: {
    users: [
      { id: 1, displayName: 'Alice' },
      { id: 2, displayName: 'Bob' },
      { id: 3, displayName: 'Charlie' },
    ],
    chats: [
      { id: 1, name: 'Alice', lastMessage: 'Hey there!' },
      { id: 2, name: 'Bob', lastMessage: "What's up?" },
      { id: 3, name: 'Charlie', lastMessage: 'See you soon.' },
    ],
  },
}

export default preview
