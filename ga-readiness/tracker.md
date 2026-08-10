# V3 GA Readiness Tracker

This is the canonical work-item index. Update it with every lifecycle
transition. Evidence is append-only in [`runs.md`](./runs.md); decisions are
append-only in [`decisions.md`](./decisions.md).

## Impact policy

| Impact    | Release effect                                                  |
| --------- | --------------------------------------------------------------- |
| `Blocker` | RC4 and GA cannot proceed                                       |
| `High`    | GA requires Closed, Disproved, or an explicit Accepted decision |
| `Medium`  | May ship only with an owner and documented disposition          |
| `Low`     | Non-gating polish                                               |

## Findings and enablers

| ID       | Hypothesis or required capability                                                          | Impact  | Target | Stage       | Execution        | Flags            | Reopens | Owner            | Verifier        | Depends on | Next action                                                                                             | Updated                | Evidence                     |
| -------- | ------------------------------------------------------------------------------------------ | ------- | ------ | ----------- | ---------------- | ---------------- | ------- | ---------------- | --------------- | ---------- | ------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------- |
| `GA-001` | Private security boundary A fails safely                                                   | Blocker | RC4    | Confirmed   | Backlog          | private, blocked | 0       | `agent-security` | `@antoine92190` | `G-001`    | Paused by `D-008`; resume private remediation and regression matrix before RC4 authorization            | `2026-08-10T16:26:02Z` | `EV-003`, `EV-008`           |
| `GA-002` | Private security boundary B rejects unsafe object shapes                                   | Blocker | RC4    | Confirming  | Backlog          | private, blocked | 0       | `agent-security` | `@antoine92190` | `G-001`    | Paused by `D-008`; retain confirming evidence and resume exact-artifact confirmation before remediation | `2026-08-10T16:26:02Z` | `EV-004`                     |
| `GA-003` | Packed declarations omit default custom-element tag inference                              | High    | RC4    | Confirming  | Backlog          | -                | 0       | `agent-contract` | `@antoine92190` | `GA-013`   | Add installed positive and negative Bundler/NodeNext probes                                             | `2026-08-10T15:55:07Z` | `EV-005`                     |
| `GA-004` | Active-chat changes can retain removed identity or display unowned messages                | Blocker | RC4    | Confirming  | Backlog          | -                | 0       | `agent-runtime`  | `@antoine92190` | `GA-013`   | Run delayed-switch, object-refresh, removal, and late-response scenarios                                | `2026-08-10T15:55:07Z` | -                            |
| `GA-005` | Selection, reply, and edit state can retain stale message objects                          | High    | RC4    | Hypothesis  | Backlog          | -                | 0       | `agent-runtime`  | `@antoine92190` | `GA-004`   | Confirm same-chat update/removal and cross-chat reset behavior                                          | `2026-08-10T15:55:07Z` | -                            |
| `GA-006` | Message selection is not operable or announced consistently by keyboard                    | High    | RC4    | Confirming  | Backlog          | -                | 0       | `agent-a11y`     | `@antoine92190` | `GA-004`   | Record packaged keyboard reproduction and specify native-control behavior                               | `2026-08-10T15:55:07Z` | -                            |
| `GA-007` | Mention combobox and IME behavior are incomplete                                           | High    | RC4    | Confirming  | Backlog          | -                | 0       | `agent-a11y`     | `@antoine92190` | -          | Run exact token, Tab/Escape, active-descendant, and composition scenarios                               | `2026-08-10T15:55:07Z` | -                            |
| `GA-008` | Media modal focus can escape and restoration is incomplete                                 | High    | RC4    | Confirming  | Backlog          | -                | 0       | `agent-a11y`     | `@antoine92190` | -          | Record packaged forward/reverse focus and all-close-path reproductions                                  | `2026-08-10T15:55:07Z` | -                            |
| `GA-009` | `Chats.showChats` is a public no-op                                                        | Medium  | RC4    | Confirming  | Backlog          | -                | 0       | `agent-contract` | `@antoine92190` | `GA-013`   | Record packaged behavior, then decide implement versus remove                                           | `2026-08-10T15:55:07Z` | -                            |
| `GA-010` | Advertised runtime/browser support exceeds the tested matrix                               | High    | RC4    | Remediating | Waiting verifier | -                | 0       | `agent-release`  | `@antoine92190` | -          | Independently review Node 20 removal, then implement the remaining exact-tarball matrix                 | `2026-08-10T16:34:19Z` | `EV-002`, `EV-007`, `EV-011` |
| `GA-011` | Merge, tag, publish approval, and partial-failure recovery controls are insufficient       | High    | RC4    | Confirming  | Backlog          | -                | 0       | `agent-release`  | `@antoine92190` | `GA-015`   | Capture immutable settings evidence, then implement and test recovery                                   | `2026-08-10T15:55:07Z` | `EV-006`                     |
| `GA-012` | Public release records contain stale RC3 status and are not CI-gated                       | Medium  | RC4    | Confirmed   | Backlog          | -                | 0       | `agent-release`  | `@aerovulpe`    | `GA-016`   | Inventory status-bearing files and add consistency/link gate                                            | `2026-08-10T15:55:07Z` | `EV-001`                     |
| `GA-013` | There is no reviewed cross-release public API baseline                                     | High    | RC4    | Verifying   | Waiting verifier | -                | 0       | `agent-contract` | `@antoine92190` | -          | Independently review the normalized API report and pull-request gate                                    | `2026-08-10T16:26:02Z` | `EV-009`                     |
| `GA-014` | Large histories have an undefined support envelope and quadratic unread work               | Medium  | RC4    | Hypothesis  | Backlog          | -                | 0       | `agent-runtime`  | `@antoine92190` | `GA-004`   | Capture RC3 baseline and decide supported envelope                                                      | `2026-08-10T15:55:07Z` | -                            |
| `GA-015` | Pack verification does not perform real package-manager installation of the tested tarball | High    | RC4    | Confirmed   | Backlog          | -                | 0       | `agent-release`  | `@antoine92190` | `GA-010`   | Install one exact tarball through npm, pnpm, and Yarn without symlinks                                  | `2026-08-10T15:55:07Z` | `EV-002`                     |
| `GA-016` | Open issue/PR triage is incomplete for GA                                                  | High    | RC4    | Verified    | Done             | -                | 0       | `agent-release`  | `@aerovulpe`    | -          | Reconcile on inventory change and rerun before RC4 authorization                                        | `2026-08-10T16:38:41Z` | `EV-006`, `EV-010`, `EV-012` |
| `GA-017` | Audio progress remains usable without overflow in narrow desktop containers                | High    | RC4    | Confirming  | Ready            | -                | 0       | `agent-runtime`  | `@antoine92190` | `GA-016`   | Confirm issue #550 against an installed tarball at narrow and normal container widths                   | `2026-08-10T16:26:02Z` | `EV-010`                     |

