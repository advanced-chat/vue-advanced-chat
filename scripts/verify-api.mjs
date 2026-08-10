import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { format, resolveConfig } from 'prettier'
import ts from 'typescript'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const baselinePath = join(projectRoot, 'ga-readiness/api-baseline.json')
const writeBaseline = process.argv.slice(2).includes('--write')
const modelNames = new Set([
  'Action',
  'ChatModel',
  'ChatReference',
  'Id',
  'MessageFileModel',
  'MessageModel',
  'MessageReference',
  'MessageStatus',
  'MessageSummary',
  'User',
  'UserReference',
])
const printer = ts.createPrinter({ removeComments: true })

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const compareNames = (left, right) => (left < right ? -1 : left > right ? 1 : 0)
const sortRecord = (entries) =>
  Object.fromEntries([...entries].sort(([left], [right]) => compareNames(left, right)))

const normalizeNode = (node, sourceFile) =>
  printer
    .printNode(ts.EmitHint.Unspecified, node, sourceFile)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')

const hasExportModifier = (node) =>
  node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)

const parseDeclarations = (relativePath) => {
  const path = join(projectRoot, relativePath)
  const sourceFile = ts.createSourceFile(
    relativePath,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  assert(!sourceFile.parseDiagnostics.length, `${relativePath} has TypeScript parse errors.`)

  const allNamed = new Map()
  const exportedTypes = new Map()
  const exportedValues = new Map()
  const globalAugmentations = []

  const addNamed = (map, name, declaration, kind, signatureNode = declaration) => {
    assert(!map.has(name), `${relativePath} has duplicate declaration ${name}.`)
    map.set(name, {
      declaration,
      kind,
      signature: normalizeNode(signatureNode, sourceFile),
    })
  }

  for (const statement of sourceFile.statements) {
    if (
      ts.isModuleDeclaration(statement) &&
      (statement.flags & ts.NodeFlags.GlobalAugmentation) !== 0
    ) {
      globalAugmentations.push(normalizeNode(statement, sourceFile))
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue
        const name = declaration.name.text
        const item = {
          declaration,
          kind: 'const',
          signature: normalizeNode(statement, sourceFile),
        }
        assert(!allNamed.has(name), `${relativePath} has duplicate declaration ${name}.`)
        allNamed.set(name, item)
        if (hasExportModifier(statement)) exportedValues.set(name, item)
      }
      continue
    }

    if (
      !ts.isInterfaceDeclaration(statement) &&
      !ts.isTypeAliasDeclaration(statement) &&
      !ts.isFunctionDeclaration(statement) &&
      !ts.isClassDeclaration(statement) &&
      !ts.isEnumDeclaration(statement)
    ) {
      continue
    }

    const name = statement.name?.text
    if (!name) continue
    const kind = ts.isInterfaceDeclaration(statement)
      ? 'interface'
      : ts.isTypeAliasDeclaration(statement)
        ? 'type'
        : ts.isFunctionDeclaration(statement)
          ? 'function'
          : ts.isClassDeclaration(statement)
            ? 'class'
            : 'enum'
    addNamed(allNamed, name, statement, kind)
    if (!hasExportModifier(statement)) continue
    const item = allNamed.get(name)
    if (kind === 'interface' || kind === 'type' || kind === 'class' || kind === 'enum') {
      exportedTypes.set(name, item)
    }
    if (kind === 'function' || kind === 'class' || kind === 'enum') exportedValues.set(name, item)
  }

  return { allNamed, exportedTypes, exportedValues, globalAugmentations, sourceFile }
}

const typeParameters = (declaration, sourceFile) =>
  declaration.typeParameters?.length
    ? `<${declaration.typeParameters.map((item) => normalizeNode(item, sourceFile)).join(', ')}>`
    : null

const memberName = (member, sourceFile) => {
  if (!member.name) return normalizeNode(member, sourceFile)
  if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) return member.name.text
  return normalizeNode(member.name, sourceFile)
}

