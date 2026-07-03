import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
import { publicUiEntries } from '../../../packages/ui/scripts/public-ui-entries.mjs'

const docsRoot = process.cwd()
const workspaceRoot = path.resolve(docsRoot, '../..')
const uiRoot = path.join(workspaceRoot, 'packages', 'ui')
const packageJson = JSON.parse(fs.readFileSync(path.join(uiRoot, 'package.json'), 'utf8'))
const manifestSource = fs.readFileSync(path.join(docsRoot, 'src', 'docs', 'manifest.ts'), 'utf8')
const examplesDir = path.join(docsRoot, 'src', 'docs', 'examples')
const apiPath = path.join(docsRoot, 'src', 'docs', 'generated', 'api.json')
const apiJson = JSON.parse(fs.readFileSync(apiPath, 'utf8'))
const exampleSourcePath = path.join(docsRoot, 'src', 'docs', 'generated', 'example-source.json')
const generatedExampleSources = JSON.parse(fs.readFileSync(exampleSourcePath, 'utf8'))

function unique(values) {
  return [...new Set(values)]
}

function diff(left, right) {
  const rightSet = new Set(right)
  return left.filter((value) => !rightSet.has(value))
}

function readDocsSlugs() {
  return manifestModule.docsComponentSlugs
}

function readExampleIds() {
  return fs
    .readdirSync(examplesDir)
    .filter((fileName) => fileName.endsWith('.tsx') && fileName !== 'index.tsx')
    .map((fileName) => fileName.replace(/\.tsx$/, ''))
    .sort((left, right) => left.localeCompare(right))
}

function readMdxMetadata(locale, slug) {
  const filePath = path.join(docsRoot, 'content', 'docs', locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const source = fs.readFileSync(filePath, 'utf8')
  const metadataMatch = source.match(/export const metadata = {(?<body>[\s\S]*?)\n}/)
  const body = metadataMatch?.groups?.body ?? ''

  return {
    filePath,
    title: body.match(/title:\s*'([^']+)'/)?.[1] ?? '',
    description: body.match(/description:\s*'([^']+)'/)?.[1] ?? '',
    category: body.match(/category:\s*'([^']+)'/)?.[1] ?? '',
    example: body.match(/example:\s*'([^']+)'/)?.[1] ?? '',
  }
}

function hasPageFile(routeDir) {
  return ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'page.mdx', 'page.md'].some((fileName) =>
    fs.existsSync(path.join(routeDir, fileName))
  )
}

