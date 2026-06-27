import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../scripts/public-ui-entries.mjs'

const root = process.cwd()
const componentRoot = path.join(root, 'src', 'components', 'ui')
const indexEntryPath = path.join(root, 'src', 'components', 'ui', 'index.ts')
const serverEntryPath = path.join(root, 'src', 'components', 'ui', 'server.ts')
const clientEntryPath = path.join(root, 'src', 'components', 'ui', 'client.ts')
const packagePath = path.join(root, 'package.json')

const indexEntry = fs.readFileSync(indexEntryPath, 'utf8')
const serverEntry = fs.readFileSync(serverEntryPath, 'utf8')
const clientEntry = fs.readFileSync(clientEntryPath, 'utf8')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

function walkFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(filePath)
    return /\.(ts|tsx)$/.test(entry.name) ? [filePath] : []
  })
}

function firstCodeLine(source) {
  return source.split(/\r?\n/).find((line) => line.trim() && !line.trim().startsWith('//')) ?? ''
}

const clientRuntimePatterns = [
  /\bReact\.(useEffect|useLayoutEffect|useState|useReducer|useSyncExternalStore)\b/,
  /\bwindow\./,
  /\bdocument\./,
  /\bIntersectionObserver\b/,
  /\bResizeObserver\b/,
  /\brequestAnimationFrame\b/,
  /from ['"]framer-motion['"]/,
]

const serverMarkedRuntimeFiles = walkFiles(componentRoot)
  .map((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8')
    return {
      filePath,
      source,
      hasUseClient: firstCodeLine(source).includes('use client'),
    }
  })
  .filter(
    ({ source, hasUseClient }) =>
      !hasUseClient && clientRuntimePatterns.some((pattern) => pattern.test(source))
  )

const clientOnlyModules = [
  './button',
  './card',
  './carousel',
  './checkbox',
  './dialog',
  './navigation',
  './page-transition',
  './popover',
  './select',
  './sheet',
  './splats',
  './tabs',
  './video-dialog',
  './wave-canvas',
]

const requiredServerExports = [
  './asset-image',
  './character-assets',
  './event-assets',
  './event-callout',
  './heading-tape',
  './list',
  './news-assets',
  './paper-tear-edge',
  './section-background',
  './squid-assets',
  './tape-assets',
  './tape-picture',
  './tape',
  './weapons-assets',
]

const demoOnlyModules = ['./demo-layout', './github-mark', './showcase-assets']

const requiredClientExports = [
  './button',
  './card',
  './carousel',
  './dialog',
  './navigation',
  './splats',
  './video-dialog',
]

const staticSvgFiles = [
  path.join(componentRoot, 'splats', 'splat.tsx'),
  path.join(componentRoot, 'splats', 'splat-1.tsx'),
  path.join(componentRoot, 'splats', 'splat-2.tsx'),
  path.join(componentRoot, 'splats', 'splat-3.tsx'),
  path.join(componentRoot, 'splats', 'splat-4.tsx'),
  path.join(componentRoot, 'splats', 'splat-5.tsx'),
  path.join(componentRoot, 'splats', 'splat-6.tsx'),
  path.join(componentRoot, 'splats', 'splat-7.tsx'),
  path.join(componentRoot, 'splats', 'splat-8.tsx'),
  path.join(componentRoot, 'splats', 'splat-9.tsx'),
  path.join(componentRoot, 'splats', 'splat-10.tsx'),
  path.join(componentRoot, 'splats', 'splat-11.tsx'),
  path.join(componentRoot, 'splats', 'splat-12.tsx'),
  path.join(componentRoot, 'splats', 'nav-splat.tsx'),
  path.join(componentRoot, 'icons', 'nav-arrow-down.tsx'),
]

const checks = [
  {
    name: 'package identity remains Splatoon UI compatible',
    pass: packageJson.name === 'splatoon-ui',
  },
  {
    name: 'package exports declare explicit server, component, and stylesheet entrypoints',
    pass:
      packageJson.exports?.['.']?.import === './dist/server.js' &&
      packageJson.exports?.['.']?.types === './dist/server.d.ts' &&
      packageJson.exports?.['./server']?.import === './dist/server.js' &&
      packageJson.exports?.['./server']?.types === './dist/server.d.ts' &&
      packageJson.exports?.['./client'] === undefined &&
      packageJson.exports?.['./styles.css'] === './dist/styles.css' &&
      publicUiEntries.every((name) => {
        const entry = packageJson.exports?.[`./${name}`]
        return entry?.import === `./dist/${name}.js` && entry?.types === `./dist/${name}.d.ts`
      }),
  },
  {
    name: 'default UI entrypoint forwards to the explicit server-safe entrypoint',
    pass: indexEntry.trim() === "export * from './server'",
  },
  {
    name: 'server-safe UI entrypoint does not create a client component boundary',
    pass:
      !serverEntry.startsWith("'use client'") &&
      !serverEntry.startsWith('"use client"') &&
      clientOnlyModules.every((modulePath) => !serverEntry.includes(`'${modulePath}'`)),
  },
  {
    name: 'files without use client do not use browser-only runtime APIs',
    pass: serverMarkedRuntimeFiles.length === 0,
  },
  {
    name: 'static SVG and icon primitives remain server-safe',
    pass: staticSvgFiles.every(
      (filePath) => !firstCodeLine(fs.readFileSync(filePath, 'utf8')).includes('use client')
    ),
  },
  {
    name: 'ButtonDrip public props avoid hook-like naming',
    pass: !fs
      .readFileSync(path.join(componentRoot, 'button-drip.tsx'), 'utf8')
      .includes('useAccentColors'),
  },
  {
    name: 'server-safe UI entrypoint exposes shared presentational assets and primitives',
    pass: requiredServerExports.every((modulePath) => serverEntry.includes(`'${modulePath}'`)),
  },
  {
    name: 'demo-only helpers stay out of published UI entrypoints',
    pass:
      demoOnlyModules.every((modulePath) => !serverEntry.includes(`'${modulePath}'`)) &&
      demoOnlyModules.every((modulePath) => !clientEntry.includes(`'${modulePath}'`)) &&
      demoOnlyModules.every((modulePath) => !publicUiEntries.includes(modulePath.slice(2))) &&
      demoOnlyModules.every((modulePath) => packageJson.exports?.[modulePath] === undefined),
  },
  {
    name: 'client UI entrypoint explicitly owns interactive component exports',
    pass:
      clientEntry.startsWith("'use client'") &&
      !clientEntry.includes("'./index'") &&
      !clientEntry.includes("'./server'") &&
      requiredClientExports.every((modulePath) => clientEntry.includes(`'${modulePath}'`)),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('UI entrypoint checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('UI entrypoint checks passed.')
