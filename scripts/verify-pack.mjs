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
  const isAllowedRootFile =
    file === 'README.md' ||
    file === 'package.json' ||
    file === 'LICENSE' ||
    file === 'custom-elements.json'
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

for (const field of ['main', 'module', 'style', 'typings', 'customElements']) {
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

await import(new URL('../dist/components.js', import.meta.url))
const webComponentModule = await import(
  new URL('../dist/advanced-chat-components.js', import.meta.url)
)
await import(new URL('../dist/advanced-chat-components-core.js', import.meta.url))

if (webComponentModule.DEFAULT_CUSTOM_ELEMENT_TAG !== 'advanced-chat-components') {
  throw new Error('The web-component bundle exports an unexpected default tag name.')
}

const customElementsManifest = JSON.parse(
  readFileSync(new URL('../custom-elements.json', import.meta.url), 'utf8'),
)
const manifestTag = customElementsManifest.modules
  ?.flatMap((module) => module.declarations || [])
  .find((declaration) => declaration.customElement)?.tagName
if (manifestTag !== webComponentModule.DEFAULT_CUSTOM_ELEMENT_TAG) {
  throw new Error('The Custom Elements Manifest tag does not match the runtime default tag.')
}

const webComponentBundle = readFileSync(
  new URL('../dist/advanced-chat-components.js', import.meta.url),
  'utf8',
)
if (webComponentBundle.includes('process.env')) {
  throw new Error('Web-component bundle contains unresolved Node process.env references.')
}

console.log(
  `Verified npm pack contract for ${pkg.name}@${pkg.version} with ${packResult.entryCount} packaged files.`,
)
