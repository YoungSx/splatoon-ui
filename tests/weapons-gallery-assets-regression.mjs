import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const weaponsDir = path.join(root, 'packages', 'ui', 'public', '_images', 'weapons')
const registryPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'weapons-assets.ts'
)
const pagePath = path.join(root, 'apps', 'docs', 'src', 'app', 'page.tsx')
const analyzerPath = path.join(root, 'scripts', 'analyze-splatoon-reference.mjs')
const serverEntryPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'server.ts')

const registry = fs.readFileSync(registryPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const analyzer = fs.readFileSync(analyzerPath, 'utf8')
const serverEntry = fs.readFileSync(serverEntryPath, 'utf8')

const marqueeAssets = Array.from(
  { length: 22 },
  (_, index) => `marquee/s3_weapons_social-${index + 1}.jpg`
)

const shopAssets = [
  'shops-gallery/weapons-express-hotlantis-1.jpg',
  'shops-gallery/weapons-express-ammo-knights-2.jpg',
  'shops-gallery/weapons-express-naut-couture-3.jpg',
  'shops-gallery/weapons-express-manoward-4.jpg',
  'shops-gallery/weapons-express-crush-station-5.jpg',
  'shops-gallery/harmony-icon.png',
  'shops-gallery/sheldon-icon.png',
  'shops-gallery/jella-icon.png',
  'shops-gallery/coco-icon.png',
  'shops-gallery/eddy-icon.png',
  'shops-gallery/harmony.png',
  'shops-gallery/sheldon.png',
  'shops-gallery/jella.png',
  'shops-gallery/coco.png',
  'shops-gallery/eddy.png',
]

const requiredAssets = [...marqueeAssets, ...shopAssets]
const registryShopAssets = shopAssets.filter(
  (asset) => asset.endsWith('.jpg') || asset.includes('-icon.')
)

const officialShopPairs = [
  ['weapons-express-hotlantis-1.jpg', 'harmony-icon.png'],
  ['weapons-express-ammo-knights-2.jpg', 'sheldon-icon.png'],
  ['weapons-express-naut-couture-3.jpg', 'eddy-icon.png'],
  ['weapons-express-manoward-4.jpg', 'jella-icon.png'],
  ['weapons-express-crush-station-5.jpg', 'coco-icon.png'],
]

function hasValidImageSignature(relativePath) {
  const filePath = path.join(weaponsDir, relativePath)
  if (!fs.existsSync(filePath)) return false

  const buffer = fs.readFileSync(filePath)
  const sample = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('utf8')
  if (
    sample.includes('<Error><Code>AccessDenied</Code>') ||
    sample.includes('<Message>Access Denied</Message>') ||
    sample.includes('<!DOCTYPE html>')
  ) {
    return false
  }

  if (relativePath.endsWith('.jpg')) {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  }

  if (relativePath.endsWith('.png')) {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  }

  return false
}

const checks = [
  {
    name: 'curated weapons gallery assets are available as valid local images',
    pass: requiredAssets.every(hasValidImageSignature),
  },
  {
    name: 'weapons asset registry exposes marquee, showcase, shop carousel data, and assetBasePath-aware factories',
    pass:
      registry.includes("import { resolveSplatoonAssetPath") &&
      registry.includes('export function createWeaponMarqueeItems') &&
      registry.includes('export function createWeaponShowcaseItems') &&
      registry.includes('export function createWeaponShopGalleryItems') &&
      registry.includes('Array.from({ length: 22 }') &&
      registry.includes('weaponShowcaseItems') &&
      registry.includes('weaponShopGalleryItems') &&
      registry.includes('weaponMarqueeItems') &&
      registryShopAssets.every((asset) => registry.includes(asset)),
  },
  {
    name: 'shop carousel thumbnail pagination follows official shop-to-character pairings',
    pass: officialShopPairs.every(([image, icon]) => {
      const imageIndex = registry.indexOf(image)
      const iconIndex = registry.indexOf(icon, imageIndex)
      return imageIndex >= 0 && iconIndex > imageIndex
    }),
  },
  {
    name: 'demo carousel data uses curated weapons assets instead of generated placeholders',
    pass:
      page.includes("from '@/components/ui/weapons-assets'") &&
      page.includes('const weaponsGalleryItems = weaponShowcaseItems') &&
      page.includes('const shopsGalleryItems = weaponShopGalleryItems') &&
      page.includes('const marqueeItems = weaponMarqueeItems') &&
      !page.includes('const marqueeItems = [\n  { id: 1, image: demoArt.alpha'),
  },
  {
    name: 'reference analyzer classifies weapons and shop gallery assets for future crawl audits',
    pass:
      analyzer.includes("id: 'weapons-gallery-carousel'") &&
      analyzer.includes("id: 'shops-gallery-carousel'") &&
      analyzer.includes('/_images/weapons/marquee/') &&
      analyzer.includes('/_images/weapons/shops-gallery/') &&
      analyzer.includes("'/_images/weapons/'"),
  },
  {
    name: 'server-safe UI entrypoint exports weapons asset metadata',
    pass: serverEntry.includes("export * from './weapons-assets'"),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Weapons gallery asset checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Weapons gallery asset checks passed.')