const interfaceMembers = (item, sourceFile) => {
  if (!item || !ts.isInterfaceDeclaration(item.declaration)) return null
  return sortRecord(
    item.declaration.members.map((member) => [
      memberName(member, sourceFile),
      normalizeNode(member, sourceFile),
    ]),
  )
}

const eventMembers = (item, sourceFile) => {
  if (!item || !ts.isInterfaceDeclaration(item.declaration)) return {}
  const events = []
  for (const member of item.declaration.members) {
    if (!ts.isCallSignatureDeclaration(member)) continue
    const eventType = member.parameters[0]?.type
    if (!eventType || !ts.isLiteralTypeNode(eventType) || !ts.isStringLiteral(eventType.literal)) {
      continue
    }
    events.push([eventType.literal.text, normalizeNode(member, sourceFile)])
  }
  return sortRecord(events)
}

const slotsForComponent = (componentItem, declarations) => {
  const componentType = componentItem?.declaration.type
  if (
    !componentType ||
    !ts.isTypeReferenceNode(componentType) ||
    !componentType.typeName.getText(declarations.sourceFile).startsWith('__VLS_WithTemplateSlots')
  ) {
    return null
  }

  const slotsArgument = componentType.typeArguments?.[1]
  const resultType = ts.isIndexedAccessTypeNode(slotsArgument)
    ? slotsArgument.objectType
    : undefined
  const resultName =
    resultType && ts.isTypeReferenceNode(resultType) ? resultType.typeName.getText() : ''
  const resultAlias = declarations.allNamed.get(resultName)?.declaration
  if (!resultAlias || !ts.isTypeAliasDeclaration(resultAlias)) return null

  const returnType = resultAlias.type
  const typeQuery = ts.isTypeReferenceNode(returnType) ? returnType.typeArguments?.[0] : undefined
  const templateName =
    typeQuery && ts.isTypeQueryNode(typeQuery) ? typeQuery.exprName.getText() : ''
  const templateFunction = declarations.allNamed.get(templateName)?.declaration
  if (!templateFunction || !ts.isFunctionDeclaration(templateFunction)) return null

  const slotsMember =
    templateFunction.type && ts.isTypeLiteralNode(templateFunction.type)
      ? templateFunction.type.members.find(
          (member) =>
            ts.isPropertySignature(member) &&
            memberName(member, declarations.sourceFile) === 'slots',
        )
      : undefined
  return slotsMember?.type ? normalizeNode(slotsMember.type, declarations.sourceFile) : null
}

const declarationSignatures = (names, declarations) =>
  sortRecord(
    [...names].map((name) => {
      const item = declarations.exportedTypes.get(name) || declarations.exportedValues.get(name)
      assert(item, `Missing declaration for ${name}.`)
      return [name, item.signature]
    }),
  )

const objectTypeMembers = (name, declarations) => {
  const item = declarations.exportedTypes.get(name)
  if (!item) return {}
  const declaration = item.declaration
  const members = ts.isInterfaceDeclaration(declaration)
    ? declaration.members
    : ts.isTypeAliasDeclaration(declaration) && ts.isTypeLiteralNode(declaration.type)
      ? declaration.type.members
      : []
  return sortRecord(
    members.map((member) => [
      memberName(member, declarations.sourceFile),
      normalizeNode(member, declarations.sourceFile),
    ]),
  )
}

const importRuntimeNames = async (relativePath) => {
  const url = pathToFileURL(join(projectRoot, relativePath))
  url.searchParams.set('api-baseline', '1')
  return Object.keys(await import(url.href)).sort(compareNames)
}

