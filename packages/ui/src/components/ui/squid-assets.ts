import { resolveSplatoonAssetPath, type SplatoonAssetBasePath } from './assets'

export interface SquidImageAsset {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

export interface SquidSpriteAsset extends SquidImageAsset {
  frameWidth: number
  frameHeight: number
  frames: number
  durationMs: number
  sourceUrl: string
}

export function createSquidImageAssets(assetBasePath?: SplatoonAssetBasePath) {
  return {
    loader: {
      id: 'loader-ika',
      src: resolveSplatoonAssetPath('squid/loader_ika.gif', assetBasePath),
      alt: 'Animated squid loading glyph',
      width: 516,
      height: 567,
    },
    mask: {
      id: 'ika',
      src: resolveSplatoonAssetPath('squid/ika.png', assetBasePath),
      alt: 'Squid mask reference artwork',
      width: 438,
      height: 481,
    },
  } satisfies Record<string, SquidImageAsset>
}

export function createSquidSpriteAssets(assetBasePath?: SplatoonAssetBasePath) {
  return {
    loaderMorph: {
      id: 'loader-morph-sprite',
      src: resolveSplatoonAssetPath('squid/loader-morph-sprite.png', assetBasePath),
      alt: 'Frame-animated morphing squid loader sprite',
      width: 8320,
      height: 130,
      frameWidth: 130,
      frameHeight: 130,
      frames: 64,
      durationMs: 8001,
      sourceUrl: 'https://www.spriters-resource.com/media/assets/180/182952.png?updated=1755487320',
    },
    loaderSwim: {
      id: 'loader-swim-sprite',
      src: resolveSplatoonAssetPath('squid/loader-swim-sprite.png', assetBasePath),
      alt: 'Frame-animated swimming squid loader sprite',
      width: 4030,
      height: 130,
      frameWidth: 130,
      frameHeight: 130,
      frames: 31,
      durationMs: 6201,
      sourceUrl: 'https://www.spriters-resource.com/media/assets/180/182953.png?updated=1755487320',
    },
  } satisfies Record<string, SquidSpriteAsset>
}

export const squidImageAssets = createSquidImageAssets()
export const squidSpriteAssets = createSquidSpriteAssets()
