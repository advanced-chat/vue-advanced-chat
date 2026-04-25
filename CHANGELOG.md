# Changelog

This file tracks notable changes to `@advanced-chat/components`. The
package is the V3 successor of the original `vue-advanced-chat`. See
`rewrite/architecture.md` for the broader context behind V3 and
`rewrite/parity-checklist.md` for the v2 → V3 mapping.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- `Chat` and `AdvancedChat` now wire message pagination: a `fetch-messages`
  event fires when the message list scrolls to within 60 px of the top
  (suppressed while `loadingMessages` or `messagesLoaded` is true).
- `Chat` auto-scrolls to the latest message on mount, on chat switch,
  on send, and when receiving a new message while the user is already
  near the bottom. When the user has scrolled away, a "scroll to
  latest" pill (with a count badge of `message.new` items) appears.
- `Chat.messagesLoaded` and `AdvancedChat.messagesLoaded` props short-
  circuit pagination once every available message has been delivered.
- New string `chat.scroll-to-bottom` for the pill's accessible label.
- `src/index.ts` aggregates per-component `*Props` / `*Events`
  interfaces (and `ChatHeaderMessageSelection`, `ChatFileItem`,
  `Theme`, `Styles`, `Strings`, `Localization`, etc.) so consumers
  writing wrapper components don't have to deep-import.
- `REPLY_ACTION` and `EDIT_ACTION` constants exported from the
  package (plus the `BuiltInActionName` type) so consumers don't
  rely on magic strings.

### Changed

- **Breaking**: event names normalized to kebab-case.
  `opened:file` → `open-file`, `clicked:user-tag` → `click-user-tag`
  on `MessageActions`, `Message`, `MessageFile`, `MessageFiles`,
  `MessageTemplate`, `ChatMessage`, `Chat`, and `AdvancedChat`.