const normalizeManifest = (manifest) => ({
  schemaVersion: manifest.schemaVersion,
  modules: [...(manifest.modules || [])]
    .map((module) => ({
      path: module.path,
      declarations: [...(module.declarations || [])]
        .map((declaration) => ({
          kind: declaration.kind,
          name: declaration.name,
          tagName: declaration.tagName,
          customElement: declaration.customElement,
          members: [...(declaration.members || [])]
            .map((member) => ({
              kind: member.kind,
              name: member.name,
              type: member.type?.text,
              ...(Object.hasOwn(member, 'default') ? { default: member.default } : {}),
            }))
            .sort((left, right) => compareNames(left.name, right.name)),
          attributes: [...(declaration.attributes || [])]
            .map((attribute) => ({
              name: attribute.name,
              fieldName: attribute.fieldName,
              type: attribute.type?.text,
            }))
            .sort((left, right) => compareNames(left.name, right.name)),
          events: [...(declaration.events || [])]
            .map((event) => ({ name: event.name, type: event.type?.text }))
            .sort((left, right) => compareNames(left.name, right.name)),
        }))
        .sort((left, right) => compareNames(left.name, right.name)),
      exports: [...(module.exports || [])]
        .map((item) => ({
          kind: item.kind,
          name: item.name,
          declaration: item.declaration
            ? { name: item.declaration.name, module: item.declaration.module }
            : undefined,
        }))
        .sort((left, right) => compareNames(left.name, right.name)),
    }))
    .sort((left, right) => compareNames(left.path, right.path)),
})

