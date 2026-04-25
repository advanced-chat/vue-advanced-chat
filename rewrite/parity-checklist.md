# V2 → V3 Parity Checklist

Status of every v2 feature in the V3 surface. Update rows as work
lands. Status legend:

- ✅ done — equivalent capability exists on `develop`
- 🟡 partial — present but missing nuance, slot, or option
- ❌ missing — not implemented yet
- 🚫 dropped — intentionally not carried over to V3
- 🆕 V3-only — new in V3, no v2 equivalent

## Container & layout

| v2 prop / behavior | V3 location | Status | Notes |
|---|---|---|---|
| `height` | `Layout.height`, `AdvancedChat.height` | ✅ | |
| `current-user-id` (string) | `AdvancedChat.user` (full `UserReference` object) | ✅ | shape change: pass `{ id }` not bare id string |
| `theme="light" / "dark"` | `Layout.theme` / `AdvancedChat.theme` | ✅ | also adds `'auto'` and `{ base, overrides }` |
| `styles` JSON prop | `theme={ base, overrides }` | ✅ | breaking shape change, equivalent capability |
| `responsive-breakpoint` | computed from CSS @media at 768px | 🟡 | hard-coded, not prop-driven; track in [#573](https://github.com/advanced-chat/vue-advanced-chat/issues/573) |
| `single-room` | use `Chat` directly without `Chats` | ✅ | architectural — drop the wrapper |
| `rooms-list-opened` | `AdvancedChat.showChatList` (internal) | 🟡 | not a prop; controlled internally via `toggle-chat-list` |
| `load-first-room` | auto-selects first chat in `AdvancedChat` | ✅ | always on; no opt-out yet |

## Chats / rooms list

| v2 | V3 | Status | Notes |
|---|---|---|---|
| `rooms` array (JSON-stringified) | `Chats.chats` typed `Chat[]` | ✅ | |
| `loading-rooms` | `Chats.loadingChats` | ✅ | |
| `rooms-loaded` | `Chats.chatsLoaded` | ✅ | |
| `rooms-order` | – | ❌ | consumer must pre-sort |
| `room-id` | `Chats.chat` (full `Chat`) | ✅ | shape change |
| `show-search` | `Chats.showSearch` / `ChatsSearch.showSearch` | ✅ | |
| `show-add-room` | `Chats.showAddChat` / `ChatsSearch.showAddChat` | ✅ | |
| `custom-search-room-enabled` + `search-room` event | `Chats.customSearchEnabled` + `search-chat` event | ✅ | local filter applied by default; opt out for server-driven search |
| `add-room` event | `Chats.add-chat` | ✅ | |
| `fetch-more-rooms` event | `Chats.fetch-more-chats` | ✅ | renamed |
| `room-actions` per row | `Chats.chatActions` → `ChatsItem.actions` | ✅ | threaded through |
| `room-action-handler` event | `Chats.chat-action-handler` | ✅ | re-emits with `{ chat, action }` |
| `unreadCount` badge | rendered | ✅ | |
| `typingUsers` row text | rendered when no last message | ✅ | |
| online/offline dot | rendered for 1:1 chats | ✅ | |
| last message preview (formatting) | rendered via `MessageTemplate` single-line | ✅ | |
| last message timestamp | locale-formatted (time today, short month/day otherwise) | ✅ | |
| last message status checkmarks | rendered | ✅ | |
| audio last-message: mic icon + duration | rendered | ✅ | |
| `rooms-empty` slot / text | `Chats[name=rooms-empty]` slot or `chats.empty` string | ✅ | |
| infinite scroll trigger | IntersectionObserver in `Chats` | ✅ | replaces `scroll-distance` prop |

## Chat header

| v2 | V3 | Status | Notes |
|---|---|---|---|
| name | `ChatHeader` from `chat.name` | ✅ | |
| avatar | `chat.icon` (renamed) | ✅ | |
| typing users | computed via `typingUsersString` | ✅ | |
| online / offline / last-seen | rendered for 1:1 | ✅ | |
| toggle rooms list (mobile) | `toggle-chat-list` event | ✅ | |
| `room-info-enabled` + `room-info` event | `ChatHeader.chatInfoEnabled` + `show-chat-info` | ✅ | renamed |
| `menu-actions` + `menu-action-handler` | `ChatHeader.actions` + `menu-action-handler` | ✅ | |
| message selection toolbar | rendered when `messageSelection.enabled` and any selected | ✅ | |
| `message-selection-actions` + handler | `ChatHeader.messageSelection.actions` + `message-selection-action-handler` | ✅ | grouped under one prop |
| selection cancel | `cancel-message-selection` event | ✅ | |
| named slots (avatar, info, options, etc.) | `room-header*` slots passthrough | ✅ | |

## Chat messages list

| v2 | V3 | Status | Notes |
|---|---|---|---|
| `messages` array | `Chat.messages` | ✅ | |
| `messages-loaded` | – | ❌ | no equivalent yet; pagination not wired |
| `loading-messages` spinner | `Chat.loadingMessages` + `Loader` | ✅ | |
| `fetch-messages` event (scroll up) | – | ❌ | infinite scroll for messages not implemented |
| `auto-scroll` policy | – | ❌ | no scroll behavior yet (always shows top) |
| scroll-to-bottom button | – | ❌ | |
| date divider between days | rendered in `ChatMessage` | ✅ | uses `toLocaleDateString` |
| `show-new-messages-divider` | `Chat.showNewMessagesDivider` → `ChatMessage` | ✅ | |
| `messages-empty` text | localized via `chat.messages.empty` | ✅ | slot still pending |
| `no-room-selected` slot | `Chat[name=no-chat-selected]` slot, fallback to `chat.empty` string | ✅ | |

## Message rendering

| v2 | V3 | Status | Notes |
|---|---|---|---|
| text content | `MessageTemplate` | ✅ | |
| markdown formatting (GFM + underline + tags) | `formatText` in `utils/text-formatter` | ✅ | |
| `text-formatting` prop | `MessageTemplate.formattingOptions` | 🟡 | per-component, not at `AdvancedChat` level; no per-marker config |
| `link-options` | `MessageTemplate.formattingOptions.linkOptions` | ✅ | |
| `username` shown when room ≥ 3 users | hard-coded: shown for non-own messages | 🟡 | no `username-options` analogue |
| sender avatar in message | – | ❌ | no avatar in `Message` template |
| timestamp | rendered (locale time) | ✅ | |
| message status: saved / delivered / read | checkmark single → double → blue | ✅ | rename: `seen→read`, `distributed→delivered` |
| `edited` indicator | pencil icon rendered in meta row when `message.edited` | ✅ | |
| `deleted` indicator | rendered with `SvgIcon name="deleted"` | ✅ | |
| `failure` indicator (clickable) | rendered button emits `open-failed-message` | ✅ | |
| `system` message | rendered as centered pill via `vac-message-system` | ✅ | |
| `disableActions` flag | hides the per-message dropdown | ✅ | |
| `disableReactions` flag | hides the per-message reaction picker | ✅ | |
| reply quote | `MessageReply` rendered above text | ✅ | |
| reactions pills | `MessageReactions` | ✅ | |
| message actions menu | `MessageActions` | ✅ | |
| reaction emoji picker | inline 5-emoji menu | 🟡 | fixed list, not full emoji picker |
| `replyMessage` action | `reply` action name pre-fills `ChatFooter` reply state | ✅ | |
| `editMessage` action | `edit` action name pre-fills `ChatFooter` edit state | ✅ | |
| `deleteMessage` action | – | 🚫 | by design — no `delete-message` event; consumer handles via `message-action-handler` |
| `selectMessages` action | – | 🟡 | consumer drives selection mode via `messageSelection.enabled`; not auto on a specific action name |
| message selection checkbox | rendered via `vac-message-row-selectable` | ✅ | |
| message-files (multiple) | `MessageFiles` | ✅ | |
| image preview / viewer | `MediaPreview` | ✅ | |
| video preview | `MessageFile` inline `<video>` + lightbox | ✅ | |
| audio playback | `AudioPlayer` | ✅ | |
| audio reply preview | `MessageReply` uses `AudioPlayer` | ✅ | |
| file download / open | `opened:file` event with `'preview' | 'download'` | ✅ | replaces `open-file` |

## Footer / input

| v2 | V3 | Status | Notes |
|---|---|---|---|
| textarea | rendered | ✅ | |
| `room-message` preset value | `ChatFooter.roomMessage` | ✅ | |
| `textarea-auto-focus` | – | ❌ | not wired |
| send icon (`show-send-icon`) | `ChatFooter.showSendIcon` | ✅ | |
| disabled-when-empty | `vac-send-disabled` | ✅ | |
| reply preview block | rendered when `replyMessage` ref set | ✅ | |
| edit mode highlight | `vac-textarea-outline` | ✅ | |
| `edit-close-icon` slot | rendered when in edit mode; `cancel-edit` resets footer | ✅ | |
| `reply-close-icon` slot | rendered alongside reply preview; `cancel-reply` resets footer | ✅ | |
| file picker (`show-files`) | `ChatFooter.showFiles` + `<input type="file">` | ✅ | |
| `accepted-files` mime filter | `ChatFooter.acceptedFiles` | ✅ | |
| `multiple-files` | `ChatFooter.multipleFiles` | ✅ | |
| `capture-files` | `ChatFooter.captureFiles` (`'' | 'user' | 'environment'`) | ✅ | |
| audio recording / `show-audio` | – | 🚫 | dropped; AudioControl is playback only |
| emoji picker icon (`show-emojis`) | `ChatFooter.showEmojis` | ✅ | |
| emoji picker dropdown | `EmojiPicker` (emoji-picker-element) | ✅ | |
| emoji autocomplete (`:foo`) | hardcoded 8-emoji list | 🟡 | not full emoji set |
| user-tag autocomplete (`@user`) | `ChatUserTag` | ✅ | |
| `templates-text` autocomplete (`/foo`) | – | ❌ | not implemented |
| `textarea-action-enabled` + slot + handler | – | ❌ | no extra textarea icon |
| `typing-message` event | emitted on every keystroke | 🟡 | always emits raw textarea value, no debounce / start-stop semantics |
| Enter sends, Shift+Enter newline | implemented | ✅ | |
| Esc cancels autocomplete | – | 🟡 | implicit; no explicit close |

## Send / edit payloads

| v2 event payload | V3 payload | Status |
|---|---|---|
| `send-message: { roomId, content, files, replyMessage, usersTag }` | `send-message: { content, files, reply }` | 🟡 — shape change; no `roomId` (parent already knows), no `usersTag` derived list |
| `edit-message: { roomId, messageId, newContent, files, replyMessage, usersTag }` | `edit-message: { messageId, content, files }` | 🟡 — shape change |
| `delete-message: { roomId, message }` | – | 🚫 — consumer fires from `message-action-handler` |
| `open-file: { message, file }` | `opened:file: { file, action }` | 🟡 — adds `'preview' | 'download'` discriminator, drops `message` reference |

## Localization

| v2 string | V3 key | Status |
|---|---|---|
| `ROOMS_EMPTY` | `chats.empty` | ✅ |
| `ROOM_EMPTY` | `chat.empty` | ✅ |
| `MESSAGES_EMPTY` | `chat.messages.empty` | ✅ |
| `MESSAGE_DELETED` | `chat.message.deleted` | ✅ |
| `NEW_MESSAGES` | `chat.messages.new` | ✅ |
| `CONVERSATION_STARTED` | – | ❌ |
| `TYPE_MESSAGE` | `chat.message.placeholder` | ✅ |
| `SEARCH` | `chats.search.placeholder` | ✅ |
| `IS_ONLINE` | `chat.user.is-online` | ✅ |
| `LAST_SEEN` | `chat.user.last-seen` | ✅ |
| `IS_TYPING` | `chat.typing` | ✅ |
| `CANCEL_SELECT_MESSAGE` | `chat.cancel-selection` | ✅ |

`getLocalizationStrings('auto')` currently always returns English even
when the browser locale is non-English. Functional placeholder; only
ships English.

## Theming

| v2 | V3 | Status |
|---|---|---|
| light / dark themes | light.json / dark.json | ✅ |
| `styles` prop overrides | `theme={ base, overrides }` | ✅ |
| CSS variables for every visible color | `Styles` interface | ✅ |
| markdown / emoji / icon colors via vars | yes | ✅ |
| auto theme tracking `prefers-color-scheme` | reactive via `useThemeStyles` composable | ✅ |

## Build / packaging

| v2 artifact | V3 artifact | Status |
|---|---|---|
| `dist/vue-advanced-chat.es.js` | `dist/components.js` | ✅ |
| `dist/vue-advanced-chat.umd.js` | `dist/components.umd.cjs` | ✅ |
| CSS embedded in JS | `dist/components.css` (separate, exported via `./styles`) | ✅ |
| `types/*.d.ts` | `dist/src/**/*.d.ts` (per component, generated) | ✅ |
| `files: dist + types` | `files: ['dist']` | ✅ |
| peer deps | `vue: ^3.5.0` declared as peer | ✅ |
| Vue version | `^3.5.0` peer | ✅ |
