# GitHub Issue / PR Triage for V3

Open issues and PRs on advanced-chat/vue-advanced-chat as of the V3
planning pass, sorted by what V3 should do with each. Use this as the
script for the post-3.0 issue sweep.

## Resolved by V3 architecture (close on release)

These don't require code changes beyond what the rewrite already
delivers — close with a link to the V3 release notes.

| # | Title | Cluster |
|---|---|---|
| [#166](https://github.com/advanced-chat/vue-advanced-chat/issues/166) | Chat components library | Architecture (top-voted) |
| [#549](https://github.com/advanced-chat/vue-advanced-chat/pull/549) | PR: export internal components | Architecture |
| [#553](https://github.com/advanced-chat/vue-advanced-chat/issues/553) | `JSON.stringify` props are unfriendly | DX / typing |
| [#445](https://github.com/advanced-chat/vue-advanced-chat/issues/445) | Same — string-only props | DX / typing |
| [#491](https://github.com/advanced-chat/vue-advanced-chat/issues/491) | `vue-tsc --noEmit` fails | TypeScript |
| [#526](https://github.com/advanced-chat/vue-advanced-chat/issues/526) | Named slots break in Vue3 (top-voted bug) | Slots |
| [#570](https://github.com/advanced-chat/vue-advanced-chat/issues/570) | CSS style modification issue | Shadow DOM / styling |
| [#511](https://github.com/advanced-chat/vue-advanced-chat/issues/511) | Cannot style `vac-progress-bar` | Shadow DOM / styling |
| [#510](https://github.com/advanced-chat/vue-advanced-chat/issues/510) | linkifyjs unmet peer dep | Dependency hygiene |
| [#551](https://github.com/advanced-chat/vue-advanced-chat/issues/551) | node-sass dep unneeded | Dependency hygiene |

## Bundle into 3.0 (still need code)

Tractable issues that fit the new architecture and are worth
including before tagging 3.0:

| # | Title | Action in V3 |
|---|---|---|
| [#530](https://github.com/advanced-chat/vue-advanced-chat/issues/530) | Disable `capture` on file input | Add `acceptedFiles` / `captureFiles` / `multipleFiles` props on `ChatFooter` |
| [#461](https://github.com/advanced-chat/vue-advanced-chat/issues/461) | File size upload limit | Surface `maxFileSize` on `ChatFooter` (consumer enforces; we filter) |
| [#474](https://github.com/advanced-chat/vue-advanced-chat/issues/474) | Limit number of uploaded files | Add `maxFiles` on `ChatFooter` |
| [#478](https://github.com/advanced-chat/vue-advanced-chat/issues/478) | Emit focus / blur on textarea | Add `focus` / `blur` events on `ChatFooter` |
| [#539](https://github.com/advanced-chat/vue-advanced-chat/issues/539) | Catch input change event | Already covered by `typing-message` |
| [#572](https://github.com/advanced-chat/vue-advanced-chat/issues/572) | Expose conversation container | Trivial in component-based V3; consumers wrap `Chat` themselves |
| [#548](https://github.com/advanced-chat/vue-advanced-chat/issues/548) | Toggle `show-new-messages-divider` | Add `showNewMessagesDivider` prop on `Chat` |
| [#503](https://github.com/advanced-chat/vue-advanced-chat/issues/503) | Restore "no chat selected" state | `Chat` already supports `chat: null` |
| [#513](https://github.com/advanced-chat/vue-advanced-chat/issues/513) | Position typing indicator above textarea | Either prop or document slot composition |

## Bundle into 3.0 (regressions to fix)

Things V3 currently regresses against v2 — must close before tagging
the first non-prerelease.

| Item | Notes |
|---|---|
| Pagination event for messages | v2 `fetch-messages` not yet wired in `Chat` |
| Auto-scroll behavior on send / receive | v2 `auto-scroll` policy gone |
| Scroll-to-bottom button | v2 had this; V3 doesn't |
| Reply / edit wiring through `Chat` | The `replyMessage` and `editMessage` actions don't pre-fill `ChatFooter` state |
| `edited` indicator | No pencil icon rendered in V3 |
| `system` message render | No special render in V3 |
| `disableActions` / `disableReactions` flags | Not respected in V3 |
| Local search filter on `Chats` | `search-chat` is emitted but local filter never updates |
| `chat-action-handler` re-emit on `Chats` | `ChatsItem` emits but `Chats` swallows it |
| Markdown task-list a11y warning | `<input>` checkboxes flagged by Storybook a11y `error` |

## V3 roadmap (post-3.0)

Important user-facing requests but too large or out of scope for the
3.0 cut. Track on a `v3-roadmap` label.

| # | Title | Why deferred |
|---|---|---|
| [#261](https://github.com/advanced-chat/vue-advanced-chat/issues/261) | Virtual scroll | Touches every list-rendering path; heavy work |
| [#342](https://github.com/advanced-chat/vue-advanced-chat/issues/342) | Performance for large histories | Same |
| [#451](https://github.com/advanced-chat/vue-advanced-chat/issues/451) | SSR support (priority) | Multiple browser-only globals; needs hydration audit |
| [#528](https://github.com/advanced-chat/vue-advanced-chat/issues/528) | Nuxt 3 ClientOnly | Same as #451 |
| [#522](https://github.com/advanced-chat/vue-advanced-chat/issues/522) | Per-room message draft persistence | Storage strategy decision needed |
| [#500](https://github.com/advanced-chat/vue-advanced-chat/issues/500) | Room message search | New surface |
| [#418](https://github.com/advanced-chat/vue-advanced-chat/issues/418) | Read receipts (per recipient) | Schema change |
| [#333](https://github.com/advanced-chat/vue-advanced-chat/issues/333) | Star messages | Schema change |
| [#299](https://github.com/advanced-chat/vue-advanced-chat/issues/299) | Pin chats | Schema change |
| [#338](https://github.com/advanced-chat/vue-advanced-chat/issues/338) | Disappearing messages | Schema + scheduling |
| [#536](https://github.com/advanced-chat/vue-advanced-chat/issues/536) | i18n for emoji picker | `emoji-picker-element` upstream |
| [#365](https://github.com/advanced-chat/vue-advanced-chat/issues/365) | Externalize file upload | Already partially achieved via `send-message` payload — document properly |
| [#387](https://github.com/advanced-chat/vue-advanced-chat/issues/387) | Map / location messages | Custom message-type extensibility hook needed |
| [#371](https://github.com/advanced-chat/vue-advanced-chat/issues/371) | Enter sends vs newline preference | Add `submitOn` prop |

## Out of scope (close)

Items that don't fit the V3 charter or are vendor-specific.

| # | Title | Reason |
|---|---|---|
| [#561](https://github.com/advanced-chat/vue-advanced-chat/pull/561) | JJSIP phone option | Beyond chat surface |
| [#538](https://github.com/advanced-chat/vue-advanced-chat/issues/538) | Disable right-aligned messages | Trivial via CSS variable / consumer override |
| [#502](https://github.com/advanced-chat/vue-advanced-chat/issues/502) | "How to run locally" | Documented in V3 README and `RELEASING.md` |

## Stale PRs (recommend closing)

| # | Action |
|---|---|
| [#567](https://github.com/advanced-chat/vue-advanced-chat/pull/567) | Maintainer fix on v2 — merge into `main` if still relevant before V3 takes over `latest` |
| [#540](https://github.com/advanced-chat/vue-advanced-chat/pull/540) | Cherry-pick the bug intent into V3, then close |
| [#520](https://github.com/advanced-chat/vue-advanced-chat/pull/520) / [#519](https://github.com/advanced-chat/vue-advanced-chat/pull/519) | Stale dependabot, supersede |
| [#518](https://github.com/advanced-chat/vue-advanced-chat/pull/518) / [#514](https://github.com/advanced-chat/vue-advanced-chat/pull/514) | Stale styling PRs, redundant in V3 |
| [#495](https://github.com/advanced-chat/vue-advanced-chat/pull/495) | Inspect logic, then close — V3 has its own divider implementation |
| [#477](https://github.com/advanced-chat/vue-advanced-chat/pull/477), [#307](https://github.com/advanced-chat/vue-advanced-chat/pull/307), [#306](https://github.com/advanced-chat/vue-advanced-chat/pull/306) | Stale, close |

## Bug clusters resolved without code change

These groups are addressed simply by leaving the web-component /
shadow-DOM model behind. Mention in release notes.

- **Slot mapping bugs** (`text2.replaceAll` errors on dashed names):
  V3 uses native Vue slots; the kebab→camel conversion that broke v2
  is gone.
- **CSS isolation pain**: V3 ships a single `components.css` and uses
  CSS custom properties — consumers can override anything in their
  own stylesheet at any specificity.
- **Hard-coded sizes** (e.g. `190px` audio progress bar, viewport
  `@media`): rewriting these against container queries / variables
  is now a single-component change rather than a `!important` battle
  through Shadow DOM.
- **TypeScript ergonomics**: V3 emits per-component declarations from
  `vite-plugin-dts`; users get autocompletion and prop typing without
  writing wrappers.