const generateReport = async () => {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'))
  const rootDeclarations = parseDeclarations('dist/index.d.ts')
  const componentNames = [...rootDeclarations.exportedTypes.keys()]
    .filter((name) => name.endsWith('Props'))
    .map((name) => name.slice(0, -'Props'.length))
    .filter((name) => rootDeclarations.exportedValues.has(name))
    .sort(compareNames)
  const componentTypeNames = new Set(
    componentNames.flatMap((name) => [`${name}Props`, `${name}Events`]),
  )
  const composableValueNames = [...rootDeclarations.exportedValues.keys()]
    .filter((name) => /^use[A-Z]/.test(name))
    .sort(compareNames)
  const composableTypeNames = [...rootDeclarations.exportedTypes.keys()]
    .filter((name) => /^Use[A-Z]/.test(name))
    .sort(compareNames)

  const componentContracts = sortRecord(
    componentNames.map((name) => {
      const props = rootDeclarations.exportedTypes.get(`${name}Props`)
      const events = rootDeclarations.exportedTypes.get(`${name}Events`)
      return [
        name,
        {
          propsTypeParameters: props
            ? typeParameters(props.declaration, rootDeclarations.sourceFile)
            : null,
          props: interfaceMembers(props, rootDeclarations.sourceFile),
          eventsTypeParameters: events
            ? typeParameters(events.declaration, rootDeclarations.sourceFile)
            : null,
          events: eventMembers(events, rootDeclarations.sourceFile),
          slots: slotsForComponent(rootDeclarations.exportedValues.get(name), rootDeclarations),
        },
      ]
    }),
  )

  const rootRuntimeNames = await importRuntimeNames(
    packageJson.exports['.'].import.replace(/^\.\//, ''),
  )
  const declarationValueNames = [...rootDeclarations.exportedValues.keys()].sort(compareNames)
  assert(
    JSON.stringify(rootRuntimeNames) === JSON.stringify(declarationValueNames),
    'Root runtime and declaration value exports differ.',
  )

  const entrypoints = []
  for (const [name, target] of Object.entries(packageJson.exports)) {
    const importPath = typeof target === 'object' ? target.import : target
    const typesPath = typeof target === 'object' ? target.types : undefined
    entrypoints.push([
      name,
      {
        ...(typesPath ? { types: typesPath } : {}),
        import: importPath,
        ...(importPath.endsWith('.js')
          ? { runtimeExports: await importRuntimeNames(importPath.replace(/^\.\//, '')) }
          : { assetType: 'css' }),
      },
    ])
  }

  const webComponentDeclarations = []
  for (const relativePath of ['dist/web-component-core.d.ts', 'dist/web-component.d.ts']) {
    const declarations = parseDeclarations(relativePath)
    webComponentDeclarations.push([
      relativePath,
      {
        runtimeDeclarations: declarationSignatures(
          declarations.exportedValues.keys(),
          declarations,
        ),
        typeDeclarations: declarationSignatures(declarations.exportedTypes.keys(), declarations),
        globalAugmentations: declarations.globalAugmentations.sort(compareNames),
      },
    ])
  }

  const excludedOtherTypes = new Set([
    ...componentTypeNames,
    ...composableTypeNames,
    ...modelNames,
    'Strings',
    'Styles',
  ])
  const otherTypeNames = [...rootDeclarations.exportedTypes.keys()].filter(
    (name) => !excludedOtherTypes.has(name),
  )
  const nonComponentValues = [...rootDeclarations.exportedValues.keys()].filter(
    (name) => !componentNames.includes(name) && !composableValueNames.includes(name),
  )

  const manifest = normalizeManifest(
    JSON.parse(readFileSync(join(projectRoot, packageJson.customElements), 'utf8')),
  )

  return {
    schemaVersion: 1,
    normalization: {
      source: 'Generated package declarations, runtime entry points, and Custom Elements Manifest',
      rules: [
        'Sort names and manifest members lexically.',
        'Remove declaration comments and collapse printer line breaks.',
        'Record component contracts instead of volatile Vue/Volar implementation helpers.',
        'Omit bundle bytes, hashes, descriptions, and generation timestamps.',
      ],
    },
    package: {
      name: packageJson.name,
      version: packageJson.version,
      type: packageJson.type,
      module: packageJson.module,
      types: packageJson.types,
      style: packageJson.style,
      customElements: packageJson.customElements,
      unpkg: packageJson.unpkg,
      jsdelivr: packageJson.jsdelivr,
      files: [...packageJson.files].sort(compareNames),
      peerDependencies: sortRecord(Object.entries(packageJson.peerDependencies || {})),
      engines: sortRecord(Object.entries(packageJson.engines || {})),
      exports: sortRecord(Object.entries(packageJson.exports)),
    },
    entrypoints: sortRecord(entrypoints),
    root: {
      runtimeExports: rootRuntimeNames,
      typeExports: [...rootDeclarations.exportedTypes.keys()].sort(compareNames),
      runtimeDeclarations: declarationSignatures(nonComponentValues, rootDeclarations),
      models: declarationSignatures(
        [...modelNames].filter((name) => rootDeclarations.exportedTypes.has(name)),
        rootDeclarations,
      ),
      composables: {
        runtime: declarationSignatures(composableValueNames, rootDeclarations),
        types: declarationSignatures(composableTypeNames, rootDeclarations),
      },
      componentContracts,
      cssCustomProperties: objectTypeMembers('Styles', rootDeclarations),
      localizationKeys: objectTypeMembers('Strings', rootDeclarations),
      otherTypes: declarationSignatures(otherTypeNames, rootDeclarations),
    },
    webComponents: sortRecord(webComponentDeclarations),
    customElementsManifest: manifest,
  }
}

const report = await generateReport()
const prettierConfig = (await resolveConfig(baselinePath)) || {}
const output = await format(JSON.stringify(report), {
  ...prettierConfig,
  filepath: baselinePath,
})

if (writeBaseline) {
  writeFileSync(baselinePath, output)
  console.log(`Wrote normalized public API baseline to ${baselinePath}.`)
} else {
  const baseline = readFileSync(baselinePath, 'utf8')
  if (baseline !== output) {
    const expectedLines = baseline.split('\n')
    const actualLines = output.split('\n')
    let index = 0
    while (expectedLines[index] === actualLines[index] && index < expectedLines.length) index++
    console.error(`Public API drift detected at baseline line ${index + 1}.`)
    console.error(`Baseline: ${expectedLines[index] ?? '<missing>'}`)
    console.error(`Current:  ${actualLines[index] ?? '<missing>'}`)
    console.error('Review the complete diff, then run `npm run update:api-baseline` if approved.')
    process.exitCode = 1
  } else {
    const componentCount = Object.keys(report.root.componentContracts).length
    console.log(
      `Verified normalized public API baseline: ${report.root.runtimeExports.length} runtime exports, ${report.root.typeExports.length} type exports, ${componentCount} component contracts.`,
    )
  }
}
