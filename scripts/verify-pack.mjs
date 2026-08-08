import { execFileSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const sourcePackage = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'))
const temporaryRoot = mkdtempSync(join(tmpdir(), 'advanced-chat-pack-'))
const viteBin = join(projectRoot, 'node_modules/vite/bin/vite.js')

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const assertSameNames = (actual, expected, label) => {
  const actualNames = [...actual].sort()
  const expectedNames = [...expected].sort()
  assert(
    JSON.stringify(actualNames) === JSON.stringify(expectedNames),
    `${label} differ. Actual: ${actualNames.join(', ')}. Expected: ${expectedNames.join(', ')}.`,
  )
}

const addMetadataPath = (paths, value) => {
  if (typeof value === 'string') {
    paths.add(value.replace(/^\.\//, ''))
  }
}

const visitExportTargets = (paths, value) => {
  if (typeof value === 'string') {
    addMetadataPath(paths, value)
    return
  }

  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) {
      visitExportTargets(paths, nested)
    }
  }
}

const linkDependency = (consumerNodeModules, packageName) => {
  const source = join(projectRoot, 'node_modules', packageName)
  const target = join(consumerNodeModules, packageName)
  mkdirSync(dirname(target), { recursive: true })
  symlinkSync(source, target, 'dir')
}

const listFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? listFiles(path) : [path]
  })

const normalizeType = (text, aliases = new Map()) => {
  const typeFile = ts.createSourceFile(
    'contract-type.ts',
    `type ContractType = ${text}`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  assert(!typeFile.parseDiagnostics.length, `Could not parse contract type: ${text}`)
  const declaration = typeFile.statements.find(ts.isTypeAliasDeclaration)
  assert(declaration, `Could not read contract type: ${text}`)

  let normalized = ts
    .createPrinter({ removeComments: true })
    .printNode(ts.EmitHint.Unspecified, declaration.type, typeFile)
  for (const [localName, publicName] of aliases) {
    normalized = normalized.replace(new RegExp(`\\b${localName}\\b`, 'g'), publicName)
  }
  return normalized.replace(/\s+/g, '').replace(/;/g, '')
}

const unwrapExpression = (expression) => {
  let current = expression
  while (ts.isParenthesizedExpression(current)) {
    current = current.expression
  }
  if (ts.isArrowFunction(current)) {
    return unwrapExpression(current.body)
  }
  return current
}

const expressionValue = (expression) => {
  const value = unwrapExpression(expression)
  if (ts.isStringLiteral(value) || ts.isNumericLiteral(value)) {
    return value.text
  }
  if (value.kind === ts.SyntaxKind.TrueKeyword) return true
  if (value.kind === ts.SyntaxKind.FalseKeyword) return false
  if (value.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isArrayLiteralExpression(value)) {
    return value.elements.map(expressionValue)
  }
  if (ts.isObjectLiteralExpression(value)) {
    return Object.fromEntries(
      value.properties.map((property) => {
        assert(
          ts.isPropertyAssignment(property) &&
            (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)),
          `Unsupported object default: ${property.getText()}`,
        )
        return [property.name.text, expressionValue(property.initializer)]
      }),
    )
  }
  throw new Error(`Unsupported default expression: ${value.getText()}`)
}