## Gates

Gate evidence must target the exact candidate commit and artifact. A pass is
stale after candidate-affecting changes.

Every automated gate emits an immutable `ga-gate-result.json` containing gate
ID, candidate version, full commit, artifact SHA-256 and npm integrity when
applicable, result, check context, workflow URL, and timestamp. Manual security
and assistive-technology gates emit an access-controlled evidence manifest with
the same identity fields. Planned commands remain Pending until their scripts
and stable CI contexts exist.

| ID      | Gate                                      | Required for  | State   | Required check or query                            | Acceptance                                                                                                | Owner           | Depends on                                                                               | Candidate | Evidence | Freshness trigger                                   |
| ------- | ----------------------------------------- | ------------- | ------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------- | --------- | -------- | --------------------------------------------------- |
| `G-000` | Governance and policies assigned          | RC4           | Running | `governance-gate` / `npm run verify:governance`    | Named identities fill every role; superseding decisions approve soak, invalidation, and every matrix cell | `@aerovulpe`    | -                                                                                        | RC4       | `EV-007` | Actor or approved-policy change                     |
| `G-001` | Private security coordination ready       | RC4           | Pass    | Private `security-coordination-gate`               | Named disclosure/remediation/verifier/publisher actors, opaque advisory IDs, access list, timeline        | `@aerovulpe`    | `G-000`                                                                                  | RC4       | `EV-008` | Actor, access, or timeline change                   |
| `G-002` | Security candidate independently verified | RC4, GA       | Pending | Private `security-gate`                            | Private manifest proves `GA-001` and `GA-002` Verified on one digest                                      | `@antoine92190` | `G-001`, `GA-001`, `GA-002`                                                              | RC4       | -        | Candidate digest or security test change            |
| `G-003` | Runtime ownership and state verified      | RC4, GA       | Pending | `runtime-contract-gate` / `npm run verify:runtime` | `GA-004` and `GA-005` reach Verified                                                                      | `@antoine92190` | `G-000`, `GA-004`, `GA-005`                                                              | RC4       | -        | Runtime/state change                                |
| `G-004` | Keyboard workflows verified               | RC4, GA       | Pending | `a11y-gate` / `npm run verify:a11y`                | Automated stories and manual AT manifest prove `GA-006` through `GA-008` Verified                         | `@antoine92190` | `G-000`, `GA-006`, `GA-007`, `GA-008`                                                    | RC4       | -        | UI, semantics, or browser policy change             |
| `G-005` | API diff approved                         | RC4, GA       | Running | `api-contract-gate` / `npm run verify:api`         | Normalized report proves `GA-003`, `GA-009`, `GA-013` Verified or approved disposition                    | `@antoine92190` | `G-000`, `GA-003`, `GA-009`, `GA-013`                                                    | RC4       | `EV-009` | Export/declaration/slot/CSS contract change         |
| `G-006` | Clean-clone quality gate                  | RC4, GA       | Running | `quality-gate` / `npm ci && npm run verify`        | Stable aggregate context passes                                                                           | `agent-release` | `G-000`                                                                                  | RC4       | `EV-011` | Any source, test, dependency, or build change       |
| `G-007` | Exact-tarball compatibility matrix        | RC4, GA       | Pending | `compatibility-gate` / `npm run verify:compat`     | Every D-004 cell passes one identity manifest                                                             | `agent-release` | `G-000`, `GA-010`, `GA-015`                                                              | RC4       | -        | Digest or compatibility-policy change               |
| `G-008` | Protected idempotent release workflow     | RC4, GA       | Pending | `release-recovery-gate` / `npm run verify:release` | Build-once identity, approval, tag rule, matching-state no-op, mismatch hard stop                         | `@antoine92190` | `G-000`, `GA-011`, `G-007`                                                               | RC4       | -        | Workflow, environment, or repository-setting change |
| `G-009` | Candidate docs and triage ready           | RC4           | Running | `docs-triage-gate` / `npm run verify:release-docs` | Candidate wording truthful; inventory predicate below is zero                                             | `@aerovulpe`    | `G-000`, `GA-012`, `GA-016`                                                              | RC4       | `EV-012` | Docs, issue inventory, or package status change     |
| `G-010` | RC4 pre-publish authorization             | RC4           | Pending | `release-preflight` / `npm run verify:prepublish`  | `G-000` through `G-009` pass and tag targets reviewed main                                                | `@aerovulpe`    | `G-000`, `G-001`, `G-002`, `G-003`, `G-004`, `G-005`, `G-006`, `G-007`, `G-008`, `G-009` | RC4       | -        | Any dependency gate stale/fail                      |
| `G-011` | RC4 post-publish convergence              | GA            | Pending | `release-convergence` / `npm run verify:published` | Digest, `next`, provenance, release, Pages SHA, anonymous installs agree                                  | `@aerovulpe`    | `G-010`                                                                                  | RC4       | -        | Published ecosystem state change                    |
| `G-012` | Security response completed               | GA            | Pending | Private `security-response-gate`                   | RC3 deprecated; advisory and notifications completed on approved timeline                                 | `@aerovulpe`    | `G-002`, `G-011`                                                                         | RC4       | -        | Advisory/deprecation state change                   |
| `G-013` | Downstream validation                     | GA            | Pending | `adopter-gate` / `npm run verify:adopters`         | Two identity-bound adopter manifests pass required scenarios                                              | `@aerovulpe`    | `G-011`                                                                                  | RC4       | -        | Candidate or scenario change                        |
| `G-014` | Soak complete                             | GA            | Pending | `soak-gate` / `npm run verify:soak`                | Approved duration, adopters, quiet period, and zero unresolved gate finding                               | `@aerovulpe`    | `G-012`, `G-013`                                                                         | RC4       | -        | Material fix or gating report                       |
| `G-015` | RC-to-GA promotion diff allowed           | GA            | Pending | `promotion-diff-gate` / `npm run verify:promotion` | Patch exactly matches approved promotion manifest; lock resolutions unchanged                             | `@aerovulpe`    | `G-014`                                                                                  | GA        | -        | Promotion commit or manifest change                 |
| `G-016` | Exact GA artifact verified                | GA            | Pending | `ga-artifact-gate` / `npm run verify:ga-artifact`  | Full T3 passes GA identity manifest and behavior delta is empty                                           | `agent-release` | `G-015`                                                                                  | GA        | -        | GA digest change                                    |
| `G-017` | GA ecosystem convergence                  | GA completion | Pending | `release-convergence` / `npm run verify:published` | `latest`, `next`, provenance, release, Pages, installs, rerun, final triage agree                         | `@aerovulpe`    | `G-016`                                                                                  | GA        | -        | Published ecosystem state change                    |

