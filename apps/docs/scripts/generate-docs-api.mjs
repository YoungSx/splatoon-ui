import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { publicUiEntries } from '../../../packages/ui/scripts/public-ui-entries.mjs'

const docsRoot = process.cwd()
const workspaceRoot = path.resolve(docsRoot, '../..')
const uiRoot = path.join(workspaceRoot, 'packages', 'ui')
const outputPath = path.join(docsRoot, 'src', 'docs', 'generated', 'api.json')
const checkOnly = process.argv.includes('--check')

function resolveUiEntry(name) {
  const candidates = [
    `src/components/ui/${name}.tsx`,
    `src/components/ui/${name}.ts`,
    `src/components/ui/${name}/index.tsx`,
    `src/components/ui/${name}/index.ts`,
  ]

  for (const candidate of candidates) {
    const absolutePath = path.join(uiRoot, candidate)
    if (fs.existsSync(absolutePath)) return absolutePath
  }

  throw new Error(`Missing public UI entry: ${name}`)
}

function resolveRelativeModule(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null

  const basePath = path.resolve(path.dirname(fromFile), specifier)
  const candidates = [
    `${basePath}.tsx`,
    `${basePath}.ts`,
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.ts'),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

function createSourceFile(filePath) {
  return ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
}

function firstCodeLine(sourceText) {
  return (
    sourceText.split(/\r?\n/).find((line) => line.trim() && !line.trim().startsWith('//')) ?? ''
  )
}

function hasUseClient(filePath) {
  return firstCodeLine(fs.readFileSync(filePath, 'utf8')).includes('use client')
}

function getNodeName(node) {
  return node.name && ts.isIdentifier(node.name) ? node.name.text : null
}

function getKind(node) {
  if (ts.isFunctionDeclaration(node)) return 'function'
  if (ts.isVariableStatement(node)) return 'const'
  if (ts.isClassDeclaration(node)) return 'class'
  if (ts.isInterfaceDeclaration(node)) return 'interface'
  if (ts.isTypeAliasDeclaration(node)) return 'type'
  if (ts.isEnumDeclaration(node)) return 'enum'
  return 're-export'
}

function getDescription(node) {
  const docs = ts.getJSDocCommentsAndTags(node)
  return docs
    .map((doc) => ('comment' in doc && typeof doc.comment === 'string' ? doc.comment : ''))
    .filter(Boolean)
    .join('\n')
}

function nodeText(node, sourceFile) {
  return node
    .getText(sourceFile)
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*.*$/s, '')
    .slice(0, 220)
}

function propFromMember(member, sourceFile) {
  const nameNode = member.name
  if (!nameNode) return null

  const name = ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) ? nameNode.text : null
  if (!name) return null

  return {
    name,
    optional: Boolean(member.questionToken),
    type: member.type ? member.type.getText(sourceFile).replace(/\s+/g, ' ') : 'unknown',
    defaultValue: '',
    description: getDescription(member),
  }
}

function propsFromTypeNode(typeNode, sourceFile, declarations, seen = new Set()) {
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return propsFromTypeNode(typeNode.type, sourceFile, declarations, seen)
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return typeNode.members.map((member) => propFromMember(member, sourceFile)).filter(Boolean)
  }

  if (ts.isIntersectionTypeNode(typeNode) || ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.flatMap((part) => propsFromTypeNode(part, sourceFile, declarations, seen))
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName.getText(sourceFile)
    if (typeName === 'Omit' || typeName === 'Pick' || typeName === 'Partial') {
      const baseType = typeNode.typeArguments?.[0]
      if (!baseType) return []

      const props = propsFromTypeNode(baseType, sourceFile, declarations, seen)
      const names = new Set(
        (typeNode.typeArguments ?? [])
          .slice(1)
          .flatMap((argument) => (ts.isUnionTypeNode(argument) ? argument.types : [argument]))
          .flatMap((argument) =>
            ts.isLiteralTypeNode(argument) && ts.isStringLiteral(argument.literal)
              ? [argument.literal.text]
              : []
          )
      )

      if (typeName === 'Omit') return props.filter((prop) => !names.has(prop.name))
      if (typeName === 'Pick') return props.filter((prop) => names.has(prop.name))
      return props.map((prop) => ({ ...prop, optional: true }))
    }

    const declaration = declarations.get(typeName.split('.').at(-1))
    if (!declaration || seen.has(declaration)) return []
    const nextSeen = new Set(seen).add(declaration)
    return propsFromDeclaration(declaration, declaration.getSourceFile(), declarations, nextSeen)
  }

  return []
}

function propsFromDeclaration(node, sourceFile, declarations, seen = new Set()) {
  if (ts.isInterfaceDeclaration(node)) {
    return node.members.map((member) => propFromMember(member, sourceFile)).filter(Boolean)
  }

  if (ts.isTypeAliasDeclaration(node)) {
    return propsFromTypeNode(node.type, sourceFile, declarations, seen)
  }

  return []
}

function uniqueProps(props) {
  const byName = new Map()
  for (const prop of props) {
    const existing = byName.get(prop.name)
    if (!existing) {
      byName.set(prop.name, prop)
      continue
    }

    byName.set(prop.name, {
      ...existing,
      optional: existing.optional && prop.optional,
      type: existing.type === prop.type ? existing.type : `${existing.type} | ${prop.type}`,
    })
  }
  return [...byName.values()]
}

