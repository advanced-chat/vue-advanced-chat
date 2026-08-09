# Archived V3 Data Model & Ergonomics Review (`3.0.0-alpha.1`)

> Historical audit only. This document intentionally preserves the
> `3.0.0-alpha.1` problem statements and proposed fixes. It is not a current
> missing-feature list. The action/id naming, chat/user avatars, status enum,
> string id, message summaries, current-user prop, file prop names, selection
> shape, event payload normalization, chat slot names, text-formatting pass,
> and locale negotiation described below subsequently changed. Use
> [`parity-checklist.md`](./parity-checklist.md) and the public migration guide
> for the `3.0.0-rc.3` contract.

A consumer-facing review of the V3 surface at `3.0.0-alpha.1` —
companion to `architecture-review.md` (which focused on structure).
This pass looks at the shape of the data, the names of fields and
props, and how the API actually feels to use.

Each item is tagged `P0` (block 3.0 GA), `P1` (3.1+), or `note`
(deliberate-design call to confirm).

## TL;DR

The V3 surface is more typed and more granular than v2, but several
names and shapes either invent terminology that doesn't match what
consumers expect, force consumers to denormalize more than they
need, or hide real semantic distinctions behind permissive fields.

The biggest individual fixes are:

- `Chat.icon` → `Chat.avatar` (industry term, matches v2).
- `User` is missing an `avatar` field entirely.
- `Message` has three overlapping booleans (`saved`/`delivered`/
  `read`) that should be a single `status` enum.
- `Action` should use `id`/`label` not `name`/`title`.
- `Strings` should accept `Partial<Strings>` so adding a key isn't a
  breaking change for typed consumers.

## Domain models

### `Chat`

```ts
interface Chat {
  id: Id
  name: string
  icon?: string
  unreadCount?: number
  lastMessage?: Message
  users?: User[]
  typingUsers?: UserReference[]
}
```

