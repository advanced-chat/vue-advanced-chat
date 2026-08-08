# Archived V3 Architecture Review (`3.0.0-alpha.1`)

> Historical audit only. This review records the state and recommendations at
> `3.0.0-alpha.1`; its words such as "today", "current", "missing", and
> "incomplete" do not describe the `3.0.0-alpha.5` working tree. Pagination,
> auto-scroll, event renames, action constants, type exports, Tailwind removal,
> click-outside replacement, strict utility typing, and the public composables
> subsequently landed. Use [`parity-checklist.md`](./parity-checklist.md) for
> current compatibility status. The findings below are retained as design
> history and should not be reopened without checking the implementation.

A maintainer-eye review of the V3 surface as it stands at
`3.0.0-alpha.1`. Each section is ranked by what should land before
the first non-prerelease tag (`P0`), what is fine for `3.1+` (`P1`),
and what is a deliberate-design call to confirm or document (`note`).

The review assumes the parity work in `parity-checklist.md` and the
test suite from `ac95636` are in place.

## Executive summary

The V3 surface is a real improvement over v2: a typed component
library, plugin-based localization, theme via CSS custom properties,
peer-deped Vue, and a separate stylesheet. The core composition
(`AdvancedChat → Chats + Chat → primitives`) is sound.

What it isn't yet: cohesive. Several decisions are _almost_ right
but inconsistent across the surface — event naming, the line between
"composer" and "state owner", the `Action` contract, the slot
namespace. Pagination and auto-scroll for messages are incomplete.
There's bundled tooling that doesn't earn its weight (Tailwind),
internalized utilities that have battle-tested replacements
(`v-click-outside` → `@vueuse/core`), and a small number of utility
files with `// @ts-nocheck` that undermine the strict-TS story.

Most of these are tractable before 3.0 GA. The library deserves
another pass to make the surface feel like one design rather than
seven mostly-aligned ones.

## What's working

- **Component decomposition.** `AdvancedChat` is the convenience
  composition; consumers can drop down to `Chats + Chat` and below
  without reaching for prop hacks. This was the headline goal of
  the rewrite and it lands cleanly.
- **CSS variable theming.** Every visible color is a custom property,
  the `Layout` component emits the active palette as inline CSS vars,
  and `useThemeStyles` reacts to `prefers-color-scheme`. This is the
  right model.
- **Plugin-based localization.** `AdvancedChatPlugin({ strings })` is
  cleaner than v2's per-instance `text-messages` prop and supports
  `provide/inject` so deep components don't need string drilling.
- **Type exports.** `Chat`, `Message`, `User`, `Action`, `Id`, plus
  the per-component `*Props`/`*Events` interfaces are emitted as
  proper `.d.ts` via `vite-plugin-dts`. Consumers get autocomplete
  on every prop and event without writing wrappers.
- **Fully typed events.** `defineEmits<EventsInterface>()` everywhere.
- **Storybook + Vitest browser project.** 173 play() interaction
  tests means every component has runtime coverage, not just type
  checks. The a11y-error gate keeps the surface honest.
- **Pack contract.** `verify-pack.mjs` enforces what ships in the
  tarball. This is the kind of small guardrail that pays off
  forever.

## P0: should land before 3.0 GA

### 1. Standardize event naming (kebab-case throughout)

Today the surface mixes:

- `send-message`, `chat-action-handler`, `fetch-more-chats` — kebab
- `opened:file`, `clicked:user-tag` — colon-namespaced

The colon form has no parallel in Vue's ecosystem (it's a custom
namespacing convention). Pick one. I'd standardize on kebab-case:

| Current            | Proposed         |
| ------------------ | ---------------- |
| `opened:file`      | `open-file`      |
| `clicked:user-tag` | `click-user-tag` |

Past-tense vs present-tense is also drifting; `send-message` (action
about to happen) vs `opened:file` (event that happened). Pick one
verb tense per category: actions are present-tense imperatives that
describe what the consumer should do (`send-message`, `delete-chat`),
notifications are past-tense descriptions of what happened
(`message-sent`, `chat-opened`). This is a breaking change but the
package is alpha.