function loadManifestModule() {
  const transpiled = ts.transpileModule(manifestSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const sandbox = {
    exports: {},
    require(specifier) {
      throw new Error(`Unexpected manifest runtime import: ${specifier}`)
    },
  }

  vm.runInNewContext(transpiled, sandbox, { filename: 'src/docs/manifest.ts' })
  return sandbox.exports
}

const manifestModule = loadManifestModule()
const docsSlugs = readDocsSlugs()
const duplicateDocs = docsSlugs.filter((slug, index) => docsSlugs.indexOf(slug) !== index)
const packageExports = Object.keys(packageJson.exports ?? {})
const apiSlugs = apiJson.entries.map((entry) => entry.slug)
const exampleIds = readExampleIds()
const generatedExampleIds = Object.keys(generatedExampleSources).sort((left, right) =>
  left.localeCompare(right)
)
const locales = ['en', 'zh', 'ja']
const documentedCoreSlugs = [
  'alert',
  'badge',
  'button',
  'card',
  'checkbox',
  'dialog',
  'input',
  'progress',
  'switch',
  'tabs',
]

const missingDocs = diff(publicUiEntries, docsSlugs)
const extraDocs = diff(docsSlugs, publicUiEntries)
const missingPackageExports = publicUiEntries.filter(
  (entry) => !packageExports.includes(`./${entry}`)
)
const missingApi = diff(publicUiEntries, apiSlugs)
const emptyApi = apiJson.entries
  .filter((entry) => !Array.isArray(entry.exports) || entry.exports.length === 0)
  .map((entry) => entry.slug)
const invalidPrimaryExports = apiJson.entries
  .filter((entry) => !entry.exports.some((apiExport) => apiExport.name === entry.primaryExport))
  .map((entry) => `${entry.slug}: ${entry.primaryExport}`)
const missingGeneratedExampleSources = diff(exampleIds, generatedExampleIds)
const extraGeneratedExampleSources = diff(generatedExampleIds, exampleIds)
const emptyGeneratedExampleSources = generatedExampleIds.filter(
  (exampleId) => !generatedExampleSources[exampleId]?.trim()
)
const missingMdx = locales.flatMap((locale) =>
  documentedCoreSlugs
    .filter((slug) => !readMdxMetadata(locale, slug))
    .map((slug) => `${locale}/${slug}.mdx`)
)
const invalidMdxExamples = locales.flatMap((locale) =>
  documentedCoreSlugs.flatMap((slug) => {
    const metadata = readMdxMetadata(locale, slug)
    if (!metadata?.example) return [`${locale}/${slug}: missing example`]
    return exampleIds.includes(metadata.example) ? [] : [`${locale}/${slug}: ${metadata.example}`]
  })
)
const invalidMdxCategories = locales.flatMap((locale) =>
  documentedCoreSlugs.flatMap((slug) => {
    const metadata = readMdxMetadata(locale, slug)
    if (!metadata?.category) return [`${locale}/${slug}: missing category`]
    const expectedCategory = manifestModule.getDocsCategoryForSlug(slug)
    return metadata.category === expectedCategory
      ? []
      : [`${locale}/${slug}: ${metadata.category}, expected ${expectedCategory}`]
  })
)

const failures = [
  missingDocs.length ? `Missing docs slugs: ${missingDocs.join(', ')}` : null,
  extraDocs.length ? `Extra docs slugs: ${extraDocs.join(', ')}` : null,
  duplicateDocs.length ? `Duplicate docs slugs: ${unique(duplicateDocs).join(', ')}` : null,
  missingPackageExports.length
    ? `Public UI entries missing package exports: ${missingPackageExports.join(', ')}`
    : null,
  missingApi.length ? `Missing generated API entries: ${missingApi.join(', ')}` : null,
  emptyApi.length ? `Generated API entries with no exports: ${emptyApi.join(', ')}` : null,
  invalidPrimaryExports.length
    ? `Invalid primary API exports: ${invalidPrimaryExports.join(', ')}`
    : null,
  missingGeneratedExampleSources.length
    ? `Missing generated example sources: ${missingGeneratedExampleSources.join(', ')}`
    : null,
  extraGeneratedExampleSources.length
    ? `Extra generated example sources: ${extraGeneratedExampleSources.join(', ')}`
    : null,
  emptyGeneratedExampleSources.length
    ? `Empty generated example sources: ${emptyGeneratedExampleSources.join(', ')}`
    : null,
  missingMdx.length ? `Missing core MDX files: ${missingMdx.join(', ')}` : null,
  invalidMdxExamples.length
    ? `Invalid MDX example references: ${invalidMdxExamples.join(', ')}`
    : null,
  invalidMdxCategories.length ? `Invalid MDX categories: ${invalidMdxCategories.join(', ')}` : null,
  hasPageFile(path.join(docsRoot, 'src', 'app', 'docs'))
    ? 'Legacy /docs route still exists.'
    : null,
  hasPageFile(path.join(docsRoot, 'src', 'app', 'docs', '[slug]'))
    ? 'Legacy /docs/[slug] route still exists.'
    : null,
  fs.existsSync(path.join(docsRoot, 'src', 'config', 'docs-registry.ts'))
    ? 'Old registry docs file still exists.'
    : null,
  fs.existsSync(path.join(uiRoot, 'src', 'components', 'docs', 'docs-shell.tsx'))
    ? 'Old docs shell still exists.'
    : null,
].filter(Boolean)

if (failures.length > 0) {
  console.error('Docs checks failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`Docs checks passed for ${docsSlugs.length} public UI entries.`)