## Soak control

| Candidate | Convergence at | Minimum end | Adopters required / complete | Quiet period starts | Reset count | Monitor      | Next check    | State       |
| --------- | -------------- | ----------- | ---------------------------- | ------------------- | ----------- | ------------ | ------------- | ----------- |
| RC4       | -              | -           | 2 / 0                        | -                   | 0           | `@aerovulpe` | After `G-011` | Not started |

## Subagent assignments

Add one row before dispatch. Task IDs link ephemeral work-tasker execution to
the durable tracker.

| Task       | Finding/gate                         | Mode           | Assignee         | Verifier          | Lease                  | Branch/worktree             | Allowed files                                                     | Status           | Evidence destination            |
| ---------- | ------------------------------------ | -------------- | ---------------- | ----------------- | ---------------------- | --------------------------- | ----------------------------------------------------------------- | ---------------- | ------------------------------- |
| `TASK-001` | Security workstream design           | Research       | `agent-security` | `release-captain` | Complete               | Read-only                   | None                                                              | Done             | Synthesized into `plan.md`      |
| `TASK-002` | Runtime/API/a11y workstream design   | Research       | `agent-runtime`  | `release-captain` | Complete               | Read-only                   | None                                                              | Done             | Synthesized into `plan.md`      |
| `TASK-003` | Package/release workstream design    | Research       | `agent-release`  | `release-captain` | Complete               | Read-only                   | None                                                              | Done             | Synthesized into `plan.md`      |
| `TASK-004` | Dynamic tracker design               | Research       | `agent-tracker`  | `release-captain` | Complete               | Read-only                   | None                                                              | Done             | Synthesized into this directory |
| `TASK-005` | `GA-013` API baseline                | Confirmation   | `agent-contract` | `@antoine92190`   | `2026-08-11T15:55:07Z` | Shared branch               | API report and supporting scripts only                            | Waiting verifier | `EV-009` and API report         |
| `TASK-006` | `GA-016` issue/PR inventory          | Confirmation   | `agent-release`  | `@aerovulpe`      | Complete               | Shared branch               | `ga-readiness/triage.md` only                                     | Done             | `EV-010` and triage snapshot    |
| `TASK-007` | `GA-001` exact-artifact confirmation | Confirmation   | `agent-security` | `@antoine92190`   | Complete               | Access-controlled temp work | No public files                                                   | Done             | `EV-008` and private advisory   |
| `TASK-008` | `GA-010` Node 20 removal             | Implementation | `@aerovulpe`     | `@antoine92190`   | `2026-08-11T16:26:02Z` | Shared branch               | Package metadata, contributor docs, API baseline, and PR workflow | Waiting verifier | `EV-011` and pull request       |

