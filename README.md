<p align="center">
  <a href="https://github.com/advanced-chat/vue-advanced-chat"><img src="https://img.shields.io/github/stars/advanced-chat/vue-advanced-chat?style=social" alt="GitHub stars"></a>
  <a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/dm/vue-advanced-chat.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/v/vue-advanced-chat.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/l/vue-advanced-chat.svg" alt="license"></a>
</p>

# vue-advanced-chat

`vue-advanced-chat` is a customizable chat UI project built for real-world applications.

It provides rooms, messages, media attachments, audio, reactions, formatting, themes, and flexible UI composition while staying backend-agnostic.

## Features

- Backend agnostic chat UI
- Rooms list and active conversation layout
- Text, files, media, audio, reactions, and reply flows
- Typing indicators, unread states, and message actions
- Light, dark, and auto theme modes
- Localization support
- Flexible component composition for custom integrations

## Demo

- Live demo: `https://advanced-chat.github.io/vue-advanced-chat`
- Sandbox integrations: `https://github.com/advanced-chat/vue-advanced-chat-sandbox`

## Installation

For the stable public package:

```bash
npm install vue-advanced-chat
```

## Usage

If you are using the stable public package, use the documentation on the `main` branch.

This `develop` branch is the in-progress Vue 3 + TypeScript rewrite. It currently builds the next library surface as:

```bash
npm install @advanced-chat/components
```

Example rewrite usage:

```ts
import { createApp } from 'vue'
import App from './App.vue'

import { AdvancedChatPlugin } from '@advanced-chat/components'
import '@advanced-chat/components/styles'

const app = createApp(App)

app.use(
  AdvancedChatPlugin({
    strings: {
      'chats.search.placeholder': 'Search conversations',
    },
  }),
)

app.mount('#app')
```

```vue
<script setup lang="ts">
import { AdvancedChat } from '@advanced-chat/components'
import type { Chat, Message, User } from '@advanced-chat/components'

const currentUser: User = {
  id: 1,
  name: 'Alice',
  status: { state: 'online' },
}

const chats: Chat[] = [
  {
    id: 1,
    name: 'General',
    users: [currentUser],
  },
]

const messages: Message[] = [
  {
    id: 1,
    sender: currentUser,
    content: 'Hello world',
    createdAt: new Date().toISOString(),
  },
]
</script>

<template>
  <AdvancedChat
    :user="currentUser"
    :chats="chats"
    :chat="chats[0]"
    :messages="messages"
    height="600px"
    theme="light"
  />
</template>
```

## Project Status

This repository currently has two main tracks:

- `main`: the stable `2.x` line and the package most users should rely on today
- `develop`: the in-progress rewrite for the next major version

If you need the production-ready package and stable documentation, use `main`.

If you are contributing to the rewrite, use `develop`.

## Rewrite Exports

### Components

- `AdvancedChat`
- `Chats`
- `ChatsSearch`
- `ChatsItem`
- `Chat`
- `ChatHeader`
- `ChatFooter`
- `ChatMessage`
- `Message`
- `MessageTemplate`
- `MessageReply`
- `MessageFile`
- `MessageFiles`
- `MessageActions`
- `MessageReactions`
- `MediaPreview`
- `AudioPlayer`
- `AudioControl`
- `EmojiPicker`
- `Loader`
- `ProgressBar`
- `SvgIcon`

### Types

- `Chat`
- `ChatReference`
- `Message`
- `MessageReference`
- `MessageFile`
- `User`
- `UserReference`
- `Action`
- `Id`

## Development

```bash
npm install
```

Run Storybook:

```bash
npm run storybook
```

Build the library:

```bash
npm run build
```

Run type checks:

```bash
npm run type-check
```

Build Storybook:

```bash
npm run build-storybook
```

Format source files:

```bash
npm run format
```

## Contributing

Contributions are welcome.

If you are working on `develop`:

- keep changes aligned with the typed component API in `src/components`
- add or update Storybook stories for component work
- use `main` as the behavioral reference when porting existing features
- avoid presenting rewrite-only APIs as if they are already the stable public interface

## Notes

- This repository is public and should stay clear for users, contributors, and maintainers.
- The stable public npm package remains `vue-advanced-chat`.
- The rewrite branch currently uses `@advanced-chat/components` in local package metadata as part of the migration work.

## License

This project is licensed under the MIT License.
