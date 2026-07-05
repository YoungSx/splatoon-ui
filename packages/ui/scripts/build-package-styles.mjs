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
  inlinePackageCssImports(readCss(globalsPath)),
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

fs.writeFileSync(outputPath, `${outputCss}\n`)

console.log(
  `Built ${path.relative(root, outputPath)} from globals.css and ${cssOutputs.length} CSS bundle(s).`
)
