# V3 GA Readiness Control Room

This directory is the live control surface for moving
`@advanced-chat/components` from `3.0.0-rc.3` to `3.0.0`. It turns the GA audit
into executable work, preserves evidence, and prevents a merged fix from being
mistaken for a verified release.

The release captain owns this dashboard. Subagents may investigate and
implement a work item, but a named maintainer must accept release-impacting
decisions and independently verify every Blocker or High item.

## Current snapshot

| Candidate    | Commit                                     | npm state                  | RC4 decision          | GA decision | Soak        | Updated                |
| ------------ | ------------------------------------------ | -------------------------- | --------------------- | ----------- | ----------- | ---------------------- |
| `3.0.0-rc.3` | `86929e655a0188822edc0b48ecfe0d330945debc` | `next`; provenance present | Required; work active | Hold        | Not started | `2026-08-10T16:38:41Z` |

Current authority:

- [`plan.md`](./plan.md) defines execution order and exit criteria.
- [`tracker.md`](./tracker.md) is the canonical work-item and gate index.
- [`runs.md`](./runs.md) is the append-only evidence register.
- [`decisions.md`](./decisions.md) is the append-only decision log.
- [GitHub issue #580](https://github.com/advanced-chat/advanced-chat-components/issues/580)
  is the public coordination surface.
- [Pull request #581](https://github.com/advanced-chat/advanced-chat-components/pull/581)
  carries the control-room implementation and independent review.
- [`../rewrite/parity-checklist.md`](../rewrite/parity-checklist.md) remains the
  compatibility authority.
- [`../rewrite/release-plan.md`](../rewrite/release-plan.md) remains the release
  history and broad release path.

## Release posture

RC3 is mechanically publishable and provenance-valid, but it is not eligible
for promotion. Security confirmation signals, package typing, runtime ownership,
accessibility, compatibility, and release-control work require RC4. No feature
work enters the GA line until the release captain records a superseding
decision.

Security remediation is paused by `D-008` while independent non-security lanes
continue. The pause does not change either security finding's impact or relax
`G-002`, `G-010`, `G-012`, or the GA hold.

## Coordination lanes

Lane names are stable task-dispatch identities, not release approvers. The
items column is assigned backlog, not active WIP. Replace maintainer
placeholders with named GitHub identities before a finding advances to
`Remediating`.

| Lane             | Scope                                       | Assigned backlog                              | WIP cap   | Independent verifier |
| ---------------- | ------------------------------------------- | --------------------------------------------- | --------- | -------------------- |
| `agent-security` | Formatter and merge-boundary security       | `GA-001`, `GA-002`                            | 1 Blocker | `@antoine92190`      |
| `agent-runtime`  | Active-chat and chat-owned state            | `GA-004`, `GA-005`, `GA-014`, `GA-017`        | 2         | `@antoine92190`      |
| `agent-contract` | Types, public props, API baseline           | `GA-003`, `GA-009`, `GA-013`                  | 2         | `@antoine92190`      |
| `agent-a11y`     | Selection, mentions, modal focus            | `GA-006`, `GA-007`, `GA-008`                  | 2         | `@antoine92190`      |
| `agent-release`  | Compatibility, CI, publishing, docs, triage | `GA-010` through `GA-012`, `GA-015`, `GA-016` | 2         | `@antoine92190`      |

## Governance identities

| Responsibility                | GitHub identity                  | Constraint                                                     |
| ----------------------------- | -------------------------------- | -------------------------------------------------------------- |
| Release captain and publisher | `@aerovulpe`                     | Cannot independently verify own release-control implementation |
| Independent verifier          | `@antoine92190`                  | Must not author the item being verified                        |
| Security remediation agents   | `agent-security`                 | No public patch/test artifacts before corrected availability   |
| Implementation agents         | Lane-specific `agent-*` identity | Cannot make release acceptance decisions                       |

## Lifecycle

Each item has exactly one lifecycle stage:

| Stage         | Meaning                                                   | Exit requirement                             |
| ------------- | --------------------------------------------------------- | -------------------------------------------- |
| `Hypothesis`  | Falsifiable concern without sufficient evidence           | Owner, verifier, reproduction plan           |
| `Confirming`  | Reproduction is in progress                               | Positive, negative, or inconclusive evidence |
| `Confirmed`   | Scope and impact are demonstrated                         | Approved remediation and target              |
| `Remediating` | Code, docs, package, or operational fix is underway       | Fix PR and focused checks                    |
| `Verifying`   | A different actor is checking the fix                     | Independent evidence against candidate bytes |
| `Verified`    | Candidate bytes passed independent verification           | RC publication or required soak              |
| `Soaking`     | Verified behavior is receiving time and downstream use    | Required duration and adopter evidence       |
| `Closed`      | Remediation, verification, and required soak are complete | Fresh terminal evidence                      |
| `Disproved`   | The hypothesis did not reproduce within recorded bounds   | Negative evidence and tested bounds          |
| `Accepted`    | A known risk is explicitly accepted for GA                | Decision ID, rationale, owner, follow-up     |
| `Deferred`    | Valid work is explicitly post-GA                          | Non-gating decision and issue link           |

Flags are independent of stage: `blocked`, `reopened`, `stale`, and `private`.
`private` means details and artifacts are restricted to the security response.

Execution state is tracked separately as `Backlog`, `Ready`, `In progress`,
`Waiting verifier`, `Monitoring`, or `Done`. Only `In progress` and `Waiting
verifier` consume WIP.

## Evidence classes

- Behavior evidence covers runtime outcomes and remains valid across an
  approved promotion-only delta when source, build inputs, dependencies,
  exports, declarations, styles, and workflows are unchanged.
- Artifact evidence covers one exact tarball digest and must be rerun for the
  final `3.0.0` artifact even when behavior evidence carries forward.
- Ecosystem evidence covers npm, provenance, GitHub Release, Pages, dist-tags,
  and anonymous installs and must be collected after each publication.

## Dynamic routing rules

1. New reports enter `Hypothesis`; Blocker and High reports receive an owner and
   verifier before Medium or Low work starts.
2. Confirmation must target the published RC3 tarball or an isolated install of
   the exact candidate artifact. Workspace-only behavior is supporting evidence.
3. A confirmed finding cannot move directly to `Closed`. It moves through
   `Remediating` and independent `Verifying`.
4. A failed verification returns the item to `Remediating` and increments its
   reopen count. Existing evidence remains in `runs.md`.
5. Any JavaScript, CSS, declaration, dependency resolution, export, build input,
   release workflow, or observable behavior change invalidates behavior and
   artifact evidence and requires another RC.
6. A material fix during RC soak resets the soak clock and requires a new RC.
   A docs-only correction receives focused verification but does not reset the
   runtime soak unless it changes the public contract.
7. A gate pass becomes `Stale` when candidate bytes, declarations, metadata,
   release automation, or the gate's environment policy changes.
8. Blocker and High findings cannot be self-verified. The owner and verifier
   must be different actors.
9. `Accepted`, `Deferred`, and `Disproved` outcomes require a decision or
   evidence ID; prose in a pull request is insufficient.
10. Dependencies use tracker IDs and must remain acyclic.
11. The final RC-to-GA promotion exception is limited to the exact allowlist in
    `plan.md`. It preserves approved behavior evidence but requires fresh GA
    artifact and ecosystem evidence. Any non-allowlisted delta requires another
    RC.
12. When RC4 is replaced by RC5, open work targets move to RC5 in one tracker
    update, the reset is recorded in `decisions.md`, and all prior evidence is
    retained with its original candidate identity.

## Task dispatch loop

The release captain uses the work tasker for one active execution item at a
time per lane:

1. Select the highest-impact item with execution state `Ready` whose
   dependencies are closed.
2. Mark it `in_progress` in the work tasker, `In progress` in the tracker, and
   set the appropriate lifecycle stage.
3. Dispatch a subagent with the item ID, task ID, lease, branch/worktree,
   allowed files, prohibited scope, expected evidence destination, and exact
   verification commands.
4. Append the subagent result and command output to `runs.md`; never replace a
   failed run with a later pass.
5. Assign a different verifier for Blocker and High work.
6. Update the tracker, gate state, and next action in the same change.
7. Complete the work-tasker item only after the tracker stage has valid exit
   evidence.

Subagent prompts must state whether the task is confirmation, implementation,
or verification. An implementation agent must not also make the release
acceptance decision.

## WIP and freshness

- Maximum three project-wide items with execution state `In progress`.
- Maximum one active Blocker remediation per lane.
- Maximum two active findings per owner.
- `Verifying` waits at most 24 hours for verifier activity.
- An `In progress` confirmation without evidence for 24 hours becomes `stale`.
- An `In progress` remediation without an update for 48 hours becomes `stale`.
- A blocked item must name its dependency, owner, and next check time.
- Do not start Medium or Low work while an unowned Blocker exists.
- Soaking does not consume implementation WIP, but it requires an owner and next
  check time.

## Decision checks

Before every RC4 or GA decision, the release captain confirms:

- Candidate version, commit, tag, tarball digest, npm dist-tag, and provenance
  agree.
- Required gates are `Pass` and fresh for the exact candidate.
- No dependency is dangling or cyclic.
- WIP and independent-verifier rules hold.
- The dashboard timestamp is newer than every active tracker update.
- The candidate-to-release diff stays within the allowed promotion scope.

For RC authorization:

- Every Blocker is `Verified` or `Disproved`.
- Every High item is `Verified`, `Disproved`, or explicitly `Accepted`.
- `G-010` is `Pass` and fresh.

For GA authorization:

- Every Blocker is `Closed` or `Disproved`.
- Every High item is `Closed`, `Disproved`, or explicitly `Accepted`.
- `G-014` through `G-016` are `Pass` and fresh.

## Soak control

The tracker records candidate, publication convergence time, seven-day minimum
end, independent adopter count, quiet-period start, reset count, monitor, and
next check. Soak cannot start until the RC post-publication convergence gate
passes. The final 72-hour quiet period is inside the seven-day minimum and must
end no earlier than the minimum soak end.
