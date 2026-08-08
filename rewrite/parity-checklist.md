# V2 -> V3 Compatibility Record

Current compatibility status for stable `vue-advanced-chat@2.1.2` and the
pre-GA `@advanced-chat/components@3.0.0-rc.1` working tree. Unlike the
archived alpha.1 reviews, this file is maintained as the current source of
truth.

Status legend:

- Done: equivalent capability exists in V3, possibly with a documented shape
  change.
- Partial: capability exists with a remaining documented limit.
- Removed: deliberately not carried into V3.
- V3-only: new public capability with no v2 equivalent.

## Distribution and layout

| v2 surface                                   | V3 surface                                                 | Status  | Notes                                                                          |
| -------------------------------------------- | ---------------------------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| Stable `vue-advanced-chat@2.1.2`             | Pre-GA `@advanced-chat/components@3.0.0-rc.1` tree         | Done    | Separate package and release track; not an in-place upgrade.                   |
| One Shadow DOM custom element + `register()` | 28 typed Vue SFCs plus bundled light-DOM custom element    | Done    | Vue is primary; web-component entrypoint auto-registers by default.            |
| JSON-stringified object/array props          | Typed Vue props or custom-element DOM properties           | Done    | Do not serialize complex V3 values into attributes.                            |
| Web-component event payloads                 | Typed `CustomEvent.detail`                                 | Done    | V3 exposes the payload directly, without Vue's single-argument array wrapper.  |
| `height`                                     | `Layout.height`, `AdvancedChat.height`                     | Done    |                                                                                |
| `current-user-id`                            | `currentUser: UserReference`                               | Done    | Pass `{ id }`; this is not the full `Message.sender` shape.                    |
| `theme="light" / "dark"`                     | `theme="light" / "dark" / "auto"` or `{ base, overrides }` | Done    | V3 adds reactive auto theme.                                                   |
| `styles` JSON prop                           | `Layout.styles` or object-form `theme` overrides           | Done    | `AdvancedChat` has no separate `styles` prop.                                  |
| `responsive-breakpoint`                      | Container-observed 768 px breakpoint                       | Partial | Mobile behavior is based on `AdvancedChat` width, but the breakpoint is fixed. |
| `single-room`                                | `Chat` standalone or `AdvancedChat.showChats=false`        | Done    |                                                                                |
| `rooms-list-opened`                          | Internal mobile list state + header toggle                 | Partial | No externally controlled visibility prop.                                      |
| `load-first-room`                            | First chat selected automatically                          | Partial | No opt-out.                                                                    |

## Chats list

| v2                                                         | V3                                    | Status  | Notes                                                                                 |
| ---------------------------------------------------------- | ------------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `rooms`                                                    | `chats: ChatModel[]`                  | Done    | Host supplies display order.                                                          |
| `rooms-order`                                              | Host-side sort                        | Removed | V3 does not reorder chats.                                                            |
| `loading-rooms` / `rooms-loaded`                           | `loadingChats` / `chatsLoaded`        | Done    | `chatsLoaded=true` means no more pages.                                               |
| `room-id`                                                  | `chat: ChatModel`                     | Done    | Full active chat rather than id.                                                      |
| `show-search` / `show-add-room`                            | `showSearch` / `showAddChat`          | Done    |                                                                                       |
| custom room search                                         | `customSearchEnabled` + `search-chat` | Done    | Local filtering is default; custom mode delegates results to host.                    |
| `fetch-more-rooms`                                         | `fetch-more-chats`                    | Done    | Sentinel plus `minimumVisibleChats` backfill; gated by loading/exhaustion.            |
| `room-actions`                                             | `chatActions`                         | Done    | Per-row actions; event is `{ chat, action }`.                                         |
| unread, typing, presence, last-message preview/status/time | `ChatsItem`                           | Done    | Includes audio mic/duration preview.                                                  |
| `rooms-empty`                                              | `chats-empty`                         | Done    | Public empty-state slot uses chat terminology.                                        |
| Per-room row slots                                         | No direct `Chats` equivalent          | Partial | Compose a custom list from exported primitives when full row replacement is required. |

## Header and mobile navigation

| v2                                 | V3                                     | Status | Notes                                                         |
| ---------------------------------- | -------------------------------------- | ------ | ------------------------------------------------------------- |
| Header name/avatar/presence/typing | `ChatHeader`                           | Done   | Uses `chat.avatar` and user status.                           |
| `menu-actions`                     | `headerActions`                        | Done   | `menu-action-handler` emits `{ chat, action }`.               |
| `room-info-enabled` / `room-info`  | `chatInfoEnabled` / `show-chat-info`   | Done   | `AdvancedChat` emits the active chat.                         |
| Message selection toolbar/actions  | `selectionActions`                     | Done   | Non-empty enables selection; action clears current selection. |
| Mobile room toggle                 | Container-observed one-pane navigation | Done   | Opening a chat hides the list; header toggle returns to it.   |

## Messages, pagination, and scrolling

| v2                                     | V3                                             | Status | Notes                                                                  |
| -------------------------------------- | ---------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| `messages`                             | `messages: MessageModel[]`                     | Done   | Chronological ascending; prepend older pages and append new messages.  |
| `loading-messages` / `messages-loaded` | `loadingMessages` / `messagesLoaded`           | Done   | `messagesLoaded=true` stops pagination.                                |
| `fetch-messages` near top              | `fetch-messages` within 60 px                  | Done   | Duplicate-gated and preserves relative position after prepends.        |
| `auto-scroll`                          | `{ onMount, onChatSwitch, onSend, onReceive }` | Done   | Incoming auto-scroll only while reader is already at bottom.           |
| Scroll-to-bottom + unread badge        | Scroll-to-latest pill                          | Done   | Appears for incoming appends while the reader is away from the bottom. |
| New-messages divider                   | `Message.unread` + `showNewMessagesDivider`    | Done   | `unread` also supplies pill count.                                     |
| Date divider / empty / no-chat state   | `ChatMessage` / localized states / slot        | Done   |                                                                        |

