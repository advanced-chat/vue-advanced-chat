import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'

import Layout from './Layout.vue'

const meta = {
  component: Layout,
  tags: ['autodocs'],
  args: {
    height: '240px',
    theme: 'light',
  },
} satisfies Meta<typeof Layout>

export default meta

type Story = StoryObj<typeof meta>

export const SlotHeightAndThemeContract: Story = {
  render: (args) => ({
    components: { Layout },
    setup: () => ({ args }),
    template: `
      <Layout v-bind="args">
        <section aria-label="Conversation layout content">
          <h2>Customer escalation</h2>
          <p>Conversation content is rendered through the default slot.</p>
        </section>
      </Layout>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const content = canvas.getByRole('region', { name: 'Conversation layout content' })
    const layout = content.parentElement as HTMLElement

    await expect(canvas.getByRole('heading', { name: 'Customer escalation' })).toBeVisible()
    await expect(content).toHaveTextContent(
      'Conversation content is rendered through the default slot.',
    )
    await expect(layout).toHaveClass('acc-card-window')
    await expect(layout).toHaveStyle({ height: '240px' })
    await expect(layout.style.getPropertyValue('--chat-content-bg-color')).toBe('#f6f7fb')
  },
}
