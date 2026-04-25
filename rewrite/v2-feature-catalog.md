# V2 Feature Catalog

Reference inventory of the v2 (`main`) component as published. Built
from the v2 README and the source on `main`. Used as the parity bar
for V3.

This document is effectively frozen — it describes what v2 ships, not
what V3 should do. See `parity-checklist.md` for V3 status.

## Top-level component

v2 ships a single web component: `<vue-advanced-chat>`, registered via
`register()` and built from `defineCustomElement` over the SFC at
`src/lib/ChatWindow.vue` on `main`.

## Props (60+)

### Layout & rooms

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `height` | string | `'600px'` | container height |
| `current-user-id` | string | required | identifies the active user |
| `rooms` | array \| string (JSON) | `[]` | room data |
| `rooms-order` | `'asc' \| 'desc'` | `'desc'` | sort by `index` |
| `loading-rooms` | bool | `false` | spinner |
| `rooms-loaded` | bool | `false` | disables pagination |
| `room-id` | string | `null` | open a specific room |
| `load-first-room` | bool | `true` | auto-open the first room |
| `rooms-list-opened` | bool | `true` | sidebar visibility |
| `responsive-breakpoint` | number | `900` | mobile collapse px |
| `single-room` | bool | `false` | hide rooms list |

### Messages

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `messages` | array \| string (JSON) | `[]` | active room messages |
| `messages-loaded` | bool | `false` | disables pagination |
| `room-message` | string | `''` | preset textarea value |
| `username-options` | object | `{ minUsers: 3, currentUser: false }` | username display rule |
| `auto-scroll` | object | `{ send: { new: true, newAfterScrollUp: true }, receive: { new: true, newAfterScrollUp: false } }` | scroll behavior on new messages |
| `show-new-messages-divider` | bool | `true` | the unread divider line |

### Actions

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `room-actions` | array | `[]` | dropdown actions per chat row |
| `menu-actions` | array | `[]` | room header menu |
| `message-actions` | array | reply / edit / delete / select | per-message dropdown |
| `message-selection-actions` | array | `[]` | bulk actions on selected messages |

### Footer / input

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `templates-text` | array | `null` | `/` autocomplete |
| `show-search` | bool | `true` | rooms search |
| `show-add-room` | bool | `true` | add room button |
| `show-send-icon` | bool | `true` | send button |
| `show-files` | bool | `true` | paperclip button |
| `show-audio` | bool | `true` | mic button |
| `audio-bit-rate` | number | `128` | mp3 encoder kbps |
| `audio-sample-rate` | number | browser default | mp3 encoder Hz |
| `show-emojis` | bool | `true` | emoji picker icon |
| `show-reaction-emojis` | bool | `true` | reactions on messages |
| `show-footer` | bool | `true` | hide entire input |
| `accepted-files` | string | `'*'` | mime filter |
| `capture-files` | string | `''` | mobile capture mode |
| `multiple-files` | bool | `true` | multi-attach |
| `textarea-action-enabled` | bool | `false` | extra textarea icon |
| `textarea-auto-focus` | bool | `true` | autofocus on room change |
| `user-tags-enabled` | bool | `true` | `@user` mentions |
| `emojis-suggestion-enabled` | bool | `true` | `:emoji:` suggestions |
| `media-preview-enabled` | bool | `true` | fullscreen media viewer |

### Behavior & content

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `text-messages` | object | en defaults | i18n string overrides |
| `text-formatting` | object | see below | markdown markers |
| `link-options` | object | `{ disabled: false, target: '_blank', rel: null }` | URL handling |
| `room-info-enabled` | bool | `false` | header click emits `room-info` |
| `custom-search-room-enabled` | bool | `false` | delegate search to consumer |
| `scroll-distance` | number | `60` | px before pagination triggers |

`text-formatting` default: `{ disabled: false, italic: '_', bold: '*', strike: '~', underline: '°', multilineCode: '\`\`\`', inlineCode: '\`' }`.

### Theme

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `theme` | `'light' \| 'dark'` | `'light'` | built-in palettes |
| `styles` | object | `{}` | partial CSS-var overrides |
| `emoji-data-source` | string | CDN URL | emoji-picker-element data |

## Events

| Event | Payload |
|------|---------|
| `fetch-messages` | `{ room, options }` (options.reset on first load) |
| `fetch-more-rooms` | – |
| `send-message` | `{ roomId, content, files, replyMessage, usersTag }` |
| `edit-message` | `{ roomId, messageId, newContent, files, replyMessage, usersTag }` |
| `delete-message` | `{ roomId, message }` |
| `open-file` | `{ message, file }` |
| `open-user-tag` | `{ user }` |
| `open-failed-message` | `{ roomId, message }` |
| `add-room` | – |
| `search-room` | `{ roomId, value }` |
| `room-action-handler` | `{ roomId, action }` |
| `menu-action-handler` | `{ roomId, action }` |
| `message-action-handler` | `{ roomId, action, message }` |
| `message-selection-action-handler` | `{ roomId, action, messages }` |
| `send-message-reaction` | `{ roomId, messageId, reaction, remove }` |
| `room-info` | `room` |
| `toggle-rooms-list` | `{ opened }` |
| `textarea-action-handler` | `{ roomId, message }` |
| `typing-message` | `{ roomId, message }` |

