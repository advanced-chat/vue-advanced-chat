# V3 Release Plan

This is the path from `@advanced-chat/components@3.0.0-rc.3` to a published
`3.0.0`. Stable v2 remains `vue-advanced-chat@2.1.2` on npm and its source is
preserved on the `v2` branch; V3 is not a drop-in replacement.

## Decisions taken

- **Package name**: ship V3 as `@advanced-chat/components`. Leave the
  legacy `vue-advanced-chat` package alone on `latest`. After 3.0
  GA, deprecate `vue-advanced-chat` with a pointer to the new name.
- **Migration story**: V3 is not a drop-in replacement for v2. The
  README explicitly tells users on v2 to keep using the
  `vue-advanced-chat` package and the `v2` branch.
- **Distribution**: ESM-only Node package, browser-only UMD Vue component
  artifact, bundled light-DOM web-component builds, separate CSS entrypoints,
  and rolled-up component plus HTMLElement/event declarations.
- **Publishing**: npm trusted publishing via the `release-package.yml`
  GitHub Actions workflow with OIDC. No long-lived tokens.

## Publication baseline

The 2026-08-08 [publish-readiness audit](./publish-readiness-audit.md) found
release blockers not covered by the original build and test gates. The rc.3
tree resolves the repository identity, version, CommonJS, licensing,
declaration, manifest, governance, public-copy, and packed-consumer findings.
Pages is deployed and npm trusted publishing has been corrected for the renamed
repository. The remaining gate is to publish the immutable rc.3 tag to `next`.

## Gates that must be green before tagging

Run locally and in CI from a clean clone:

- `npm ci`
- `npm run format:check`
- `npm run type-check`
- `npm run lint`
- `npm run test:storybook` (Storybook + Playwright a11y / interaction tests)
- `npm run build`
- `npm run verify:pack` (validates the tarball contract)
- `npm run build-storybook`

`npm run verify` chains all of the above.

## Pre-3.0 work order

1. **Critical correctness fixes** ✅ landed in `3.0.0-alpha.1`:
   - Transitive `micromark-*` packages moved into declared
     `dependencies`.
   - `Chats.search-chat` wired to the local `filter` ref by default;
     `customSearchEnabled` opts out.
   - `Chats.chat-action-handler` re-emits from `ChatsItem`.
   - `replyMessage` / `editMessage` actions on `Chat` pre-fill
     `ChatFooter` state and a cancel-edit / cancel-reply control is
     rendered by default.
   - `vue` moved to `peerDependencies`.
2. **Parity fixes** ✅ landed in `3.0.0-alpha.1`:
   - `edited` indicator on `Message`.
   - `system` message render on `Message`.
   - `disableActions` / `disableReactions` flags respected.
   - Hard-coded English replaced with `chat.empty`, `chat.messages.empty`,
     `chat.messages.new`, `chat.message.placeholder`,
     `chat.message.deleted`, `chat.cancel-reply`, `chat.cancel-edit`.
   - File-input controls landed as `acceptedFiles`, `multipleFiles`, and
     `captureFiles`, then were renamed to current `accept`, `multiple`, and
     `capture` in `alpha.3`.
   - `focus-textarea` / `blur-textarea` events on `ChatFooter`.
3. **Polish** ✅ landed in `3.0.0-alpha.1`:
   - Chat-list timestamps locale-formatted (time today, short month/day
     otherwise).
   - `useThemeStyles` composable reacts to `prefers-color-scheme`
     changes in `'auto'` mode.
   - Storybook a11y `error` mode passing on all 65 tests, including the
     new contrast-fix on the muted text variables.
   - Storybook variants for empty/loading/no-chat-selected/edited/system/
     deleted/failure/audio/reply states.
   - Local-search interaction test added.
4. **Pagination + scroll-to-bottom** ✅ landed in `3.0.0-alpha.2`:
   - `Chat` and `AdvancedChat` emit `fetch-messages` when the list
     scrolls within 60 px of the top, suppressed while
     `loadingMessages` or `messagesLoaded` is true.
   - "Scroll to latest" pill renders with a count badge of unread
     messages when the user is not at the bottom.
   - `Chat` auto-scrolls on mount, on chat switch, on send, and on
     receive when the user is at the bottom.
