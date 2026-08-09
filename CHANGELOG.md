# Changelog

This file tracks notable changes to `@advanced-chat/components`. The
package is the V3 successor of the original `vue-advanced-chat`. See
`rewrite/architecture.md` for the broader context behind V3 and
`rewrite/parity-checklist.md` for the v2 → V3 mapping.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project follows [Semantic Versioning](https://semver.org/).

Only `3.0.0-alpha.0` was published to npm. The alpha.1 through alpha.5
sections below are retained as internal development milestones that were folded
into the first public release candidate. The `v3.0.0-rc.1` tag failed
pre-publish verification. The `v3.0.0-rc.2` tag passed verification, but npm
rejected its stale pre-rename trusted-publisher identity. Neither was published;
rc.3 supersedes them.

## 3.0.0-rc.3 - 2026-08-09

### Added

- Official `@advanced-chat/components/web-component` entrypoint. Importing it
  auto-registers the light-DOM `<advanced-chat-components>` element and bundles Vue;
  `AdvancedChatHTMLElement`, `AdvancedChatEventMap`, and the constructor type
  provide typed DOM properties and `addEventListener` payloads.
- Side-effect-free `@advanced-chat/components/web-component/core` entrypoint
  with explicit constructor creation and registration, plus a Custom Elements
  Manifest for IDE and framework tooling.
- Browser-level package verification for auto-registration, explicit
  registration, property assignment, packaged styles, rendering, and events.
- Rolled-up public declarations verified against strict TypeScript `Bundler`
  and `NodeNext` consumers, plus a packed-package Vite consumer.
- MIT project licensing, bundled third-party notices, security and support
  policies, contribution guidance, and GitHub issue templates.
- `send-message` and `edit-message` now include deduplicated
  `mentionedUsers: User[]`. Selecting a mention writes a stable `<@id>` token
  into `content`; rendering resolves known ids to names without changing the
  persisted token.
- `AdvancedChat` operational states: blocking `loading`, `empty`, `error`, and
  `permission-denied` panels; non-blocking `offline` and `reconnecting`
  banners; host copy, retry action, and independent composer disabling.
- Container-observed mobile navigation. `AdvancedChat` switches its two-pane
  layout at 768 px based on its own width, hides the list after opening a chat,
  and exposes the header toggle to return to it.

### Changed

- Renamed the component CSS, transition, keyframe, and SVG identifier prefix
  from `vac-` to `acc-`, including the documented light-DOM selectors.
- Made the Node package ESM-only. The browser UMD artifact remains available
  through CDN metadata but is no longer exposed as a CommonJS entry.
- Renamed the V3 project to `advanced-chat-components` while retaining the npm
  package name `@advanced-chat/components`. The default custom-element tag,
  browser globals, bundle filenames, repository metadata, and documentation now
  use the framework-neutral project name.
- Web-component events expose the component payload directly as
  `CustomEvent.detail`; Vue's internal single-argument array wrapper is removed
  at the DOM boundary. Events now also bubble and cross shadow boundaries for
  standards-based delegation.
- Calling `registerAdvancedChat()` with options after default
  auto-registration updates managed registration options for future mounts
  only. Existing elements retain their initialized localization; foreign tag
  registrations reject options rather than discarding them.
- Sending or editing transfers ownership of emitted attachment `localUrl`
  object URLs to the host. The library still revokes URLs for files removed or
  reset while pending; after emission the host must revoke them.
- V3 compatibility records now distinguish stable `vue-advanced-chat@2.1.2`
  from the pre-GA `@advanced-chat/components@3.0.0-rc.3` tree and record the
  deliberate removal of audio recording, room ordering, template
  autocomplete, and the extra composer action.

### Fixed

- Audio playback now follows the native media element's play/pause/end state,
  catches rejected play promises, resets when the source or selection mode
  changes, supports mouse and keyboard scrubbing, and releases listeners on
  unmount. Audio recording remains intentionally out of scope.
- Message pagination preserves the reader's position after history prepends,
  gates duplicate requests, and works with the documented auto-scroll and
  scroll-to-latest behavior.
- Corrected security, theming, SSR, web-component, backend, upload, pagination,
  composable, migration, and API guidance against the shipped implementation.
  In particular, inline theme variables must be overridden through object-form
  `theme` or `Layout.styles`; there is no dedicated link-color token.

## 3.0.0-alpha.5 (internal milestone)

Closes the remaining items on `rewrite/release-plan.md` step 4 — the
last GA gaps before tagging beta. Adds three additive `Chat` /
`ChatFooter` props plus a slot, lights up locale negotiation, and
wires per-component slot autodocs. Each behavior change ships with a
Storybook regression test.

### Added

- `ChatFooter.maxFiles` / `ChatFooter.maxFileSize` props (both
  default `0` = disabled). Files past the cap are rejected with a
  new `invalid-file: { file, reason: 'size' \| 'count' }` event so
  hosts can show their own error UI. Forwarded by `Chat` and
  `AdvancedChat`. Closes
  [#461](https://github.com/advanced-chat/advanced-chat-components/issues/461)
  and
  [#474](https://github.com/advanced-chat/advanced-chat-components/issues/474).
- `Chat.typingIndicatorPosition: 'header' \| 'composer' \| 'both' \|
'none'` (default `'header'`). When the policy includes `composer`,
  `Chat` renders a typing line above `ChatFooter`; the new
  `composer-typing` scoped slot exposes the resolved string. Closes
  [#513](https://github.com/advanced-chat/advanced-chat-components/issues/513).
- `Chat.autoScroll: { onMount?, onChatSwitch?, onSend?, onReceive? }`
  policy prop. Each leg defaults `true` to match the alpha.2
  hard-coded behavior; consumers can opt out per leg without
  rewriting any of the surrounding scroll logic.
- `negotiateLocale()` helper exported from the package. Inspects
  `navigator.language` and returns the closest supported BCP 47
  prefix (`'en'` only today; ready for additional dictionaries to
  land additively). Warns under `import.meta.env.DEV` when the
  detected language has no bundled match.
- `ChatHeader.showTypingIndicator` prop (default `true`) so `Chat`
  can suppress the header's typing line when the policy renders it
  somewhere else.
- `<!-- @slot ... -->` documentation comments on every public slot
  (`Chat`, `Chats`, `ChatHeader`, `ChatFooter`, `Message`).
  Storybook autodocs now lists each slot, its description, and
  scoped slot props where applicable.

### Changed

- `getLocalizationStrings('auto')` now performs real locale
  negotiation rather than returning English unconditionally. The
  observable behavior for English-locale browsers is unchanged; for
  non-English browsers it still resolves to `'en'` but emits a DEV
  warning so the lack of localization is visible in development.

### Fixed

- The `'auto'` branch of `getLocalizationStrings` no longer reads
  `navigator` on the server (returns `'en'` directly), removing one
  more SSR sharp edge.

## 3.0.0-alpha.4 (internal milestone)

Internal refactor that ships consumer-facing escape hatches. Closes
the previously deferred composables-extraction and autocomplete-
unification items from `rewrite/ergonomics-review.md`. No props or
events on existing components changed; the new exports are purely
additive.

### Added

- Composables exported from the package entrypoint:
  - `useAutocomplete<T>` — the active-index state machine that powers
    the emoji and user-tag suggestion menus. Drives a list from
    parent-supplied `selectSignal` / `navSignal` watchers so the host
    decides which keys mean navigate / commit.
  - `useMessageSelection<T>` — bulk selection state with `toggle`,
    `clear`, `cancel`, and a `selectedIds` set. `Chat.vue` now uses
    it directly.
  - `useReplyEdit` — owns the composer's reply / edit message state
    and dispatches the built-in `REPLY_ACTION` / `EDIT_ACTION`.
  - `useInfiniteScroll` — `IntersectionObserver` helper that fires
    `onLoadMore` when a sentinel element scrolls into view; releases
    the observer on unmount.
  - `useLocalSearch<T>` — wraps the package's `filterItems` helper
    with a `custom` escape hatch (server-driven results) baked in.
- `<AutocompleteMenu>` component — generic, slotted base component
  that `ChatEmojis` and `ChatUserTag` are now thin wrappers around.
  Accepts `items: T[]`, an `itemKey` resolver, `selectItem` /
  `activeUpOrDown` signals, a `vertical` / `horizontal` `layout`,
  and an `ariaLabel`. Use it directly to build a slash-command menu
  or any other autocomplete surface without re-deriving the
  active-index state.
- `chat.autocomplete.emojis` / `chat.autocomplete.users`
  localization strings (used as the listbox `aria-label`).

### Changed

- `ChatEmojis` and `ChatUserTag` now render through
  `<AutocompleteMenu>`. Their public props / events are unchanged.
  The internal CSS class names changed (`vac-emoji-element`,
  `vac-tags-box`, `vac-tags-box-active`, etc. → shared
  `vac-autocomplete-item` / `vac-autocomplete-item-active` +
  per-wrapper `vac-emojis-menu` / `vac-user-tag-menu` scopes); only
  consumers that styled or queried those internal classes are
  affected.
- `Chat.vue` now clears the message selection automatically after a
  `message-selection-action-handler` dispatch. Hosts that previously
  emitted `cancel-message-selection` from their handler can drop that
  call; hosts that relied on the selection persisting must re-select
  explicitly.

### Fixed

- `formatText({ singleLine: true })` no longer crashes under SSR.
  The DOM-stripping pass is now guarded behind a `typeof document`
  check with a tag-strip fallback for server rendering.
- `MessageFile`'s image preloader now also listens for `error`,
  so a broken image URL clears the loading spinner instead of
  leaving it spinning indefinitely.
- `ChatFooter` no longer leaks an extra `URL.createObjectURL`
  reference per attached file — the composer's `url` and `localUrl`
  now share a single object URL that `removeFile` / `resetMessage`
  revoke together.

## 3.0.0-alpha.3 (internal milestone)

Second naming and ergonomics pass — closes the consumer-facing P1
items from `rewrite/ergonomics-review.md` (composables extraction
and autocomplete unification stay deferred; they're internal-only
refactors that don't gate the release). Every item is a breaking
change vs `3.0.0-alpha.2`.

### Migration recipe

| Before                                                                                                                                                                    | After                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `messageSelection: { enabled, actions }` (Chat / ChatHeader / AdvancedChat as `messageSelectionActions`)                                                                  | `selectionActions: Action[]` — non-empty enables selection mode                                                                  |
| `acceptedFiles`                                                                                                                                                           | `accept`                                                                                                                         |
| `multipleFiles`                                                                                                                                                           | `multiple`                                                                                                                       |
| `captureFiles`                                                                                                                                                            | `capture`                                                                                                                        |
| `user` (the viewer prop on AdvancedChat / Chat / Chats / ChatHeader / ChatsItem / Message / ChatMessage / MessageActions / MessageReactions / MessageFile / MessageFiles) | `currentUser`                                                                                                                    |
| `Action.onlyMe`                                                                                                                                                           | `Action.ownMessageOnly`                                                                                                          |
| `selectedMessagesTotal` (ChatHeader)                                                                                                                                      | `selectedCount`                                                                                                                  |
| `Chat.lastMessage: Message`                                                                                                                                               | `Chat.lastMessage: MessageSummary` (`Message` is still assignable; the projection just doesn't require `reactions`/`reply`/etc.) |
| `Message.reply: Message`                                                                                                                                                  | `Message.reply: MessageSummary` (no longer recursive)                                                                            |
| `chat.lastMessage.unread` (read in `ChatsItem` for the "new message" styling)                                                                                             | `chat.unreadCount`                                                                                                               |

### Added

- `Chat.textFormatting?: Partial<TextFormattingOptions>` and
  `AdvancedChat.textFormatting?: Partial<TextFormattingOptions>`. One
  knob to disable markdown / linkify / configure link options across
  every message body in a chat. Per-render overrides
  (single-line previews, system-message render) compose on top.
  Restores the v2 top-level `text-formatting` config.
- `Action.icon?: string`. Optional leading icon for dropdown menu
  items, resolves to a built-in `SvgIcon` name (e.g. `'pencil'`,
  `'deleted'`). Sample fixture wires `pencil` for Edit and
  `deleted` for Delete.
- `MessageStatus` and `MessageSummary` types exported from the
  package.

### Changed (data model)

- `Action.onlyMe` was renamed to `Action.ownMessageOnly`, and `Action.icon`
  was added. The alpha.2 `name` to `id` and `title` to `label` renames remain.
- `Chat.lastMessage` and `Message.reply` retyped to `MessageSummary`.
  This is a non-recursive projection: `id`, `sender`, `content`,
  `createdAt`, `status`, `deleted`, `edited`, `files`. Existing
  `Message` values pass through unchanged.

### Changed (component props)

- The packed `messageSelection: { enabled, actions }` prop on `Chat`
  and `ChatHeader` is replaced by `selectionActions: Action[]`.
  Selection mode is enabled iff the array is non-empty. `AdvancedChat`
  exposes the same prop directly (was `messageSelectionActions`).
  One concept, one prop.
- File-input props on `Chat`, `ChatFooter`, and `AdvancedChat` match
  the underlying HTML attributes: `accept`, `multiple`, `capture`.
- The viewer prop is `currentUser` everywhere it appears, no longer
  colliding with `Chat.users` (participants) in TypeScript hovering.
- `selectedCount` replaces `selectedMessagesTotal` on `ChatHeader`.

### Removed

- `ChatHeaderMessageSelection` interface (no longer needed).

## 3.0.0-alpha.2 (internal milestone)

Naming and ergonomics pass that closes the P0 items from
`rewrite/ergonomics-review.md`. Every item below is a breaking
change vs `3.0.0-alpha.1`.

### Migration recipe (mechanical)

| Before                                                                  | After                                                                       |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `Action.name`, `Action.title`                                           | `Action.id`, `Action.label`                                                 |
| `Chat.icon`                                                             | `Chat.avatar`                                                               |
| `User` had no avatar field                                              | `User.avatar?: string`                                                      |
| `Message.saved`, `Message.delivered`, `Message.read`, `Message.failure` | `Message.status?: 'sending' \| 'sent' \| 'delivered' \| 'read' \| 'failed'` |
| `Message.new`                                                           | `Message.unread`                                                            |
| `MessageFile.audio: boolean`                                            | (removed; use `isAudioFile(file)` from `@advanced-chat/components`)         |
| `Id = string \| number`                                                 | `Id = string` (call `String(id)` at the API boundary)                       |
| `<slot name="room-header">` etc.                                        | `<slot name="chat-header">`                                                 |
| `<slot :name="'room-list-item_' + id">` etc.                            | `<slot :name="'chat-list-item_' + id">`                                     |
| `<slot name="rooms-empty">`                                             | `<slot name="chats-empty">`                                                 |
| `<slot name="spinner-icon-rooms">`                                      | `<slot name="spinner-icon-chats">`                                          |
| `ChatHeader` emits `menu-action-handler: Action`                        | `ChatHeader` emits `menu-action-handler: { chat, action }`                  |
| `ChatHeader` emits `message-selection-action-handler: Action`           | `ChatHeader` emits `message-selection-action-handler: { chat, action }`     |
| `ChatsItem` emits `chat-action-handler: Action`                         | `ChatsItem` emits `chat-action-handler: { chat, action }`                   |
| `Chat`/`Message`/`AdvancedChat` emit `open-failed-message: { message }` | `open-failed-message: message` (single-field wrap dropped)                  |

### Changed (data model)

- `Action` is now `{ id: string; label: string; onlyMe?: boolean }`.
  Aligns with industry-standard `id`/`label` naming. The exported
  built-in action constants `REPLY_ACTION` and `EDIT_ACTION` keep
  their string values (`'reply'`, `'edit'`); they're now the
  documented value to put in `Action.id`.
- `Chat.icon` renamed to `Chat.avatar`. "Avatar" matches v2 and the
  rest of the chat-library ecosystem.
- `User.avatar?: string` added. Rendered in the user-tag autocomplete
  row, available as fallback for `Chat.avatar` in 1:1 chats. Test
  fixtures in `.test/users.json` now include avatar URLs.
- `Message` delivery state moved from four overlapping booleans
  (`saved`/`delivered`/`read`/`failure`) to one `status` enum:
  `'sending' | 'sent' | 'delivered' | 'read' | 'failed'`. Components
  derive the checkmark icon and failure pill from a single source
  of truth. New exported type: `MessageStatus`.
- `Message.new` renamed to `Message.unread`. Generic name → semantic.
- `MessageFile.audio` removed. The library already detects audio via
  MIME / extension through `isAudioFile`; the boolean was a duplicated
  source of truth.
- `Id` narrowed to `string`. Drops 12+ defensive `.toString()` calls
  in components and removes a class of `1 === '1'` bugs. Consumers
  with numeric backend ids should call `String(id)` at the API
  boundary.

### Changed (event payloads)

- `ChatHeader.menu-action-handler`, `ChatHeader.message-selection-action-handler`,
  and `ChatsItem.chat-action-handler` now emit `{ chat, action }`
  (or `{ chat, action, messages }` for the selection variant). The
  same listener wired through any layer (`Chats`, `Chat`, or
  `AdvancedChat`) now sees the same payload shape.
- `open-failed-message` emits the `Message` directly, not wrapped in
  `{ message }`. Consumers should change
  `(payload) => doSomething(payload.message)` to
  `(message) => doSomething(message)`.

### Changed (slots)

Final v2 → v3 slot rename pass. Templates only — internal
`vac-room-*` CSS classes are unchanged.

- `room-header` → `chat-header`
- `room-header-avatar` → `chat-header-avatar`
- `room-header-info` → `chat-header-info`
- `room-options` → `chat-options`
- `rooms-empty` → `chats-empty`
- `room-list-item_<id>` → `chat-list-item_<id>`
- `room-list-avatar_<id>` → `chat-list-avatar_<id>`
- `room-list-info_<id>` → `chat-list-info_<id>`
- `room-list-options_<id>` → `chat-list-options_<id>`
- `room-list-options-icon_<id>` → `chat-list-options-icon_<id>`
- `spinner-icon-rooms` → `spinner-icon-chats`
- `spinner-icon-infinite-rooms` → `spinner-icon-infinite-chats`

### Changed (localization)

- `typingUsersString(chat, strings)` now accepts
  `Pick<Strings, 'chat.typing'>` instead of the full `Strings` type.
  `AdvancedChatPlugin({ strings })` already accepted `Partial<Strings>`;
  this matches the test fixtures' expectation. Plugin overrides using
  `Partial<Strings>` no longer need to implement unrelated keys; consumers
  implementing the complete `Strings` interface still receive new required
  keys as the interface evolves.

### Removed

- `Message.saved`, `Message.delivered`, `Message.read`, `Message.failure`,
  `Message.new`, `MessageFile.audio` (see migration recipe).

### Added (rolled in from the previous Unreleased section)

- `Chat` and `AdvancedChat` wire message pagination: `fetch-messages`
  fires when the list scrolls within 60 px of the top, suppressed
  while `loadingMessages` or `messagesLoaded` is true.
- `Chat` auto-scrolls to the latest message on mount, on chat switch,
  on send, and on receive when the user is at the bottom. When the
  user has scrolled away, a "scroll to latest" pill with a count
  badge of unread messages appears.
- New string `chat.scroll-to-bottom`.
- `src/index.ts` aggregates per-component `*Props` / `*Events`
  interfaces, theme/localization primitives, and plugin types.
- `REPLY_ACTION` / `EDIT_ACTION` constants and `BuiltInActionName`
  type exported.

### Also changed

- Event names previously namespaced with a colon (`opened:file`,
  `clicked:user-tag`) renamed to kebab-case (`open-file`,
  `click-user-tag`).
- `Chats.chatsLoaded` semantics: `true` now means "all chats
  delivered" (matches v2's `rooms-loaded`).
- `vClickOutside` migrated from internal fork to
  `@vueuse/components`'s `vOnClickOutside`.
- Five `@ts-nocheck` files in `src/utils` are typed cleanly. New
  `text-formatter/types.d.ts` augments `micromark-util-types`.
- `@tailwindcss/vite` and `tailwindcss` dropped — the library never
  used Tailwind utility classes. CSS bundle 31.77 kB / 5.83 kB gz
  (was 37.20 / 7.48).

## 3.0.0-alpha.1 (internal milestone)

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

Initial npm publication of the V3 rewrite. Later alpha sections document
internal milestones rather than separately published npm versions.
