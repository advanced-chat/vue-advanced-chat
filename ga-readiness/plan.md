# V3 GA Verification And Remediation Plan

## Goal

Confirm every GA audit finding against distributed RC3 behavior, remediate each
confirmed release blocker, certify one immutable RC4 artifact, soak it in real
consumers, and promote only release-identical behavior to `3.0.0`.

## Operating principles

- GA is feature-frozen. Only confirmed defect fixes, compatibility work,
  release controls, and status corrections enter RC4.
- Tests must fail on RC3 before a behavioral fix is accepted.
- Confirmation and verification use installed tarballs, not only workspace
  source.
- Until RC4 registry availability, provenance, and anonymous installation are
  verified, reproduction details, affected-symbol details, payloads, logs,
  patch and test diffs, pull requests, and CI artifacts for `GA-001` and
  `GA-002` remain in a private advisory or access-controlled security branch.
  Public records contain only IDs, impact, lifecycle state, and opaque private
  evidence references. Pre-clear non-security gates, then merge, tag, and
  publish reviewed security bytes in one coordinated release window.
- The smallest correct fix is preferred; pre-GA is the time to remove dead or
  misleading public contract rather than preserve it indefinitely.
- A merged fix is not done until an independent verifier exercises candidate
  bytes and records evidence.

## Phase 0: Control and freeze

| Order | Work                                                                     | Output                                   | Gate             |
| ----- | ------------------------------------------------------------------------ | ---------------------------------------- | ---------------- |
| 0.1   | Name the release captain and maintainer verifiers                        | Updated owner registry                   | RC4 planning     |
| 0.2   | Open private security coordination for `GA-001` and `GA-002`             | Advisory references and disclosure owner | Security work    |
| 0.3   | Freeze and normalize the RC3 public API                                  | Reviewed API baseline                    | Contract changes |
| 0.4   | Decide supported Node, Vue, package-manager, bundler, and browser floors | One compatibility policy                 | Matrix design    |
| 0.5   | Reconcile live issues and PRs with the GA tracker                        | No untriaged candidate blocker           | RC4 scope        |

Phase 0 closes when private security coordination gate `G-001` passes,
`GA-013` and `GA-016` have owners, the compatibility policy is approved, and
all Blocker/High items have named independent verifiers.

## Phase 1: Independent confirmation

Run confirmation tasks in parallel by lane. Security confirmation uses private
evidence. Each task records exact package version, tarball integrity, Node,
browser, OS, package manager, command or scenario, expected result, actual
result, and immutable output location.

### Security lane

`GA-001` and `GA-002` use private exact-artifact confirmation and regression
matrices. Public evidence records only candidate identity, result
classification, lifecycle state, and opaque private references. Both require
red RC3 and green RC4 results, preserved benign behavior, and independent
verification.

### Runtime lane

`GA-004` mounts chat A with distinctive data, changes to chat B while host data
is delayed, replaces active chat objects, removes the active chat, and resolves
late A work after B is active. No prior or unowned content may render under a
new identity.

`GA-005` updates and removes selected, reply, and edit targets without changing
chat ID. Emitted actions must use current objects, removed targets must be
pruned or canceled, and every chat-owned state must reset on chat change.

`GA-014` records RC3 performance at 100, 500, and 1,000 messages and at 50 and
500 chats. Capture initial render, append, prepend, switching, DOM count, long
tasks, and retained heap. This establishes a support envelope; it does not add
virtualization to RC4.

### Contract lane

`GA-003` compiles clean installed consumers under strict Bundler and NodeNext
resolution. `document.createElement('advanced-chat-components')` and typed
events must infer without casts. Negative cases must fail.

`GA-009` mounts the exported `Chats` component with `showChats` false, toggles
it, and records visibility and pagination emissions. Decide implement versus
remove against the RC3 API baseline.

`GA-013` compares normalized RC3 and candidate exports, component props/events,
models, composables, slots, CSS variables, web-component members, defaults,
events, attributes, and global declarations.

### Accessibility lane

`GA-006` completes message selection by keyboard, including text-only and
file-bearing messages, multiple selection, bulk action, cancellation, announced
state, and focus recovery.

`GA-007` verifies mention navigation, exact token insertion, Escape, Tab,
active-descendant state, and IME composition without accidental send or commit.

`GA-008` verifies initial modal focus, forward and reverse Tab containment,
button/Escape/backdrop/prop/unmount close paths, file replacement, removed
invoker fallback, and focus restoration.

### Package and release lane

`GA-010` and `GA-015` install one exact candidate tarball through npm, pnpm,
and Yarn without repository symlinks. Test Node/Vue floors, strict types,
bundlers, package exports, SSR-safe imports, browser rendering, UMD/CDN entry,
manifest, styles, and peer trees.

`GA-011` records current branch, tag, environment, and release recovery
controls, then proves that a failed gate blocks merge and a repeated publish
workflow converges safely.

`GA-012` and `GA-016` reconcile status-bearing docs, changelog, release records,
issue forms, open issues, and open PRs against the actual package and candidate.

## Phase 2: Remediation

