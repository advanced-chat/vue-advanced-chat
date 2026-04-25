# Rewrite Working Directory

This directory holds planning and reference docs for the V3 rewrite of
`vue-advanced-chat`. It is the working record used to drive remaining
work on `develop` until the first non-prerelease 3.x tag is published.

The library on `main` ships v2 as a single web component
(`<vue-advanced-chat>`) registered via `register()`. V3 ships individual
typed Vue 3 components consumers compose directly. The architectural
notes, feature parity checklist, and issue triage in this directory
exist so the rewrite can reach a stable surface without losing v2
behavior in the move.

## Contents

- [`architecture.md`](./architecture.md) — what V3 changes vs v2, why,
  and the public contract consumers will rely on.
- [`architecture-review.md`](./architecture-review.md) — maintainer-eye
  review of the V3 surface at `3.0.0-alpha.1`: strengths, P0/P1 issues,
  and a recommended sequence before 3.0 GA.
- [`ergonomics-review.md`](./ergonomics-review.md) — companion review
  focused on data modeling, field names, prop ergonomics, localization
  type, and event payload shape. Drives the final naming pass before
  3.0 GA.
- [`v2-feature-catalog.md`](./v2-feature-catalog.md) — full inventory of
  the v2 component on `main`: every prop, event, slot, behavior, and
  configurable feature. Used as the parity bar.
- [`parity-checklist.md`](./parity-checklist.md) — V2 feature → V3
  status mapping. Source of truth for what is done, intentionally
  dropped, or still missing.
- [`issue-triage.md`](./issue-triage.md) — open GitHub issues / PRs
  bucketed by whether the rewrite resolves them, still needs work,
  is intentionally out of scope, or warrants a stale-close.
- [`release-plan.md`](./release-plan.md) — concrete path from the
  current `3.0.0-alpha.0` state to a published `3.0.0` on npm,
  including version bumps, migration notes, and announcement plan.

## Conventions for this directory

- These docs are reference material for maintainers — they are not
  shipped to consumers (the package's `files` field is `dist/` only).
- When a parity gap is closed in code, update the relevant row in
  `parity-checklist.md` in the same change.
- Treat `v2-feature-catalog.md` as effectively frozen — it describes
  the published v2 surface, not what V3 should do.