### 2. Fix the `Chats` infinite-scroll inversion

`loadMoreChats` returns early when `!props.chatsLoaded`, but the
watch only calls it when `chatsLoaded` is false. The two together
mean `fetch-more-chats` is unreachable through the watch path; only
the IntersectionObserver can fire it, and only when `chatsLoaded`
is `true` — which is the opposite of v2's "true means everything is
loaded, stop fetching" semantics.

This was the failure that forced the test suite to delete a story.
Either rename the prop to `chatsHasMore` (truthy-means-keep-going)
and audit usages, or flip the boolean. Either way, document.

### 3. Wire message pagination + auto-scroll

`Chat` has no `fetch-messages` event and no scroll-to-bottom
behavior on send/receive. v2 had both with a documented `auto-scroll`
policy object. Without these, every consumer reimplements the same
scroll logic. Bring back:

- `fetch-messages` event triggered when scroll reaches the top
  threshold (mirror `Chats`'s threshold-based observer).
- `auto-scroll` prop on `Chat` (or sensible default + override) that
  controls whether new own/other messages scroll the list.
- `scroll-to-bottom` button + new-message badge when the user has
  scrolled away from the latest.

These are not optional features — they're the difference between
"chat library" and "list of message bubbles".

### 4. Reduce magic strings on `Action.name`

`Chat` recognizes `'reply'` and `'edit'` as built-in action names
(not exported, no enum, just string literals in the source). A
consumer who types `name: 'replyMessage'` (v2's name) gets no
warning and no behavior.

Three options, in order of how invasive they are:

1. **Export const names** (`REPLY_ACTION`, `EDIT_ACTION`) and use
   them in fixtures + docs. Low effort.
2. **Discriminated `Action` type**:
   ```ts
   type BuiltInAction = { kind: 'reply' | 'edit' | 'delete' | 'select'; title: string }
   type CustomAction = { kind: 'custom'; name: string; title: string; onlyMe?: boolean }
   type Action = BuiltInAction | CustomAction
   ```
   Forces consumers to think about which bucket their action falls in.
3. **Slots over actions** for the special cases — let `Chat` accept a
   `replyMessage`/`editMessage` v-model so the consumer drives state
   directly without going through an action handler. Most idiomatic
   Vue 3 pattern.

I'd do option 1 in 3.0 (it's not breaking) and explore option 3 in
the 3.x roadmap.

### 5. Remove or justify Tailwind

`src/assets/style.css` does `@import 'tailwindcss'`. No component
uses Tailwind utility classes — every template uses `vac-*` scoped
classes. The Tailwind preflight is shipped in `dist/components.css`
(part of the 37 KB bundle) for no consumer benefit.

Either:

- Drop `@tailwindcss/vite` and the import. Save ~10–15 KB on the CSS
  bundle and one dev dep tier.
- Or commit to it: rewrite at least one component using Tailwind
  utility classes, document the mix-and-match expectation, and
  configure tree-shaking via `content` so unused utilities don't
  ship.

### 6. Eliminate `// @ts-nocheck` in `src/utils/`

Five files (`deep-merge`, `filter-items`, `text-formatter/autolink`,
`text-formatter/underline`, `text-formatter/user-tag`) opt out of
typechecking. These are core utilities used by every component. The
remediation is straightforward (most are micromark types and a
generic constraint on `deepMerge`); if you need help with the
micromark types, the upstream `@types/micromark*` packages already
provide them.

A library that publishes its own `.d.ts` shouldn't have type-checking
holes in its own implementation.

### 7. Replace `on-click-outside` with `@vueuse/core`

The internal `src/utils/on-click-outside.ts` is a fork of
`v-click-outside` (200 lines, including iframe blur detection,
touch detection, and capture-phase handling). `@vueuse/core` ships
`onClickOutside` and `vOnClickOutside`, both more battle-tested,
under maintained semver, and with proper Vue 3 reactive composition.

The dependency footprint is bounded (`@vueuse/core` is `~25 KB
gzipped` and tree-shakes per-export). Replacing it would let you
delete a whole utility file and a directive contract that's already
been a source of subtle bugs in v2.

### 8. Aggregate type exports

`src/index.ts` re-exports models but not the per-component
`*Props`/`*Events`/`*MessageSelection` types. Consumers who want to
type a wrapper component have to import them individually:

```ts
import type { ChatProps } from '@advanced-chat/components/dist/.../Chat.vue'
```

Add re-exports in `src/index.ts`:

```ts
export type { AdvancedChatProps, AdvancedChatEvents } from './components/AdvancedChat.vue'
export type { ChatProps, ChatEvents } from './components/Chat.vue'
// …etc
```

The `.d.ts` already contains them; this is a pure ergonomics fix.

## P1: 3.x roadmap

### 9. Extract composables

Several patterns are duplicated or buried in components:

- `useInfiniteScroll(rootRef, loaderRef, onIntersect)` — used by `Chats`, would be needed by `Chat` for message pagination.
- `useChatSearch(items, key)` → returns `{ filter, filtered, setFilter }`.
- `useMessageSelection<T>()` → handles toggle/in/out and exposes the array.
- `useReplyEdit()` → owns reply/edit state with `setReply`/`setEdit`/`reset`.
- `useAutocomplete(textValue, trigger, items, getQuery)` → emits the up/down/enter/tab semantics needed by `ChatEmojis`/`ChatUserTag`.

Once extracted these can be exported as a public surface for advanced
consumers. The current "you must compose `Chat` plus `ChatFooter`" is
fine at the chat level but doesn't scale to e.g. building a
search/command palette out of the same primitives.

### 10. Unify autocomplete primitive

`ChatEmojis` and `ChatUserTag` are 95% the same component with
different render slots and types. They both:

- Take a filtered array
- Track an active index
- Watch `selectItem` to commit
- Watch `activeUpOrDown` to navigate

Replace with a single `<AutocompleteMenu>` that takes a slot for
each item:

```vue
<AutocompleteMenu :items="emojis" v-model:selected="..." @commit="..." />
  <template #item="{ item, active }">…</template>
</AutocompleteMenu>
```

Less code, less duplication, easier to add a third autocomplete
type (templates `/`-trigger from v2's `templates-text` is not yet
ported; this would be the natural place).

### 11. Slot strategy: prefer scoped over id-suffixed

V3 currently mirrors v2's `message_<id>`, `room-list-item_<id>`, etc.
Each rendered message dynamically declares its own slot name. This
worked for v2 because the web component had no real Vue slot
machinery, but in V3 it's a regression vs. native scoped slots:

```vue
<Chat>
  <template #message="{ message, user, isOwn }">
    <MyCustomBubble :message="message" />
  </template>
</Chat>
```

Both can coexist for compat, but the typed scoped form should be the
documented path. The `_<id>` suffix form is hard to type and
encourages consumers to write per-id branching that doesn't scale.

### 12. Reconsider `Id = string | number`

Every model lookup in the codebase ends with `.id.toString()` to
guarantee equality. That's a smell. Reasons to keep dual-type: REST
APIs sometimes return numeric ids. Reasons to drop: `'1' === 1`
bugs, slightly wider tolerated input that the library can't validate.

I'd pin to `string` and ask consumers to do `String(id)` at the API
edge once. Saves a `.toString()` per equality check and removes a
class of bug.

Counter-argument: v2 used `string` for ids; v3 widening was a
deliberate move? If so, document why.

### 13. Centralize text formatting config

V2 had `text-formatting` at the top level (markers for bold/italic/
strike/etc.). V3 dropped it. `MessageTemplate.formattingOptions`
exists but per-component, not at `Chat` or `AdvancedChat`. Consumers
who want to disable markdown across all messages have to either
override `MessageTemplate` or wrap every message render.

Add `Chat.textFormatting` (and forward from `AdvancedChat`) that
threads down to every `MessageTemplate` instance. Or accept this is
an intentional reduction and document the workaround.

### 14. `Chat` selection mode could be self-contained

Today the consumer must:

1. Pass `messageSelection.enabled: true` to opt in
2. Listen for `cancel-message-selection` to flip it back to false
3. Maintain that boolean state externally

That's three things for one feature. `Chat` could own the whole
selection lifecycle: a `selectMessages` action enters selection mode;
cancel exits; the consumer only sees `message-selection-action-handler`
firing with the selected messages. The opt-in becomes "did you pass
any `messageSelectionActions`?".

### 15. Floating UI for menus

`MessageActions`'s dropdown and the header menu use plain
`position: absolute; right: 0; top: calc(100% + 6px)`. This breaks at
the viewport edges and has no flip/shift behavior.

`@floating-ui/vue` is the standard fix and weighs ~3 KB gzipped
tree-shaken. Worth adopting before consumers start filing bugs about
menus clipping at the right edge of narrow containers.

### 16. SSR audit

Use of `window`, `document`, `navigator`, IntersectionObserver, and
MediaQueryList is partly guarded (`themes/index.ts` checks for
window) and partly not (`utils/on-click-outside.ts` references
`document` at module scope; `EmojiPicker` constructs `new Picker()`
in setup which touches DOM).

The current Nuxt advice is `<ClientOnly>`. That's fine as a 3.0
escape hatch but should be a roadmap item: at minimum, document
which components are SSR-safe and which aren't, and ideally make
the leaf components (Loader, ProgressBar, SvgIcon, MessageTemplate)
fully SSR-safe so consumers can render server-side at least the
read-only parts of a chat thread.

## Notes / deliberate design calls to confirm

### Schema names

- `Chat.icon` (vs `avatar` in v2) — "icon" reads as a small symbolic
  graphic, but it's used as a profile picture in the templates. If
  it's intentional (forward-looking: a chat could have a logo, not a
  human avatar), document the intent. Otherwise rename to `avatar`.
