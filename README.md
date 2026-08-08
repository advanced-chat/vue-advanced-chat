<p align="center">
  <a href="https://github.com/advanced-chat/vue-advanced-chat"><img src="https://img.shields.io/github/stars/advanced-chat/vue-advanced-chat?style=social" alt="GitHub stars"></a>
  <a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/dm/vue-advanced-chat.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/v/vue-advanced-chat.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/l/vue-advanced-chat.svg" alt="license"></a>
</p>

# vue-advanced-chat

A typed Vue 3 chat-UI library: rooms, messages, files, audio, reactions,
replies, edits, typing indicators, themes, localization, and a small set
of composables. Backend-agnostic — you own the data layer.

This repository ships two tracks:

- **`main`** — the stable v2 line. Published as `vue-advanced-chat` on
  npm, currently `2.1.2`. Single web component
  (`<vue-advanced-chat>` + `register()`).
  Most users on Vue 2 / non-Vue hosts should stay here.
- **`develop`** — the V3 rewrite. Published as
  `@advanced-chat/components`; this tree is versioned
  `3.0.0-alpha.5` and remains pre-GA. It contains 28 typed Vue 3
  SFCs plus an official light-DOM web-component entrypoint.

## V3 documentation

The V3 docs site is built from Storybook and deployed from `develop`:

> **<https://advanced-chat.github.io/vue-advanced-chat/>**

It carries the per-component prop / event / slot tables, the prose
guides, the cookbook, and the public API reference. New users on V3
should start with the **Quick Start** page on the docs site.

## Install (V3)

```bash
npm install @advanced-chat/components
```

Vue 3.5+ is a peer dependency.

## Quick example (V3)

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

import { AdvancedChatPlugin } from '@advanced-chat/components'
import '@advanced-chat/components/styles'

createApp(App).use(AdvancedChatPlugin()).mount('#app')
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  AdvancedChat,
  type ChatModel,
  type MessageModel,
  type User,
} from '@advanced-chat/components'

const currentUser: User = { id: 'me', name: 'Alice', status: { state: 'online' } }
const chats = ref<ChatModel[]>([{ id: 'general', name: 'General', users: [currentUser] }])
const messages = ref<MessageModel[]>([])
</script>

<template>
  <AdvancedChat
    :current-user="currentUser"
    :chats="chats"
    :chat="chats[0]"
    :messages="messages"
    :messages-loaded="true"
    :chats-loaded="true"
    height="600px"
    theme="auto"
  />
</template>
```

## Web component (V3)

The framework-independent entrypoint bundles its Vue runtime and
registers `<vue-advanced-chat>` in light DOM on import. Load its
matching stylesheet, then assign objects and arrays as DOM properties
rather than JSON attributes:

```html
<vue-advanced-chat id="chat"></vue-advanced-chat>
<script type="module">
  import '@advanced-chat/components/web-component'
  import '@advanced-chat/components/web-component/styles'

  /** @type {import('@advanced-chat/components/web-component').AdvancedChatHTMLElement} */
  const chat = document.querySelector('#chat')
  chat.currentUser = { id: 'me' }
  chat.chats = [{ id: 'general', name: 'General', users: [] }]
  chat.chat = chat.chats[0]
  chat.messages = []
  chat.chatsLoaded = true
  chat.messagesLoaded = true

  chat.addEventListener('send-message', (event) => {
    console.log(event.detail.content, event.detail.files, event.detail.mentionedUsers)
  })
</script>
```

Importing `@advanced-chat/components/web-component` auto-registers the default
tag with automatic localization. The entrypoint exports
`AdvancedChatHTMLElement`, `AdvancedChatEventMap`, and
`AdvancedChatElementConstructor` so DOM properties and event details are typed.
Event payloads are exposed directly as `CustomEvent.detail`, not wrapped in a
Vue argument array.

`registerAdvancedChat({ tagName, strings, localization })` can register an
alternate tag. Calling it for the default managed tag after auto-registration
updates options for elements mounted after that call; already-mounted elements
keep the localization they were created with. Options are never silently
applied to a tag registered by an unrelated constructor.

Mention selections are serialized into stable `<@id>` tokens in `content` and
the corresponding full users are included in `mentionedUsers` on both
`send-message` and `edit-message`. Pending attachment object URLs are owned and
cleaned up by the library until send/edit; ownership of emitted `localUrl`
values then transfers to the host, which must revoke them when they are no
longer needed.

Transport, persistence, authorization, upload, realtime, and retry policy
remain the host application's responsibility.

For a full working example, the **Quick Start** page on the docs site
walks through the wiring end-to-end. To run a real backend behind it,
see **Cookbook → Backend Integration**.

## Install (v2)

If you're shipping today on `main`, install the stable v2 `2.1.2`
line:

```bash
npm install vue-advanced-chat
```

Use the `main` branch for v2 documentation and the v2-specific issues
listed in [`rewrite/issue-triage.md`](./rewrite/issue-triage.md) for a
rough map of what V3 resolves.

## Development

```bash
npm ci
npm run storybook         # local docs + component playground
npm run verify            # format + types + lint + tests + build + pack + storybook
```

Use Node `22.14.0` or newer (`.nvmrc`).

The full set of `npm run` scripts: `format`, `format:check`, `lint`,
`type-check`, `test`, `test:unit`, `test:storybook`, `test:coverage`,
`build`, `build-storybook`, `verify`, `verify:pack`. `verify` chains
the gates that CI also runs.

## Contributing

Contributions are welcome.

If you're working on `develop`:

- Keep changes aligned with the typed component API in
  [`src/components`](./src/components).
- Add or update Storybook stories for any component change.
- Use `main` as the behavioral reference when porting existing
  features.

For the V3 release process, see [RELEASING.md](./RELEASING.md). The
architecture rationale and parity status live in
[`rewrite/`](./rewrite/README.md). Notable changes are tracked in
[`CHANGELOG.md`](./CHANGELOG.md).

## License

MIT.
