import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

const requiredFiles = [
  'dist',
  'public/_images',
  'public/fonts',
  'README.md',
  'README_EN.md',
  'README_JA.md',
  'LICENSE',
  'NOTICE',
]
const forbiddenFiles = ['.next', 'scratch', 'tests', 'src']

const checks = [
  {
    name: 'package remains named splatoon-ui and is publishable',
    pass: packageJson.name === 'splatoon-ui' && packageJson.private !== true,
  },
  {
    name: 'package exposes built ESM and declaration entrypoints',
    pass:
      packageJson.type === 'module' &&
      packageJson.main === './dist/server.js' &&
      packageJson.module === './dist/server.js' &&
      packageJson.types === './dist/server.d.ts' &&
      packageJson.exports?.['.']?.import === './dist/server.js' &&
      packageJson.exports?.['./client']?.import === './dist/client.js' &&
      packageJson.exports?.['./styles.css'] === './dist/styles.css',
  },
  {
    name: 'publish files whitelist includes built output and public assets only',
    pass:
      Array.isArray(packageJson.files) &&
      requiredFiles.every((entry) => packageJson.files.includes(entry)) &&
      forbiddenFiles.every((entry) => !packageJson.files.includes(entry)),
  },
  {
    name: 'React runtime is declared as a peer dependency',
    pass: Boolean(
      packageJson.peerDependencies?.react && packageJson.peerDependencies?.['react-dom']
    ),
  },
  {
    name: 'package build and dry-run scripts are available',
    pass:
      packageJson.scripts?.['build:package']?.includes('tsup') &&
      packageJson.scripts?.['build:package']?.includes('build-package-styles') &&
      packageJson.scripts?.['pack:dry-run'] === 'npm pack --dry-run' &&
      packageJson.scripts?.['test:package-consumer'] === 'node tests/package-consumer-smoke.mjs' &&
      packageJson.scripts?.release?.includes('pack:dry-run') &&
      packageJson.scripts?.release?.includes('test:package-consumer'),
  },
  {
    name: 'CSS files are marked as side-effectful for bundlers',
    pass: Array.isArray(packageJson.sideEffects) && packageJson.sideEffects.includes('**/*.css'),
  },
  {
    name: 'package build config exists',
    pass:
      fs.existsSync(path.join(root, 'tsup.config.ts')) &&
      fs.existsSync(path.join(root, 'tsconfig.package.json')) &&
      fs.existsSync(path.join(root, 'scripts', 'build-package-styles.mjs')) &&
      fs.existsSync(path.join(root, 'tests', 'package-consumer-smoke.mjs')),
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
