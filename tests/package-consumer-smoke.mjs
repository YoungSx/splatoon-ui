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
  'README_ZH.md',
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
import { Badge } from 'splatoon-ui/badge'
import { BannerDivider } from 'splatoon-ui/banner-divider'
import { Button } from 'splatoon-ui/button'
import { ButtonGroup, ButtonGroupItem } from 'splatoon-ui/button-group'
import { Carousel, CarouselContent, CarouselItem, CarouselPagination } from 'splatoon-ui/carousel'
import { DottedDivider } from 'splatoon-ui/dotted-divider'
import { Dialog } from 'splatoon-ui/dialog'
import { HeadingTape } from 'splatoon-ui/heading-tape'
import { IconButton } from 'splatoon-ui/icon-button'
import { Input } from 'splatoon-ui/input'
import { Label } from 'splatoon-ui/label'
import { List, ListItem } from 'splatoon-ui/list'
import { Loader } from 'splatoon-ui/loader'
import { Popover, PopoverContent, PopoverTriggerButton } from 'splatoon-ui/popover'
import { RadioGroup, RadioGroupItem } from 'splatoon-ui/radio-group'
import { RuggedCard, RuggedCardTitle } from 'splatoon-ui/rugged-card'
import { Section } from 'splatoon-ui/section'
import {
  SegmentedControl,
  SegmentedControlItem,
} from 'splatoon-ui/segmented-control'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'splatoon-ui/select'
import { Sheet, SheetContent, SheetTriggerButton } from 'splatoon-ui/sheet'
import { SplatoonTitle } from 'splatoon-ui/splatoon-title'
import { StapleCard, StapleCardDescription, StapleCardTitle } from 'splatoon-ui/staple-card'
import { Staple, Tape } from 'splatoon-ui/tape'
import { TapeTitle } from 'splatoon-ui/tape-title'
import { TornCard, TornCardDescription, TornCardTitle } from 'splatoon-ui/torn-card'
import { WaveButton } from 'splatoon-ui/wave-button'
import { WaveCanvas } from 'splatoon-ui/wave-canvas'

export function App() {
  return (
    <main>
      <Alert>
        <AlertTitle>Demo</AlertTitle>
        <AlertDescription>Package consumer smoke test.</AlertDescription>
      </Alert>
      <Input value="Inkling" readOnly />
      <Button>Open</Button>
      <ButtonGroup aria-label="Consumer actions">
        <ButtonGroupItem size="sm">Ready</ButtonGroupItem>
        <ButtonGroupItem size="sm" variant="blue">
          Gear
        </ButtonGroupItem>
      </ButtonGroup>
      <IconButton aria-label="Next" variant="carousel" direction="right" />
      <WaveButton aria-label="Close consumer panel" />
      <Label htmlFor="consumer-input">Player</Label>
      <RadioGroup defaultValue="turf">
        <RadioGroupItem value="turf" />
        <RadioGroupItem value="ranked" />
      </RadioGroup>
      <Select defaultValue="gallery">
        <SelectTrigger aria-label="Consumer select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gallery">Gallery</SelectItem>
          <SelectItem value="cards">Cards</SelectItem>
        </SelectContent>
      </Select>
      <SegmentedControl defaultValue="turf">
        <SegmentedControlItem value="turf">Turf</SegmentedControlItem>
        <SegmentedControlItem value="ranked">Ranked</SegmentedControlItem>
      </SegmentedControl>
      <Popover>
        <PopoverTriggerButton>Info</PopoverTriggerButton>
        <PopoverContent>Consumer popover</PopoverContent>
      </Popover>
      <Sheet>
        <SheetTriggerButton>Open sheet</SheetTriggerButton>
        <SheetContent>Consumer sheet</SheetContent>
      </Sheet>
      <Loader animation="morph" size="2rem" label="Loading" />
      <List>
        <ListItem>Queue</ListItem>
        <ListItem showDivider={false}>Ready</ListItem>
      </List>
      <Section as="div" pattern="chip-white">
        Consumer section
      </Section>
      <BannerDivider
        tapes={[
          { variant: 'design1', rotate: -2 },
          { variant: 'yellow', rotate: 2, offsetY: 14 },
        ]}
        layout="spacer"
      />
      <DottedDivider />
      <TapeTitle color="yellow">Consumer tape title</TapeTitle>
      <div style={{ position: 'relative', minHeight: 120 }}>
        <Tape variant="tape-2" position="top-left" />
        <Staple position="right" />
      </div>
      <div style={{ position: 'relative', minHeight: 96 }}>
        <WaveCanvas color="var(--color-blue)" height={64} interactive={false} />
      </div>
      <Badge>Fresh</Badge>
      <SplatoonTitle>Consumer title</SplatoonTitle>
      <HeadingTape>Consumer heading</HeadingTape>
      <StapleCard
        image={<div style={{ height: 120, background: 'var(--color-yellow)' }} />}
        variant="b"
      >
        <StapleCardTitle>Featured rotation</StapleCardTitle>
        <StapleCardDescription>Formal package entrypoint smoke test.</StapleCardDescription>
      </StapleCard>
      <TornCard variant="b">
        <TornCardTitle>Public torn card</TornCardTitle>
        <TornCardDescription>Separate package entrypoint smoke test.</TornCardDescription>
      </TornCard>
      <RuggedCard theme="yellow" rotation="-2deg">
        <RuggedCardTitle>Public rugged card</RuggedCardTitle>
      </RuggedCard>
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
await import('splatoon-ui/badge')
await import('splatoon-ui/banner-divider')
await import('splatoon-ui/button')
await import('splatoon-ui/button-group')
await import('splatoon-ui/carousel')
await import('splatoon-ui/dialog')
await import('splatoon-ui/dotted-divider')
await import('splatoon-ui/heading-tape')
await import('splatoon-ui/icon-button')
await import('splatoon-ui/label')
await import('splatoon-ui/list')
await import('splatoon-ui/loader')
await import('splatoon-ui/popover')
await import('splatoon-ui/radio-group')
await import('splatoon-ui/rugged-card')
await import('splatoon-ui/section')
await import('splatoon-ui/segmented-control')
await import('splatoon-ui/select')
await import('splatoon-ui/sheet')
await import('splatoon-ui/splatoon-title')
await import('splatoon-ui/staple-card')
await import('splatoon-ui/tape')
await import('splatoon-ui/tape-title')
await import('splatoon-ui/torn-card')
await import('splatoon-ui/wave-button')
await import('splatoon-ui/wave-canvas')
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