| Issue                                                                                                                                                                                              | Priority | Fix                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon` reads as a small symbolic graphic; consumers expect `avatar` for a chat picture. v2 used `avatar`.                                                                                          | `P0`     | Rename `icon` → `avatar`.                                                                                                                                                                      |
| `lastMessage: Message` forces consumers to provide the _full_ `Message` (including `files`, `reactions`, possibly `reply`) for every chat row. Only the chat-list preview needs a tiny projection. | `P1`     | Introduce `MessageSummary = Pick<Message, 'id' \| 'sender' \| 'content' \| 'createdAt' \| 'read' \| 'delivered' \| 'saved' \| 'deleted' \| 'edited' \| 'files'>` and use it for `lastMessage`. |
| `users?: User[]` is optional but most behavior (typing indicator, online status, message-author lookup) depends on it. Consumers who omit it get silently degraded UI.                             | `P1`     | Make required (or document the degraded behavior explicitly).                                                                                                                                  |
| `typingUsers` reads as "the participants" until you parse the type.                                                                                                                                | `note`   | Consider `usersTyping` or just `typing: UserReference[]`.                                                                                                                                      |
| No `index` / `order` field. Consumer must pre-sort.                                                                                                                                                | `note`   | OK as-is but document the expected ordering (ascending by activity? descending?).                                                                                                              |
| No `lastActiveAt` / `updatedAt`.                                                                                                                                                                   | `note`   | Many UIs sort or display this. Add as optional.                                                                                                                                                |

### `Message`

```ts
interface Message {
  id: Id
  sender: User
  content?: string
  files?: MessageFile[]
  reactions?: Record<string, Id[]>
  new?: boolean
  saved?: boolean
  delivered?: boolean
  read?: boolean
  deleted?: boolean
  edited?: boolean
  failure?: boolean
  system?: boolean
  disableActions?: boolean
  disableReactions?: boolean
  createdAt: string
  reply?: Message
}
```

| Issue                                                                                                                                                                                                                                                                     | Priority                           | Fix                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `sender: User` (full object) on every message means data is denormalized everywhere. A 200-message thread with two participants ships two users 100× each.                                                                                                                | `P0`                               | Accept `sender: UserReference \| User` and resolve against `chat.users` when only an id is provided.                       |
| `saved`, `delivered`, `read` are three booleans for the same delivery state machine. They overlap, can be inconsistent (e.g. `read: true` but `delivered: false`), and require components to derive precedence (current code: `read \|\| delivered` → double-check icon). | `P0`                               | Replace with `status?: 'sending' \| 'sent' \| 'delivered' \| 'read' \| 'failed'`. Existing booleans become a derived view. |
| `failure: boolean` — odd noun for a state. The rest of the model is past-participle (`deleted`, `edited`, `read`).                                                                                                                                                        | `P0` (folded into the status enum) | Use `'failed'` in the enum, drop the standalone field.                                                                     |
| `new: boolean` — too generic; reads as "is this a new field on the schema?". The intent is "this message is one of the unread batch that triggers the New-messages divider."                                                                                              | `P0`                               | Rename `new` → `unread`.                                                                                                   |
| `disableActions` / `disableReactions` — negative naming forces a double-negative read ("if not disabled, render").                                                                                                                                                        | `P1`                               | Replace with `actionable?: boolean` / `reactable?: boolean` (default true) **or** a single `readonly?: boolean`.           |
| `system: boolean` is a discriminator for a fundamentally different render path. Mixing it with content fields breaks "make impossible states impossible".                                                                                                                 | `P1`                               | Discriminated union: `Message = NormalMessage \| SystemMessage`. Migration path: accept both shapes for a release.         |
| `reply?: Message` is recursive — a reply could itself have a reply ad infinitum. Most apps only want one level of quote.                                                                                                                                                  | `P1`                               | Tighten to `reply?: MessageSummary` (non-recursive).                                                                       |
| `createdAt: string` (ISO only).                                                                                                                                                                                                                                           | `note`                             | Accept `Date \| string` for friendlier API; serialize internally.                                                          |
| `content?: string` — fine. v2 used `content` too.                                                                                                                                                                                                                         | `note`                             | Keep.                                                                                                                      |
| No "pending" / "sending" state. Consumer can use `failed` for hard failure but has no in-flight state.                                                                                                                                                                    | `P1`                               | Falls out of the `status` enum above.                                                                                      |

### `User`

```ts
interface User {
  id: Id
  name: string
  status: { state: 'online' \| 'offline' \| 'away' \| 'busy'; lastActiveAt?: string }
}
```

| Issue                                                                                                                                                                                                                                                          | Priority | Fix                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **No `avatar` field.** Per-user avatars never render. The "avatar" you see in `ChatsItem` is `chat.icon` (the chat's picture, not a user's). For 1:1 chats the chat avatar happens to look like a user avatar; for group chats every user's avatar is missing. | `P0`     | Add `User.avatar?: string`. Render in `Message`'s sender block, in user-tag autocomplete, and as a fallback for `Chat.avatar` in 1:1 rooms. |
| `status` is required at the type level (no `?`) but conceptually optional — many apps don't track presence.                                                                                                                                                    | `P1`     | Make `status?: { … }`.                                                                                                                      |
| `state: 'online' \| 'offline' \| 'away' \| 'busy'` — `'busy'` is rare; `'away'` overlaps with `'offline'`.                                                                                                                                                     | `note`   | OK as-is; document the rendering contract.                                                                                                  |
| `lastActiveAt: string` — same Date-or-string flexibility as `Message.createdAt`.                                                                                                                                                                               | `note`   | Match the chosen pattern.                                                                                                                   |

### `MessageFile`

```ts
interface MessageFile {
  name: string
  type: string
  extension: string
  url: string
  previewUrl?: string
  size?: number
  audio?: boolean
  duration?: number
  progress?: number
  blob?: Blob
}
```

| Issue                                                                                                                                                               | Priority | Fix                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `audio: boolean` is redundant; `isAudioFile(file)` already derives this from `type` / `extension`. Two sources of truth.                                            | `P0`     | Remove `audio`. Components already detect audio via media-types helpers.                                                                                                              |
| `extension` duplicates information already in `name` ("voice.mp3" → "mp3") and overlaps with `type`. Useful for display but consumers shouldn't have to compute it. | `P1`     | Make optional and derive in the rendering layer if missing.                                                                                                                           |
| `duration` is named generically; only meaningful for audio/video.                                                                                                   | `note`   | Acceptable; document the contract.                                                                                                                                                    |
| `blob: Blob` is for upload state, but the type is mixed with display props.                                                                                         | `note`   | Could split into `MessageFile` (display) and `PendingMessageFile extends MessageFile { blob, localUrl, progress }`. Currently `ChatFileItem` does some of this; alignment would help. |
| No `mimeType` alias — consumers backed by REST APIs that return `mime_type` write a mapper for one field.                                                           | `note`   | Trivial; users can map.                                                                                                                                                               |

### `Action`

```ts
interface Action {
  name: string
  title: string
  onlyMe?: boolean
}
```

| Issue                                                                                                                                                                             | Priority                    | Fix                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `name` (identifier) + `title` (label) is non-standard. Most APIs use `id` + `label`.                                                                                              | `P0`                        | Rename: `Action = { id: string; label: string; onlyMe?: boolean }`. v2 used `name`/`title`; this is a deliberate break. |
| `onlyMe?: boolean` is fine semantically but reads as colloquial.                                                                                                                  | `P1`                        | Rename to `currentUserOnly?: boolean` or `ownMessageOnly?: boolean`.                                                    |
| No optional `icon?: string` field — every modern dropdown action has an icon (delete = trash, reply = arrow). Today consumers use slots for this; clunky for a list of N actions. | `P1`                        | Add `icon?: string` (resolves to a built-in `SvgIcon` name) and/or `iconUrl?: string`.                                  |
| No discriminator between built-in (`reply`, `edit`) and custom. Already in the architecture review — consumers must use exported `REPLY_ACTION` / `EDIT_ACTION` constants.        | (already P0 in arch review) | Consider a stronger type: `Action<T extends string = string> = { id: T; … }`.                                           |
| No `confirm?` / `destructive?` flag. Delete actions typically need a confirmation prompt; the library leaves all of that to consumers.                                            | `note`                      | Acceptable — consumer composes confirms.                                                                                |

### `Id = string | number`

| Issue                                                                                                                                                                                   | Priority                      | Fix                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| Dual type forces `.toString()` everywhere comparisons happen (Message lookup, user matching, selection). It's a bug attractor: `id: 1` from a JSON column ≠ `id: '1'` from a URL param. | `P0` (already in arch review) | Pin to `Id = string`. Consumers do `String(id)` once at the boundary. |

### `*Reference` types

```ts
interface ChatReference {
  id: Id
}
interface UserReference {
  id: Id
}
interface MessageReference {
  id: Id
}
```

| Issue                                                                                                                                           | Priority | Fix                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Three `{ id }` interfaces with different names — they're structurally identical.                                                                | `P1`     | Either delete and inline `{ id: Id }`, or use `type Reference<T extends { id: Id }> = Pick<T, 'id'>`.                                  |
| Inconsistent usage: `Chat.typingUsers: UserReference[]` (just ids) but `Message.sender: User` (full). Same conceptual relationship, two shapes. | `P0`     | After narrowing `Message.sender` (above), use `UserReference` consistently for "the user is identified, look them up in `chat.users`." |

## Naming consistency

### Field names across types

| Concept       | Chat          | User        | Message | Action    |
| ------------- | ------------- | ----------- | ------- | --------- |
| Identifier    | `id` ✓        | `id` ✓      | `id` ✓  | `name` ✗  |
| Display label | `name`        | `name`      | –       | `title` ✗ |
| Picture       | `icon` ✗      | (missing) ✗ | –       | –         |
| Counter       | `unreadCount` | –           | –       | –         |

Recommendation: standardize on `id`, `name`, `avatar`, `count`-suffixed counters.

### Singular vs plural

- `AdvancedChat.user` (the viewer) vs `Chat.users` (participants) — the
  same word root means two different things in the same component
  tree. Hovering a `user` prop in TypeScript doesn't tell you which.
- Recommendation: rename `user` → `currentUser` or `viewer` at the
  prop level. Internal types stay `User`. `P1`.

### `count` suffix

- `Chat.unreadCount` ✓
- `ChatHeader.selectedMessagesTotal` ✗ (different suffix)
- Recommendation: standardize on `Count`. `selectedMessagesCount` or
  even `selectedCount`. `P1`.

### v2 → v3 schema rename leaks

The rewrite consistently renamed `room` → `chat`, but several slot
names and DOM ids still say "room": `room-header`, `room-options`,
`room-list-item_<id>`, `infinite-loader-rooms`, `acc-rooms-empty`.

Recommendation: do a final pass on slot names. The CSS class names
(`acc-room-*`) can stay (CSS is internal), but the slot names are
public API. `P0`.

## Component prop ergonomics

### `AdvancedChat`

| Prop                                                                                                                                              | Issue                                                                                                | Suggested                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`                                                                                                                                            | Singular; ambiguous with `chat.users`.                                                               | `currentUser`                                                                                                                                                     |
| `chats` + `chat`                                                                                                                                  | Visually similar; the active one is just `chat`.                                                     | `activeChat` reads cleaner                                                                                                                                        |
| `messageSelection` (object on `Chat`/`ChatHeader`)                                                                                                | Packed `{ enabled, actions }` requires the consumer to wire two things to opt in.                    | `selectionActions: Action[]` (truthy + non-empty enables)                                                                                                         |
| `acceptedFiles`, `multipleFiles`, `captureFiles`                                                                                                  | These shadow HTML attributes (`accept`, `multiple`, `capture`) but the names obscure the connection. | `accept`, `allowMultiple`, `capture` — match the platform                                                                                                         |
| `customSearchEnabled`                                                                                                                             | Awkward gerund. The bool also doesn't disable the local filter so much as "I'm doing it elsewhere".  | Drop the flag; if a `@search-chat` listener handles results, the consumer drives `chats` externally. Or rename to `serverSideSearch`.                             |
| `chatInfoEnabled`                                                                                                                                 | Reads as "enable the info feature" but really means "make the header a clickable button".            | `clickableHeader`                                                                                                                                                 |
| `showSendIcon`, `showFiles`, `showEmojis`, `showFooter`, `showSearch`, `showAddChat`, `showReactionEmojis`, `showNewMessagesDivider`, `showChats` | Nine flags. The granularity is fine, but the `show*` prefix on all of them is heavy.                 | Group by area: `footer: { show: bool, sendIcon: bool, files: bool, emojis: bool }` (a "config" object). Or accept the verbosity — it's at least consistent. `P1`. |
| `headerActions` vs `messageActions` vs `chatActions` vs `messageSelectionActions`                                                                 | Four `*Actions` props at the same level.                                                             | OK; they target distinct UI zones. Document the mapping.                                                                                                          |

