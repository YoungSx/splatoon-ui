import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentRoot = path.join(root, 'src', 'components', 'ui')
const serverEntryPath = path.join(root, 'src', 'components', 'ui', 'index.ts')
const clientEntryPath = path.join(root, 'src', 'components', 'ui', 'client.ts')
const packagePath = path.join(root, 'package.json')

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
  './character-assets',
  './event-assets',
  './event-callout',
  './heading-tape',
  './news-assets',
  './paper-tear-edge',
  './section-background',
  './showcase-assets',
  './squid-assets',
  './tape-assets',
  './tape-picture',
  './tape',
  './weapons-assets',
]

const requiredClientExports = [
  './index',
  './button',
  './card',
  './carousel',
  './dialog',
  './navigation',
  './splats',
  './video-dialog',
]

const checks = [
  {
    name: 'package identity remains Splatoon UI compatible',
    pass: packageJson.name === 'splatoon-ui',
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
    name: 'ButtonDrip public props avoid hook-like naming',
    pass:
      !fs
        .readFileSync(path.join(componentRoot, 'button-drip.tsx'), 'utf8')
        .includes('useAccentColors'),
  },
  {
    name: 'server-safe UI entrypoint exposes shared presentational assets and primitives',
    pass: requiredServerExports.every((modulePath) => serverEntry.includes(`'${modulePath}'`)),
  },
  {
    name: 'client UI entrypoint explicitly owns interactive component exports',
    pass:
      clientEntry.startsWith("'use client'") &&
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
