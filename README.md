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

| Component | Role |
|---|---|
| `AdvancedChat` | All-in-one composition: Layout + Chats + Chat |
| `Layout` | Theme + height wrapper that drives CSS custom properties |
| `Chats` | Sidebar list of conversations (search, infinite-scroll, actions) |
| `ChatsSearch` | Search/add bar embedded in `Chats` |
| `ChatsItem` | Single chat row (avatar, last message, unread badge) |
| `Chat` | Active conversation: header, messages list, footer, media preview |
| `ChatHeader` | Chat name, status, menu actions, message-selection toolbar |
| `ChatFooter` | Textarea + emoji + file picker + reply/edit state |
| `ChatMessage` | Date dividers + new-messages divider around `Message` |
| `Message` | Message bubble: text/files/audio, reply, reactions, actions |
| `MessageTemplate` | Markdown / mention rendering primitive |
| `MessageReply` | Quoted message preview |
| `MessageFile` / `MessageFiles` | Image / video / file attachments |
| `MessageActions` | Per-message dropdown + reaction picker |
| `MessageReactions` | Emoji-reaction pills |
| `MediaPreview` | Fullscreen image/video lightbox |
| `AudioPlayer` / `AudioControl` | Audio playback + scrubber |
| `EmojiPicker` | `emoji-picker-element` wrapper |
| `ChatEmojis` / `ChatUserTag` / `ChatFile` / `ChatFiles` | Footer autocomplete + pending-upload primitives |
| `Loader` / `ProgressBar` / `SvgIcon` | UI primitives |

### Types

- `Chat`, `ChatReference`
- `Message`, `MessageReference`, `MessageFile`
- `User`, `UserReference`
- `Action`, `Id`

### Plugin

- `AdvancedChatPlugin({ localization?, strings? })` — installs the
  string dictionary used by all components.

### Slots

Each public component documents its slots inline in Storybook
autodocs. Notable slots by surface:

| Component | Slot | Default |
|---|---|---|
| `Chat` | `no-chat-selected` | "No chat selected" empty state |
| `Chat` | `composer-typing` (scoped: `typing-users`) | Renders `typingUsers` text when `typingIndicatorPosition` includes `composer` |
| `Chat` | `scroll-icon` | Down-chevron for the scroll-to-latest pill |
| `Chats` | `chats-header` / `chats-search` / `chats-empty` | (default chrome) |
| `ChatHeader` | `chat-header`, `chat-header-avatar`, `chat-header-info`, `chat-options`, `toggle-icon`, `menu-icon` | (default chrome / icons) |
| `ChatFooter` | `reply-close-icon`, `edit-close-icon`, `emoji-picker-icon`, `paperclip-icon`, `send-icon` | Built-in `SvgIcon` graphics |
| `Message` | `deleted-icon_<id>`, `microphone-icon_<id>`, `pencil-icon_<id>`, `checkmark-icon_<id>` | Per-message icon overrides keyed by `message.id` |

`AdvancedChat` does not forward slots — drop down to `Chats + Chat`
when you need slot composition.

### Theming

- `Layout.theme` accepts `'light'`, `'dark'`, `'auto'`, or
  `{ base: 'light' | 'dark', overrides: Partial<Styles> }`.
- `Layout.styles` accepts a `Partial<Styles>` map applied as the
  final layer over the resolved theme — useful for one-off overrides
  on a single mount without forking a theme.
- All visible colors are CSS custom properties on the `Layout` root.
- `'auto'` follows `prefers-color-scheme` reactively.

## Security model

The library treats the data passed in via props as already trusted:
it is rendered into the DOM and into CSS without sanitization. The
host application is responsible for validating user-supplied content
at the boundary where it enters the data layer.

In particular, the following values are interpolated into
`background-image: url('…')` declarations or `<source src>`
attributes:

- `Chat.avatar`, `User.avatar` (rendered by `ChatHeader`,
  `ChatsItem`, `ChatUserTag`)
- `Message.files[].url` and `Message.files[].previewUrl` (rendered
  by `MessageFile`, `MediaPreview`, `MessageReply`)

If any of these can originate from an untrusted source, validate
that they are well-formed `http(s):` / `data:` / `blob:` URLs (and
do not contain `'`, `)`, or newlines that could close the CSS
`url(...)` token) before passing them in. Markdown rendered through
`MessageTemplate` is sanitized by `micromark-extension-gfm-tagfilter`,
which strips `<script>` and event-handler attributes; bring your own
sanitizer if you need stricter guarantees.

## Development

```bash
npm ci
```

Use Node `22.14.0` or newer when working on the V3 package and release workflow.

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

Run the full verification suite:

```bash
npm run verify
```

Build Storybook:

```bash
npm run build-storybook
```

Format source files:

```bash
npm run format
```

Check formatting without mutating files:

```bash
npm run format:check
```

Lint source files without mutating them:

```bash
npm run lint
```

## Contributing

Contributions are welcome.

If you are working on `develop`:

- keep changes aligned with the typed component API in `src/components`
- add or update Storybook stories for component work
- use `main` as the behavioral reference when porting existing features
- avoid presenting rewrite-only APIs as if they are already the stable public interface

For V3 release process and publication rules, see [RELEASING.md](./RELEASING.md).
The architecture, parity status, and upcoming work are documented in
[`rewrite/`](./rewrite/README.md), and notable changes are tracked in
[`CHANGELOG.md`](./CHANGELOG.md).

## Notes

- This repository is public and should stay clear for users, contributors, and maintainers.
- The stable public npm package remains `vue-advanced-chat`.
- The rewrite branch currently uses `@advanced-chat/components` in local package metadata as part of the migration work.

## License

This project is licensed under the MIT License.
