# V3 Architecture

The V3 rewrite changes how the library is consumed. This document
captures what's deliberately different from v2 and the contract V3
exposes.

## What V3 changes vs v2

| Concern       | v2 (`main`, stable 2.1.2)                   | V3 (`develop`, pre-GA alpha.5)                                            |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| Package name  | `vue-advanced-chat`                         | `@advanced-chat/components`                                               |
| Distribution  | Single web component, explicit `register()` | 28 typed Vue SFCs plus bundled auto-registering web component             |
| Encapsulation | Custom Element + Shadow DOM                 | Light DOM for Vue and custom-element surfaces                             |
| Props         | Arrays/objects commonly JSON-stringified    | Native typed values; custom-element hosts assign DOM properties           |
| Events        | Web-component custom events                 | Typed Vue events or typed direct `CustomEvent.detail`                     |
| Slots         | String-named custom-element slots           | Native Vue slots on component surfaces                                    |
| Bundling      | UMD + ES, CSS embedded in JS                | Component and bundled web-component builds, separate CSS entrypoints      |
| Styling       | `styles` JSON prop, hard-coded breakpoints  | Typed CSS variables, normal CSS, container-observed primary mobile layout |
| Theming       | `light` / `dark`                            | `light` / `dark` / reactive `auto` plus override object                   |
| Localization  | `text-messages` prop                        | `AdvancedChatPlugin({ strings })` or web-component registration options   |
| TypeScript    | Hand-written declaration for one component  | Per-component declarations plus typed HTMLElement/event map               |
| Tooling       | Vite 2 + custom build                       | Vite 7, Storybook 10, Vitest browser tests                                |

## The breaking changes

These all bake into the V3 surface and need a migration entry:

