# Publish-Readiness Audit And Resolution Record

Audit date: 2026-08-08

Scope: public documentation and copy for `@advanced-chat/components`, plus the
package and repository metadata needed to make those claims true. This covers
`README.md`, `docs/`, Storybook descriptions, `CHANGELOG.md`, `RELEASING.md`,
the package manifest, and the published tarball contract.

## Original verdict

The tree audited at the start of 2026-08-08 was not ready to publish.

The component and documentation test suites are not the remaining release
gate. The blocking work is release identity, package compatibility, bundled
license compliance, and correction of public guidance that does not match the
implementation.

## Resolution status

The `3.0.0-rc.3` tree resolves the codebase and documentation blockers
recorded below:

- The repository was renamed to `advanced-chat/advanced-chat-components`, its
  Pages URL exists, repository metadata is current, and private vulnerability
  reporting is enabled.
- The package is versioned `3.0.0-rc.3`; prereleases publish to npm `next` from
  immutable tag pushes.
- The Node package is ESM-only. Browser UMD remains CDN-only and is not exposed
  through a CommonJS condition.
- Public declarations are rolled up and compile in strict `Bundler` and
  `NodeNext` packed consumers.
- MIT licensing, bundled third-party notices, governance files, issue forms,
  and support/security policies are present.
- The Custom Elements Manifest, packed exports, SSR imports, CSS side-effect
  entries, license inventory, and browser web-component contract are verified.
- Public guides, integrations, examples, Storybook labels, and deterministic
  media fixtures were reconciled against implementation and tests.

The Storybook Pages site is deployed and npm trusted publishing now targets the
renamed repository. The remaining external gates are operational rather than
source defects: merge the rc.3 release commit to the default branch, publish
`v3.0.0-rc.3` to `next`, and verify the installed package and provenance
anonymously.

## Original publication blockers (resolved)

### P0: choose and establish the public repository identity

Public metadata targets
`github.com/advanced-chat/advanced-chat-components`, but that repository and
its GitHub Pages site do not currently exist. The checked-out repository still
uses `advanced-chat/vue-advanced-chat` as its remote. As a result, the README
badges and documentation link, package repository and issue URLs, security
advisory link, changelog issue links, and trusted-publishing instructions point
at unavailable locations.

Before editing those links again, choose one topology:

1. Rename this repository to `advanced-chat-components` and deploy its Pages
   site at the documented path.
2. Keep `vue-advanced-chat` and restore every public URL to that repository.
3. Create a separate `advanced-chat-components` repository and move the V3
   release there.

The chosen repository must contain `release-package.yml` on its default branch
before its manual workflow can be dispatched. npm trusted publishing must be
configured against that exact organization, repository, and workflow.

### P0: assign the release an honest version and dist-tag

`package.json` identifies the current tree as `3.0.0-alpha.5`, while the
changelog and release plan identify substantial code in the same tree as
post-alpha.5 work. npm currently contains only `3.0.0-alpha.0`, and unversioned
installation resolves to that old release.

Choose the next version before copy freeze. The existing ladder points to
`3.0.0-beta.0`; `3.0.0-alpha.6` is the conservative alternative. Move the
`Unreleased` notes under the chosen version, include a release date, and publish
prereleases on `next`. Until GA, public install commands must use either the
exact version or `@next`; they must not imply that unqualified installation is
the supported V3 path.

### P0: remove or repair the broken CommonJS contract

The package exposes `dist/components.umd.cjs` through `main` and the root
`require` export. Requiring that entry in Node throws because bundled
`emoji-picker-element` reads `requestAnimationFrame` during module evaluation.
The current package verifier imports only ESM, so it does not detect this.

Either remove the `require` condition and describe V3 as ESM-only, or make the
CJS entry import-safe and add a packed-package `require()` smoke test. A
browser-global UMD artifact may remain available without being advertised as a
Node CommonJS entry.

### P0: ship bundled third-party license notices

The generated bundles redistribute third-party code, including Apache-2.0
`emoji-picker-element` and multiple MIT dependencies. The tarball contains only
the project's MIT license and the generated bundles do not retain the required
notices.

Generate and include a `THIRD_PARTY_LICENSES` or `NOTICE` file for every bundled
dependency. Make `verify:pack` require it. Complete a license review whenever
the bundle dependency set changes.

## Original high-priority release gates (resolved)

### Package contract

- Generated declarations fail for consumers using TypeScript `NodeNext`
  resolution because they contain `.vue` and extensionless ESM imports. Either
  roll up the declarations and test `Bundler` plus `NodeNext`, or document and
  enforce a narrower support policy.
- `custom-elements.json` refers to a nonexistent `ThemeOptions` type instead of
  the exported `Theme` shape.