### `Chat`

| Prop           | Issue                                                                                      | Suggested                                                  |
| -------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `standalone`   | Hides the toggle-chat-list button but the name doesn't say so.                             | `withChatList: boolean` (default true) — flip the polarity |
| `showChatList` | Internal state of the toggle; mostly an implementation leak from `AdvancedChat` to `Chat`. | Remove from public surface; manage internally              |

### `ChatFooter`

| Prop                                        | Issue                                                                                   | Suggested                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `roomMessage: string`                       | "room" naming leak; the meaning ("initial textarea content") isn't clear from the name. | `initialText` or `modelValue` (with `update:modelValue`)                     |
| `initReplyMessage`, `initEditMessage`       | The `init` prefix conveys "pass once"; convention in Vue 3 is v-model.                  | `replyMessage` + `update:replyMessage`, `editMessage` + `update:editMessage` |
| `showFooter` (rendered inside `ChatFooter`) | A footer-level prop deciding whether the footer renders is self-defeating.              | Move to parent; just don't render the component if `showFooter: false`.      |

## Localization ergonomics

### Strict `Strings` type breaks consumer code on every key add

```ts
type Strings = {
  'chats.empty': string
  ... // 14 keys today
}
```

Adding `chat.scroll-to-bottom` (which 0.alpha.1 did) made every
typed consumer config invalid even though the plugin merges
defaults at runtime.

