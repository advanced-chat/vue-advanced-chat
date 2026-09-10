import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repository = 'advanced-chat/advanced-chat-components'
const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const snapshotPath = join(projectRoot, 'ga-readiness/triage-snapshot.json')

const runGh = (args) => JSON.parse(execFileSync('gh', args, { cwd: projectRoot, encoding: 'utf8' }))

const issueFields = [
  'number',
  'title',
  'url',
  'author',
  'assignees',
  'labels',
  'milestone',
  'createdAt',
  'updatedAt',
]
const pullRequestFields = [
  ...issueFields,
  'isDraft',
  'headRefName',
  'baseRefName',
  'reviewDecision',
  'mergeStateStatus',
]
const capturedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
const snapshotId = `GH-${capturedAt.replace(/[-:]/g, '')}`

const snapshot = {
  schemaVersion: 1,
  snapshotId,
  capturedAt,
  repository: runGh(['repo', 'view', repository, '--json', 'nameWithOwner,url,defaultBranchRef']),
  queries: {
    issues: `gh issue list --repo ${repository} --state open --limit 1000 --json ${issueFields.join(',')}`,
    pullRequests: `gh pr list --repo ${repository} --state open --limit 1000 --json ${pullRequestFields.join(',')}`,
  },
  issues: runGh([
    'issue',
    'list',
    '--repo',
    repository,
    '--state',
    'open',
    '--limit',
    '1000',
    '--json',
    issueFields.join(','),
  ]),
  pullRequests: runGh([
    'pr',
    'list',
    '--repo',
    repository,
    '--state',
    'open',
    '--limit',
    '1000',
    '--json',
    pullRequestFields.join(','),
  ]),
}

writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(
  `Captured ${snapshot.issues.length} open issues and ${snapshot.pullRequests.length} open pull requests in ${snapshotPath}.`,
)
