import {
  resolveSplatoonAssetPath,
  type SplatoonAssetBasePath,
} from './assets'

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

interface TapeAssetSourceDefinition {
  fileName: string
  width: number
  height: number
}

interface TapeAssetDefinition extends TapeAssetSourceDefinition {
  desktop?: TapeAssetSourceDefinition
}

function definition(fileName: string, width: number, height: number): TapeAssetSourceDefinition {
  return { fileName, width, height }
}

function responsiveDefinition(
  fileName: string,
  width: number,
  height: number,
  desktopFileName: string,
  desktopWidth: number,
  desktopHeight: number
): TapeAssetDefinition {
  return {
    ...definition(fileName, width, height),
    desktop: definition(desktopFileName, desktopWidth, desktopHeight),
  }
}

const tapeImageAssetDefinitions = {
  'sticker-1': responsiveDefinition(
    'sticker-1.png',
    110,
    110,
    'sticker-1-medium-up.png',
    230,
    230
  ),
  'sticker-2-red': responsiveDefinition(
    'sticker-2-red.png',
    80,
    114,
    'sticker-2-red-medium-up.png',
    137,
    194
  ),
  'sticker-3': responsiveDefinition(
    'sticker-3.png',
    100,
    65,
    'sticker-3-medium-up.png',
    225,
    146
  ),
  'sticker-4': responsiveDefinition(
    'sticker-4.png',
    100,
    56,
    'sticker-4-medium-up.png',
    203,
    113
  ),
  'sticker-5': responsiveDefinition(
    'sticker-5.png',
    180,
    62,
    'sticker-5-medium-up.png',
    449,
    154
  ),
  'sticker-6': responsiveDefinition(
    'sticker-6.png',
    112,
    98,
    'sticker-6-medium-up.png',
    281,
    247
  ),
  'sticker-7': responsiveDefinition(
    'sticker-7.png',
    100,
    63,
    'sticker-7-medium-up.png',
    152,
    95
  ),
  'sticker-8': responsiveDefinition(
    'sticker-8.png',
    198,
    35,
    'sticker-8-medium-up.png',
    406,
    72
  ),
  'sticker-9': responsiveDefinition(
    'sticker-9.png',
    96,
    31,
    'sticker-9-medium-up.png',
    146,
    48
  ),
  'sticker-10': responsiveDefinition(
    'sticker-10.png',
    113,
    26,
    'sticker-10-medium-up.png',
    225,
    51
  ),
  'sticker-11': responsiveDefinition(
    'sticker-11.png',
    114,
    39,
    'sticker-11-medium-up.png',
    140,
    46
  ),
  'sticker-12': responsiveDefinition(
    'sticker-12.png',
    416,
    58,
    'sticker-12-medium-up.png',
    641,
    89
  ),
  'tape-1': definition('tape-1.png', 300, 68),
  'tape-2': responsiveDefinition('tape-2.png', 82, 36, 'tape-2-medium-up.png', 166, 74),
  'tape-3': responsiveDefinition('tape-3.png', 97, 38, 'tape-3-medium-up.png', 202, 78),
  'tape-4': definition('tape-4-medium-up.png', 120, 53),
  'tape-5': responsiveDefinition('tape-5.png', 140, 36, 'tape-5-medium-up.png', 276, 70),
  'tape-6': responsiveDefinition('tape-6.png', 103, 44, 'tape-6-medium-up.png', 187, 85),
  'tape-7': definition('tape-7.png', 539, 112),
} as const satisfies Record<string, TapeAssetDefinition>

export type TapeImageVariant = keyof typeof tapeImageAssetDefinitions

function source(
  definition: TapeAssetSourceDefinition,
  assetBasePath?: SplatoonAssetBasePath
): TapeAssetSource {
  const { fileName, width, height } = definition
  const extensionIndex = fileName.lastIndexOf('.')
  const basename = fileName.slice(0, extensionIndex)
  const extension = fileName.slice(extensionIndex)

  return {
    src: resolveSplatoonAssetPath(`tape-assets/${fileName}`, assetBasePath),
    pngSrcSet: `${resolveSplatoonAssetPath(
      `tape-assets/${basename}${extension}`,
      assetBasePath
    )} 1x, ${resolveSplatoonAssetPath(`tape-assets/${basename}-2x${extension}`, assetBasePath)} 2x`,
    webpSrcSet: `${resolveSplatoonAssetPath(
      `tape-assets/${basename}.webp`,
      assetBasePath
    )} 1x, ${resolveSplatoonAssetPath(`tape-assets/${basename}-2x.webp`, assetBasePath)} 2x`,
    width,
    height,
  }
}

function asset(definition: TapeAssetDefinition, assetBasePath?: SplatoonAssetBasePath): TapeAsset {
  return {
    ...source(definition, assetBasePath),
    ...(definition.desktop ? { desktop: source(definition.desktop, assetBasePath) } : {}),
  }
}

export function createTapeImageAssets(assetBasePath?: SplatoonAssetBasePath) {
  return Object.fromEntries(
    Object.entries(tapeImageAssetDefinitions).map(([key, definition]) => [
      key,
      asset(definition, assetBasePath),
    ])
  ) as Record<TapeImageVariant, TapeAsset>
}

export const tapeImageAssets = createTapeImageAssets()

export function getTapeImageAsset(
  variant: TapeImageVariant,
  assetBasePath?: SplatoonAssetBasePath
) {
  return asset(tapeImageAssetDefinitions[variant], assetBasePath)
}

export function isTapeImageVariant(value: string): value is TapeImageVariant {
  return Object.prototype.hasOwnProperty.call(tapeImageAssetDefinitions, value)
}
