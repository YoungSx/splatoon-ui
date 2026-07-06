import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const eventDir = path.join(root, 'packages', 'ui', 'public', '_images', 'events')
const registryPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'event-assets.ts')
const calloutPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'event-callout.tsx'
)
const calloutCssPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'event-callout.module.css'
)
const pagePath = path.join(root, 'apps', 'docs', 'src', 'app', 'page.tsx')
const serverEntryPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'server.ts')

const registry = fs.readFileSync(registryPath, 'utf8')
const callout = fs.readFileSync(calloutPath, 'utf8')
const calloutCss = fs.readFileSync(calloutCssPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const serverEntry = fs.readFileSync(serverEntryPath, 'utf8')

const requiredAssets = [
  ['big-run-callout.jpg', 'jpg', 382, 215],
  ['golden-egg.png', 'png', 52, 46],
  ['splatnet-blade.jpg', 'jpg', 558, 313],
  ['splatnet-next-page.png', 'png', 342, 221],
]

function hasNoHttpErrorPayload(buffer) {
  const sample = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('utf8')
  return (
    !sample.includes('<Error><Code>AccessDenied</Code>') &&
    !sample.includes('<Message>Access Denied</Message>') &&
    !sample.includes('<!DOCTYPE html>')
  )
}

function jpegSize(buffer) {
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break
    const marker = buffer[offset + 1]
    const length = buffer.readUInt16BE(offset + 2)
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      }
    }
    offset += 2 + length
  }
  return null
}

function hasValidImageSignature([fileName, type, width, height]) {
  const filePath = path.join(eventDir, fileName)
  if (!fs.existsSync(filePath)) return false
  const buffer = fs.readFileSync(filePath)
  if (!hasNoHttpErrorPayload(buffer)) return false

  if (type === 'png') {
    return (
      buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) &&
      buffer.readUInt32BE(16) === width &&
      buffer.readUInt32BE(20) === height
    )
  }

  const size = jpegSize(buffer)
  return buffer[0] === 0xff && buffer[1] === 0xd8 && size?.width === width && size.height === height
}

const checks = [
  {
    name: 'curated event callout assets are valid local images',
    pass: requiredAssets.every(hasValidImageSignature),
  },
  {
    name: 'event asset registry exposes dimensions and assetBasePath-aware factories',
    pass:
      registry.includes("import { resolveSplatoonAssetPath") &&
      registry.includes('export function createEventImageAssets') &&
      registry.includes('eventImageAssets') &&
      requiredAssets.every(([asset]) =>
        registry.includes(`resolveSplatoonAssetPath('events/${asset}', assetBasePath)`)
      ) &&
      ['width: 382', 'height: 215', 'width: 52', 'height: 46', 'width: 558', 'height: 313'].every(
        (entry) => registry.includes(entry)
      ),
  },
  {
    name: 'EventCallout renders media, background, and badge assets through shared AssetImage',
    pass:
      callout.includes("import { AssetImage } from './asset-image'") &&
      callout.includes('createEventImageAssets(assetBasePath)') &&
      callout.includes('eventAssets.bigRunCallout') &&
      callout.includes('eventAssets.splatnetNextPage') &&
      callout.includes('eventAssets.goldenEgg') &&
      callout.includes('assetBasePath?: SplatoonAssetBasePath') &&
      callout.includes('className={styles.mediaFrame}') &&
      callout.includes('<article') &&
      callout.includes('<AssetImage') &&
      !callout.includes('<img') &&
      calloutCss.includes('aspect-ratio: 382 / 215;') &&
      calloutCss.includes('@media (min-width: 760px)'),
  },
  {
    name: 'demo page uses event assets instead of colored letter placeholder cards',
    pass:
      page.includes("from '@/components/ui/event-callout'") &&
      page.includes("from '@/components/ui/event-assets'") &&
      page.includes('eventImageAssets.bigRunCallout.src') &&
      page.includes('eventImageAssets.splatnetBlade.src') &&
      page.includes('<EventCallout') &&
      !page.includes('Grid Item A') &&
      !page.includes('Grid Item B') &&
      !page.includes('>A</div>') &&
      !page.includes('>B</div>'),
  },
  {
    name: 'server-safe UI entrypoint exports event assets and callout component',
    pass:
      serverEntry.includes("export * from './event-assets'") &&
      serverEntry.includes("export * from './asset-image'") &&
      serverEntry.includes("export * from './event-callout'"),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Event callout asset checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Event callout asset checks passed.')
