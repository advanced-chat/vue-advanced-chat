# Rewrite Working Directory

This directory holds planning, historical audits, and the current compatibility
record for the V3 rewrite of `vue-advanced-chat`. Stable v2 is
`vue-advanced-chat@2.1.2`; the `develop` tree is the pre-GA
`@advanced-chat/components@3.0.0-alpha.5` line.

The library on `main` ships v2 as a single web component registered via
`register()`. V3 ships 28 individually importable typed Vue 3 components and a
bundled light-DOM web-component entrypoint that auto-registers its default tag.
The records here distinguish equivalent behavior, deliberate removals, and
remaining limits rather than treating every v2 difference as a regression.

## Contents

- [`architecture.md`](./architecture.md) — what V3 changes vs v2, why,
  and the public contract consumers will rely on.
- [`architecture-review.md`](./architecture-review.md) — archived
  maintainer-eye snapshot at `3.0.0-alpha.1`. Its gaps are historical.
- [`ergonomics-review.md`](./ergonomics-review.md) — archived companion
  snapshot at `3.0.0-alpha.1`. Its recommendations explain later changes but
  are not the current API.
- [`v2-feature-catalog.md`](./v2-feature-catalog.md) — full inventory of
  the v2 component on `main`: every prop, event, slot, behavior, and
  configurable feature. Used as the parity bar.
- [`parity-checklist.md`](./parity-checklist.md) — maintained v2 -> V3
  status mapping and source of truth for what is equivalent, deliberately
  removed, or still limited.
- [`issue-triage.md`](./issue-triage.md) — open GitHub issues / PRs
  bucketed by whether the rewrite resolves them, still needs work,
  is intentionally out of scope, or warrants a stale-close.
- [`release-plan.md`](./release-plan.md) — concrete path from the
  current `3.0.0-alpha.5` tree to a published `3.0.0` on npm,
  including version bumps, migration notes, and announcement plan.

## Conventions for this directory

- These docs are reference material for maintainers — they are not
  shipped to consumers (the package's `files` field is `dist/` only).
- When a parity gap is closed in code, update the relevant row in
  `parity-checklist.md` in the same change.
- Treat `v2-feature-catalog.md` as effectively frozen — it describes
  the published v2 surface, not what V3 should do.