## Slots

Slots either replace fixed UI regions or target a specific entity by id.

**Region slots**: `rooms-header`, `rooms-list-search`, `rooms-empty`,
`messages-empty`, `no-room-selected`, `room-header`, `room-header-avatar`,
`room-header-info`, `room-options`, `menu-icon`, `custom-action-icon`,
`emoji-picker-icon`, `paperclip-icon`, `send-icon`, `reply-close-icon`,
`image-close-icon`, `file-icon`, `files-close-icon`, `edit-close-icon`,
`preview-close-icon`, `audio-stop-icon`, `audio-check-icon`,
`scroll-icon`, `search-icon`, `add-icon`, `toggle-icon`,
`spinner-icon-rooms`, `spinner-icon-infinite-rooms`,
`spinner-icon-messages`, `spinner-icon-infinite-messages`,
`spinner-icon-room-file`.

**Per-room slots** (`*_{{ROOM_ID}}`): `room-list-item`,
`room-list-avatar`, `room-list-info`, `room-list-options`,
`room-list-options-icon`, `microphone-icon`, `checkmark-icon`,
`deleted-icon`.

**Per-message slots** (`*_{{MESSAGE_ID}}`): `message`,
`message-avatar`, `message-failure`, `dropdown-icon`, `pencil-icon`,
`checkmark-icon`, `deleted-icon`, `audio-play-icon`, `audio-pause-icon`,
`microphone-icon`, `eye-icon`, `document-icon`,
`emoji-picker-reaction-icon`, `spinner-icon-message-file`.

## Domain types (v2 shape)

```ts
interface Room {
  roomId: string
  roomName: string
  avatar?: string
  unreadCount?: number
  index?: string | number | Date
  lastMessage?: Message
  users: RoomUser[]
  typingUsers?: string[]      // user ids
}

interface RoomUser {
  _id: string
  username: string
  avatar: string
  status: { state: 'online' | 'offline'; lastChanged: string }
}

interface Message {
  _id: string
  senderId: string
  content?: string
  username?: string
  avatar?: string
  date?: string
  timestamp?: string
  system?: boolean
  saved?: boolean
  distributed?: boolean
  seen?: boolean
  deleted?: boolean
  edited?: boolean
  failure?: boolean
  disableActions?: boolean
  disableReactions?: boolean
  indexId?: string | number
  files?: MessageFile[]
  reactions?: Record<string, string[]>   // emoji -> userIds
  replyMessage?: Message
}

interface MessageFile {
  name: string
  type: string
  extension: string
  url: string
  size?: number
  audio?: boolean
  duration?: number
  progress?: number
  blob?: Blob
  preview?: string
  localUrl?: string
}
```

## Behaviors

- **Markdown formatting** via micromark + GFM plus custom markers for
  underline (`°…°`) and user tags (`<usertag>id</usertag>`). Auto-link
  for URLs; nesting allowed.
- **Username display** in messages when more than 3 users in the room;
  configurable via `username-options`.
- **Date dividers** between messages on different days.
- **New messages divider** between read and unread sections.
- **Auto-scroll** policy split into send / receive × new /
  newAfterScrollUp.
- **Scroll-to-bottom button** when scrolled away from the latest with
  unread badge.
- **Infinite scroll** for messages (up) and rooms (down) using a
  configurable `scroll-distance` trigger.
- **Edit mode** highlights the textarea outline and prefills content.
- **Reply** quotes the target message above the input; nested
  rendering inside the message bubble.
- **Selection mode** shows checkboxes on messages; a selection toolbar
  replaces the room header.
- **Audio recording** captures via MediaRecorder, encodes to MP3 via
  bundled `lamejs`, sends as `MessageFile` with `audio: true` and
  `duration`.
- **Audio playback** with custom progress scrubber (also rendered in
  reply previews and last-message-preview rows).
- **File preview** uses local blob URLs before upload; consumer
  receives `blob` and `localUrl` in `send-message`.
- **Media preview** lightbox for images and videos; closes on
  Escape / outside click.
- **Emoji picker** via `emoji-picker-element`; data source is
  configurable.
- **Emoji autocomplete** when typing `:` followed by characters.
- **User-tag autocomplete** when typing `@`.
- **Template autocomplete** when typing `/` if `templates-text` set.
- **Typing indicator** rendered in header from `room.typingUsers`.
- **Online / offline / last-seen** rendered in header (1:1 chats) and
  list rows.
- **Last-message preview** rendered in the chats list including
  status checkmarks, audio mic icon + duration, deleted indicator,
  and sender prefix in group chats.
- **Reactions** as emoji pills below messages; current-user reactions
  styled distinctly.
- **Mobile** collapses sidebar below `responsive-breakpoint` and
  exposes a toggle button in the header.
- **Themes** light + dark + per-CSS-var override map.
- **i18n** via `text-messages` overrides for default English strings.

## Build & packaging (v2)

- `main`: `dist/vue-advanced-chat.umd.js`
- `module`: `dist/vue-advanced-chat.es.js`
- CSS: embedded in JS bundle (no separate stylesheet).
- `types`: `types/vue-advanced-chat.common.d.ts`.
- Runtime deps: `emoji-picker-element`, `micromark`, `micromark-extension-gfm`.
- Vue 3 (custom-element registration).
- No declared peer deps.
