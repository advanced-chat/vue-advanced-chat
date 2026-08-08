# Security Policy

## Supported Versions

Security support follows the versions published under npm dist-tags, not every version in a major
release line.

| Package and release lifecycle                                                                    | Status        |
| ------------------------------------------------------------------------------------------------ | ------------- |
| Before 3.0.0 GA: the single newest `@advanced-chat/components` prerelease published under `next` | Supported     |
| Before 3.0.0 GA: all earlier `@advanced-chat/components` prereleases                             | Not supported |
| After GA: the single newest stable `@advanced-chat/components` release published under `latest`  | Supported     |
| After GA: all earlier stable `@advanced-chat/components` releases                                | Not supported |
| All `vue-advanced-chat` releases                                                                 | Not supported |

A version declared in repository files but not yet published under the applicable dist-tag is not
supported. A security fix may be released only in a newer version, requiring affected users to
upgrade.

## Reporting A Vulnerability

Do not open a public issue, discussion, or pull request for a suspected vulnerability.

Use GitHub's private vulnerability reporting route:

<https://github.com/advanced-chat/advanced-chat-components/security/advisories/new>

Include:

- The affected package, version, import path, and build format.
- A description of the impact and the conditions required to reproduce it.
- Minimal reproduction steps or a private proof of concept.
- Affected browsers, frameworks, and deployment configuration.
- Any suggested mitigation or evidence that the issue is already public.

Remove secrets, access tokens, personal data, and production customer data from reports. Reports
that only contain automated scanner output may need additional reproduction details before they
can be evaluated.

Maintainers will communicate through the private advisory. The project does not guarantee a
response or resolution time. Please keep the report confidential until maintainers publish an
advisory or agree that coordinated disclosure can proceed.

## Scope

Examples of in-scope reports include exploitable unsafe HTML or URL handling, cross-site scripting
in library-rendered content, unintended exposure of sensitive data by the library, and a bundled
dependency vulnerability that is reachable through distributed code.

Application authentication, authorization, storage, transport security, and server-side message
validation remain the integrating application's responsibility. Usage questions, unsupported
versions, and behavior without a demonstrated security impact belong in the support channels in
[`SUPPORT.md`](SUPPORT.md), not in a private advisory.