Recommendation: `AdvancedChatPlugin({ strings?: Partial<Strings> })`.
The plugin already does deep-merge; the type should match the
runtime contract. **`P0`**.

### `Strings` shape

- Dotted keys (`chats.empty`) suggest a hierarchical namespace, but
  the type is flat. Either make it actually nested
  (`{ chats: { empty: string } }`) or pick a flatter convention
  (`chatsEmpty`). Current form mixes both.
- `chat.user.is-online` mixes dot and dash. Pick one. `P1`.

### `getLocalizationStrings('auto')` always returns English

The runtime stub at `src/localization/index.ts` has `case 'auto':`
returning English regardless of `navigator.language`. Either:

- Remove `'auto'` until you actually have multiple locales.
- Or document the placeholder and ship at least one alternative
  to validate the wiring. `P1`.

## Event payloads

### Inconsistent shape across layers

| Layer          | Event                 | Payload                    | Issue                      |
| -------------- | --------------------- | -------------------------- | -------------------------- |
| `ChatHeader`   | `menu-action-handler` | `Action` (just the action) | No `chat` context          |
| `Chat`         | `menu-action-handler` | `Action` (forwards)        | Same                       |
| `AdvancedChat` | `menu-action-handler` | `{ chat, action }`         | Wraps with the active chat |

