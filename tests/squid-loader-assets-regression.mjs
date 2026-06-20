import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const squidDir = path.join(root, 'public', '_images', 'squid')
const registryPath = path.join(root, 'src', 'components', 'ui', 'squid-assets.ts')
const loaderPath = path.join(root, 'src', 'components', 'ui', 'loader.tsx')
const loaderCssPath = path.join(root, 'src', 'components', 'ui', 'loader.module.css')
const squidMaskPath = path.join(root, 'src', 'components', 'ui', 'squid-mask-transition.tsx')
const pagePath = path.join(root, 'src', 'app', 'page.tsx')
const serverEntryPath = path.join(root, 'src', 'components', 'ui', 'server.ts')

const registry = fs.readFileSync(registryPath, 'utf8')
const loader = fs.readFileSync(loaderPath, 'utf8')
const loaderCss = fs.readFileSync(loaderCssPath, 'utf8')
const squidMask = fs.readFileSync(squidMaskPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const serverEntry = fs.readFileSync(serverEntryPath, 'utf8')

function hasNoHttpErrorPayload(filePath) {
  const buffer = fs.readFileSync(filePath)
  const sample = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('utf8')
  return (
    !sample.includes('<Error><Code>AccessDenied</Code>') &&
    !sample.includes('<Message>Access Denied</Message>') &&
    !sample.includes('<!DOCTYPE html>')
  )
}

function hasValidGifSignature(fileName, width, height) {
  const filePath = path.join(squidDir, fileName)
  if (!fs.existsSync(filePath) || !hasNoHttpErrorPayload(filePath)) return false
  const buffer = fs.readFileSync(filePath)
  return (
    buffer.subarray(0, 6).toString('ascii') === 'GIF89a' &&
    buffer.readUInt16LE(6) === width &&
    buffer.readUInt16LE(8) === height
  )
}

function hasValidPngSignature(fileName, width, height) {
  const filePath = path.join(squidDir, fileName)
  if (!fs.existsSync(filePath) || !hasNoHttpErrorPayload(filePath)) return false
  const buffer = fs.readFileSync(filePath)
  return (
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) &&
    buffer.readUInt32BE(16) === width &&
    buffer.readUInt32BE(20) === height
  )
}

const checks = [
  {
    name: 'squid loader and mask assets are valid local media files',
    pass:
      hasValidGifSignature('loader_ika.gif', 516, 567) &&
      hasValidPngSignature('ika.png', 438, 481) &&
      hasValidPngSignature('loader-morph-sprite.png', 8320, 130) &&
      hasValidPngSignature('loader-swim-sprite.png', 4030, 130),
  },
  {
    name: 'squid asset registry centralizes loader and mask metadata',
    pass:
      registry.includes("const SQUID_ASSET_BASE = '/_images/squid'") &&
      registry.includes('squidImageAssets') &&
      registry.includes('squidSpriteAssets') &&
      registry.includes('loader_ika.gif') &&
      registry.includes('ika.png') &&
      registry.includes('loader-morph-sprite.png') &&
      registry.includes('loader-swim-sprite.png') &&
      registry.includes('width: 516') &&
      registry.includes('height: 567') &&
      registry.includes('width: 438') &&
      registry.includes('height: 481') &&
      registry.includes('frames: 64') &&
      registry.includes('frames: 31') &&
      registry.includes('durationMs: 2667') &&
      registry.includes('durationMs: 2067') &&
      registry.includes('182952.png') &&
      registry.includes('182953.png'),
  },
  {
    name: 'Loader renders the image-backed squid glyph instead of a CSS border spinner',
    pass:
      loader.includes("import { AssetImage } from './asset-image'") &&
      loader.includes('squidImageAssets.loader') &&
      loader.includes('squidSpriteAssets.loaderMorph') &&
      loader.includes('squidSpriteAssets.loaderSwim') &&
      loader.includes("animation?: LoaderAnimation") &&
      loader.includes("'--loader-sprite-duration'") &&
      loader.includes('<AssetImage') &&
      loader.includes('role="status"') &&
      !loader.includes('<img') &&
      !loader.includes('border spinner') &&
      !loaderCss.includes('border-right-color') &&
      !loaderCss.includes('rotate(359deg)') &&
      !loaderCss.includes('@keyframes rotate-360') &&
      loaderCss.includes('steps(64, end)') &&
      loaderCss.includes('steps(31, end)') &&
      loaderCss.includes('mask-image: var(--loader-sprite-url)'),
  },
  {
    name: 'SquidMaskTransition reads the mask asset from the shared registry',
    pass:
      squidMask.includes('squidImageAssets.mask.src') &&
      !squidMask.includes("img.src = '/_images/squid/ika.png'"),
  },
  {
    name: 'demo copy describes the local image-backed loader',
    pass:
      page.includes('Local squid glyph asset with ink-color backing') &&
      page.includes("animation: 'morph'") &&
      page.includes("animation: 'swim'") &&
      !page.includes('CSS border spinner'),
  },
  {
    name: 'server-safe UI entrypoint exports squid asset metadata',
    pass: serverEntry.includes("export * from './squid-assets'"),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Squid loader asset checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Squid loader asset checks passed.')
