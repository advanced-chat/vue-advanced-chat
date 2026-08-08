# Releasing `@advanced-chat/components`

This document defines the release path for V3 on the default `main` branch.

The release tracks are intentionally separate: `vue-advanced-chat@2.1.2` is the
stable v2 package, while this tree is the pre-GA
`@advanced-chat/components@3.0.0-rc.2` line. Do not describe a release candidate
as the stable replacement or modify the separate `vue-advanced-chat` package's
`latest` tag as part of a V3 prerelease.

## Trusted Publishing Setup

Configure npm trusted publishing for the exact GitHub Actions workflow in this
repository before the next release. The historical alpha.0 publication predates
this workflow.

- npm package: `@advanced-chat/components`
- GitHub organization or user: `advanced-chat`
- GitHub repository: `advanced-chat-components`
- workflow filename: `release-package.yml`
- environment name: leave blank unless this workflow is later gated behind a GitHub Environment

The publish workflow must continue to run on a GitHub-hosted runner and keep OIDC enabled:

- `runs-on: ubuntu-latest`
- `permissions.id-token: write`

After trusted publishing is working:

- do not add `NPM_TOKEN` or `NODE_AUTH_TOKEN` to the release workflow
- revoke old write-capable npm automation tokens that were previously used for this package
- in npm package settings, set publishing access to require two-factor authentication and disallow tokens

## Release Preconditions

- merge only reviewed, green commits into `main`
- ensure `package.json` version already matches the intended tag, for example `3.0.0-rc.2`
- ensure the local and CI runtime meets npm trusted publishing minimums:
  - Node `22.14.0` or newer
  - npm `11.5.1` or newer
- run the full local verification suite:

```bash
npm ci
npm run verify
```

- when public docs or rewrite records changed, format/check only those files
  rather than bulk-formatting unrelated working-tree files:

```bash
npx prettier --check README.md CHANGELOG.md RELEASING.md "docs/**/*.mdx" "rewrite/*.md"
git diff --check
```

- confirm the package tarball contract is clean:

```bash
npm run verify:pack
```

- confirm npm trusted publishing is configured for the GitHub Actions workflow before attempting release

## Version And Tag Rules

- V3 prereleases use SemVer prerelease versions such as `3.0.0-rc.2`
- the Git tag must match `package.json` exactly with a `v` prefix, for example `v3.0.0-rc.2`
- the release workflow publishes from immutable tags only; do not publish from a branch tip
- prerelease tags publish to npm `next`; stable tags publish to npm `latest`

## Standard Release Flow

1. Update `package.json` and `CHANGELOG.md` to the intended V3 version and land
   the reviewed change on `main`.
2. Verify the exact release commit locally with `npm ci`, `npm run verify`, and `npm run verify:pack`.
3. Create and push only the exact tag, for example
   `git tag v3.0.0-rc.2 && git push origin v3.0.0-rc.2`.
4. The tag push starts `Release Package`; the workflow validates the tag and
   derives the npm dist-tag from the package version.
5. Confirm the workflow completed successfully and that the published npm
   version, dist-tag, provenance metadata, and trusted publisher match the
   intended release.
6. Confirm the workflow created the matching GitHub Release and marked
   prerelease versions as prereleases.

## Release Checklist

- `npm ci` passed
- `npm run verify` passed
- `npm run verify:pack` passed
- `package.json` version matches the intended tag
- immutable Git tag pushed
- `Release Package` workflow ran from that tag
- npm package published with provenance through GitHub OIDC trusted publishing
- npm package page shows provenance for the published release
- matching GitHub Release exists with generated or curated release notes
- public docs state stable v2 and prerelease V3 status accurately
- migration/parity records list deliberate removals and remaining limits

## Rollback And Follow-Up

- if the workflow fails before `npm publish`, fix the issue on `main`, bump to a
  new prerelease version, and create a new matching tag; never move or reuse the
  failed tag
- if the package publishes incorrectly, do not overwrite the version; publish a new corrective version
- if trusted publishing setup is missing, stop and fix the GitHub-to-npm publishing configuration before retrying