const parseDefault = (text) => {
  const defaultFile = ts.createSourceFile(
    'contract-default.ts',
    `const contractDefault = ${text}`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  assert(!defaultFile.parseDiagnostics.length, `Could not parse manifest default: ${text}`)
  const declaration = defaultFile.statements[0]?.declarationList?.declarations[0]
  assert(declaration?.initializer, `Could not read manifest default: ${text}`)
  return expressionValue(declaration.initializer)
}

const getCustomEventDetailType = (text) => {
  const eventFile = ts.createSourceFile(
    'contract-event.ts',
    `type ContractEvent = ${text}`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const declaration = eventFile.statements.find(ts.isTypeAliasDeclaration)
  assert(
    declaration &&
      ts.isTypeReferenceNode(declaration.type) &&
      declaration.type.typeName.getText(eventFile) === 'CustomEvent' &&
      declaration.type.typeArguments?.length === 1,
    `Manifest event type must be CustomEvent<T>: ${text}`,
  )
  return normalizeType(declaration.type.typeArguments[0].getText(eventFile))
}

const getAttributeType = (type, sourceFile, aliases) => {
  const override = normalizeType(type.getText(sourceFile), aliases)
  if (override === 'Theme') {
    return normalizeType("'light' | 'dark' | 'auto'")
  }

  const members = ts.isUnionTypeNode(type) ? type.types : [type]
  const primitiveMembers = members.filter(
    (member) =>
      member.kind === ts.SyntaxKind.StringKeyword ||
      member.kind === ts.SyntaxKind.NumberKeyword ||
      member.kind === ts.SyntaxKind.BooleanKeyword ||
      (ts.isLiteralTypeNode(member) &&
        (ts.isStringLiteral(member.literal) ||
          ts.isNumericLiteral(member.literal) ||
          member.literal.kind === ts.SyntaxKind.TrueKeyword ||
          member.literal.kind === ts.SyntaxKind.FalseKeyword)),
  )
  if (!primitiveMembers.length) return undefined
  return primitiveMembers
    .map((member) => normalizeType(member.getText(sourceFile), aliases))
    .join('|')
}

const getPublicSourceContract = () => {
  const componentPath = join(projectRoot, 'src/components/AdvancedChat.vue')
  const componentSource = readFileSync(componentPath, 'utf8')
  const script = componentSource.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)?.[1]
  assert(script, 'Could not find the TypeScript setup script in AdvancedChat.vue.')

  const sourceFile = ts.createSourceFile(
    componentPath,
    script,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const aliases = new Map()
  const props = new Map()
  const events = new Map()
  const defaults = new Map()
  const attributes = new Map()

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings) {
      if (ts.isNamedImports(statement.importClause.namedBindings)) {
        for (const specifier of statement.importClause.namedBindings.elements) {
          aliases.set(specifier.name.text, specifier.propertyName?.text || specifier.name.text)
        }
      }
    }

    if (!ts.isInterfaceDeclaration(statement)) {
      continue
    }

    if (statement.name.text === 'AdvancedChatProps') {
      for (const member of statement.members) {
        if (
          ts.isPropertySignature(member) &&
          member.type &&
          member.name &&
          ts.isIdentifier(member.name)
        ) {
          const name = member.name.text
          props.set(name, normalizeType(member.type.getText(sourceFile), aliases))
          const attributeType = getAttributeType(member.type, sourceFile, aliases)
          if (attributeType) attributes.set(name, attributeType)
        }
      }
    }

    if (statement.name.text === 'AdvancedChatEvents') {
      for (const member of statement.members) {
        const eventType = ts.isCallSignatureDeclaration(member)
          ? member.parameters[0]?.type
          : undefined
        if (eventType && ts.isLiteralTypeNode(eventType) && ts.isStringLiteral(eventType.literal)) {
          const detailParameters = member.parameters.slice(1)
          const detailType =
            detailParameters.length === 0
              ? 'null'
              : detailParameters.length === 1
                ? detailParameters[0].type?.getText(sourceFile)
                : `[${detailParameters.map((parameter) => parameter.type?.getText(sourceFile)).join(',')}]`
          assert(detailType, `Event ${eventType.literal.text} has an untyped detail parameter.`)
          events.set(eventType.literal.text, normalizeType(detailType, aliases))
        }
      }
    }
  }

  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'withDefaults' &&
      node.arguments[1] &&
      ts.isObjectLiteralExpression(node.arguments[1])
    ) {
      for (const property of node.arguments[1].properties) {
        assert(
          ts.isPropertyAssignment(property) && ts.isIdentifier(property.name),
          `Unsupported withDefaults property: ${property.getText(sourceFile)}`,
        )
        defaults.set(property.name.text, expressionValue(property.initializer))
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  return { attributes, defaults, events, props }
}

const parseLicenseInventory = (contents) => {
  const rows = new Map()
  let inInventory = false
  for (const line of contents.split('\n')) {
    if (line === '## Bundled Packages') {
      inInventory = true
      continue
    }
    if (inInventory && line.startsWith('## ')) break
    if (!inInventory || !line.startsWith('| `')) continue

    const cells = line.split('|').map((cell) => cell.trim())
    const packageName = cells[1]?.match(/^`(.+)`$/)?.[1]
    const version = cells[2]
    assert(packageName && version, `Could not parse bundled license inventory row: ${line}`)
    assert(!rows.has(packageName), `Duplicate package in bundled license inventory: ${packageName}`)
    rows.set(packageName, version)
  }
  assert(rows.size, 'THIRD_PARTY_LICENSES.md has no bundled package inventory.')
  return new Set([...rows].map(([name, version]) => `${name}@${version}`))
}

const getBundledPackagesFromSourceMaps = () => {
  const sourceMapRoot = join(temporaryRoot, 'private-source-maps')
  const builds = [
    { name: 'vue' },
    { name: 'web-component', config: 'vite.web-component.config.ts' },
    { name: 'web-component-core', config: 'vite.web-component.config.ts', mode: 'core' },
  ]

  for (const build of builds) {
    const outDir = join(sourceMapRoot, build.name)
    const args = [viteBin, 'build']
    if (build.config) args.push('--config', build.config)
    if (build.mode) args.push('--mode', build.mode)
    args.push('--outDir', outDir, '--sourcemap', '--emptyOutDir')
    execFileSync(process.execPath, args, { cwd: projectRoot, stdio: 'pipe' })
  }

  const sourceMaps = listFiles(sourceMapRoot).filter((file) => file.endsWith('.map'))
  assert(sourceMaps.length, 'Private verification builds did not produce source maps.')
  const packages = new Set()

  for (const sourceMapPath of sourceMaps) {
    const sourceMap = JSON.parse(readFileSync(sourceMapPath, 'utf8'))
    for (const source of sourceMap.sources || []) {
      const sourcePath = resolve(dirname(sourceMapPath), decodeURIComponent(source)).replaceAll(
        '\\',
        '/',
      )
      const marker = '/node_modules/'
      const markerIndex = sourcePath.lastIndexOf(marker)
      if (markerIndex === -1) continue

      const packageSegments = sourcePath.slice(markerIndex + marker.length).split('/')
      const packageName = packageSegments[0]?.startsWith('@')
        ? packageSegments.slice(0, 2).join('/')
        : packageSegments[0]
      if (!packageName || packageName === '.vite') continue

      const packageRoot = sourcePath.slice(0, markerIndex + marker.length) + packageName
      const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
      packages.add(`${packageJson.name}@${packageJson.version}`)
    }
  }

  return packages
}

try {
  const licensedPackages = parseLicenseInventory(
    readFileSync(join(projectRoot, 'THIRD_PARTY_LICENSES.md'), 'utf8'),
  )
  const bundledPackages = getBundledPackagesFromSourceMaps()
  assertSameNames(bundledPackages, licensedPackages, 'Bundled package license inventory')

  const packOutput = execFileSync(
    'npm',
    ['pack', '--json', '--ignore-scripts', '--pack-destination', temporaryRoot],
    { cwd: projectRoot, encoding: 'utf8' },
  )
  const [packResult] = JSON.parse(packOutput)
  assert(packResult && Array.isArray(packResult.files), 'npm pack did not return a file manifest.')

  const packagedFiles = new Set(packResult.files.map((file) => file.path))
  const allowedRootFiles = new Set([
    'LICENSE',
    'README.md',
    'THIRD_PARTY_LICENSES.md',
    'custom-elements.json',
    'package.json',
  ])

  for (const file of packagedFiles) {
    assert(
      allowedRootFiles.has(file) || file.startsWith('dist/'),
      `Unexpected packaged file: ${file}`,
    )
    assert(
      !/(^|\/)(env\.d\.ts|.*(?:stories|fixtures).*\.d\.ts|.*\.(?:spec|test)\.d\.ts)$/i.test(file),
      `Internal declaration debris was packaged: ${file}`,
    )
    assert(!file.endsWith('.map'), `Source map must not be published: ${file}`)
  }

  for (const requiredRootFile of ['LICENSE', 'THIRD_PARTY_LICENSES.md', 'custom-elements.json']) {
    assert(packagedFiles.has(requiredRootFile), `Packed artifact is missing ${requiredRootFile}.`)
  }

  const declarationFiles = [...packagedFiles].filter((file) => file.endsWith('.d.ts'))
  assertSameNames(
    declarationFiles,
    [
      'dist/index.d.ts',
      'dist/styles.d.ts',
      'dist/web-component-core.d.ts',
      'dist/web-component.d.ts',
    ],
    'Public declaration files',
  )

  const styleDeclarationFile = ts.createSourceFile(
    'styles.d.ts',
    readFileSync(join(projectRoot, 'dist/styles.d.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  assert(
    styleDeclarationFile.statements.length === 1 &&
      ts.isExportDeclaration(styleDeclarationFile.statements[0]) &&
      ts.isNamedExports(styleDeclarationFile.statements[0].exportClause) &&
      styleDeclarationFile.statements[0].exportClause.elements.length === 0,
    'styles.d.ts must be a side-effect-only empty module.',
  )

  const tarballPath = join(temporaryRoot, packResult.filename)
  const consumerRoot = join(temporaryRoot, 'consumer')
  const consumerNodeModules = join(consumerRoot, 'node_modules')
  const installedPackageRoot = join(consumerNodeModules, '@advanced-chat/components')
  mkdirSync(installedPackageRoot, { recursive: true })
  execFileSync('tar', ['-xzf', tarballPath, '--strip-components=1', '-C', installedPackageRoot])

  const packedPackage = JSON.parse(readFileSync(join(installedPackageRoot, 'package.json'), 'utf8'))
  assert(packedPackage.type === 'module', 'Packed package must declare ESM semantics.')
  assert(
    !Object.hasOwn(packedPackage, 'main'),
    'Packed package must not advertise a Node main entry.',
  )
  assert(
    !Object.hasOwn(packedPackage.exports['.'], 'require'),
    'Packed root export must not advertise CommonJS support.',
  )
  assert(
    packedPackage.unpkg === 'dist/components.umd.js' &&
      packedPackage.jsdelivr === 'dist/components.umd.js',
    'Browser CDN metadata must point to the browser-only UMD artifact.',
  )

  const requiredPaths = new Set()
  for (const field of ['module', 'style', 'types', 'customElements', 'unpkg', 'jsdelivr']) {
    addMetadataPath(requiredPaths, packedPackage[field])
  }
  visitExportTargets(requiredPaths, packedPackage.exports)
  for (const requiredPath of requiredPaths) {
    assert(
      packagedFiles.has(requiredPath),
      `Packed artifact is missing entrypoint: ${requiredPath}`,
    )
  }

  const customElementsManifest = JSON.parse(
    readFileSync(join(installedPackageRoot, 'custom-elements.json'), 'utf8'),
  )
  const manifestDeclaration = customElementsManifest.modules
    ?.flatMap((module) => module.declarations || [])
    .find((declaration) => declaration.customElement)
  assert(manifestDeclaration, 'Custom Elements Manifest has no custom-element declaration.')
  assert(
    manifestDeclaration.tagName === 'advanced-chat-components',
    'Custom Elements Manifest has an unexpected default tag.',
  )

  for (const module of customElementsManifest.modules) {
    assert(packagedFiles.has(module.path), `Manifest module path is not packaged: ${module.path}`)
  }
  const manifestDefinition = customElementsManifest.modules
    .flatMap((module) => module.exports || [])
    .find((entry) => entry.kind === 'custom-element-definition')
  assert(
    manifestDefinition?.name === manifestDeclaration.tagName &&
      manifestDefinition.declaration?.name === manifestDeclaration.name &&
      packagedFiles.has(manifestDefinition.declaration?.module),
    'Manifest custom-element definition does not resolve to its packaged declaration.',
  )

  const sourceContract = getPublicSourceContract()
  assertSameNames(
    new Set(manifestDeclaration.members.map((member) => member.name)),
    new Set(sourceContract.props.keys()),
    'Custom-element properties',
  )
  for (const member of manifestDeclaration.members) {
    assert(
      normalizeType(member.type?.text) === sourceContract.props.get(member.name),
      `Manifest property ${member.name} type differs from source: ${member.type?.text}.`,
    )
  }

  const manifestDefaults = new Map(
    manifestDeclaration.members
      .filter((member) => Object.hasOwn(member, 'default'))
      .map((member) => [member.name, parseDefault(member.default)]),
  )
  assertSameNames(
    new Set(manifestDefaults.keys()),
    new Set(sourceContract.defaults.keys()),
    'Custom-element property defaults',
  )
  for (const [name, defaultValue] of sourceContract.defaults) {
    assert(
      JSON.stringify(manifestDefaults.get(name)) === JSON.stringify(defaultValue),
      `Manifest property ${name} default differs from source.`,
    )
  }

  assertSameNames(
    new Set(manifestDeclaration.events.map((event) => event.name)),
    new Set(sourceContract.events.keys()),
    'Custom-element events',
  )
  for (const event of manifestDeclaration.events) {
    assert(
      getCustomEventDetailType(event.type?.text) === sourceContract.events.get(event.name),
      `Manifest event ${event.name} detail type differs from source: ${event.type?.text}.`,
    )
  }

  assertSameNames(
    new Set(manifestDeclaration.attributes.map((attribute) => attribute.fieldName)),
    new Set(sourceContract.attributes.keys()),
    'Custom-element attributes',
  )
  for (const attribute of manifestDeclaration.attributes) {
    const expectedName = attribute.fieldName.replace(
      /[A-Z]/g,
      (letter) => `-${letter.toLowerCase()}`,
    )
    assert(
      attribute.name === expectedName,
      `Manifest attribute ${attribute.name} should be named ${expectedName}.`,
    )
    assert(
      normalizeType(attribute.type?.text) === sourceContract.attributes.get(attribute.fieldName),
      `Manifest attribute ${attribute.name} type differs from source: ${attribute.type?.text}.`,
    )
  }

  const webComponentBundle = readFileSync(
    join(installedPackageRoot, 'dist/advanced-chat-components.js'),
    'utf8',
  )
  assert(
    !webComponentBundle.includes('process.env'),
    'Web-component bundle contains unresolved Node process.env references.',
  )

  for (const packageName of [
    ...Object.keys(sourcePackage.dependencies || {}),
    ...Object.keys(sourcePackage.peerDependencies || {}),
  ]) {
    linkDependency(consumerNodeModules, packageName)
  }

  writeFileSync(join(consumerRoot, 'package.json'), '{"private":true,"type":"module"}\n')
  writeFileSync(
    join(consumerRoot, 'runtime.mjs'),
    `
const root = await import('@advanced-chat/components')
const core = await import('@advanced-chat/components/web-component/core')
const autoRegistering = await import('@advanced-chat/components/web-component')

if (typeof root.AdvancedChat !== 'object' || typeof root.getThemeStyles !== 'function') {
  throw new Error('Root ESM package-name import is missing public exports.')
}
if (core.DEFAULT_CUSTOM_ELEMENT_TAG !== 'advanced-chat-components') {
  throw new Error('Core web-component export has an unexpected default tag.')
}
if (typeof core.registerAdvancedChat !== 'function') {
  throw new Error('Core web-component package-name import is missing registration exports.')
}
if (
  autoRegistering.DEFAULT_CUSTOM_ELEMENT_TAG !== core.DEFAULT_CUSTOM_ELEMENT_TAG ||
  typeof autoRegistering.registerAdvancedChat !== 'function'
) {
  throw new Error('Auto-registering web-component package-name import is missing public exports.')
}

for (const entry of [
  '@advanced-chat/components/styles',
  '@advanced-chat/components/web-component/styles',
]) {
  import.meta.resolve(entry)
}
`,
  )
  execFileSync(process.execPath, ['runtime.mjs'], { cwd: consumerRoot, stdio: 'inherit' })

  writeFileSync(
    join(consumerRoot, 'contract.ts'),
    `
import '@advanced-chat/components/styles'
import '@advanced-chat/components/web-component/styles'
import {
  DEFAULT_CUSTOM_ELEMENT_TAG as AUTO_REGISTER_TAG,
  type AdvancedChatHTMLElement as AutoRegisteredAdvancedChatHTMLElement,
} from '@advanced-chat/components/web-component'
import {
  AdvancedChat,
  getThemeStyles,
  type AdvancedChatProps,
  type ChatModel,
  type MessageModel,
  type Theme,
} from '@advanced-chat/components'
import {
  DEFAULT_CUSTOM_ELEMENT_TAG,
  registerAdvancedChat,
  type AdvancedChatEventMap,
  type AdvancedChatHTMLElement,
  type RegisterAdvancedChatOptions,
} from '@advanced-chat/components/web-component/core'

const theme: Theme = { base: 'dark', overrides: {} }
const props: AdvancedChatProps = { theme, chats: [] as ChatModel[], messages: [] as MessageModel[] }
const options: RegisterAdvancedChatOptions = { tagName: 'company-chat' }
declare const element: AdvancedChatHTMLElement
declare const autoRegisteredElement: AutoRegisteredAdvancedChatHTMLElement
declare const events: AdvancedChatEventMap

getThemeStyles(theme)
void AdvancedChat
void AUTO_REGISTER_TAG
void DEFAULT_CUSTOM_ELEMENT_TAG
void registerAdvancedChat
void element
void autoRegisteredElement
void events
void options
void props
`,
  )

  const commonCompilerOptions = {
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    noEmit: true,
    skipLibCheck: false,
    strict: true,
    target: 'ES2022',
    types: [],
    verbatimModuleSyntax: true,
  }
  const typeScriptConfigs = {
    bundler: {
      compilerOptions: {
        ...commonCompilerOptions,
        module: 'ESNext',
        moduleResolution: 'Bundler',
      },
      files: ['./contract.ts'],
    },
    nodenext: {
      compilerOptions: {
        ...commonCompilerOptions,
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
      },
      files: ['./contract.ts'],
    },
  }

  for (const [name, config] of Object.entries(typeScriptConfigs)) {
    const configPath = join(consumerRoot, `tsconfig.${name}.json`)
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
    execFileSync(
      process.execPath,
      [join(projectRoot, 'node_modules/typescript/bin/tsc'), '-p', configPath],
      {
        cwd: consumerRoot,
        stdio: 'inherit',
      },
    )
  }

  writeFileSync(
    join(consumerRoot, 'index.html'),
    '<!doctype html><html><body><script type="module" src="/vite-consumer.ts"></script></body></html>\n',
  )
  writeFileSync(
    join(consumerRoot, 'vite-consumer.ts'),
    `
import '@advanced-chat/components/styles'
import '@advanced-chat/components/web-component/styles'
`,
  )
  const viteConsumerOut = join(consumerRoot, 'vite-dist')
  execFileSync(
    process.execPath,
    [viteBin, 'build', '.', '--outDir', 'vite-dist', '--emptyOutDir'],
    {
      cwd: consumerRoot,
      stdio: 'inherit',
    },
  )
  assert(
    listFiles(viteConsumerOut).some(
      (file) => file.endsWith('.css') && readFileSync(file, 'utf8').length > 0,
    ),
    'Packed Vite consumer did not emit CSS for the style entrypoints.',
  )

  console.log(
    `Verified packed ESM consumer contract for ${packedPackage.name}@${packedPackage.version} with ${packResult.entryCount} files.`,
  )
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true })
}