## Issue and PR triage schema

`GA-016` captures the exact GitHub issue and PR queries plus an immutable JSON
snapshot, then adds one row per open item using this schema:

| Snapshot | Kind | Number | Title | Release relevance | Impact | Disposition | Owner | Linked finding | Last triaged | Evidence |
| -------- | ---- | ------ | ----- | ----------------- | ------ | ----------- | ----- | -------------- | ------------ | -------- |

Allowed dispositions are `ga-blocker`, `rc-soak`, `close-on-ga`, `v3-roadmap`,
`v2-only`, `support`, `needs-info`, and `declined`. `G-009` requires zero open
items missing from the snapshot, zero missing owners/dispositions, and zero
Blocker/High items left as `needs-info`.

## Work queue

Use this order when dependencies allow:

1. `GA-013`, `GA-001`, `GA-002`, `GA-010`, `GA-016`, and `GA-017`.
2. `GA-003`, `GA-004`, `GA-007`, `GA-008`, and `GA-015`.
3. `GA-005`, `GA-006`, `GA-009`, `GA-011`, and `GA-014`.
4. `GA-012`, full candidate verification, RC4 publication, and soak.

The release captain may reorder within an impact level but must record a
decision when bypassing an unblocked Blocker or High item.

## Tracker update checklist

- Stage transition and next action updated.
- Owner and independent verifier assigned.
- Dependencies reference existing IDs.
- Evidence appended rather than overwritten.
- Candidate commit/version/digest recorded where applicable.
- Reopen count and old evidence retained after failure.
- Gate state refreshed or marked Stale.
- Dashboard timestamp updated.
- Task assignment, lease, scope, and evidence destination recorded.
