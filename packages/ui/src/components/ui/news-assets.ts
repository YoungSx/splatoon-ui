export interface NewsImageAsset {
  src: string
  width: number
  height: number
}

export const newsStapleAssets = {
  left: {
    src: '/_images/news/news-staple-left.png',
    width: 75,
    height: 48,
  },
  right: {
    src: '/_images/news/news-staple-right.png',
    width: 45,
    height: 17,
  },
} satisfies Record<string, NewsImageAsset>