- The pack verifier checks working-tree artifacts rather than installing the
  tarball as a consumer. Add tests for package-name ESM resolution, CommonJS if
  retained, TypeScript, styles, both web-component entrypoints, and SSR import
  safety.
- The tarball includes internal declaration debris such as story fixtures and
  a `vite/client` reference. Generate declarations only for the public surface.
- The release workflow accepts incompatible version/dist-tag combinations.
  Reject prereleases on `latest`, reject stable versions on prerelease tags,
  and push only the intended release tag rather than all local tags.

### Public documentation and copy

- Rewrite `docs/05-security.mdx`. Micromark is currently safe by default
  because dangerous HTML and dangerous protocols are not enabled; GFM
  tagfilter is not an event-attribute sanitizer; sanitizing raw Markdown is not
  equivalent to sanitizing generated HTML; and the CSS-injection example does
  not match Vue's single-property style binding. Document the actual trust
  boundaries, remote-resource risks, allowed protocols, and input-size limits.
- Correct theming guidance. `Layout` writes the full theme map as inline custom
  properties, so ordinary stylesheet declarations do not override those
  values. Document object-form `theme` and `Layout.styles` as the supported
  mechanisms unless the implementation is changed. Correct the message-link
  rule and remove the claim that the package contains theme JSON files.
- Make web-component examples complete and type-valid, or label them as
  abbreviated fragments. The current Vanilla, React, Angular, and Svelte
  examples omit required model fields, declarations, or component state.
- Remove unsupported `Chat` slot guidance from the custom-actions cookbook.
  The named slots belong to lower-level components and are not forwarded by
  `Chat`.
- Replace the Vite SSR example with a mounted/client-only pattern that renders
  the same fallback on the server and during hydration.
- Repair the backend-integration recipe: require authorization rules and
  membership filtering, convert Firestore timestamps into model strings,
  unsubscribe live listeners, and use one-shot reads for pagination.
- Revoke upload preview object URLs in `finally` blocks so failed uploads do
  not leak them.
- Correct smaller factual errors: local search is accent-insensitive;
  pagination uses an immutable prepend, not an in-place append; eventless
  components do not export `*Events`; and `AdvancedChatPluginType` describes an
  installable plugin object rather than a function.
- Replace test-oriented public Storybook labels such as "Regression", "Fires",
  "Emits", and "GA policy" with consumer-facing scenarios. Hide purely
  internal regression stories from documentation navigation.
- Replace remote and intentionally invalid media fixtures with deterministic
  local assets before treating Storybook as the public documentation site.

### Open-source project baseline

- Add `SECURITY.md` with supported versions and a verified private reporting
  route.
- Add `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SUPPORT.md` before public
  launch. Define issue versus support boundaries and the project's CLA or DCO
  policy.
- Add issue and pull-request templates once the final repository exists.
- Add dates and compare links to release headings. Remove internal drafting
  asides, test-count snapshots, and rewrite-directory bookkeeping from public
  changelog entries unless they explain consumer impact.

## Decisions resolved during release-candidate preparation

1. Repository: `advanced-chat/advanced-chat-components`; V3 becomes the default
   `main` line and legacy source is preserved on `v2`.
2. Version: `3.0.0-rc.3`; prereleases publish to `next`, stable to `latest`.
3. Module policy: ESM-only Node package with a browser-only UMD artifact.
4. TypeScript policy: strict `Bundler` and `NodeNext` consumers are verified.
5. CDN policy: browser UMD remains the Vue-library CDN artifact; the standalone
   web component uses its explicit ESM subpath.
6. License: MIT with original-author and 2019-2026 contributor attribution.
7. SSR and security limits are documented without claiming full server
   rendering or host-side authorization.
8. Security reports use GitHub private vulnerability reporting; support uses
   Discussions; contributions are licensed under MIT without a separate CLA.

## Execution order

1. Resolve repository, version, module-format, type-resolution, and policy
   decisions. Establish the final repository and documentation URLs.
2. Repair the distributable contract: license notices, declarations, exports,
   manifest, packed-consumer tests, and workflow guards.
3. Correct security, theming, integration, SSR, upload, and API guidance
   against tested behavior.
4. Add the open-source community and security files, then rewrite README and
   changelog copy around the chosen release identity.
5. Deploy documentation and verify every public link anonymously. Run the full
   verification suite from a clean clone and inspect the exact tarball.
6. Publish the immutable prerelease tag to `next`, verify npm provenance and
   installability, then promote to GA only after prerelease feedback is closed.

## Exit criteria for publication

Publication is complete only when the final commit and workflows are on `main`,
the Pages site serves the V3 Storybook build, npm trusted publishing succeeds
for `v3.0.0-rc.3`, `next` resolves to that version, provenance is visible, and a
clean anonymous consumer can install and exercise the documented entrypoints.
