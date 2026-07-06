import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const charactersDir = path.join(root, 'packages', 'ui', 'public', '_images', 'characters')
const registryPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'character-assets.ts'
)
const pagePath = path.join(root, 'apps', 'docs', 'src', 'app', 'page.tsx')
const analyzerPath = path.join(root, 'scripts', 'analyze-splatoon-reference.mjs')
const serverEntryPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'server.ts')

const registry = fs.readFileSync(registryPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const analyzer = fs.readFileSync(analyzerPath, 'utf8')
const serverEntry = fs.readFileSync(serverEntryPath, 'utf8')

const requiredAssets = [
  'char-2.png',
  'char-3.png',
  'char-4.png',
  'char-5.png',
  'char-7.png',
  'char-8.png',
  'char-10.png',
  'char-11.png',
  'char-12.png',
  'char-13.png',
  'char-14.png',
  'char-15.png',
  'char-17.png',
  'char-18.png',
  'game-pack.png',
  'salmonid.png',
]

function hasValidPngSignature(asset) {
  const filePath = path.join(charactersDir, asset)
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

  return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
}

const checks = [
  {
    name: 'curated character assets are available as valid local PNG images',
    pass: requiredAssets.every(hasValidPngSignature),
  },
  {
    name: 'character asset registry exposes dimensions, transition mappings, and assetBasePath-aware factories',
    pass:
      registry.includes("import { resolveSplatoonAssetPath") &&
      registry.includes('export function createCharacterImageAssets') &&
      registry.includes('export function createPageTransitionCharacterAssets') &&
      registry.includes('characterImageAssets') &&
      registry.includes('pageTransitionCharacterAssets') &&
      requiredAssets.every((asset) => registry.includes(`characterAssetSrc('${asset}'`)) &&
      ['width: 421', 'height: 451', 'width: 425', 'height: 461', 'width: 331', 'height: 405'].every(
        (entry) => registry.includes(entry)
      ),
  },
  {
    name: 'page transition demos use character images instead of emoji placeholders',
    pass:
      page.includes("from '@/components/ui/character-assets'") &&
      registry.includes('pageTransitionCharacterAssets') &&
      registry.includes('home:') &&
      registry.includes('about:') &&
      registry.includes('weapons:') &&
      page.includes('pageTransitionCharacterAssets[demoPage].src') &&
      page.includes('pageTransitionCharacterAssets[demoPage].alt') &&
      page.includes('pageTransitionCharacterAssets[demoPage].width') &&
      page.includes('pageTransitionCharacterAssets[demoPage].height') &&
      !page.includes('emoji:') &&
      !page.includes('current.emoji'),
  },
  {
    name: 'reference analyzer classifies and maps character showcase assets',
    pass:
      analyzer.includes("id: 'character-showcase'") &&
      analyzer.includes('/_images/characters/') &&
      analyzer.includes('gameplay\\/characters\\/') &&
      analyzer.includes("'/_images/characters/'"),
  },
  {
    name: 'server-safe UI entrypoint exports character asset metadata',
    pass: serverEntry.includes("export * from './character-assets'"),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Character asset checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Character asset checks passed.')
