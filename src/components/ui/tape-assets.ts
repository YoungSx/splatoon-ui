const TAPE_ASSET_BASE = '/_images/tape-assets'

export interface TapeAssetSource {
  src: string
  pngSrcSet?: string
  webpSrcSet?: string
  width: number
  height: number
}

export interface TapeAsset extends TapeAssetSource {
  desktop?: TapeAssetSource
}

function source(fileName: string, width: number, height: number): TapeAssetSource {
  const path = `${TAPE_ASSET_BASE}/${fileName}`
  const extensionIndex = fileName.lastIndexOf('.')
  const basename = fileName.slice(0, extensionIndex)
  const extension = fileName.slice(extensionIndex)

  return {
    src: path,
    pngSrcSet: `${TAPE_ASSET_BASE}/${basename}${extension} 1x, ${TAPE_ASSET_BASE}/${basename}-2x${extension} 2x`,
    webpSrcSet: `${TAPE_ASSET_BASE}/${basename}.webp 1x, ${TAPE_ASSET_BASE}/${basename}-2x.webp 2x`,
    width,
    height,
  }
}

function responsiveAsset(
  fileName: string,
  width: number,
  height: number,
  desktopFileName: string,
  desktopWidth: number,
  desktopHeight: number
): TapeAsset {
  return {
    ...source(fileName, width, height),
    desktop: source(desktopFileName, desktopWidth, desktopHeight),
  }
}

const tapeImageAssetDefinitions = {
  'sticker-1': responsiveAsset('sticker-1.png', 110, 110, 'sticker-1-medium-up.png', 230, 230),
  'sticker-2-red': responsiveAsset(
    'sticker-2-red.png',
    80,
    114,
    'sticker-2-red-medium-up.png',
    137,
    194
  ),
  'sticker-3': responsiveAsset('sticker-3.png', 100, 65, 'sticker-3-medium-up.png', 225, 146),
  'sticker-4': responsiveAsset('sticker-4.png', 100, 56, 'sticker-4-medium-up.png', 203, 113),
  'sticker-5': responsiveAsset('sticker-5.png', 180, 62, 'sticker-5-medium-up.png', 449, 154),
  'sticker-6': responsiveAsset('sticker-6.png', 112, 98, 'sticker-6-medium-up.png', 281, 247),
  'sticker-7': responsiveAsset('sticker-7.png', 100, 63, 'sticker-7-medium-up.png', 152, 95),
  'sticker-8': responsiveAsset('sticker-8.png', 198, 35, 'sticker-8-medium-up.png', 406, 72),
  'sticker-9': responsiveAsset('sticker-9.png', 96, 31, 'sticker-9-medium-up.png', 146, 48),
  'sticker-10': responsiveAsset('sticker-10.png', 113, 26, 'sticker-10-medium-up.png', 225, 51),
  'sticker-11': responsiveAsset('sticker-11.png', 114, 39, 'sticker-11-medium-up.png', 140, 46),
  'sticker-12': responsiveAsset('sticker-12.png', 416, 58, 'sticker-12-medium-up.png', 641, 89),
  'tape-1': {
    src: `${TAPE_ASSET_BASE}/tape-1.png`,
    width: 300,
    height: 68,
  },
  'tape-2': responsiveAsset('tape-2.png', 82, 36, 'tape-2-medium-up.png', 166, 74),
  'tape-3': responsiveAsset('tape-3.png', 97, 38, 'tape-3-medium-up.png', 202, 78),
  'tape-4': source('tape-4-medium-up.png', 120, 53),
  'tape-5': responsiveAsset('tape-5.png', 140, 36, 'tape-5-medium-up.png', 276, 70),
  'tape-6': responsiveAsset('tape-6.png', 103, 44, 'tape-6-medium-up.png', 187, 85),
  'tape-7': source('tape-7.png', 539, 112),
} satisfies Record<string, TapeAsset>

export type TapeImageVariant = keyof typeof tapeImageAssetDefinitions
export const tapeImageAssets: Record<TapeImageVariant, TapeAsset> = tapeImageAssetDefinitions

export function isTapeImageVariant(value: string): value is TapeImageVariant {
  return Object.prototype.hasOwnProperty.call(tapeImageAssets, value)
}
