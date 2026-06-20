import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const tapeAssetsPath = path.join(root, 'src', 'components', 'ui', 'tape-assets.ts')
const tapePicturePath = path.join(root, 'src', 'components', 'ui', 'tape-picture.tsx')
const tapeComponentPath = path.join(root, 'src', 'components', 'ui', 'tape.tsx')
const stickerDir = path.join(root, 'src', 'components', 'ui', 'stickers')
const publicTapeAssetDir = path.join(root, 'public', '_images', 'tape-assets')
const registryConsumerPaths = [
  path.join(root, 'src', 'components', 'ui', 'photo-frame.tsx'),
  path.join(root, 'src', 'components', 'ui', 'torn-card.tsx'),
  path.join(root, 'src', 'components', 'ui', 'video-dialog.tsx'),
  path.join(root, 'src', 'components', 'ui', 'staple-card.tsx'),
  path.join(root, 'src', 'components', 'ui', 'media-decoration.tsx'),
]

const tapeAssets = fs.readFileSync(tapeAssetsPath, 'utf8')
const tapePicture = fs.readFileSync(tapePicturePath, 'utf8')
const tapeComponent = fs.readFileSync(tapeComponentPath, 'utf8')
const registryConsumers = registryConsumerPaths
  .map((filePath) => fs.readFileSync(filePath, 'utf8'))
  .join('\n')

const requiredAssets = [
  'sticker-1.png',
  'sticker-2-red.png',
  'sticker-3.png',
  'sticker-4.png',
  'sticker-5.png',
  'sticker-6.png',
  'sticker-7.png',
  'sticker-8.png',
  'sticker-9.png',
  'sticker-10.png',
  'sticker-11.png',
  'sticker-12.png',
  'tape-1.png',
  'tape-2.png',
  'tape-3.png',
  'tape-4-medium-up.png',
  'tape-5.png',
  'tape-6.png',
  'tape-7.png',
]

const stickerComponents = [
  ['sticker-2-red.tsx', 'sticker-2-red'],
  ['sticker-5.tsx', 'sticker-5'],
  ['sticker-10.tsx', 'sticker-10'],
]

const checks = [
  {
    name: 'curated official tape and sticker assets are available under public/_images',
    pass: requiredAssets.every((asset) => fs.existsSync(path.join(publicTapeAssetDir, asset))),
  },
  {
    name: 'tape asset registry exposes official sticker and tape variants',
    pass:
      tapeAssets.includes('export const tapeImageAssets') &&
      tapeAssets.includes('export function isTapeImageVariant') &&
      tapeAssets.includes("'sticker-2-red'") &&
      tapeAssets.includes("'sticker-12'") &&
      tapeAssets.includes("'tape-7'") &&
      tapeAssets.includes('tape-4-medium-up.png'),
  },
  {
    name: 'shared tape picture renderer centralizes responsive official image markup',
    pass:
      tapePicture.includes('export function TapePicture') &&
      tapePicture.includes('export function TapeResponsivePictures') &&
      tapePicture.includes('type="image/webp"') &&
      tapePicture.includes('srcSet={source.pngSrcSet}') &&
      tapePicture.includes('srcSet={desktopImage.webpSrcSet}'),
  },
  {
    name: 'Tape public variants are image-backed instead of hand-drawn SVG fallbacks',
    pass:
      tapeComponent.includes('TapePicture') &&
      tapeComponent.includes('export type TapeVariant = TapeImageVariant') &&
      !tapeComponent.includes('TapeUtilityVariant') &&
      !tapeComponent.includes('renderUtilitySvg') &&
      !tapeComponent.includes('<svg') &&
      !tapeComponent.includes('VALK') &&
      !tapeComponent.includes('ALERT!') &&
      !tapeComponent.includes("case 'tape-1'") &&
      !tapeComponent.includes("case 'tape-2'") &&
      !tapeComponent.includes("case 'tape-3'") &&
      !tapeComponent.includes("case 'sticker-8'") &&
      !tapeComponent.includes("case 'sticker-9'"),
  },
  {
    name: 'public sticker components render curated image assets instead of inline SVG drawings',
    pass: stickerComponents.every(([fileName, asset]) => {
      const source = fs.readFileSync(path.join(stickerDir, fileName), 'utf8')
      return (
        source.includes('StickerImage') &&
        source.includes(`asset="${asset}"`) &&
        !source.includes('<svg') &&
        !source.includes('<path') &&
        !source.includes('<polygon')
      )
    }),
  },
  {
    name: 'decorated card and media components consume the registry instead of hard-coded tape asset paths',
    pass:
      registryConsumers.includes('TapePicture') &&
      registryConsumers.includes('TapeResponsivePictures') &&
      registryConsumers.includes('MediaDecoration') &&
      !registryConsumers.includes('/_images/tape-assets/tape-2') &&
      !registryConsumers.includes('/_images/tape-assets/tape-3') &&
      !registryConsumers.includes('/_images/tape-assets/tape-5') &&
      !registryConsumers.includes('/_images/tape-assets/sticker-9') &&
      !registryConsumers.includes('/_images/tape-assets/sticker-10'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Tape image asset regression checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Tape image asset regression checks passed.')
