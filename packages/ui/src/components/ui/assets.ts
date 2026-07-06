export const SPLATOON_UI_DEFAULT_ASSET_BASE_PATH = '/_images'

export type SplatoonAssetBasePath = string

export interface SplatoonAssetPathOptions {
  assetBasePath?: SplatoonAssetBasePath
}

export interface SplatoonAssetImageCandidate {
  path: string
  descriptor?: string
  type?: string
}

const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i

function stripImageRoot(path: string) {
  return path.replace(/^\/?_images\/?/, '')
}

function trimSlashes(path: string) {
  return path.replace(/^\/+|\/+$/g, '')
}

function escapeCssUrl(url: string) {
  return url.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export function resolveSplatoonAssetPath(
  path: string,
  assetBasePath: SplatoonAssetBasePath = SPLATOON_UI_DEFAULT_ASSET_BASE_PATH
) {
  if (ABSOLUTE_URL_PATTERN.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }

  const relativePath = stripImageRoot(path)
  const basePath = assetBasePath || ''

  if (!basePath) {
    return `/${trimSlashes(relativePath)}`
  }

  return `${basePath.replace(/\/+$/g, '')}/${relativePath.replace(/^\/+/g, '')}`
}

export function splatoonAssetUrl(
  path: string,
  assetBasePath: SplatoonAssetBasePath = SPLATOON_UI_DEFAULT_ASSET_BASE_PATH
) {
  return `url("${escapeCssUrl(resolveSplatoonAssetPath(path, assetBasePath))}")`
}

export function splatoonAssetImageSet(
  candidates: readonly SplatoonAssetImageCandidate[],
  assetBasePath: SplatoonAssetBasePath = SPLATOON_UI_DEFAULT_ASSET_BASE_PATH
) {
  return `image-set(${candidates
    .map(({ path, descriptor = '1x', type }) => {
      const typeHint = type ? ` type("${type}")` : ''
      return `${splatoonAssetUrl(path, assetBasePath)}${typeHint} ${descriptor}`
    })
    .join(', ')})`
}
