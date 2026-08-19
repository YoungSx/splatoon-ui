import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { createCssModuleScope, readCssModule, walkCssModuleFiles } from './css-modules.mjs'
import { publicUiEntries } from './public-ui-entries.mjs'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const globalsPath = path.join(root, 'src', 'styles', 'globals.css')
const componentRoot = path.join(root, 'src', 'components', 'ui')
const outputPath = path.join(distDir, 'styles.css')
const themeOutputPath = path.join(distDir, 'theme.css')
const internalOutputPath = path.join(distDir, 'internal-styles.css')
const entryStylesDir = path.join(distDir, 'styles')
const moduleStylesDir = path.join(distDir, 'style-modules')
const require = createRequire(import.meta.url)

function readCss(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .replace(/\/\*# sourceMappingURL=.*?\*\//g, '')
    .trim()
}

function inlinePackageCssImports(source) {
  return source.replace(/^@import\s+['"]shadcn\/tailwind\.css['"];\s*$/m, () =>
    readCss(path.join(path.dirname(require.resolve('shadcn')), 'tailwind.css'))
  )
}

/**
 * `@source` paths resolve relative to the stylesheet that declares them, so the
 * directive cannot be copied through verbatim.
 *
 * In the source tree `globals.css` lives in `src/styles/`, and `../` points at
 * `src/` — the components whose class names Tailwind has to discover. In the
 * published file the stylesheet is `dist/styles.css`, where the same `../`
 * would resolve to the package root and walk `public/` (megabytes of images and
 * fonts) on every consumer build. The compiled JS in `dist/` is what actually
 * carries the class name strings, so the published directive is retargeted
 * there: same class coverage, without the asset tree.
 */
function rewriteSourceDirective(source, replacement) {
  const sourceDirective = /^@source\s+['"][^'"]*['"];\s*$/m

  if (!sourceDirective.test(source)) {
    throw new Error(
      'globals.css no longer declares an @source directive. Tailwind would emit no ' +
        'utilities for the packaged components; update this build step to match.'
    )
  }

  return source.replace(sourceDirective, replacement)
}

/**
 * Every CSS Module keyframe is renamed to `<scope>_<name>`, so the definitions
 * and the `animation` references that point at them have to stay in sync. A
 * scoped name on only one side means the rename missed a spelling, which the
 * browser would silently ignore as an unknown animation.
 */
function assertScopedKeyframesResolve(css) {
  const defined = new Set(
    [...css.matchAll(/@(?:-(?:webkit|moz|o|ms)-)?keyframes\s+([A-Za-z_][\w-]*)/g)].map(
      (match) => match[1]
    )
  )
  const referenced = new Set(
    [...css.matchAll(/(?:^|;|\{|\n)\s*animation(?:-name)?\s*:([^;{}]+)/gi)].flatMap((match) =>
      (match[1].match(/[A-Za-z_][\w-]*/g) ?? []).filter((token) => /_[a-f0-9]{7}_/.test(token))
    )
  )

  const dangling = [...referenced].filter((name) => !defined.has(name))
  if (dangling.length > 0) {
    throw new Error(
      `Scoped keyframe references without a matching definition: ${dangling.join(', ')}`
    )
  }
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ does not exist. Run tsup before building package styles.')
}

/**
 * Reads every compiled entry and chunk, so a module's styles can be included
 * based on whether its class names survived into the published JS.
 */
function readCompiledJavaScript() {
  return fs
    .readdirSync(distDir)
    .filter((name) => name.endsWith('.js'))
    .map((name) => fs.readFileSync(path.join(distDir, name), 'utf8'))
    .join('\n')
}

/** Reads one entry and every emitted chunk it reaches. */
function collectCompiledEntryGraph(entryName) {
  const seen = new Set()

  function visit(filePath) {
    const absolutePath = path.resolve(filePath)
    if (seen.has(absolutePath)) return ''
    if (!absolutePath.startsWith(`${distDir}${path.sep}`) || !fs.existsSync(absolutePath)) {
      throw new Error(`Compiled entry graph references a missing local module: ${absolutePath}`)
    }

    seen.add(absolutePath)
    const source = fs.readFileSync(absolutePath, 'utf8')
    const localImports = [
      ...source.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.\/[^'"]+\.js)['"]/g),
    ].map((match) => path.resolve(path.dirname(absolutePath), match[1]))

    localImports.forEach(visit)
    return source
  }

  visit(path.join(distDir, `${entryName}.js`))
  const files = [...seen].sort((left, right) => left.localeCompare(right))
  return {
    files,
    source: files.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n'),
  }
}

/**
 * True when the module's scoped class prefix appears in the compiled output.
 *
 * The source tree holds CSS for components that no published entrypoint
 * reaches (internal helpers and demo-only pieces), and globbing the directory
 * shipped all of them: 12 of 42 modules, about a fifth of the stylesheet, whose
 * selectors could never match a consumer's DOM.
 *
 * The boundary is anchored because scopes share suffixes -- an unanchored test
 * for `divider_6016457_` is satisfied by `banner_divider_65bc1af_`, which would
 * keep a dead module purely because an unrelated one is alive.
 */
function isReferencedInCompiledOutput(scope, compiledJavaScript) {
  return new RegExp(`(?:^|[^A-Za-z0-9_])${scope}_`).test(compiledJavaScript)
}

const compiledJavaScript = readCompiledJavaScript()
const allStyleSheets = walkCssModuleFiles(componentRoot)
  .sort((left, right) => left.localeCompare(right))
  .map((filePath) => ({
    filePath,
    published: isReferencedInCompiledOutput(
      createCssModuleScope(filePath, root),
      compiledJavaScript
    ),
    ...readCssModule(filePath, root),
  }))

const componentStyleSheets = allStyleSheets.filter(({ published }) => published)
const internalStyleSheets = allStyleSheets.filter(({ published }) => !published)

if (componentStyleSheets.length === 0) {
  throw new Error(
    'No CSS Module matched the compiled output. The scope naming used by the ' +
      'build and by this filter have diverged; the stylesheet would ship with ' +
      'no component styles at all.'
  )
}

function renderStyleSheets(styleSheets) {
  return styleSheets.flatMap(({ filePath, css }) => [
    `/* Splatoon UI component styles: ${path.relative(root, filePath)} */`,
    css.trim(),
  ])
}

function cssModuleOutputName(filePath) {
  return path.basename(filePath).replace(/\.module\.css$/, '.css')
}

const moduleOutputNames = componentStyleSheets.map(({ filePath }) =>
  cssModuleOutputName(filePath)
)
if (new Set(moduleOutputNames).size !== moduleOutputNames.length) {
  throw new Error('Published CSS Modules must have unique basenames for granular style exports.')
}

const globalSource = inlinePackageCssImports(readCss(globalsPath))
const aggregateThemeCss = rewriteSourceDirective(globalSource, "@source '.';")
const granularThemeCss = rewriteSourceDirective(globalSource, '')

const outputCss = [
  '/* Splatoon UI global styles */',
  aggregateThemeCss,
  ...renderStyleSheets(componentStyleSheets),
].join('\n\n')

if (outputCss.includes('shadcn/tailwind.css')) {
  throw new Error('Package stylesheet still contains unresolved shadcn/tailwind.css import.')
}

assertScopedKeyframesResolve(outputCss)

fs.mkdirSync(entryStylesDir, { recursive: true })
fs.mkdirSync(moduleStylesDir, { recursive: true })
fs.writeFileSync(outputPath, `${outputCss}\n`)
fs.writeFileSync(
  themeOutputPath,
  `/* Splatoon UI theme. Pair with one or more splatoon-ui/styles/*.css entries. */\n\n` +
    `${granularThemeCss}\n`
)

for (const { filePath, css } of componentStyleSheets) {
  assertScopedKeyframesResolve(css)
  fs.writeFileSync(
    path.join(moduleStylesDir, cssModuleOutputName(filePath)),
    `/* ${path.relative(root, filePath)} */\n${css.trim()}\n`
  )
}

for (const entryName of publicUiEntries) {
  const compiledEntry = collectCompiledEntryGraph(entryName)
  const entryStyleSheets = componentStyleSheets.filter(({ filePath }) =>
    isReferencedInCompiledOutput(createCssModuleScope(filePath, root), compiledEntry.source)
  )
  const sources = compiledEntry.files.map(
    (filePath) => `@source '${path.relative(entryStylesDir, filePath).replaceAll(path.sep, '/')}';`
  )
  const imports = entryStyleSheets.map(
    ({ filePath }) => `@import '../style-modules/${cssModuleOutputName(filePath)}';`
  )

  fs.writeFileSync(
    path.join(entryStylesDir, `${entryName}.css`),
    [`/* Splatoon UI styles for splatoon-ui/${entryName} */`, ...sources, ...imports, ''].join(
      '\n'
    )
  )
}

/**
 * Styles for components that no published entrypoint reaches. Consumers can
 * never render these, so keeping them out of styles.css is what makes the
 * published stylesheet honest.
 *
 * They are still emitted, because the demo imports those internal components
 * straight from source while taking its CSS from this build. Dropping them
 * outright left the demo's navigation unstyled and unclickable. This file is
 * excluded from the package `files` whitelist, so it serves the demo without
 * reaching consumers.
 */
const internalCss = [
  '/* Splatoon UI internal component styles.',
  '   Not part of the public package: these components have no entrypoint.',
  '   Consumed by the workspace demo, which imports them from source. */',
  ...renderStyleSheets(internalStyleSheets),
].join('\n\n')

assertScopedKeyframesResolve(internalCss)

fs.writeFileSync(internalOutputPath, `${internalCss}\n`)

console.log(
  `Built ${path.relative(root, outputPath)} from globals.css and ` +
    `${componentStyleSheets.length} of ${allStyleSheets.length} CSS Modules; ` +
    `${publicUiEntries.length} granular component stylesheet(s); ` +
    `${internalStyleSheets.length} internal-only module(s) went to ` +
    `${path.relative(root, internalOutputPath)}.`
)
