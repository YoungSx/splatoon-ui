import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const eventDir = path.join(root, 'public', '_images', 'events')
const registryPath = path.join(root, 'src', 'components', 'ui', 'event-assets.ts')
const calloutPath = path.join(root, 'src', 'components', 'ui', 'event-callout.tsx')
const calloutCssPath = path.join(root, 'src', 'components', 'ui', 'event-callout.module.css')
const pagePath = path.join(root, 'src', 'app', 'page.tsx')
const uiIndexPath = path.join(root, 'src', 'components', 'ui', 'index.ts')

const registry = fs.readFileSync(registryPath, 'utf8')
const callout = fs.readFileSync(calloutPath, 'utf8')
const calloutCss = fs.readFileSync(calloutCssPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const uiIndex = fs.readFileSync(uiIndexPath, 'utf8')

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
    name: 'event asset registry exposes dimensions for each curated event image',
    pass:
      registry.includes("const EVENT_ASSET_BASE = '/_images/events'") &&
      registry.includes('eventImageAssets') &&
      requiredAssets.every(([asset]) => registry.includes(`\${EVENT_ASSET_BASE}/${asset}`)) &&
      ['width: 382', 'height: 215', 'width: 52', 'height: 46', 'width: 558', 'height: 313'].every(
        (entry) => registry.includes(entry)
      ),
  },
  {
    name: 'EventCallout renders official media, background, and badge assets with fixed-ratio layout',
    pass:
      callout.includes('eventImageAssets.bigRunCallout') &&
      callout.includes('eventImageAssets.splatnetNextPage') &&
      callout.includes('eventImageAssets.goldenEgg') &&
      callout.includes('className={styles.mediaFrame}') &&
      callout.includes('<article') &&
      callout.includes('<img') &&
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
      uiIndex.includes("export * from './event-assets'") &&
      uiIndex.includes("export * from './event-callout'"),
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
