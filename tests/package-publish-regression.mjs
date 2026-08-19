import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'
import { staticChecks } from './registry.mjs'

const root = process.cwd()
const packageRoot = path.join(root, 'packages', 'ui')
const workspacePackageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))
const changelog = fs.readFileSync(path.join(packageRoot, 'CHANGELOG.md'), 'utf8')
// Changesets writes newest-first, so the first `## x.y.z` is the latest release.
const latestChangelogVersion = changelog.match(/^## (\d+\.\d+\.\d+)$/m)?.[1] ?? ''
const builtStylesheetPath = path.join(packageRoot, 'dist', 'styles.css')
// Missing output should fail the stylesheet check with a readable name rather
// than crashing the run before any check reports.
const builtStylesheet = fs.existsSync(builtStylesheetPath)
  ? fs.readFileSync(builtStylesheetPath, 'utf8')
  : ''
function readWorkflow(name) {
  const workflowPath = path.join(root, '.github', 'workflows', name)
  // A deleted workflow should fail the check that depends on it, not crash the
  // whole run before any check reports.
  return fs.existsSync(workflowPath) ? fs.readFileSync(workflowPath, 'utf8') : ''
}

const publishWorkflow = readWorkflow('publish.yml')
const ciWorkflow = readWorkflow('ci.yml')

/** True when a workflow runs `pnpm test` as its own command. */
function runsAggregateSuite(workflow) {
  return /(?:^|\n)\s*(?:run:\s*)?pnpm test\s*(?:$|\n)/.test(workflow)
}

/** True when a workflow names an individual check file, which is what drifts. */
function namesTestFileInline(workflow) {
  return /node tests\/[\w-]+\.mjs/.test(workflow)
}

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
      packageJson.main === './dist/client.js' &&
      packageJson.module === './dist/client.js' &&
      packageJson.types === './dist/client.d.ts' &&
      packageJson.exports?.['.']?.import === './dist/client.js' &&
      packageJson.exports?.['.']?.types === './dist/client.d.ts' &&
      packageJson.exports?.['.']?.['react-server']?.import === './dist/server.js' &&
      packageJson.exports?.['.']?.['react-server']?.types === './dist/server.d.ts' &&
      packageJson.exports?.['./client']?.import === './dist/client.js' &&
      packageJson.exports?.['./client']?.types === './dist/client.d.ts' &&
      packageJson.exports?.['./server']?.import === './dist/server.js' &&
      packageJson.exports?.['./server']?.types === './dist/server.d.ts' &&
      packageJson.exports?.['./assets']?.import === './dist/assets.js' &&
      packageJson.exports?.['./assets']?.types === './dist/assets.d.ts' &&
      packageJson.exports?.['./tokens']?.import === './dist/tokens.js' &&
      packageJson.exports?.['./tokens']?.types === './dist/tokens.d.ts' &&
      packageJson.exports?.['./types']?.import === './dist/types.js' &&
      packageJson.exports?.['./types']?.types === './dist/types.d.ts' &&
      packageJson.exports?.['./styles.css'] === './dist/styles.css' &&
      packageJson.exports?.['./theme.css'] === './dist/theme.css' &&
      packageJson.exports?.['./styles/*.css'] === './dist/styles/*.css' &&
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
      forbiddenFiles.every((entry) => !packageJson.files.includes(entry)) &&
      packageJson.files.includes('!dist/internal-styles.css'),
  },
  {
    name: 'React runtime is declared as a React 19 peer dependency',
    pass:
      packageJson.peerDependencies?.react === '^19.0.0' &&
      packageJson.peerDependencies?.['react-dom'] === '^19.0.0',
  },
  {
    name: 'stylesheet processors are version-aligned peers, not duplicate runtime installs',
    pass:
      packageJson.peerDependencies?.tailwindcss === '^4.0.0' &&
      packageJson.peerDependencies?.['tw-animate-css'] === '^1.4.0' &&
      packageJson.dependencies?.tailwindcss === undefined &&
      packageJson.dependencies?.['tw-animate-css'] === undefined &&
      Boolean(packageJson.devDependencies?.tailwindcss) &&
      Boolean(packageJson.devDependencies?.['tw-animate-css']),
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
      workspacePackageJson.scripts?.release?.includes('docs:check') &&
      // The release gate runs the aggregate suite rather than an inline list of
      // files, so individual checks cannot be dropped by editing this script.
      // tests/registry.mjs owns which checks exist and fails if one is orphaned.
      workspacePackageJson.scripts?.release?.includes('pnpm test') &&
      staticChecks.includes('component-api-encapsulation-regression.mjs') &&
      staticChecks.includes('package-dts-regression.mjs'),
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
    // The workflow used to run `npm version` to make package.json match the
    // tag. That write only existed on the runner, so the committed version
    // stayed behind while three releases shipped: the repo said 0.2.0 while
    // npm served 0.2.3. The tag must now agree with the committed version
    // instead of being silently overwritten by CI.
    name: 'tag-driven npm publish verifies the committed version instead of rewriting it',
    pass:
      !publishWorkflow.includes('npm version') &&
      publishWorkflow.includes(
        'ACTUAL_VERSION="$(node -p "require(\'./package.json\').version")"'
      ) &&
      publishWorkflow.includes('working-directory: packages/ui') &&
      publishWorkflow.includes('if [ "${ACTUAL_VERSION}" != "${VERSION}" ]; then') &&
      publishWorkflow.includes('npm publish --provenance --access public --ignore-scripts'),
  },
  {
    // Guards the same drift from the repository side: the published history in
    // CHANGELOG.md has to reach the version that is about to ship, so a release
    // cannot leave the changelog stranded on an older entry.
    name: 'changelog documents the currently committed package version',
    // Asserting only that the version appears somewhere would still pass while
    // the repository sat on 0.2.0 with 0.2.3 already published. The committed
    // version has to be the newest entry.
    pass: latestChangelogVersion === packageJson.version,
  },
  {
    // `@source` resolves relative to the stylesheet declaring it. The source
    // copy sits in src/styles/ and points at `../` (the components). Shipping
    // that verbatim from dist/ would resolve to the package root and make every
    // consumer build crawl public/ — megabytes of images and fonts that hold no
    // class names. The build retargets it to dist/, where the compiled JS that
    // does carry the class strings lives.
    name: 'shipped stylesheet scopes Tailwind scanning to the compiled output',
    pass:
      /^@source\s+['"]\.['"];\s*$/m.test(builtStylesheet) &&
      !/^@source\s+['"]\.\.\//m.test(builtStylesheet),
  },
  {
    // The publish workflow used to name three regression scripts inline, which
    // silently drifted from the release gate as checks were added. Both CI
    // entrypoints now invoke the aggregate suite so the two cannot diverge.
    name: 'CI workflows run the aggregate check suite instead of an inline list',
    pass:
      // Anchored to the whole command: a bare `includes('pnpm test')` would also
      // match `pnpm test:package-consumer` and pass even with the gate removed.
      runsAggregateSuite(publishWorkflow) &&
      !namesTestFileInline(publishWorkflow) &&
      runsAggregateSuite(ciWorkflow) &&
      !namesTestFileInline(ciWorkflow),
  },
  {
    name: 'CI validates pull requests, not just release tags',
    pass: /on:[\s\S]*?pull_request/.test(ciWorkflow),
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
