import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ref, type ConcreteComponent } from 'vue'

import AutocompleteMenu from './AutocompleteMenu.vue'

const suggestions = [
  { id: 'alice', name: 'Alice' },
  { id: 'bob', name: 'Bob' },
  { id: 'charlie', name: 'Charlie' },
]

type Suggestion = (typeof suggestions)[number]

type AutocompleteMenuArgs = {
  items: Suggestion[]
  itemKey?: (item: Suggestion, index: number) => string | number
  selectItem?: boolean | null
  activeUpOrDown?: number | null
  layout?: 'vertical' | 'horizontal'
  ariaLabel?: string
  listboxId?: string
  onCommit?: (item: Suggestion) => void
  'onActivate-item'?: () => void
  'onActive-descendant-change'?: (value: string | null) => void
}

const meta = {
  title: 'Components/AutocompleteMenu',
  component: AutocompleteMenu as unknown as Omit<ConcreteComponent<AutocompleteMenuArgs>, 'props'>,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible suggestion list used by message composer experiences such as user mentions and emoji completion.',
      },
    },
  },
  args: {
    items: suggestions,
    itemKey: (item) => item.id,
    ariaLabel: 'People suggestions',
    listboxId: 'people-suggestions',
    onCommit: fn(),
    'onActivate-item': fn(),
    'onActive-descendant-change': fn(),
  },
  decorators: [
    () => ({
      template:
        '<div style="position: relative; min-height: 260px; max-width: 420px; margin: 0 auto"><story /></div>',
    }),
  ],
  render: (args) => ({
    components: { AutocompleteMenu },
    setup() {
      const navigation = ref<number | null>(null)
      const selectItem = ref(false)

      return {
        args,
        navigation,
        selectItem,
        moveNext: () => {
          navigation.value = navigation.value === 1 ? 2 : 1
        },
      }
    },
    template: `
      <div>
        <button type="button" @click="moveNext">Next suggestion</button>
        <button type="button" @click="selectItem = true">Choose active suggestion</button>
        <AutocompleteMenu
          v-bind="args"
          :active-up-or-down="navigation"
          :select-item="selectItem"
        >
          <template #default="{ item }">
            <span style="display: block; padding: 8px 10px">{{ item.name }}</span>
          </template>
        </AutocompleteMenu>
      </div>
    `,
  }),
} satisfies Meta<AutocompleteMenuArgs>

export default meta

type Story = StoryObj<typeof meta>

export const PeopleSuggestions: Story = {
  name: 'People suggestions',
  args: {
    items: suggestions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const listbox = canvas.getByRole('listbox', { name: 'People suggestions' })
    const options = within(listbox).getAllByRole('option')

    await expect(options[0]).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Next suggestion' }))
    await expect(options[1]).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Choose active suggestion' }))
    await expect(args.onCommit).toHaveBeenCalledWith(suggestions[1])
  },
}

export const HorizontalSuggestions: Story = {
  name: 'Horizontal suggestions',
  args: {
    items: suggestions,
    layout: 'horizontal',
  },
}