### Security requirements

- Finding-specific reproduction, remediation design, payloads, and regression
  matrices remain in the private advisories until corrected availability.
- Each private matrix records exact RC3 red evidence, exact RC4 green evidence,
  preserved benign behavior, affected entrypoints, and independent verification.
- Fixes and private regression tests are reviewed, merged, tagged, and released
  together in the coordinated RC4 window.

### Runtime requirements

- Define controlled and uncontrolled active-chat authority explicitly.
- Reconcile retained active objects by ID and release an active chat removed
  from the collection.
- Never display messages whose ownership is unknown or differs from the active
  chat. If ownership cannot be proven from the current API, make the minimum
  pre-GA API correction and document it.
- Resolve selected action payloads against current messages and prune removed
  IDs. Refresh or cancel reply/edit state when its target changes or disappears.
- Compute the first unread divider once rather than scanning each prefix.
- Keep virtualization and full SSR support deferred unless confirmation reveals
  an immediate safety blocker.

### Contract requirements

- Preserve the default custom-element global tag augmentation in packed
  declarations.
- Verify auto and core web-component entrypoints under Bundler and NodeNext.
- Implement `Chats.showChats` consistently or remove it with explicit pre-GA
  migration notes.
- Produce a reviewable API report and fail CI on unapproved changes after RC4.

### Accessibility requirements

- Use native, focusable controls for message selection; do not turn a container
  with nested controls into a synthetic checkbox.
- Put combobox semantics on the focused composer control and ignore commit/send
  keys while input composition is active.
- Focus a deliberate modal control on open, contain forward and reverse Tab,
  and restore focus after controlled closure completes.
- Require keyboard interaction assertions and manual VoiceOver/Safari plus
  NVDA/Chrome evidence. Axe remains necessary but is not sufficient.

### Release requirements

- Build one tarball once, record its digest, test that artifact, and publish the
  same artifact.
- One producer job creates the tarball and an identity manifest containing
  version, full commit, tag, workflow run and artifact IDs, filename, SHA-256,
  and npm integrity. Matrix and publish jobs download that artifact, verify the
  manifest, and are prohibited from running `npm pack` again.
- Split verification from protected publishing permissions.
- Require stable aggregate quality and compatibility checks on `main`.
- Add a protected `npm-release` environment and release-manager tag policy.
- Make npm/GitHub release recovery idempotent for matching immutable package
  bytes; a digest mismatch is always a hard stop and new version.
- Deploy public docs from the exact published tag SHA.
- Automate status consistency, public-link, Markdown/MDX, and workflow checks.

## Phase 3: Verification tiers

| Tier                 | Trigger                             | Required scope                                                                                        |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| T0 focused           | Local and subagent iteration        | Finding-specific unit or Storybook test                                                               |
| T1 pull request      | Every PR                            | Format, types, lint, units, Chromium UI/a11y, build, pack, docs build                                 |
| T2 compatibility     | Main, nightly, package-impacting PR | Real tarball pairwise Node/Vue/manager/bundler matrix plus Firefox/WebKit                             |
| T3 release candidate | RC4 and GA candidate                | Full compatibility, actual-browser checks, exact artifact, links, status, license, provenance dry run |
| T4 protected publish | Approved immutable tag              | Publish tested artifact, verify registry, reconcile release/docs, capture evidence                    |

Use pairwise coverage on ordinary CI and the full required matrix for RC4/GA.
Path skipping must still report stable aggregate gate names.

### Approved compatibility matrix

Decision `D-007` approves these exact RC4 cells. Every required cell records OS,
command, expected result, candidate digest, and log URL. Version changes require
a superseding decision and make compatibility evidence stale.

| Dimension  | Required PR/main coverage                   | Required RC4/GA coverage                                                                   | Pass criterion                                    |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Node       | `22.14.0` canonical                         | `22.14.0`, `24.15.0`; Node 20 is removed before RC4                                        | Install, imports, types, build pass               |
| Vue        | `3.5.41`                                    | `3.5.0` and `3.5.41`                                                                       | Peer tree clean and runtime smoke passes          |
| Manager    | npm `11.5.1`                                | npm `11.5.1`, pnpm `11.21.0`, Yarn `4.18.0`                                                | Exact tarball installs without repository links   |
| Resolution | Bundler                                     | Bundler and NodeNext                                                                       | Positive probes pass; negative probes fail        |
| Bundler    | Vite `7.3.6`                                | Vite `7.3.6` and `8.2.1`, webpack `5.109.2`, Rollup `4.62.4`, esbuild `0.28.2`             | Production build retains JS and CSS entrypoints   |
| Browser    | Playwright `1.58.2` Chromium `145.0.7632.6` | Chromium `145.0.7632.6`, Firefox `146.0.1`, WebKit `26.0`; Safari `26.6` on macOS `26.6.1` | Render, events, focus, media, custom element pass |
| Entrypoint | Root and styles                             | Every package export plus UMD/CDN metadata                                                 | Import/resolve/render contract passes             |

## Release convergence and recovery

