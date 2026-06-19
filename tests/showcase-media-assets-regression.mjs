import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicImagesDir = path.join(root, 'public', '_images')
const registryPath = path.join(root, 'src', 'components', 'ui', 'showcase-assets.ts')
const pagePath = path.join(root, 'src', 'app', 'page.tsx')
const analyzerPath = path.join(root, 'scripts', 'analyze-splatoon-reference.mjs')
const uiIndexPath = path.join(root, 'src', 'components', 'ui', 'index.ts')

const registry = fs.readFileSync(registryPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const analyzer = fs.readFileSync(analyzerPath, 'utf8')
const uiIndex = fs.readFileSync(uiIndexPath, 'utf8')

const requiredAssets = [
  'screenshots/video-trailer.jpg',
  'home/header-back.jpg',
  'home/character.png',
  'home/s3-home-intro-blade.jpg',
  'gameplay/battle-online/gameplay-battle-online-anarchy-1.jpg',
  'gameplay/battle-online/gameplay-battle-online-turfwar-left-screen.jpg',
  'gameplay/battle-online/gameplay-battle-online-turfwar-right-screen.jpg',
  'gameplay/gameplay-salmonrun.jpg',
  'gameplay/splatfest/gameplay-splatfest-1.jpg',
  'gameplay/splatfest/gameplay-splatfest-2.jpg',
]

function hasValidImageSignature(relativePath) {
  const filePath = path.join(publicImagesDir, relativePath)
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
    name: 'curated showcase media assets are available as valid local images',
    pass: requiredAssets.every(hasValidImageSignature),
  },
  {
    name: 'showcase media registry exposes dimensions for each curated image',
    pass:
      registry.includes('showcaseMediaAssets') &&
      requiredAssets.every((asset) => registry.includes(`/_images/${asset}`)) &&
      ['width: 748', 'height: 421', 'width: 658', 'height: 370', 'width: 558'].every((entry) =>
        registry.includes(entry)
      ),
  },
  {
    name: 'demo page uses showcase media assets instead of generated SVG placeholders',
    pass:
      page.includes("from '@/components/ui/showcase-assets'") &&
      page.includes('showcaseMediaAssets.trailerThumbnail.src') &&
      page.includes('showcaseMediaAssets.fullscreenPreview.src') &&
      page.includes('showcaseMediaAssets.ruggedLookbook.src') &&
      page.includes('showcaseMediaAssets.ruggedMode.src') &&
      page.includes('showcaseMediaAssets.ruggedScene.src') &&
      !page.includes('function createDemoArt') &&
      !page.includes('data:image/svg+xml'),
  },
  {
    name: 'reference analyzer classifies showcase media for future crawl audits',
    pass:
      analyzer.includes("id: 'showcase-media'") &&
      analyzer.includes('isShowcaseMediaPath') &&
      analyzer.includes('/_images/home/header-back.jpg') &&
      analyzer.includes('/_images/gameplay/gameplay-salmonrun.jpg') &&
      analyzer.includes("'/_images/gameplay/'"),
  },
  {
    name: 'server-safe UI entrypoint exports showcase asset metadata',
    pass: uiIndex.includes("export * from './showcase-assets'"),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Showcase media asset checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Showcase media asset checks passed.')
