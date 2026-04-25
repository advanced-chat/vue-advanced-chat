# Releasing `@advanced-chat/components`

This document defines the release path for the V3 rewrite on the `develop` branch.

## Trusted Publishing Setup

Configure npm trusted publishing for the exact GitHub Actions workflow in this repository before the first live release.

- npm package: `@advanced-chat/components`
- GitHub organization or user: `advanced-chat`
- GitHub repository: `vue-advanced-chat`
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

- merge only from reviewed, green commits on `develop`
- ensure `package.json` version already matches the intended tag, for example `3.0.0-alpha.1`
- ensure the local and CI runtime meets npm trusted publishing minimums:
  - Node `22.14.0` or newer
  - npm `11.5.1` or newer
- run the full local verification suite:

```bash
npm ci
npm run verify
```

- confirm the package tarball contract is clean:

```bash
npm run verify:pack
```

- confirm npm trusted publishing is configured for the GitHub Actions workflow before attempting release

## Version And Tag Rules

- V3 prereleases should use semver prerelease versions such as `3.0.0-alpha.1`
- the Git tag must match `package.json` exactly with a `v` prefix, for example `v3.0.0-alpha.1`
- the release workflow publishes from immutable tags only; do not publish from a branch tip

## Standard Release Flow

1. Update `package.json` to the intended V3 version and land the change on `develop`.
2. Verify the exact release commit locally with `npm ci`, `npm run verify`, and `npm run verify:pack`.
3. Create and push the exact tag, for example `v3.0.0-alpha.1`.
4. Run the `Release Package` GitHub Actions workflow with:
   - `release_ref`: the exact tag
   - `npm_dist_tag`: `next` for prereleases unless there is an explicit release decision to use another tag
5. Confirm the workflow completed successfully and that the published npm version, dist-tag, provenance metadata, and npm trusted publisher details match the intended release.

## Release Checklist

- `npm ci` passed
- `npm run verify` passed
- `npm run verify:pack` passed
- `package.json` version matches the intended tag
- immutable Git tag pushed
- `Release Package` workflow ran from that tag
- npm package published with provenance through GitHub OIDC trusted publishing
- npm package page shows provenance for the published release
- changelog or release notes captured in the repo or release record used for the publication

## Rollback And Follow-Up

- if the workflow fails before `npm publish`, fix the issue on `develop`, retag from a new commit, and rerun from the new immutable tag
- if the package publishes incorrectly, do not overwrite the version; publish a new corrective version
- if trusted publishing setup is missing, stop and fix the GitHub-to-npm publishing configuration before retrying