5. **Remaining GA gaps** ✅ landed in `3.0.0-alpha.5`:
   - `Chat.autoScroll` policy prop (`{ onMount?, onChatSwitch?,
onSend?, onReceive? }`) — defaults match the alpha.2 hard-coded
     behavior; consumers can opt out per leg.
   - `ChatFooter.maxFiles` and `ChatFooter.maxFileSize` props,
     forwarded by `Chat` / `AdvancedChat`. Files above either cap
     are emitted as `invalid-file: { file, reason }`
     ([#461](https://github.com/advanced-chat/advanced-chat-components/issues/461),
     [#474](https://github.com/advanced-chat/advanced-chat-components/issues/474)).
   - `Chat.typingIndicatorPosition` prop (`'header' | 'composer' |
'both' | 'none'`) plus a `composer-typing` slot that exposes
     the typing string
     ([#513](https://github.com/advanced-chat/advanced-chat-components/issues/513)).
   - Slot inventory documented inline (`<!-- @slot ... -->` on every
     public slot) so Storybook autodocs exposes it on component pages.
   - `getLocalizationStrings('auto')` actually negotiates against
     `navigator.language` via the new `negotiateLocale()` helper.
     Currently still resolves to `'en'` (only locale shipped) but
     warns in DEV when the detected language isn't supported, so
     adding a second locale is purely additive.
6. **Post-alpha.5 public-contract fixes** ✅ included in `3.0.0-rc.3`:
   - Typed, auto-registering light-DOM web-component entrypoint with direct
     `CustomEvent.detail` and future-mount registration option semantics.
   - Stable `<@id>` mention content plus `mentionedUsers` on send/edit.
   - Explicit object-URL ownership transfer after send/edit.
   - Container-observed mobile navigation and host operational states.
   - Audio playback lifecycle and mouse/keyboard scrubbing fixes.
   - Public docs, examples, Storybook copy, and compatibility records audited
     against implementation.
7. **Carryover from the alpha.4 code review**:
   - ✅ `useAutocomplete` now watches item length rather than deep-traversing
     consumer objects and resets correctly after in-place length changes.
   - **Untangle `Chats.vue`'s two load-more paths**
     (`src/components/Chats.vue:120-127` local `loadMoreChats`
     - the composable's intersection callback at
       `src/composables/use-infinite-scroll.ts:57-66`). Pure refactor,
       no behavior change — both paths converge correctly today
       because `loading` and `loadingMoreChats` are the same ref.
       Inline the local helper into the `minimumVisibleChats` backfill
       (the only remaining caller) and rename it for what it actually
       does (`backfillIfBelowMinimum`) so the file reads as a single
       codepath.

8. **Release-candidate prep** ✅ completed for `3.0.0-rc.3`:
   - ESM-only package contract and strict packed-consumer verification.
   - MIT and bundled third-party notices.
   - Security, contribution, conduct, support, and issue templates.
   - Corrected public guides and deterministic Storybook documentation.
9. **GA prep** after rc feedback:
   - Close any release-candidate defects without adding features.
   - Bump `package.json` to `3.0.0` and add a dated changelog section.
   - Run the GitHub issue triage sweep in `issue-triage.md`.

## Versioning ladder

Use semver prereleases on `next`:

- `3.0.0-alpha.0` — architecture frozen, surface in flux
- `3.0.0-alpha.1` — internal milestone: parity gaps closed for actions, search,
  reply/edit, file-input controls, system/edited rendering, and theming.
- `3.0.0-alpha.2` — internal milestone: message pagination, auto-scroll on receive, and
  scroll-to-latest pill; `Chat` event-payload reshape.
- `3.0.0-alpha.3` — internal milestone: naming + ergonomics pass (P1 from
  `ergonomics-review.md`).
- `3.0.0-alpha.4` — internal milestone: composables extraction + `<AutocompleteMenu>`
  unification + correctness fixes (SSR `singleLine`, image-error
  handler, `URL.createObjectURL` dedupe).
- `3.0.0-alpha.5` — internal milestone closing the originally listed GA gaps:
  file-constraint props, typing-indicator position, `autoScroll`
  policy, locale negotiation, slot autodocs.
- `3.0.0-rc.1` — failed pre-publish verification; immutable tag retained but no
  npm package was published.
- `3.0.0-rc.2` — passed verification, but npm rejected the stale pre-rename
  trusted-publisher identity; immutable tag retained but no package was published.
- `3.0.0-rc.3` — first published release candidate: contract complete,
  ESM-only, licensed, packed-consumer verified, and documentation audited.
- `3.0.0` — promoted to `latest`

Each tag must satisfy:

- `package.json` version matches the tag (`v3.0.0-rc.3` ↔ `3.0.0-rc.3`)
- Tag is pushed from a clean, reviewed commit on `main`
- CI on the exact tag is green

## Publishing

Triggered by an immutable `v*` tag push:

1. Ensure `package.json` and the changelog match the intended version on
   `main`.
2. Tag and push only that tag, for example
   `git tag v3.0.0-rc.3 && git push origin v3.0.0-rc.3`.
3. The workflow validates the tag and publishes prereleases to `next` or stable
   versions to `latest`.
4. Confirm the npm package page shows provenance on the new version.
5. Capture release notes in the matching GitHub Release.

Trusted publishing setup must already be configured for the workflow
(see `RELEASING.md`). No `NPM_TOKEN` is used.

## After 3.0

- Announce on the repo via Discussions and a pinned issue.
- Run the issue triage sweep — close items in `issue-triage.md` with
  the right disposition.
- Add a `v3-roadmap` label and migrate deferred enhancements to it.
- Decide whether to deprecate `vue-advanced-chat` on npm immediately
  or wait one minor cycle.
