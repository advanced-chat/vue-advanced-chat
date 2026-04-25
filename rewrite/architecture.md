# V3 Architecture

The V3 rewrite changes how the library is consumed. This document
captures what's deliberately different from v2 and the contract V3
exposes.

## What V3 changes vs v2

| Concern | v2 (`main`) | V3 (`develop`) |
|---|---|---|
| Package name | `vue-advanced-chat` | `@advanced-chat/components` |
| Distribution | Single web component, `register()` | Individual Vue 3 components |
| Encapsulation | Custom Element + Shadow DOM | Plain Vue SFCs, light DOM |
| Props | All scalar; arrays/objects via `JSON.stringify` | Native typed objects/arrays |
| Events | Kebab-case web component events | Native Vue events |
| Slot identifiers | `name="message_<id>"` strings | Same pattern, native Vue slots |
| Bundling | UMD + ES, CSS embedded in JS | UMD + ES, CSS as separate file |
| Styling | `styles` JSON prop, hard-coded breakpoints | CSS variables + composable subcomponents |
| Theming | `theme="light" | "dark"` | `theme="light" | "dark" | "auto"` plus override object |
| Localization | `text-messages` prop | `AdvancedChatPlugin({ strings })` |
| TypeScript | Hand-written `.d.ts` for one component | `vite-plugin-dts` per-component declarations |
| Tooling | Vite 2 + custom build | Vite 7, Storybook 10, Vitest browser tests |

## The breaking changes

These all bake into the V3 surface and need a migration entry:

1. **`register()` is gone.** Consumers `import { AdvancedChat } from '@advanced-chat/components'` and use it like any other Vue component. The Custom Element bridge is not shipped.
2. **Props take real values.** `:rooms="rooms"` (an array) instead of `:rooms="JSON.stringify(rooms)"`. Resolves [#553](https://github.com/advanced-chat/vue-advanced-chat/issues/553), [#445](https://github.com/advanced-chat/vue-advanced-chat/issues/445).
3. **Schema rename.** v2's domain types changed:
   - `roomId` → `id`, `roomName` → `name`, `users` (unchanged), `avatar` → `icon`
   - `message._id` → `message.id`, `senderId` → `sender` (full `User` object), `timestamp` removed in favor of `createdAt`, `replyMessage` → `reply`, `seen` → `read`, `distributed` → `delivered`
   - `User` shape simplified (no `username`, just `name`); `status.lastChanged` → `status.lastActiveAt`
4. **Localization moves to plugin.** `app.use(AdvancedChatPlugin({ strings }))` replaces the per-instance `text-messages` prop. String keys are dotted (e.g. `chats.empty`, `chat.user.is-online`).
5. **CSS is shipped separately.** `import '@advanced-chat/components/styles'` instead of styles being embedded in the JS bundle. Lets consumers override CSS variables and individual component classes.
6. **No bundled emoji recorder.** The `lamejs` MP3 encoder used in v2 is dropped from the default bundle. Audio recording is exposed as the optional `AudioControl` integration; consumers wire it up to whatever capture API they want.
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

### Exported plugin

`AdvancedChatPlugin({ localization?, strings? })` provides a global
strings dictionary via Vue's `provide`/`inject`. Components consume it
through `useLocalizationStrings()`. There is no per-instance string
override prop — apps inject the strings they want once.

### Exported style entry

`@advanced-chat/components/styles` resolves to the bundled CSS file
(`dist/components.css`). It loads the global Tailwind base, helper
classes, animations, and markdown styles. CSS custom properties on
the root `Layout` element drive theming.

## Theming

Themes are a `Styles` map of CSS custom properties. The `Layout`
component computes the active map via `getThemeStyles(theme)`:

- `theme="light"` → built-in light palette
- `theme="dark"` → built-in dark palette
- `theme="auto"` → matches `prefers-color-scheme` at runtime
- `theme={ base: 'light' | 'dark', overrides: Partial<Styles> }`
  → deep-merge overrides onto the base palette

Every visible color, border, and background is variable-driven. There
is no `styles` prop and no inline `<style>` injection.

## Layout responsibilities

- `AdvancedChat` is opinionated: it owns the Chats↔Chat split, mobile
  toggle, default empty state. Consumers who want different layout drop
  it and compose `Chats` + `Chat` themselves.
- `Chat` owns message-list scroll, message selection state, and the
  preview lightbox. It does not own pagination — consumers drive
  `messages` via the `loadingMessages` prop and `fetch-messages` event.
- `Chats` owns local search filtering and infinite-scroll wiring via
  IntersectionObserver. Consumers drive `chats`, `loadingChats`,
  `chatsLoaded`.
- `ChatFooter` owns input state (text, files, reply/edit). It emits
  `send-message` / `edit-message` with the assembled payload; it does
  not perform uploads. Consumers handle the actual transport.

## SSR

V3 components use `window`, `document`, and `IntersectionObserver` in
several places (theme detection, click-outside, infinite scroll,
emoji picker DOM injection). They are intended for client-rendered
mounting points. SSR-friendly behavior (no-op on server, hydrate on
mount) is on the post-3.0 roadmap (#451, #528). Until then, Nuxt
consumers should wrap with `<ClientOnly>`.

## Out of scope for 3.0

- Virtual scroll / windowing for very large message histories ([#261](https://github.com/advanced-chat/vue-advanced-chat/issues/261), [#342](https://github.com/advanced-chat/vue-advanced-chat/issues/342)).
- Server-side rendering ([#451](https://github.com/advanced-chat/vue-advanced-chat/issues/451), [#528](https://github.com/advanced-chat/vue-advanced-chat/issues/528)).
- Built-in audio recording / MP3 encoder.
- Built-in emoji-picker localization ([#536](https://github.com/advanced-chat/vue-advanced-chat/issues/536)).
- WebRTC / phone integration ([#561](https://github.com/advanced-chat/vue-advanced-chat/pull/561)).
