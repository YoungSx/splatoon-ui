import { resolveSplatoonAssetPath, type SplatoonAssetBasePath } from './assets'

export interface CharacterImageAsset {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

function characterAssetSrc(path: string, assetBasePath?: SplatoonAssetBasePath) {
  return resolveSplatoonAssetPath(`characters/${path}`, assetBasePath)
}

export function createCharacterImageAssets(assetBasePath?: SplatoonAssetBasePath) {
  return {
    inkling: {
      id: 'inkling',
      src: characterAssetSrc('char-8.png', assetBasePath),
      alt: 'Inkling character reference artwork',
      width: 421,
      height: 451,
    },
    octoling: {
      id: 'octoling',
      src: characterAssetSrc('char-10.png', assetBasePath),
      alt: 'Octoling character reference artwork',
      width: 425,
      height: 461,
    },
    salmonid: {
      id: 'salmonid',
      src: characterAssetSrc('salmonid.png', assetBasePath),
      alt: 'Salmonid character reference artwork',
      width: 331,
      height: 405,
    },
    gamePack: {
      id: 'game-pack',
      src: characterAssetSrc('game-pack.png', assetBasePath),
      alt: 'Game pack reference artwork',
      width: 150,
      height: 243,
    },
    char2: {
      id: 'char-2',
      src: characterAssetSrc('char-2.png', assetBasePath),
      alt: 'Character reference artwork 2',
      width: 261,
      height: 220,
    },
    char3: {
      id: 'char-3',
      src: characterAssetSrc('char-3.png', assetBasePath),
      alt: 'Character reference artwork 3',
      width: 207,
      height: 238,
    },
    char4: {
      id: 'char-4',
      src: characterAssetSrc('char-4.png', assetBasePath),
      alt: 'Character reference artwork 4',
      width: 515,
      height: 390,
    },
    char5: {
      id: 'char-5',
      src: characterAssetSrc('char-5.png', assetBasePath),
      alt: 'Character reference artwork 5',
      width: 295,
      height: 104,
    },
    char7: {
      id: 'char-7',
      src: characterAssetSrc('char-7.png', assetBasePath),
      alt: 'Character reference artwork 7',
      width: 343,
      height: 300,
    },
    char11: {
      id: 'char-11',
      src: characterAssetSrc('char-11.png', assetBasePath),
      alt: 'Character reference artwork 11',
      width: 346,
      height: 507,
    },
    char12: {
      id: 'char-12',
      src: characterAssetSrc('char-12.png', assetBasePath),
      alt: 'Character reference artwork 12',
      width: 375,
      height: 303,
    },
    char13: {
      id: 'char-13',
      src: characterAssetSrc('char-13.png', assetBasePath),
      alt: 'Character reference artwork 13',
      width: 607,
      height: 555,
    },
    char14: {
      id: 'char-14',
      src: characterAssetSrc('char-14.png', assetBasePath),
      alt: 'Character reference artwork 14',
      width: 858,
      height: 430,
    },
    char15: {
      id: 'char-15',
      src: characterAssetSrc('char-15.png', assetBasePath),
      alt: 'Character reference artwork 15',
      width: 570,
      height: 188,
    },
    char17: {
      id: 'char-17',
      src: characterAssetSrc('char-17.png', assetBasePath),
      alt: 'Character reference artwork 17',
      width: 450,
      height: 276,
    },
    char18: {
      id: 'char-18',
      src: characterAssetSrc('char-18.png', assetBasePath),
      alt: 'Character reference artwork 18',
      width: 343,
      height: 310,
    },
  } satisfies Record<string, CharacterImageAsset>
}

export const characterImageAssets = createCharacterImageAssets()

export function createPageTransitionCharacterAssets(assetBasePath?: SplatoonAssetBasePath) {
  const assets = createCharacterImageAssets(assetBasePath)

  return {
    home: assets.inkling,
    about: assets.octoling,
    weapons: assets.salmonid,
  } as const
}

export const pageTransitionCharacterAssets = createPageTransitionCharacterAssets()
