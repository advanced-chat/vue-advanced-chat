import type { Meta, StoryObj } from '@storybook/vue3-vite'

import SvgIcon from './SvgIcon.vue'

const meta = {
  component: SvgIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: [
        'search',
        'add',
        'toggle',
        'menu',
        'close',
        'file',
        'paperclip',
        'close-outline',
        'send',
        'emoji',
        'document',
        'pencil',
        'checkmark',
        'double-checkmark',
        'eye',
        'dropdown',
        'deleted',
        'microphone',
        'audio-play',
        'audio-pause',
      ],
      description: 'Name of the SVG icon to display',
    },
  },
} satisfies Meta<typeof SvgIcon>

export default meta

type Story = StoryObj<typeof meta>

export const SearchIcon: Story = {
  args: {
    name: 'search',
  },
}

export const AddIcon: Story = {
  args: {
    name: 'add',
  },
}

export const ToggleIcon: Story = {
  args: {
    name: 'toggle',
  },
}

export const MenuIcon: Story = {
  args: {
    name: 'menu',
  },
}

export const CloseIcon: Story = {
  args: {
    name: 'close',
  },
}

export const FileIcon: Story = {
  args: {
    name: 'file',
  },
}

export const PaperclipIcon: Story = {
  args: {
    name: 'paperclip',
  },
}

export const CloseOutlineIcon: Story = {
  args: {
    name: 'close-outline',
  },
}

export const SendIcon: Story = {
  args: {
    name: 'send',
  },
}

export const EmojiIcon: Story = {
  args: {
    name: 'emoji',
  },
}

export const DocumentIcon: Story = {
  args: {
    name: 'document',
  },
}

export const PencilIcon: Story = {
  args: {
    name: 'pencil',
  },
}

export const CheckmarkIcon: Story = {
  args: {
    name: 'checkmark',
  },
}

export const DoubleCheckmarkIcon: Story = {
  args: {
    name: 'double-checkmark',
  },
}

export const EyeIcon: Story = {
  args: {
    name: 'eye',
  },
}

export const DropdownIcon: Story = {
  args: {
    name: 'dropdown',
  },
}

export const DeletedIcon: Story = {
  args: {
    name: 'deleted',
  },
}

export const MicrophoneIcon: Story = {
  args: {
    name: 'microphone',
  },
}

export const AudioPlayIcon: Story = {
  args: {
    name: 'audio-play',
  },
}

export const AudioPauseIcon: Story = {
  args: {
    name: 'audio-pause',
  },
}