- `Message.reply` is a full `Message` (recursive). Most chats only
  show one level. Consider a `MessageSummary` type with just the
  fields a reply preview needs, then `reply: MessageSummary`.
- `User.status.lastActiveAt: string` (ISO) — accepting `Date | string`
  would be more idiomatic. Same for `Message.createdAt`.

### `customSearchEnabled` flag

The flag exists because the consumer might want server-driven
search. Two flags-flavors that read more naturally:

- A typed callable: `searchChats?: (query: string, chats: Chat[]) => Chat[]`
  defaults to local-filter; consumer overrides with their own.
- Or always emit, and let the consumer drive `chats` externally.

The current flag-and-emit-and-also-filter is the most flexible but
least obvious option. Confirm it's deliberate and document it well.

### Strings / plugin scope

`AdvancedChatPlugin` provides one strings dictionary at app scope.
Multiple chat instances on the same Vue app share it. For 99% of
apps this is right. If you ever need per-instance overrides
(e.g., embedding two locales on the same page), provide a `strings`
prop on `AdvancedChat` that locally re-`provide`s. Not 3.0-blocking.

### `withDefaults` vs `defaultValue` on `defineProps`

The codebase mostly uses `withDefaults(defineProps<...>(), { … })`.
Vue 3.5+ supports `const props = defineProps<…>({ default: … })` via
the reactive props destructure. Mixing isn't broken, but pinning to
one style improves consistency. Either is fine; pick one.

## Recommended order

If you accept this review, a sane sequence to land before 3.0 GA:

1. Clean up `// @ts-nocheck` files (mechanical, no behavior change).
2. Aggregate type exports in `src/index.ts`.
3. Fix `Chats.loadMoreChats` inversion + write the missing tests.
4. Wire `fetch-messages` event on `Chat`. (Bigger but well-scoped.)
5. Add scroll-to-bottom + auto-scroll policy.
6. Standardize event naming (kebab-case, present/past split).
7. Export action-name constants; document the special `reply`/`edit`
   contract.
8. Decide on Tailwind: drop or commit.
9. Migrate `on-click-outside` to `@vueuse/core`.

Each of these is a tractable PR, and they don't depend on each
other. The total surface change is breaking — but the package is
alpha; this is the moment.