function addBindingName(name, node, declarations) {
  if (ts.isIdentifier(name)) {
    declarations.set(name.text, node)
    return
  }

  if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
    for (const element of name.elements) {
      if (ts.isBindingElement(element)) addBindingName(element.name, node, declarations)
    }
  }
}

function collectModule(filePath, seen = new Set()) {
  if (!filePath || seen.has(filePath)) {
    return {
      declarations: new Map(),
      exportedAliases: new Map(),
      exportedNames: new Set(),
      files: new Set(),
    }
  }

  seen.add(filePath)

  const sourceFile = createSourceFile(filePath)
  const declarations = new Map()
  const exportedAliases = new Map()
  const exportedNames = new Set()
  const files = new Set([filePath])

  for (const statement of sourceFile.statements) {
    const name = getNodeName(statement)
    if (name) declarations.set(name, statement)

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        addBindingName(declaration.name, statement, declarations)
      }
    }
  }

  for (const statement of sourceFile.statements) {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined
    const isExported = modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)

    if (isExported) {
      const name = getNodeName(statement)
      if (name) {
        exportedNames.add(name)
        exportedAliases.set(name, name)
      }

      if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) {
            exportedNames.add(declaration.name.text)
            exportedAliases.set(declaration.name.text, declaration.name.text)
          }
        }
      }
    }

    if (ts.isExportDeclaration(statement)) {
      const moduleSpecifier =
        statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
          ? statement.moduleSpecifier.text
          : null

      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        const collected = moduleSpecifier
          ? collectModule(resolveRelativeModule(filePath, moduleSpecifier), seen)
          : null

        if (collected) {
          for (const [key, value] of collected.declarations) declarations.set(key, value)
          for (const file of collected.files) files.add(file)
        }

        for (const specifier of statement.exportClause.elements) {
          const exportedName = specifier.name.text
          const localName = (specifier.propertyName ?? specifier.name).text
          const declarationName = collected?.exportedAliases.get(localName) ?? localName
          const declaration =
            collected?.declarations.get(declarationName) ?? declarations.get(localName)

          exportedNames.add(exportedName)
          exportedAliases.set(exportedName, declarationName)
          if (declaration) declarations.set(exportedName, declaration)
        }
        continue
      }

      if (!statement.exportClause && moduleSpecifier) {
        const resolvedFile = resolveRelativeModule(filePath, moduleSpecifier)
        const collected = collectModule(resolvedFile, seen)
        for (const [key, value] of collected.declarations) declarations.set(key, value)
        for (const exportName of collected.exportedNames) exportedNames.add(exportName)
        for (const [key, value] of collected.exportedAliases) exportedAliases.set(key, value)
        for (const file of collected.files) files.add(file)
      }
    }
  }

  return { declarations, exportedAliases, exportedNames, files }
}

function createExportRow(name, declaration, declarations, exportedAliases) {
  const sourceFile = declaration?.getSourceFile()
  const kind = declaration ? getKind(declaration) : 're-export'
  const localName = exportedAliases.get(name) ?? name
  const propsDeclaration = declarations.get(`${name}Props`) ?? declarations.get(`${localName}Props`)
  const propsSourceFile = propsDeclaration?.getSourceFile()
  const props =
    propsDeclaration && propsSourceFile
      ? uniqueProps(propsFromDeclaration(propsDeclaration, propsSourceFile, declarations))
      : []

  return {
    name,
    kind,
    type: declaration && sourceFile ? nodeText(declaration, sourceFile) : 're-export',
    description: declaration ? getDescription(declaration) : '',
    props,
  }
}

function toComponentTitle(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function getPrimaryExport(slug, exports) {
  const expectedName = toComponentTitle(slug)
  const runtimeExports = exports.filter(
    (apiExport) => apiExport.kind !== 'interface' && apiExport.kind !== 'type'
  )

  return (
    runtimeExports.find((apiExport) => apiExport.name === expectedName)?.name ??
    runtimeExports.find((apiExport) => /^[A-Z]/.test(apiExport.name))?.name ??
    runtimeExports[0]?.name ??
    exports[0]?.name ??
    expectedName
  )
}

const entries = publicUiEntries.map((slug) => {
  const entryPath = resolveUiEntry(slug)
  const collected = collectModule(entryPath)
  const exports = [...collected.exportedNames]
    .sort((left, right) => left.localeCompare(right))
    .map((name) =>
      createExportRow(
        name,
        collected.declarations.get(name),
        collected.declarations,
        collected.exportedAliases
      )
    )

  return {
    slug,
    importPath: `splatoon-ui/${slug}`,
    primaryExport: getPrimaryExport(slug, exports),
    sourcePath: path.relative(uiRoot, entryPath),
    boundary: [...collected.files].some((filePath) => hasUseClient(filePath)) ? 'client' : 'server',
    exports,
  }
})

const output = `${JSON.stringify(
  {
    generatedAt: new Date(0).toISOString(),
    entries,
  },
  null,
  2
)}\n`

if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : ''
  if (current !== output) {
    throw new Error('Generated docs API is stale. Run pnpm docs:api.')
  }

  console.log(`Docs API is up to date for ${entries.length} public UI entries.`)
} else {
  fs.writeFileSync(outputPath, output)

  console.log(`Generated docs API for ${entries.length} public UI entries.`)
}
