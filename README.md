<p align="center">
  <a href="https://github.com/advanced-chat/advanced-chat-components"><img src="https://img.shields.io/github/stars/advanced-chat/advanced-chat-components?style=social" alt="GitHub stars"></a>
  <a href="https://www.npmjs.com/package/@advanced-chat/components"><img src="https://img.shields.io/npm/dm/%40advanced-chat%2Fcomponents.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/@advanced-chat/components"><img src="https://img.shields.io/npm/v/%40advanced-chat%2Fcomponents/next.svg" alt="npm next version"></a>
  <a href="https://www.npmjs.com/package/@advanced-chat/components"><img src="https://img.shields.io/npm/l/%40advanced-chat%2Fcomponents.svg" alt="license"></a>
</p>

# Advanced Chat Components

A framework-neutral chat web component and typed Vue 3 component library:
rooms, messages, files, audio, reactions, replies, edits, typing indicators,
themes, localization, and composables. Backend-agnostic — you own the data layer.

This repository contains the release-candidate line of Advanced Chat
Components:

- **V3 release candidate** — published as
  `@advanced-chat/components@3.0.0-rc.1` on the npm `next` tag. It contains 28
  typed Vue 3 SFCs plus an official light-DOM web-component entrypoint. The
  package is ESM-only; a browser-only UMD artifact remains available through
  the CDN metadata.
- **Legacy v2** — published as `vue-advanced-chat@2.1.2`. Existing v2
  applications can continue using that stable package; its source is retained
  on the [`v2`](https://github.com/advanced-chat/advanced-chat-components/tree/v2)
  branch. V3 is not a drop-in replacement.

## V3 documentation

The V3 docs site is built from Storybook and deployed from the default branch:

> **<https://advanced-chat.github.io/advanced-chat-components/>**

It carries the per-component prop / event / slot tables, the prose
guides, the cookbook, and the public API reference. New users on V3
should start with the **Quick Start** page on the docs site.

## Install (V3)

```bash
npm install @advanced-chat/components@next
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
registers `<advanced-chat-components>` in light DOM on import. Load its
matching stylesheet, then assign objects and arrays as DOM properties
rather than JSON attributes:

```html
<advanced-chat-components id="chat"></advanced-chat-components>
<script type="module">
  import '@advanced-chat/components/web-component'
  import '@advanced-chat/components/web-component/styles'

  /** @type {import('@advanced-chat/components/web-component').AdvancedChatHTMLElement} */
  const chat = document.querySelector('#chat')
  chat.currentUser = { id: 'me', name: 'Alice', status: { state: 'online' } }
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
Vue argument array. Public events bubble and cross shadow boundaries, so hosts
can use event delegation.

For applications that control registration or render on the server, import the
side-effect-free core entrypoint:

```ts
import {
  registerAdvancedChat,
  type AdvancedChatHTMLElement,
} from '@advanced-chat/components/web-component/core'
import '@advanced-chat/components/web-component/styles'

if (typeof window !== 'undefined') {
  registerAdvancedChat({ tagName: 'acme-chat' })
}
```

The package includes a standards-based `custom-elements.json` manifest for IDE
completion and custom-element-aware tooling. Vanilla JavaScript, React,
Angular, Svelte, and other framework examples are in the **Web Components**
page on the documentation site.

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

To stay on the stable v2 `2.1.2` line:

```bash
npm install vue-advanced-chat
```

Use the `v2` branch for v2 source and documentation. The v2-specific issues
listed in [`rewrite/issue-triage.md`](./rewrite/issue-triage.md) provide a rough
map of what V3 resolves.

## Development

```bash
npm ci
npm run storybook         # local docs + component playground
npm run verify            # format + types + lint + tests + build + pack + storybook
```

Use Node `22.14.0` or newer (`.nvmrc`).

Key `npm run` scripts include `format`, `format:check`, `lint`, `type-check`,
`test`, `test:unit`, `test:storybook`, `test:coverage`, `build`,
`build-storybook`, `verify`, `verify:pack`, and `verify:web-component`.
`verify` chains the release gates that CI also runs.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup,
branch, testing, and pull-request expectations. Usage questions belong in
[GitHub Discussions](https://github.com/advanced-chat/advanced-chat-components/discussions/categories/q-a),
and vulnerabilities must follow [SECURITY.md](./SECURITY.md).

For the V3 release process, see [RELEASING.md](./RELEASING.md). The
architecture rationale and parity status live in
[`rewrite/`](./rewrite/README.md). Notable changes are tracked in
[`CHANGELOG.md`](./CHANGELOG.md).

## License

MIT. Bundled dependency notices are listed in
[THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).
