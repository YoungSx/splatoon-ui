import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'

const root = process.cwd()
const packageRoot = path.join(root, 'packages', 'ui')
const workspacePackageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))
const publishWorkflow = fs.readFileSync(
  path.join(root, '.github', 'workflows', 'publish.yml'),
  'utf8'
)

const requiredFiles = [
  'dist',
  'public/_images/backgrounds',
  'public/_images/banners',
  'public/_images/characters',
  'public/_images/events',
  'public/_images/news',
  'public/_images/squid',
  'public/_images/svg',
  'public/_images/tape-assets',
  'public/_images/weapons',
  'public/fonts',
  'public/svgs',
  'README.md',
  'README_ZH.md',
  'README_JA.md',
  'LICENSE',
  'NOTICE',
]
const forbiddenFiles = [
  '.next',
  'scratch',
  'tests',
  'src',
  'public/_images/gameplay',
  'public/_images/home',
  'public/_images/screenshots',
]
const forbiddenPublicEntrypoints = [
  './demo-layout',
  './github-mark',
  './showcase-assets',
  './trigger-button',
]
const allowedPackageExports = new Set([
  '.',
  './server',
  './styles.css',
  './assets/*',
  './package.json',
  ...publicUiEntries.map((entry) => `./${entry}`),
])

const checks = [
  {
    name: 'package remains named splatoon-ui and is publishable',
    pass: packageJson.name === 'splatoon-ui' && packageJson.private !== true,
  },
  {
    name: 'package exposes built ESM, declaration, and component entrypoints',
    pass:
      packageJson.type === 'module' &&
      packageJson.main === './dist/server.js' &&
      packageJson.module === './dist/server.js' &&
      packageJson.types === './dist/server.d.ts' &&
      packageJson.exports?.['.']?.import === './dist/server.js' &&
      packageJson.exports?.['./client'] === undefined &&
      packageJson.exports?.['./styles.css'] === './dist/styles.css' &&
      Object.keys(packageJson.exports ?? {}).every((entry) => allowedPackageExports.has(entry)) &&
      publicUiEntries.every((name) => {
        const entry = packageJson.exports?.[`./${name}`]
        return entry?.import === `./dist/${name}.js` && entry?.types === `./dist/${name}.d.ts`
      }) &&
      forbiddenPublicEntrypoints.every(
        (entrypoint) => packageJson.exports?.[entrypoint] === undefined
      ),
  },
  {
    name: 'publish files whitelist includes built output and public assets only',
    pass:
      Array.isArray(packageJson.files) &&
      requiredFiles.every((entry) => packageJson.files.includes(entry)) &&
      forbiddenFiles.every((entry) => !packageJson.files.includes(entry)),
  },
  {
    name: 'React runtime is declared as a React 19 peer dependency',
    pass:
      packageJson.peerDependencies?.react === '^19.0.0' &&
      packageJson.peerDependencies?.['react-dom'] === '^19.0.0',
  },
  {
    name: 'shadcn CLI stays out of published runtime dependencies',
    pass: !packageJson.dependencies?.shadcn && Boolean(packageJson.devDependencies?.shadcn),
  },
  {
    name: 'package build and dry-run scripts are available',
    pass:
      packageJson.scripts?.['build:package']?.includes('tsup') &&
      packageJson.scripts?.['build:package']?.includes('build-package-styles') &&
      packageJson.scripts?.['pack:dry-run'] === 'npm pack --dry-run' &&
      workspacePackageJson.scripts?.typecheck === 'pnpm build:package && pnpm -r typecheck' &&
      workspacePackageJson.scripts?.release?.includes('pack:dry-run') &&
      workspacePackageJson.scripts?.release?.includes('test:package-consumer') &&
      workspacePackageJson.scripts?.release?.includes(
        'component-api-encapsulation-regression.mjs'
      ) &&
      workspacePackageJson.scripts?.release?.includes('package-dts-regression.mjs'),
  },
  {
    name: 'CSS files are marked as side-effectful for bundlers',
    pass: Array.isArray(packageJson.sideEffects) && packageJson.sideEffects.includes('**/*.css'),
  },
  {
    name: 'package build config exists',
    pass:
      fs.existsSync(path.join(packageRoot, 'tsup.config.ts')) &&
      fs.existsSync(path.join(packageRoot, 'tsconfig.package.json')) &&
      fs.existsSync(path.join(packageRoot, 'scripts', 'build-package-styles.mjs')) &&
      fs.existsSync(path.join(root, 'tests', 'package-consumer-smoke.mjs')),
  },
  {
    name: 'tag-driven npm publish keeps the package version pinned to the tag',
    pass:
      publishWorkflow.includes('npm version "$VERSION" --no-git-tag-version --ignore-scripts') &&
      publishWorkflow.includes(
        'ACTUAL_VERSION="$(node -p "require(\'./package.json\').version")"'
      ) &&
      publishWorkflow.includes('working-directory: packages/ui') &&
      publishWorkflow.includes('if [ "${ACTUAL_VERSION}" != "${VERSION}" ]; then') &&
      publishWorkflow.includes('npm publish --provenance --access public --ignore-scripts'),
  },
  {
    name: 'stale initial release changeset has been consumed',
    pass: !fs.existsSync(path.join(root, '.changeset', 'initial-release.md')),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Package publish checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Package publish checks passed.')
