import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

const packOutput = execFileSync('npm', ['pack', '--json', '--dry-run', '--ignore-scripts'], {
  encoding: 'utf8',
})

const [packResult] = JSON.parse(packOutput)

if (!packResult || !Array.isArray(packResult.files)) {
  throw new Error('npm pack --json --dry-run did not return a file manifest.')
}

const packagedFiles = new Set(packResult.files.map((file) => file.path))

for (const file of packagedFiles) {
  const isAllowedRootFile = file === 'README.md' || file === 'package.json' || file === 'LICENSE'
  const isDistArtifact = file.startsWith('dist/')

  if (!isAllowedRootFile && !isDistArtifact) {
    throw new Error(`Unexpected packaged file: ${file}`)
  }
}

const requiredPaths = new Set()

const addRequiredPath = (value) => {
  if (typeof value !== 'string' || !value.startsWith('./')) {
    return
  }

  requiredPaths.add(value.slice(2))
}

for (const field of ['main', 'module', 'style', 'typings']) {
  addRequiredPath(`./${pkg[field]}`)
}

const visitExports = (value) => {
  if (typeof value === 'string') {
    addRequiredPath(value)
    return
  }

  if (!value || typeof value !== 'object') {
    return
  }

  for (const nested of Object.values(value)) {
    visitExports(nested)
  }
}

visitExports(pkg.exports)

for (const requiredPath of requiredPaths) {
  if (!packagedFiles.has(requiredPath)) {
    throw new Error(`Packaged artifact is missing required entrypoint: ${requiredPath}`)
  }
}

console.log(
  `Verified npm pack contract for ${pkg.name}@${pkg.version} with ${packResult.entryCount} packaged files.`,
)
