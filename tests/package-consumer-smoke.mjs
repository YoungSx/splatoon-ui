import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'

const root = process.cwd()
const packageRoot = path.join(root, 'packages', 'ui')
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

const packResult = run('npm', ['pack', '--json', '--pack-destination', packDir], {
  capture: true,
  cwd: packageRoot,
})
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

const requiredPackedFiles = [
  'dist/server.js',
  'dist/server.d.ts',
  'dist/styles.css',
  'README.md',
  'README_EN.md',
  'README_JA.md',
  'LICENSE',
  'NOTICE',
  ...publicUiEntries.flatMap((entry) => [`dist/${entry}.js`, `dist/${entry}.d.ts`]),
]

for (const required of requiredPackedFiles) {
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
import { Alert, AlertDescription, AlertTitle } from 'splatoon-ui/alert'
import { Button } from 'splatoon-ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselPagination } from 'splatoon-ui/carousel'
import { Dialog } from 'splatoon-ui/dialog'
import { Input } from 'splatoon-ui/input'
import { StapleCard, StapleCardDescription, StapleCardTitle } from 'splatoon-ui/staple-card'

export function App() {
  return (
    <main>
      <Alert>
        <AlertTitle>Demo</AlertTitle>
        <AlertDescription>Package consumer smoke test.</AlertDescription>
      </Alert>
      <Input value="Inkling" readOnly />
      <Button>Open</Button>
      <StapleCard
        image={<div style={{ height: 120, background: 'var(--color-yellow)' }} />}
        variant="b"
      >
        <StapleCardTitle>Featured rotation</StapleCardTitle>
        <StapleCardDescription>Formal package entrypoint smoke test.</StapleCardDescription>
      </StapleCard>
      <Carousel aria-label="Consumer carousel">
        <CarouselContent>
          <CarouselItem>Slide one</CarouselItem>
          <CarouselItem>Slide two</CarouselItem>
        </CarouselContent>
        <CarouselPagination />
      </Carousel>
      <Dialog />
    </main>
  )
}
`
)

fs.writeFileSync(
  path.join(consumerDir, 'runtime.mjs'),
  `await import('splatoon-ui')
await import('splatoon-ui/button')
await import('splatoon-ui/carousel')
await import('splatoon-ui/dialog')
await import('splatoon-ui/staple-card')
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
