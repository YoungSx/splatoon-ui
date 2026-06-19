const SQUID_ASSET_BASE = '/_images/squid'

export interface SquidImageAsset {
  id: string
  src: string
  alt: string
  width: number
  height: number
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
