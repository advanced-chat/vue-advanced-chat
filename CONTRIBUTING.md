# Contributing

Thank you for contributing to Advanced Chat Components. Participation in this repository is
governed by the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Choose The Right Channel

- Ask usage and integration questions in [GitHub Discussions Q&A](https://github.com/advanced-chat/advanced-chat-components/discussions/categories/q-a).
- Submit a reproducible defect with the GitHub bug form.
- Propose focused enhancements with the feature request form. Discuss large API or architecture
  changes before investing in an implementation.
- Report vulnerabilities privately as described in [`SECURITY.md`](SECURITY.md).

## Branches

- `main` contains the current `@advanced-chat/components` release line. Open
  normal V3 changes against `main` unless maintainers announce a separate
  integration branch.
- `v2` preserves the legacy `vue-advanced-chat@2.1.2` source. Target it only
  for a maintainer-requested legacy backport.

Create a short-lived branch from the current target branch. Keep a pull request focused; unrelated
cleanup should be a separate change.

## Local Setup

The repository uses npm and requires Node.js `>=22.14.0`. The checked-in `.nvmrc` selects
Node.js 22.14.0.

```sh
nvm use
npm ci
```

Use `npm ci`, not `npm install`, when validating the checked-in lockfile. Run Storybook locally
with `npm run storybook` when changing rendered components or examples.

## Make A Change

- Add or update tests for observable behavior.
- Add or update Storybook stories when component states, interactions, or accessibility behavior
  change.
- Preserve the public TypeScript, Vue, and web-component contracts unless the change intentionally
  changes an API and documents the migration impact.
- Do not include credentials, private data, generated local artifacts, or unrelated formatting.
- Follow the repository's existing concise, imperative commit style. Conventional prefixes such as
  `fix:`, `feat:`, `test:`, and `docs:` are commonly used.

Contributions are submitted under the repository's MIT License. By submitting a contribution, you
represent that you have the right to license it on those terms.

## Validate

Use focused commands while developing:

```sh
npm run format:check
npm run type-check
npm run lint
npm run test:unit
npm run test:storybook
```

`npm run format` writes only `src/` and `.storybook/`. Run Prettier directly with explicit paths
when checking other supported file types.

Before requesting final review, run the complete project gate:

```sh
npm run verify
```

The complete gate checks formatting, types, lint, unit and Storybook tests, library and
web-component builds, package contents, the web-component contract, and the static Storybook
build. Browser tests require Playwright Chromium; install it when needed with:

```sh
npx playwright install chromium
```

## Pull Requests

In the pull request:

- Explain the user-visible problem and the chosen solution.
- Link related issues or state that there is no issue.
- List the exact validation commands run.
- Include screenshots or recordings for visual changes.
- Call out breaking changes, compatibility limits, and follow-up work explicitly.

Maintainers may ask for changes, split an oversized pull request, or decline work that does not fit
the project's direction or maintenance capacity. Submission does not guarantee acceptance or a
release date.
