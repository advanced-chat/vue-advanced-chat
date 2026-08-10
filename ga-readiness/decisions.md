# GA Readiness Decision Log

This file is append-only. A changed decision adds a new row that references the
decision it supersedes.

## Decisions

| Decision | At           | Status   | Candidate / commit                                      | Type                   | Outcome                                                                                                                                                                                                        | Evidence snapshot          | Decider           | Rationale                                                                                                                                                             | Supersedes |
| -------- | ------------ | -------- | ------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `D-001`  | `2026-08-10` | Working  | `3.0.0-rc.3 / 86929e655a0188822edc0b48ecfe0d330945debc` | RC4 requirement        | Required; GA Hold                                                                                                                                                                                              | `EV-001` through `EV-006`  | `release-captain` | Strong confirming security signals and a confirmed distributed typing defect require new candidate bytes; runtime, a11y, compatibility, and release gates remain open | -          |
| `D-002`  | `2026-08-10` | Proposed | V3 GA line                                              | Soak policy            | Seven days plus two adopters and final 72-hour quiet period                                                                                                                                                    | [`plan.md`](./plan.md)     | `release-captain` | One published RC day is insufficient evidence for first stable release                                                                                                | -          |
| `D-003`  | `2026-08-10` | Proposed | V3 GA line                                              | Candidate invalidation | Material candidate change requires a new RC and resets soak                                                                                                                                                    | [`README.md`](./README.md) | `release-captain` | Promotion must preserve the behavior and package contract that actually soaked                                                                                        | -          |
| `D-004`  | `2026-08-10` | Proposed | V3 GA line                                              | Compatibility policy   | Use the proposed matrix in `plan.md`; retain Node 20 only if explicitly supported and tested                                                                                                                   | [`plan.md`](./plan.md)     | `release-captain` | Exact support floors must precede matrix implementation                                                                                                               | -          |
| `D-005`  | `2026-08-10` | Approved | V3 GA line                                              | Soak policy            | Seven days, two independent adopters, and a final 72-hour quiet period inside the seven days                                                                                                                   | [`plan.md`](./plan.md)     | `@aerovulpe`      | First stable release requires explicit downstream and time evidence                                                                                                   | `D-002`    |
| `D-006`  | `2026-08-10` | Approved | V3 GA line                                              | Candidate invalidation | Material runtime/package/workflow change requires a new RC and resets soak; exact promotion-only delta is exempt                                                                                               | [`README.md`](./README.md) | `@aerovulpe`      | GA must preserve behavior that actually soaked while still rebuilding exact GA artifact evidence                                                                      | `D-003`    |
| `D-007`  | `2026-08-10` | Approved | RC4                                                     | Compatibility policy   | Drop EOL Node 20; require Node 22.14.0 and 24.15.0, Vue 3.5.0 and 3.5.41, npm 11.5.1, pnpm 11.21.0, Yarn 4.18.0, TypeScript 5.9.3, pinned bundlers, Playwright 1.58.2 engines, and Safari 26.6 on macOS 26.6.1 | [`plan.md`](./plan.md)     | `@aerovulpe`      | Exact matrix reflects supported LTS runtimes and current consumer toolchains                                                                                          | `D-004`    |
| `D-008`  | `2026-08-10` | Approved | RC4                                                     | Security sequencing    | Pause security remediation while independent non-security gates continue; keep RC4 authorization and GA on hold until security work resumes or a separate explicit risk decision is approved                   | `EV-008`                   | `@aerovulpe`      | The pause preserves private coordination and release impact without idling API, compatibility, triage, runtime, accessibility, or release-control lanes               | -          |

## Decision types

| Type             | Outcomes                           |
| ---------------- | ---------------------------------- |
| RC requirement   | `Required`, `Not required`, `Hold` |
| RC publish       | `Go`, `Hold`, `No-go`              |
| GA publish       | `Go`, `Hold`, `No-go`              |
| Risk disposition | `Accepted`, `Deferred`, `Rejected` |
| GA completion    | `Complete`, `Incident`             |

## Decision requirements

- RC and GA decisions cite an immutable gate snapshot or copied evidence set.
- A proposed policy becomes approved only when a named maintainer is recorded.
- `Working` is the safe operational default while evidence is gathered. It may
  hold a release but cannot authorize publication. `Proposed` is non-binding;
  release work that depends on it remains blocked until approval.
- Accepted risk identifies impact, affected consumers, mitigation, owner, and
  follow-up issue.
- A superseding row retains the prior decision and explains what changed.
- GA completion is recorded only after npm dist-tags, provenance, GitHub
  Release, Pages, anonymous installs, and recovery checks converge.