## Message rendering

| v2                                           | V3                                                   | Status  | Notes                                                                                   |
| -------------------------------------------- | ---------------------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| Markdown, GFM, underline, mentions, autolink | `formatText` / `MessageTemplate`                     | Done    | Known `<@id>` tokens render current names; unknown ids remain tokens.                   |
| Top-level text formatting                    | `textFormatting` on `Chat` / `AdvancedChat`          | Partial | Markdown/linkify options exist; custom per-marker syntax does not.                      |
| `link-options`                               | `textFormatting.linkOptions`                         | Done    | No dedicated link-color theme token yet.                                                |
| Sender name/avatar                           | Full `Message.sender: User`                          | Done    | Sender is not a reference lookup.                                                       |
| saved/distributed/seen/failure booleans      | `status` enum                                        | Done    | `sending`, `sent`, `delivered`, `read`, `failed`.                                       |
| edited/deleted/system/failure states         | `Message` variants                                   | Done    | Failed own messages emit the message directly for retry.                                |
| Reply, reactions, actions, selection         | `MessageReply`, `MessageReactions`, `MessageActions` | Done    | Delete remains host-defined through action handler.                                     |
| Image/video/file preview and download intent | `MessageFile`, `MediaPreview`, `open-file`           | Done    | Payload is `{ file, action: 'preview' \| 'download' }`.                                 |
| Audio playback                               | `AudioPlayer` + `AudioControl`                       | Done    | Native play/pause state and mouse/keyboard scrubbing; source/selection/unmount cleanup. |
| Per-message username policy                  | Non-own sender name shown                            | Partial | No `username-options` equivalent.                                                       |
| Reaction picker                              | Fixed inline emoji set                               | Partial | Not the full emoji picker.                                                              |

## Composer and payloads

| v2                                        | V3                                              | Status  | Notes                                                                             |
| ----------------------------------------- | ----------------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| Textarea, Enter send, Shift+Enter newline | `ChatFooter`                                    | Done    |                                                                                   |
| Reply/edit prefill and cancel             | Built-in reply/edit action ids                  | Done    | `REPLY_ACTION` / `EDIT_ACTION`.                                                   |
| File picker/filter/multiple/capture       | `accept`, `multiple`, `capture`                 | Done    | V3 also adds file count/size rejection events.                                    |
| Pending local previews                    | `ChatFileItem.localUrl`                         | Done    | Library owns while pending; send/edit transfers ownership to host for revocation. |
| `show-audio` + recording/encoder controls | None                                            | Removed | Audio playback remains; recording and MP3 encoding do not.                        |
| Emoji picker and `:` autocomplete         | `EmojiPicker` + small quick set                 | Partial | Quick autocomplete is intentionally limited.                                      |
| `@user` autocomplete / `usersTag`         | `<@id>` content + `mentionedUsers`              | Done    | Send/edit preserve stable tokens and provide deduplicated resolved users.         |
| `templates-text` `/` autocomplete         | None                                            | Removed | Build a custom surface with `AutocompleteMenu` if needed.                         |
| `textarea-action-enabled` / handler       | None                                            | Removed | Replace existing icons through slots or compose a custom footer.                  |
| `textarea-auto-focus`                     | None                                            | Partial | Not exposed.                                                                      |
| `typing-message: { roomId, message }`     | `typing-message: string`                        | Done    | Immediate start, 300 ms trailing update, and `''` on clear/stop.                  |
| `send-message`                            | `{ content, files, mentionedUsers, reply }`     | Done    | Active chat is host state; no `roomId`.                                           |
| `edit-message`                            | `{ messageId, content, files, mentionedUsers }` | Done    | No reply field on edit.                                                           |

## Operational state and localization

| Capability                            | V3 status | Notes                                                        |
| ------------------------------------- | --------- | ------------------------------------------------------------ |
| Loading/empty/error/permission states | V3-only   | Blocking state panels; error can emit `retry`.               |
| Offline/reconnecting                  | V3-only   | Non-blocking banner preserves chat history and navigation.   |
| Read-only composer                    | V3-only   | `composerDisabled` is independent from visual status.        |
| v2 `text-messages` overrides          | Done      | `AdvancedChatPlugin({ strings: Partial<Strings> })`.         |
| Locale negotiation                    | Partial   | `'auto'` is SSR-safe and negotiates, but only English ships. |

## Packaging and remaining limits

| Area                                | Status  | Notes                                                                                             |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| Vue component build                 | Done    | ESM/UMD, separate CSS, generated declarations, Vue 3.5 peer.                                      |
| Web-component build                 | Done    | Bundled Vue, light DOM, separate stylesheet, typed HTMLElement/events, default auto-registration. |
| Full SSR hydration                  | Partial | Imports/server markup are guarded; complete chat surfaces should remain client-only.              |
| Virtualized histories               | Partial | No windowing for very large message sets.                                                         |
| Room ordering                       | Removed | Host sorts.                                                                                       |
| Audio recording                     | Removed | Host supplies capture/encoding if required.                                                       |
| Templates and extra composer action | Removed | Compose custom UI instead.                                                                        |
| Link theming                        | Partial | Links render and support target/rel; fixed Layout link rule, no `Styles` token yet.               |