1. **Vue is the primary API; a web-component boundary is also shipped.** Vue consumers import `AdvancedChat` directly. Framework-independent hosts import `@advanced-chat/components/web-component`, which registers a bundled light-DOM `<vue-advanced-chat>` element and accepts complex values as DOM properties.
2. **Props take real values.** `:rooms="rooms"` (an array) instead of `:rooms="JSON.stringify(rooms)"`. Resolves [#553](https://github.com/advanced-chat/vue-advanced-chat/issues/553), [#445](https://github.com/advanced-chat/vue-advanced-chat/issues/445).
3. **Schema rename.** v2's domain types changed:
   - `roomId` → `id`, `roomName` → `name`, `avatar` stays `avatar`
   - `message._id` → `message.id`, `senderId` → `sender` (full `User`),
     `timestamp` → `createdAt`, `replyMessage` → `reply`, and delivery
     booleans → one `status` enum
   - `User._id` → `id`, `username` → `name`, and
     `status.lastChanged` → `status.lastActiveAt`
4. **Localization moves to plugin.** `app.use(AdvancedChatPlugin({ strings }))` replaces the per-instance `text-messages` prop. String keys are dotted (e.g. `chats.empty`, `chat.user.is-online`).
5. **CSS is shipped separately.** `import '@advanced-chat/components/styles'` instead of styles being embedded in the JS bundle. Lets consumers override CSS variables and individual component classes.
6. **No bundled audio recorder.** The v2 capture flow and MP3 encoder are
   deliberately removed. `AudioPlayer` and `AudioControl` are playback and
   scrubber components, not recording hooks. Hosts that need capture own that
   UI, permission flow, encoding, and upload.
7. **The wrapper isn't required.** `AdvancedChat` is the convenience composition. Consumers can import `Chats`, `Chat`, `ChatHeader`, `ChatFooter`, `Message`, etc. directly and wire their own layout. Resolves [#166](https://github.com/advanced-chat/vue-advanced-chat/issues/166), [#570](https://github.com/advanced-chat/vue-advanced-chat/issues/570), [#549](https://github.com/advanced-chat/vue-advanced-chat/pull/549).

## Public contract

### Exported components

Composition is layered. From outermost to innermost:

```
AdvancedChat              — Layout + Chats + Chat
├─ Layout                 — height, theme, CSS-vars wrapper
├─ Chats                  — sidebar list of conversations
│  ├─ ChatsSearch         — search/add bar
│  └─ ChatsItem           — single chat row
└─ Chat                   — the active conversation surface
   ├─ ChatHeader          — name + status + menu actions + selection toolbar
   ├─ ChatMessage         — single rendered message + date divider
   │  └─ Message          — bubble + reply + reactions + actions
   │     ├─ MessageReply
   │     ├─ MessageTemplate     — markdown / mention rendering
   │     ├─ MessageFiles
   │     │  └─ MessageFile
   │     ├─ MessageActions
   │     └─ MessageReactions
   ├─ ChatFooter          — textarea + send + emoji + file picker
   │  ├─ ChatEmojis       — `:emoji` autocomplete
   │  ├─ ChatUserTag      — `@user` autocomplete
   │  ├─ AutocompleteMenu — generic suggestion-list primitive
   │  ├─ ChatFiles        — pending uploads
   │  │  └─ ChatFile
   │  └─ EmojiPicker
   ├─ MediaPreview        — fullscreen image/video viewer
   ├─ AudioPlayer         — playback for audio messages
   │  └─ AudioControl     — scrubber primitive
   ├─ Loader
   ├─ ProgressBar
   └─ SvgIcon
```

### Exported types

`Id`, `User`, `UserReference`, `Chat`, `ChatReference`, `Message`,
`MessageReference`, `MessageFile`, `Action`. The `*Reference` shapes
exist so callers can pass minimal `{ id }` objects when full hydration
isn't needed (e.g. `typingUsers`).

`Message.sender` is specifically a full `User`; it is not a reference resolved
from `chat.users`. `currentUser` accepts a `UserReference`, while chat members
are full users for rendering, presence, and mention lookup.

### Exported web component

`@advanced-chat/components/web-component` bundles Vue, builds its component
styles into the separate `web-component/styles` entrypoint, and auto-registers
`<vue-advanced-chat>` in light DOM.
Complex values are DOM properties. `AdvancedChatHTMLElement` and
`AdvancedChatEventMap` type the property/event boundary, and event payloads are
direct `CustomEvent.detail` values.

`registerAdvancedChat()` can register another tag or supply localization
options. For a tag already managed by the entrypoint, later options affect
future mounts only. Existing elements keep their initialized plugin state;
options supplied for a foreign constructor are rejected.

### Exported plugin

`AdvancedChatPlugin({ localization?, strings? })` provides a global
strings dictionary via Vue's `provide`/`inject`. Components consume it
through `useLocalizationStrings()`. There is no per-instance string
override prop — apps inject the strings they want once.

### Exported style entry

`@advanced-chat/components/styles` resolves to the bundled CSS file
(`dist/components.css`). It loads helper classes, animations, and markdown
styles. CSS custom properties on
the root `Layout` element drive theming.

## Theming

Themes are a `Styles` map of CSS custom properties. The `Layout`
component computes the active map via `getThemeStyles(theme)`:

- `theme="light"` → built-in light palette
- `theme="dark"` → built-in dark palette
- `theme="auto"` → matches `prefers-color-scheme` at runtime
- `theme={ base: 'light' | 'dark', overrides: Partial<Styles> }`
  → deep-merge overrides onto the base palette

Most visible colors, borders, and backgrounds are variable-driven.
`Layout.styles` is a final `Partial<Styles>` layer. Message links are a current
exception: `Layout` uses a fixed anchor color/weight rule and does not expose a
`--chat-message-color-link` token. Light-DOM hosts can override the selector.

## Layout responsibilities

- `AdvancedChat` is opinionated: it owns the Chats↔Chat split, mobile
  toggle, default empty state. Consumers who want different layout drop
  it and compose `Chats` + `Chat` themselves.
- `Chat` owns message-list scrolling, top-threshold pagination events,
  prepend position preservation, auto-scroll policy, scroll-to-latest state,
  message selection state, and the preview lightbox. Consumers still fetch and
  supply message pages through props/events.
- `Chats` owns local search filtering and infinite-scroll wiring via
  IntersectionObserver. Consumers drive `chats`, `loadingChats`,
  `chatsLoaded`.
- `ChatFooter` owns input state (text, files, mentions, reply/edit). It emits
  tokenized content, resolved `mentionedUsers`, and pending files; it does not
  perform uploads. It revokes object URLs while pending and transfers ownership
  to the host on send/edit.
- `AdvancedChat` observes its own width for the primary mobile pane switch and
  represents host-controlled operational state. Blocking states replace the
  surface; offline/reconnecting banners preserve it.

## SSR

Browser-only globals are guarded so package import and non-interactive server
rendering do not crash. Full chat-surface hydration remains uncertified,
especially for the emoji custom element and DOM measurement behavior. Nuxt and
other SSR consumers should still wrap complete chat surfaces in a client-only
boundary.

## Out of scope for 3.0

- Virtual scroll / windowing for very large message histories ([#261](https://github.com/advanced-chat/vue-advanced-chat/issues/261), [#342](https://github.com/advanced-chat/vue-advanced-chat/issues/342)).
- Server-side rendering ([#451](https://github.com/advanced-chat/vue-advanced-chat/issues/451), [#528](https://github.com/advanced-chat/vue-advanced-chat/issues/528)).
- Built-in audio recording / MP3 encoder (deliberately removed; playback is
  supported).
- Chat ordering, `/` template autocomplete, and an additional composer action
  (deliberately host-composed rather than built in).
- Configurable mobile breakpoint and auto-open-first-chat policy.
- Dedicated message-link theme token.
- Built-in emoji-picker localization ([#536](https://github.com/advanced-chat/vue-advanced-chat/issues/536)).
- WebRTC / phone integration ([#561](https://github.com/advanced-chat/vue-advanced-chat/pull/561)).