A consumer who uses `Chat` directly (without `AdvancedChat`) gets a
different event shape than the same listener wired through
`AdvancedChat`. That's a non-obvious gotcha when wrapping.

Recommendation: every `*-action-handler` event in the public surface
emits `{ chat, action }` (or `{ message, action }`). At the level
where `chat` isn't yet available, hold the emit until it is, or
require it via prop so the component can fill it in. **`P0`**.

### Wrap-of-one-field payloads

- `open-failed-message: { message }` — single-field object wrap.
- Could be `open-failed-message: message` directly.
- v2's convention was object payloads for forward compatibility.
  V3 should pick one: always-object (consistent), or always-direct
  for one-field events. `P1`.

## Slot naming — final v2 → v3 sweep

```
room-header → chat-header
room-header-avatar → chat-header-avatar
room-header-info → chat-header-info
room-options → chat-options
rooms-empty → chats-empty
no-room-selected → no-chat-selected (already done in Chat)
room-list-item_<id> → chat-list-item_<id>
room-list-avatar_<id> → chat-list-avatar_<id>
room-list-info_<id> → chat-list-info_<id>
room-list-options_<id> → chat-list-options_<id>
room-list-options-icon_<id> → chat-list-options-icon_<id>
microphone-icon_<id> (room) → microphone-icon_<id> (already shared)
checkmark-icon_<id> (room) — same
deleted-icon_<id> (room) — same
spinner-icon-rooms → spinner-icon-chats
spinner-icon-infinite-rooms → spinner-icon-infinite-chats
```

`P0` to do this once before 3.0 — slots are public API.

## Defaults & required props

- `Chats` requires `user` to render the list (`v-if="user"` guards
  the entire template). Should be in the type as required. Today
  it's `user?: UserReference`.
- `Message.sender` is required, but `Message.user` (in props) is
  required too. Consumer who builds a "preview" without an active
  user can't render `Message`. OK if intentional.
- `MessageFile` requires `name`, `type`, `extension`, `url` — but
  `extension` could be derived. Trim required surface.

## Documentation gaps the types could close

- `messages` ordering: chronological ascending or descending? Not
  encoded. JSDoc on `Chat.messages` would help.
- `Chat.unreadCount` vs `Message.new`: relationship not specified.
  Consumer must guess.
- `messageSelection.actions` contract: do these run against
  `selectedMessages` (plural) or each? Code shows plural; doc says
  the same.
- `Action.onlyMe` polarity: "only show when message is mine" or "do
  not show on my message". Code shows the former; JSDoc would
  clarify.

A short JSDoc pass over the model interfaces would close most of
these without a behavior change.

## Recommended landing order

1. **Action.name → Action.id, Action.title → Action.label.** Pure
   rename, mechanical. (`P0`)
2. **Chat.icon → Chat.avatar, add User.avatar.** Pure addition +
   rename. (`P0`)
3. **Strings → Partial<Strings>.** Type fix, no runtime change.
   (`P0`)
4. **Message status enum** (replace `saved`/`delivered`/`read`/`failure`).
   Bigger; touches Message rendering, ChatsItem rendering, fixtures,
   tests. (`P0`)
5. **Message.new → Message.unread.** Rename. (`P0`)
6. **Slot v2 → v3 sweep.** Rename `room-*` slots. (`P0`)
7. **Pin Id to string.** (`P0`, already in arch review)
8. **Event payloads: always-object with `chat` context.** (`P0`)
9. **MessageFile.audio remove.** (`P0`)
10. **`current user` rename, `acceptedFiles` → `accept`, etc.** (`P1`)

That's nine `P0`s, all small. Each is a tractable PR. None depend on
each other except the status-enum work, which is a single bigger
change.

## Notes on what V2 got right and V3 lost

- **`avatar` field name** — instantly readable, matches every other
  chat library on the planet. V3's `icon` is a regression.
- **`text-formatting` config at the top level** — already noted in
  the architecture review.
- **`auto-scroll` policy** — fixed in this round.
- **`load-first-room`** — controllable behavior. V3 hard-codes
  "auto-pick first chat".

V3 added enough good stuff (typed events, separated CSS, plugin
strings, scroll-to-bottom button) that net the rewrite is a clear
improvement, but a final ergonomics pass before 3.0 GA would close
the gap between "typed v2" and "library that feels designed".
