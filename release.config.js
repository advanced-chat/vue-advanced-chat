module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      'changelogFile': 'CHANGELOG.md'
    }],
    ['@semantic-release/npm', {
      'npmPublish': true
    }],
    ['@semantic-release/github', {
      'assets': ['dist/**', 'LICENSE']
    }],
    ['@semantic-release/git', {
      'assets': ['CHANGELOG.md'],
      // eslint-disable-next-line no-template-curly-in-string
      'message': 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }]
  ]
}
