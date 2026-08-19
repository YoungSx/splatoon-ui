import { resolveSplatoonAssetPath, type SplatoonAssetBasePath } from './assets'

export interface NewsImageAsset {
  src: string
  width: number
  height: number
}

export function createNewsStapleAssets(assetBasePath?: SplatoonAssetBasePath) {
  return {
    left: {
      src: resolveSplatoonAssetPath('news/news-staple-left.png', assetBasePath),
      width: 75,
      height: 48,
    },
    right: {
      src: resolveSplatoonAssetPath('news/news-staple-right.png', assetBasePath),
      width: 45,
      height: 17,
    },
  } satisfies Record<string, NewsImageAsset>
}

export const newsStapleAssets = createNewsStapleAssets()
