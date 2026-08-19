import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { readCssModule, walkCssModuleFiles } from './css-modules.mjs'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const globalsPath = path.join(root, 'src', 'styles', 'globals.css')
const componentRoot = path.join(root, 'src', 'components', 'ui')
const outputPath = path.join(distDir, 'styles.css')
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
function retargetSourceDirective(source) {
  const sourceDirective = /^@source\s+['"][^'"]*['"];\s*$/m

  if (!sourceDirective.test(source)) {
    throw new Error(
      'globals.css no longer declares an @source directive. Tailwind would emit no ' +
        'utilities for the packaged components; update this build step to match.'
    )
  }

  return source.replace(sourceDirective, "@source '.';")
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

const cssOutputs = fs
  .readdirSync(distDir)
  .filter((name) => name.endsWith('.css') && name !== 'styles.css')
  .sort((a, b) => {
    const order = ['server.css', 'client.css']
    const left = order.indexOf(a)
    const right = order.indexOf(b)
    if (left !== -1 || right !== -1) {
      return (left === -1 ? order.length : left) - (right === -1 ? order.length : right)
    }
    return a.localeCompare(b)
  })

const outputCss = [
  '/* Splatoon UI global styles */',
  retargetSourceDirective(inlinePackageCssImports(readCss(globalsPath))),
  ...walkCssModuleFiles(componentRoot)
    .sort((left, right) => left.localeCompare(right))
    .flatMap((filePath) => [
      `/* Splatoon UI component styles: ${path.relative(root, filePath)} */`,
      readCssModule(filePath, root).css.trim(),
    ]),
  ...cssOutputs.flatMap((name) => [
    `/* Splatoon UI component styles: ${name} */`,
    readCss(path.join(distDir, name)),
  ]),
].join('\n\n')

if (outputCss.includes('shadcn/tailwind.css')) {
  throw new Error('Package stylesheet still contains unresolved shadcn/tailwind.css import.')
}

assertScopedKeyframesResolve(outputCss)

fs.writeFileSync(outputPath, `${outputCss}\n`)

console.log(
  `Built ${path.relative(root, outputPath)} from globals.css and ${cssOutputs.length} CSS bundle(s).`
)
