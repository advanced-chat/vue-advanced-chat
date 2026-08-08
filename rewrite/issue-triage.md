# GitHub Issue / PR Triage for V3

Open issues and PRs on advanced-chat/advanced-chat-components, sorted by
what V3 should do with each. Use this as the script for the post-3.0
issue sweep. Last reconciled against the `3.0.0-rc.1` working tree.

## Resolved by V3 architecture (close on release)

These don't require code changes beyond what the rewrite already
delivers — close with a link to the V3 release notes.

| #                                                                            | Title                                     | Cluster                                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| [#166](https://github.com/advanced-chat/advanced-chat-components/issues/166) | Chat components library                   | Architecture (top-voted)                                                            |
| [#549](https://github.com/advanced-chat/advanced-chat-components/pull/549)   | PR: export internal components            | Architecture                                                                        |
| [#553](https://github.com/advanced-chat/advanced-chat-components/issues/553) | `JSON.stringify` props are unfriendly     | DX / typing                                                                         |
| [#445](https://github.com/advanced-chat/advanced-chat-components/issues/445) | Same — string-only props                  | DX / typing                                                                         |
| [#491](https://github.com/advanced-chat/advanced-chat-components/issues/491) | `vue-tsc --noEmit` fails                  | TypeScript                                                                          |
| [#526](https://github.com/advanced-chat/advanced-chat-components/issues/526) | Named slots break in Vue3 (top-voted bug) | Slots                                                                               |
| [#570](https://github.com/advanced-chat/advanced-chat-components/issues/570) | CSS style modification issue              | Shadow DOM / styling                                                                |
| [#511](https://github.com/advanced-chat/advanced-chat-components/issues/511) | Cannot style `vac-progress-bar`           | Shadow DOM / styling                                                                |
| [#510](https://github.com/advanced-chat/advanced-chat-components/issues/510) | linkifyjs unmet peer dep                  | Dependency hygiene                                                                  |
| [#551](https://github.com/advanced-chat/advanced-chat-components/issues/551) | node-sass dep unneeded                    | Dependency hygiene                                                                  |
| [#572](https://github.com/advanced-chat/advanced-chat-components/issues/572) | Expose conversation container             | Component-based V3 — consumers wrap `Chat` themselves                               |
| [#571](https://github.com/advanced-chat/advanced-chat-components/issues/571) | Dynamic `room-actions` control            | `Chats.chatActions` / `AdvancedChat.chatActions` are reactive per-row action arrays |
| [#557](https://github.com/advanced-chat/advanced-chat-components/issues/557) | `document-icon` slot has no effect        | V2-only slot-name shape                                                             |
| [#556](https://github.com/advanced-chat/advanced-chat-components/issues/556) | Vue 2 route switch loses chat             | V2-only                                                                             |
| [#555](https://github.com/advanced-chat/advanced-chat-components/issues/555) | `fetch-more-rooms` not firing             | V2-only event name                                                                  |
| [#541](https://github.com/advanced-chat/advanced-chat-components/issues/541) | Switching rooms triggers wrong event      | V2-only event shape                                                                 |
| [#532](https://github.com/advanced-chat/advanced-chat-components/issues/532) | Loading on every room switch              | V2-only                                                                             |
| [#517](https://github.com/advanced-chat/advanced-chat-components/issues/517) | `messages-loaded` doesn't take effect     | V2 web-component prop                                                               |
| [#539](https://github.com/advanced-chat/advanced-chat-components/issues/539) | Catch input change event                  | Already covered by `typing-message` in V3                                           |

## Bundle into 3.0 — landed (close on release)

Issues that originally fit the "still need code" / "regressions"
buckets and have since landed. Close with a link to the V3 release
notes and the version that shipped each fix.

| # / Item                                                                                                              | Landed in                            | What shipped                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [#530](https://github.com/advanced-chat/advanced-chat-components/issues/530) Disable `capture` on file input          | `alpha.1` (renamed `alpha.3`)        | `accept` / `multiple` / `capture` props on `ChatFooter` (and forwarded by `Chat` / `AdvancedChat`)                                    |
| [#478](https://github.com/advanced-chat/advanced-chat-components/issues/478) focus/blur events on textarea            | `alpha.1`                            | `focus-textarea` / `blur-textarea` events on `ChatFooter`                                                                             |
| [#548](https://github.com/advanced-chat/advanced-chat-components/issues/548) Toggle `show-new-messages-divider`       | `alpha.1`                            | `showNewMessagesDivider` prop on `Chat`                                                                                               |
| [#503](https://github.com/advanced-chat/advanced-chat-components/issues/503) Restore "no chat selected" state         | `alpha.1`                            | `Chat` accepts `chat: null` + `no-chat-selected` slot                                                                                 |
| [#461](https://github.com/advanced-chat/advanced-chat-components/issues/461) File size upload limit                   | `alpha.5`                            | `ChatFooter.maxFileSize` + `invalid-file: { reason: 'size' }` event                                                                   |
| [#474](https://github.com/advanced-chat/advanced-chat-components/issues/474) Limit number of uploaded files           | `alpha.5`                            | `ChatFooter.maxFiles` + `invalid-file: { reason: 'count' }` event                                                                     |
| [#513](https://github.com/advanced-chat/advanced-chat-components/issues/513) Position typing indicator above textarea | `alpha.5`                            | `Chat.typingIndicatorPosition` (`'header' \| 'composer' \| 'both' \| 'none'`) + `composer-typing` slot                                |
| Pagination event for messages                                                                                         | `alpha.2`                            | `fetch-messages` event fires when scrolled within 60 px of top                                                                        |
| Scroll-to-bottom button                                                                                               | `alpha.2`                            | "Scroll to latest" pill with unread-count badge                                                                                       |
| Auto-scroll on send / receive                                                                                         | `alpha.2` (policy prop in `alpha.5`) | Default policy plus `Chat.autoScroll: { onMount?, onChatSwitch?, onSend?, onReceive? }`                                               |
| Reply / edit wiring through `Chat`                                                                                    | `alpha.1`                            | `dispatchReplyEdit` pre-fills `ChatFooter` state; `useReplyEdit` extracted in `alpha.4`                                               |
| `edited` indicator                                                                                                    | `alpha.1`                            | Pencil icon next to timestamp when `Message.edited` is true                                                                           |
| `system` message render                                                                                               | `alpha.1`                            | Centered pill rendering in `Message`                                                                                                  |
| `disableActions` / `disableReactions`                                                                                 | `alpha.1`                            | Respected in `Message`/`MessageActions`                                                                                               |
| Local search filter on `Chats`                                                                                        | `alpha.1`                            | `useLocalSearch` (extracted in `alpha.4`); `customSearchEnabled` opts out                                                             |
| `chat-action-handler` re-emit on `Chats`                                                                              | `alpha.1`                            | `Chats` re-emits `ChatsItem`'s `chat-action-handler`                                                                                  |
| Markdown task-list a11y warning                                                                                       | `alpha.1`                            | `aria-label` on `<input type="checkbox">` in markdown render                                                                          |
| [#573](https://github.com/advanced-chat/advanced-chat-components/issues/573) Narrow embedded layout                   | `3.0.0-rc.1`                         | `AdvancedChat` observes its own width for the 768 px pane switch; message cards use `max-width: min(100%, 560px)`                     |
| Audio playback state and controls                                                                                     | `3.0.0-rc.1`                         | Native play/pause/end synchronization, rejected-play handling, mouse/keyboard scrubbing, source/selection reset, and listener cleanup |
| Mention payloads                                                                                                      | `3.0.0-rc.1`                         | Stable `<@id>` content plus deduplicated `mentionedUsers` on send/edit                                                                |
| Host operational states                                                                                               | `3.0.0-rc.1`                         | Blocking and non-blocking state UI, retry event, and independently disabled composer                                                  |

## Compatibility decisions before beta

No item in this record is still represented as an unimplemented v2 parity fix.
The remaining differences are either roadmap limits or deliberate removals in
`parity-checklist.md`.

- [#546](https://github.com/advanced-chat/advanced-chat-components/issues/546): links
  render using the shared `--chat-message-color-tag` value, but there is no
  dedicated `--chat-message-color-link` token. Keep the design issue open; do
  not document a dedicated token until one is implemented with light/dark
  values.
- [#531](https://github.com/advanced-chat/advanced-chat-components/issues/531): V3
  deliberately does not replace v2's extra textarea action with a new
  `composerActions` prop. Existing icon slots replace built-in controls;
  consumers needing additional controls compose a custom footer. Track any
  future generic action surface as an enhancement, not a parity blocker.

## V3 roadmap (post-3.0)

Important user-facing requests but too large or out of scope for the
3.0 cut. Track on a `v3-roadmap` label.

| #                                                                            | Title                              | Why deferred                                                              |
| ---------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| [#261](https://github.com/advanced-chat/advanced-chat-components/issues/261) | Virtual scroll                     | Touches every list-rendering path; heavy work                             |
| [#342](https://github.com/advanced-chat/advanced-chat-components/issues/342) | Performance for large histories    | Same                                                                      |
| [#451](https://github.com/advanced-chat/advanced-chat-components/issues/451) | SSR support (priority)             | Multiple browser-only globals; needs hydration audit                      |
| [#528](https://github.com/advanced-chat/advanced-chat-components/issues/528) | Nuxt 3 ClientOnly                  | Same as #451                                                              |
| [#522](https://github.com/advanced-chat/advanced-chat-components/issues/522) | Per-room message draft persistence | Storage strategy decision needed                                          |
| [#500](https://github.com/advanced-chat/advanced-chat-components/issues/500) | Room message search                | New surface                                                               |
| [#418](https://github.com/advanced-chat/advanced-chat-components/issues/418) | Read receipts (per recipient)      | Schema change                                                             |
| [#333](https://github.com/advanced-chat/advanced-chat-components/issues/333) | Star messages                      | Schema change                                                             |
| [#299](https://github.com/advanced-chat/advanced-chat-components/issues/299) | Pin chats                          | Schema change                                                             |
| [#338](https://github.com/advanced-chat/advanced-chat-components/issues/338) | Disappearing messages              | Schema + scheduling                                                       |
| [#536](https://github.com/advanced-chat/advanced-chat-components/issues/536) | i18n for emoji picker              | `emoji-picker-element` upstream                                           |
| [#365](https://github.com/advanced-chat/advanced-chat-components/issues/365) | Externalize file upload            | Already partially achieved via `send-message` payload — document properly |
| [#387](https://github.com/advanced-chat/advanced-chat-components/issues/387) | Map / location messages            | Custom message-type extensibility hook needed                             |
| [#371](https://github.com/advanced-chat/advanced-chat-components/issues/371) | Enter sends vs newline preference  | Add `submitOn` prop                                                       |

## Out of scope (close)

Items that don't fit the V3 charter or are vendor-specific.

| #                                                                            | Title                          | Reason                                       |
| ---------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------- |
| [#561](https://github.com/advanced-chat/advanced-chat-components/pull/561)   | JJSIP phone option             | Beyond chat surface                          |
| [#538](https://github.com/advanced-chat/advanced-chat-components/issues/538) | Disable right-aligned messages | Trivial via CSS variable / consumer override |
| [#502](https://github.com/advanced-chat/advanced-chat-components/issues/502) | "How to run locally"           | Documented in V3 README and `RELEASING.md`   |

## Stale PRs (recommend closing)

| #                                                                                                                                                                                                                                  | Action                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [#567](https://github.com/advanced-chat/advanced-chat-components/pull/567)                                                                                                                                                         | Maintainer fix on v2 — backport to `v2` if still relevant         |
| [#540](https://github.com/advanced-chat/advanced-chat-components/pull/540)                                                                                                                                                         | Cherry-pick the bug intent into V3, then close                    |
| [#520](https://github.com/advanced-chat/advanced-chat-components/pull/520) / [#519](https://github.com/advanced-chat/advanced-chat-components/pull/519)                                                                            | Stale dependabot, supersede                                       |
| [#518](https://github.com/advanced-chat/advanced-chat-components/pull/518) / [#514](https://github.com/advanced-chat/advanced-chat-components/pull/514)                                                                            | Stale styling PRs, redundant in V3                                |
| [#495](https://github.com/advanced-chat/advanced-chat-components/pull/495)                                                                                                                                                         | Inspect logic, then close — V3 has its own divider implementation |
| [#477](https://github.com/advanced-chat/advanced-chat-components/pull/477), [#307](https://github.com/advanced-chat/advanced-chat-components/pull/307), [#306](https://github.com/advanced-chat/advanced-chat-components/pull/306) | Stale, close                                                      |

## Bug clusters resolved without code change

These groups are addressed by leaving the v2 Shadow DOM and string-only
custom-element contract behind. V3 still offers a web component, but it renders
in light DOM, takes real DOM properties, and has a typed event map.

- **Slot mapping bugs** (`text2.replaceAll` errors on dashed names):
  V3 uses native Vue slots; the kebab→camel conversion that broke v2
  is gone.
- **CSS isolation pain**: V3 ships a single `components.css` in light DOM.
  Consumers can target component selectors directly and use object-form
  `theme` or `Layout.styles` for palette variables rather than crossing a
  Shadow DOM boundary.
- **Hard-coded sizes**: the primary pane switch now observes the component
  container and message cards constrain themselves to available width. Some
  leaf controls still have fixed dimensions and viewport media rules; these
  are documented limits rather than Shadow DOM override blockers.
- **TypeScript ergonomics**: V3 emits per-component declarations from
  `vite-plugin-dts`; users get autocompletion and prop typing without
  writing wrappers.
