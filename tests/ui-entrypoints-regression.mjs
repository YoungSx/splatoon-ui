import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'

const root = process.cwd()
const componentRoot = path.join(root, 'packages', 'ui', 'src', 'components', 'ui')
const indexEntryPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'index.ts')
const serverEntryPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'server.ts')
const clientEntryPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'client.ts')
const packagePath = path.join(root, 'packages', 'ui', 'package.json')

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

// Any React API that is unavailable in the react-server condition, plus
// browser-only globals. React's server build exports neither hooks nor
// createContext/useContext, so a module touching these must declare
// 'use client' or it throws the moment a Server Component imports it.
const clientOnlyReactApis = [
  'createContext',
  'useActionState',
  'useCallback',
  'useContext',
  'useDeferredValue',
  'useEffect',
  'useId',
  'useImperativeHandle',
  'useInsertionEffect',
  'useLayoutEffect',
  'useMemo',
  'useOptimistic',
  'useReducer',
  'useRef',
  'useState',
  'useSyncExternalStore',
  'useTransition',
]

const clientRuntimePatterns = [
  // Matches both `React.useState(` and a bare `useState(` from a named import.
  new RegExp(String.raw`\b(?:React\.)?(?:${clientOnlyReactApis.join('|')})\s*[(<]`),
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
  './assets',
  './alert',
  './badge',
  './character-assets',
  './event-assets',
  './event-callout',
  './input',
  './progress',
  './squid-assets',
  './tokens',
  './types',
  './weapons-assets',
]

const demoOnlyModules = ['./demo-layout', './github-mark', './showcase-assets']
const privateImplementationModules = ['./trigger-button']

const requiredClientExports = [
  './assets',
  './tokens',
  './types',
  ...publicUiEntries.map((name) => `./${name}`),
]

const allowedPackageExports = new Set([
  '.',
  './client',
  './server',
  './assets',
  './tokens',
  './types',
  './styles.css',
  './theme.css',
  './styles/*.css',
  './assets/*',
  './package.json',
  ...publicUiEntries.map((name) => `./${name}`),
])

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
    name: 'package exports declare explicit client, server, support, component, and stylesheet entrypoints',
    pass:
      packageJson.exports?.['.']?.import === './dist/client.js' &&
      packageJson.exports?.['.']?.types === './dist/client.d.ts' &&
      packageJson.exports?.['.']?.['react-server']?.import === './dist/server.js' &&
      packageJson.exports?.['.']?.['react-server']?.types === './dist/server.d.ts' &&
      packageJson.exports?.['./client']?.import === './dist/client.js' &&
      packageJson.exports?.['./client']?.types === './dist/client.d.ts' &&
      packageJson.exports?.['./server']?.import === './dist/server.js' &&
      packageJson.exports?.['./server']?.['react-server'] === './dist/server.js' &&
      packageJson.exports?.['./server']?.types === './dist/server.d.ts' &&
      packageJson.exports?.['./assets']?.import === './dist/assets.js' &&
      packageJson.exports?.['./assets']?.types === './dist/assets.d.ts' &&
      packageJson.exports?.['./tokens']?.import === './dist/tokens.js' &&
      packageJson.exports?.['./tokens']?.types === './dist/tokens.d.ts' &&
      packageJson.exports?.['./types']?.import === './dist/types.js' &&
      packageJson.exports?.['./types']?.types === './dist/types.d.ts' &&
      packageJson.exports?.['./styles.css'] === './dist/styles.css' &&
      Object.keys(packageJson.exports ?? {}).every((entry) => allowedPackageExports.has(entry)) &&
      publicUiEntries.every((name) => {
        const entry = packageJson.exports?.[`./${name}`]
        return entry?.import === `./dist/${name}.js` && entry?.types === `./dist/${name}.d.ts`
      }),
  },
  {
    name: 'default UI entrypoint forwards to the explicit client entrypoint',
    pass: indexEntry.trim() === "'use client'\n\nexport * from './client'",
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
    name: 'private implementation modules stay out of published UI entrypoints',
    pass:
      privateImplementationModules.every(
        (modulePath) => !serverEntry.includes(`'${modulePath}'`)
      ) &&
      privateImplementationModules.every(
        (modulePath) => !clientEntry.includes(`'${modulePath}'`)
      ) &&
      privateImplementationModules.every(
        (modulePath) => !publicUiEntries.includes(modulePath.slice(2))
      ) &&
      privateImplementationModules.every(
        (modulePath) => packageJson.exports?.[modulePath] === undefined
      ),
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