Publishing is an ordered convergence process. Each side effect inspects current
state first, verifies identity, then creates or repairs only matching state.

| npm package                               | GitHub Release | Required action                                           |
| ----------------------------------------- | -------------- | --------------------------------------------------------- |
| Missing                                   | Missing        | Publish tested artifact, verify registry, create release  |
| Matching digest                           | Missing        | Skip publish, reconcile approved dist-tag, create release |
| Missing                                   | Exists         | Publish, verify, then reconcile release metadata          |
| Matching digest                           | Correct        | No-op success after full verification                     |
| Different digest for version              | Any            | Hard stop; investigate and issue a new version            |
| Correct version, wrong dist-tag           | Any            | Move only approved dist-tag through protected environment |
| Package correct, release metadata wrong   | Incorrect      | Idempotently edit release after tag target verification   |
| Package exists, provenance missing        | Any            | Hard stop; do not soak; escalate or issue a new version   |
| Provenance identity or digest mismatches  | Any            | Hard stop and security investigation                      |
| Correct package, Pages missing/wrong SHA  | Any            | Redeploy exact tag SHA, then rerun status/link checks     |
| Anonymous install fails                   | Any            | Halt convergence; new version for artifact defect         |
| Tag missing, moved, or resolves elsewhere | Any            | Hard stop; never move/reuse tag; investigate as incident  |

Use one-version concurrency, OIDC only in the protected publish job, a named
environment approver, and a release-manager tag rule. Pages deploys only after
registry convergence, from the exact published tag SHA.

## Phase 4: RC4 authorization and publication

### Pre-publish authorization

RC4 may enter the protected publish job only when:

- `GA-001` and `GA-002` are independently verified against candidate bytes.
- Every Blocker is Verified or Disproved, and every High item is Verified,
  Disproved, or explicitly Accepted.
- The RC3-to-RC4 API diff is approved and documented.
- T1 through T3 pass against one recorded tarball digest.
- npm, pnpm, and Yarn clean installs pass without repository symlinks.
- Required Node/Vue and Chromium/Firefox/WebKit cells pass.
- Protected release approval and idempotent recovery are active.
- Current-status docs and issue triage match RC4.
- Candidate wording is accurate without claiming publication, and the tag
  points to reviewed `main`.

### Post-publish convergence

After publication, verify npm version and `next`, provenance, tarball digest,
anonymous package-manager installs, curated GitHub prerelease, exact-tag Pages,
and public links/status. Soak starts only after gate `G-011` records convergence.

After convergence, deprecate RC3 with a generic upgrade notice. Publish the
coordinated advisory on the approved timeline with impact, affected and fixed
versions, mitigation, credits, and identifiers, but no payload, proof of
concept, or step-by-step reproduction. Record deprecation, advisory, link, and
notification evidence. GA remains blocked until gate `G-012` passes.

## Phase 5: RC4 soak

The approved minimum soak is seven calendar days, two independent downstream
confirmations (one Vue and one web-component consumer), and a final 72-hour
blocker-free quiet period inside those seven days. Adopters must be independent
of the implementation agents and must provide install and scenario evidence.
Triage incoming reports within one business day.

A runtime, declaration, package, CSS, dependency, or release-workflow fix
requires RC5 and resets the seven-day soak. A public-copy-only correction gets
focused revalidation and does not reset runtime soak unless it changes contract
meaning.

Downstream evidence covers installation, styles, theming, message flow, events,
files, mobile behavior, types, and upgrade from an earlier V3 prerelease.

## Phase 6: GA promotion

Before the promotion commit, generate `promotion-manifest.json` as an approved
release artifact. It records the last RC commit, proposed GA commit, exact
allowed JSON pointers, exact Markdown unified-diff hunk hashes, and the expected
full patch SHA-256. `G-015` rejects a patch whose digest or any hunk differs.

The promotion manifest may allow only:

- `package.json` version only.
- Root package version fields in `package-lock.json`, with zero dependency or
  resolution changes.
- Exact approved GA heading/status hunks in individually named Markdown/MDX
  files. Directory globs are prohibited.
- Curated GitHub release-note input that does not affect package contents.

CI must reject every unlisted file, field, and hunk, plus every other source,
generated artifact, package-content,
dependency, export, declaration, CSS, build, or workflow delta. The exact GA
artifact receives fresh T3 artifact verification even though approved behavior
evidence carries forward. Any non-allowlisted delta returns to an RC.

GA is complete only when:

- The soak and quiet period finish without an unresolved Blocker or High issue.
- Full T3 passes for the exact `3.0.0` artifact.
- Independent approval records tag, commit, and tarball digest.
- `latest` and `next` resolve to `3.0.0`.
- Provenance identifies the exact GA tag, workflow, commit, and artifact.
- Anonymous unqualified installs pass through every supported package manager.
- GitHub Release is non-prerelease and current; Pages serves the exact GA SHA.
- README, docs, security policy, issue forms, release records, and tracker all
  describe GA consistently.
- The release workflow recovery rerun converges without changing correct state.
- The post-release issue/PR disposition sweep is recorded.