- **Breaking**: `Chats.chatsLoaded` now follows v2's
  `rooms-loaded` semantics (true means "all chats delivered, stop
  fetching"). The previous inverted check made `fetch-more-chats`
  unreachable through the watch path.
- The chats watch is now `immediate: true` and re-orders the
  `loadingMoreChats` watcher so the initial pass through
  `loadMoreChats` correctly emits both `fetch-more-chats` and
  `loading-more-chats: true`.
- All `vClickOutside` directive usages migrated from the internal
  fork to `@vueuse/components`'s `vOnClickOutside`. Removes
  `src/utils/on-click-outside.ts` (~200 LOC).
- All five `// @ts-nocheck` files in `src/utils` are typed cleanly:
  `deep-merge`, `filter-items`, `text-formatter/autolink`,
  `text-formatter/underline`, `text-formatter/user-tag`. New
  `text-formatter/types.d.ts` augments `micromark-util-types` with
  the custom token names this library emits.

### Removed

- **Breaking**: dropped `@tailwindcss/vite` and `tailwindcss` as
  dependencies. The library never used Tailwind utility classes;
  the import in `src/assets/style.css` was shipping a Tailwind
  preflight in `dist/components.css` for no consumer benefit. CSS
  bundle now 31.77 kB / 5.83 kB gzipped (down from 37.20 / 7.48).
- Removed the internal `src/utils/on-click-outside.ts` fork.

## 3.0.0-alpha.1

### Added

- `Chats` exposes `chatActions`, `customSearchEnabled`, and emits
  `chat-action-handler` with `{ chat, action }`.
- `ChatFooter` exposes `acceptedFiles`, `multipleFiles`, `captureFiles`,
  emits `focus-textarea` / `blur-textarea`, `reset-reply-message`,
  `reset-edit-message`. The textarea now renders a cancel-edit button
  by default when in edit mode.
- `Chat` exposes `showNewMessagesDivider`, `acceptedFiles`,
  `multipleFiles`, `captureFiles`. It now wires `reply` and `edit`
  message actions through to `ChatFooter` so the footer pre-fills
  state on click. `Chat` also re-emits `open-failed-message`.
- `AdvancedChat` exposes `chatsLoaded`, `chatActions`,
  `messageSelectionActions`, `showSearch`, `showAddChat`, `showFiles`,
  `showEmojis`, `showFooter`, `showSendIcon`, `showReactionEmojis`,
  `showNewMessagesDivider`, `acceptedFiles`, `multipleFiles`,
  `captureFiles`, `customSearchEnabled`, `chatInfoEnabled`. It now
  forwards every consumer-facing event from the underlying `Chats`
  and `Chat` components.
- `Message` renders the `system` message variant, the `edited` pencil
  indicator, and respects `disableActions` / `disableReactions`.
- `useThemeStyles(theme)` composable: reactive `Styles` ref that
  follows `prefers-color-scheme` changes when `theme === 'auto'`.
- New strings: `chat.empty`, `chat.messages.empty`, `chat.messages.new`,
  `chat.message.placeholder`, `chat.message.deleted`,
  `chat.message.failure`, `chat.cancel-reply`, `chat.cancel-edit`.
- New theme variables `--chat-message-color-failure` and
  `--chat-message-bg-color-failure` for the retry pill.
- Storybook variants for `Chat` (Loading, Empty, NoChatSelected),
  `Chats` (Loading, Empty, WithActions), and `Message`
  (OwnEdited, Reply, AudioOnly, Deleted, System, Failure).
- Comprehensive Playwright interaction tests via Storybook + Vitest:
  229 tests covering 35 test files (input/footer typing/keyboard nav,
  reply/edit flow, message actions/reactions/menu opens, chat list
  selection/search/actions, audio scrub, media preview close, and
  end-to-end AdvancedChat flows). Combined with unit tests for
  utilities, models, theme, plugin, and text-formatter, the suite
  reaches 86.07% statements / 79.1% branches / 84.51% functions /
  87.78% lines via `npm run test:coverage`.
- New `npm run test:coverage` and `npm run test:unit` scripts; the
  default `npm run test` runs both suites.
- `rewrite/` working directory: architecture, V2 catalog, parity
  checklist, GitHub issue triage, and release plan documents.

### Changed

- `vue` moved from `dependencies` to `peerDependencies`
  (`^3.5.0`) so consumers don't double-bundle Vue.
- Light-theme placeholder / muted-text colors darkened to meet
  WCAG 4.5:1 contrast on default backgrounds.
- `Chats` local search is now wired by default. The previous
  `search-chat` event still fires; pass `customSearchEnabled` to
  fully delegate filtering to the consumer.
- `ChatsItem` renders the chat last-message timestamp using locale
  formatting (time-of-day on the same day, short month/day otherwise).
- `ChatHeader` formats `status.lastActiveAt` with locale formatting.

### Fixed

- `MessageActions` is now a chip floating below the message bubble
  instead of being positioned absolutely over the message content.
  The reaction picker and dropdown menu no longer overlap text in
  short messages, audio summaries, or failed messages, and the
  reaction/menu popups open upward so they don't push off-screen.
- The `edited` pencil indicator is now rendered at a usable size
  (12px) with theme-driven fill so it reads clearly in both themes.
- The failure indicator is now a proper retry pill ("Failed to send.
  Tap to retry.") with theme-aware colors via
  `--chat-message-color-failure` / `--chat-message-bg-color-failure`,
  replacing the tiny red `!` character that was nearly invisible.
- `ChatsItem` no longer renders the dropdown chevron when the row has
  no actions configured (previously the chevron showed for empty
  arrays because the `v-if` accepted any truthy value).
- `MessageFile` image attachments now have an explicit width/height
  CSS rule and a sensible JS default for `maxHeight`. Previously the
  image collapsed to 0 height when `clientWidth` was 0 at mount.
- Click on the search box in `Chats` now actually filters the chat
  list (previously `filter` was never updated).
- Chat-row dropdown actions now fire and bubble up through `Chats`
  (previously the event was emitted by `ChatsItem` but swallowed by
  `Chats`).
- Replying to or editing a message now pre-fills `ChatFooter` state
  end-to-end (previously the consumer had to manually thread state
  back into props).
- `MessageTemplate` now renders message text content even when
  `formattingOptions.markdown` is `false`. Reply quotes and chat-list
  last-message previews were silently empty because the previous
  `v-if="part.markdown"` guard hid the rendered output.
- `MessageTemplate.formattingOptions` partial overrides now merge with
  defaults instead of replacing them, so passing `{ singleLine: true }`
  no longer silently disables markdown rendering.
- Transitive `micromark-*` packages used by the markdown formatter
  are now declared in `dependencies` so consumer installs resolve
  the typings without relying on hoisted transitive resolution.

## 3.0.0-alpha.0

Initial alpha tag of the V3 rewrite. See git history on `develop`
prior to this changelog being introduced.
