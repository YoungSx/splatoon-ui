const SQUID_ASSET_BASE = '/_images/squid'

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

export const squidImageAssets = {
  loader: {
    id: 'loader-ika',
    src: `${SQUID_ASSET_BASE}/loader_ika.gif`,
    alt: 'Animated squid loading glyph',
    width: 516,
    height: 567,
  },
  mask: {
    id: 'ika',
    src: `${SQUID_ASSET_BASE}/ika.png`,
    alt: 'Squid mask reference artwork',
    width: 438,
    height: 481,
  },
} satisfies Record<string, SquidImageAsset>

export const squidSpriteAssets = {
  loaderMorph: {
    id: 'loader-morph-sprite',
    src: `${SQUID_ASSET_BASE}/loader-morph-sprite.png`,
    alt: 'Frame-animated morphing squid loader sprite',
    width: 8320,
    height: 130,
    frameWidth: 130,
    frameHeight: 130,
    frames: 64,
    durationMs: 2667,
    sourceUrl:
      'https://www.spriters-resource.com/media/assets/180/182952.png?updated=1755487320',
  },
  loaderSwim: {
    id: 'loader-swim-sprite',
    src: `${SQUID_ASSET_BASE}/loader-swim-sprite.png`,
    alt: 'Frame-animated swimming squid loader sprite',
    width: 4030,
    height: 130,
    frameWidth: 130,
    frameHeight: 130,
    frames: 31,
    durationMs: 2067,
    sourceUrl:
      'https://www.spriters-resource.com/media/assets/180/182953.png?updated=1755487320',
  },
} satisfies Record<string, SquidSpriteAsset>
