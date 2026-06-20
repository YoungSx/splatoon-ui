import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const tmpRoot = path.join(root, '.tmp', 'package-consumer-smoke')
const packDir = path.join(tmpRoot, 'pack')
const consumerDir = path.join(tmpRoot, 'consumer')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: 'utf8',
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    ...options,
  })

  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stdout)
      process.stderr.write(result.stderr)
    }
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`)
  }

  return result
}

fs.rmSync(tmpRoot, { force: true, recursive: true })
fs.mkdirSync(packDir, { recursive: true })
fs.mkdirSync(consumerDir, { recursive: true })

const packResult = run('npm', ['pack', '--json', '--pack-destination', packDir], { capture: true })
const packJsonStart = packResult.stdout.lastIndexOf('\n[')
const packJson = packResult.stdout.slice(packJsonStart === -1 ? 0 : packJsonStart + 1)
const [packInfo] = JSON.parse(packJson)
const tarballPath = path.join(packDir, packInfo.filename)

const packedFiles = packInfo.files.map((file) => file.path)
const forbiddenPrefixes = ['src/', 'tests/', 'scratch/', '.next/', 'node_modules/']
const forbiddenFiles = packedFiles.filter((file) =>
  forbiddenPrefixes.some((prefix) => file.startsWith(prefix))
)

if (forbiddenFiles.length > 0) {
  throw new Error(`Package tarball contains forbidden files:\n${forbiddenFiles.join('\n')}`)
}

for (const required of [
  'dist/server.js',
  'dist/client.js',
  'dist/server.d.ts',
  'dist/client.d.ts',
  'dist/styles.css',
  'README.md',
  'README_EN.md',
  'README_JA.md',
  'LICENSE',
  'NOTICE',
]) {
  if (!packedFiles.includes(required)) {
    throw new Error(`Package tarball is missing ${required}`)
  }
}

fs.writeFileSync(
  path.join(consumerDir, 'package.json'),
  JSON.stringify(
    {
      private: true,
      type: 'module',
      dependencies: {
        '@types/react': '^19',
        '@types/react-dom': '^19',
        react: '19.2.4',
        'react-dom': '19.2.4',
        'splatoon-ui': `file:${tarballPath}`,
        typescript: '^5',
      },
    },
    null,
    2
  )
)

fs.writeFileSync(
  path.join(consumerDir, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        jsx: 'react-jsx',
        module: 'esnext',
        moduleResolution: 'bundler',
        noEmit: true,
        skipLibCheck: true,
        strict: true,
        target: 'es2019',
      },
      include: ['src/**/*'],
    },
    null,
    2
  )
)

fs.mkdirSync(path.join(consumerDir, 'src'), { recursive: true })
fs.writeFileSync(
  path.join(consumerDir, 'src', 'app.tsx'),
  `import 'splatoon-ui/styles.css'
import { HeadingTape, Section } from 'splatoon-ui'
import { Button, Dialog } from 'splatoon-ui/client'

export function App() {
  return (
    <Section>
      <HeadingTape>Demo</HeadingTape>
      <Button>Open</Button>
      <Dialog />
    </Section>
  )
}
`
)

fs.writeFileSync(
  path.join(consumerDir, 'runtime.mjs'),
  `await import('splatoon-ui')
await import('splatoon-ui/client')
await import('splatoon-ui/package.json', { with: { type: 'json' } })
`
)

run('npm', ['install', '--silent'], { cwd: consumerDir })

if (fs.existsSync(path.join(consumerDir, 'node_modules', 'shadcn'))) {
  throw new Error('Consumer install should not include the shadcn CLI package.')
}

run('npx', ['tsc', '--noEmit'], { cwd: consumerDir })
run('node', ['runtime.mjs'], { cwd: consumerDir })

console.log(`Package consumer smoke passed with ${packInfo.files.length} packed files.`)
