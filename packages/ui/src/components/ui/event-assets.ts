import { resolveSplatoonAssetPath, type SplatoonAssetBasePath } from './assets'

export interface EventImageAsset {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

export function createEventImageAssets(assetBasePath?: SplatoonAssetBasePath) {
  return {
    bigRunCallout: {
      id: 'big-run-callout',
      src: resolveSplatoonAssetPath('events/big-run-callout.jpg', assetBasePath),
      alt: 'Event callout reference screenshot',
      width: 382,
      height: 215,
    },
    goldenEgg: {
      id: 'golden-egg',
      src: resolveSplatoonAssetPath('events/golden-egg.png', assetBasePath),
      alt: 'Golden egg reference icon',
      width: 52,
      height: 46,
    },
    splatnetBlade: {
      id: 'splatnet-blade',
      src: resolveSplatoonAssetPath('events/splatnet-blade.jpg', assetBasePath),
      alt: 'Stage event reference artwork',
      width: 558,
      height: 313,
    },
    splatnetNextPage: {
      id: 'splatnet-next-page',
      src: resolveSplatoonAssetPath('events/splatnet-next-page.png', assetBasePath),
      alt: 'Graffiti event panel background',
      width: 342,
      height: 221,
    },
  } satisfies Record<string, EventImageAsset>
}

export const eventImageAssets = createEventImageAssets()
