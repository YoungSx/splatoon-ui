const CHARACTER_ASSET_BASE = '/_images/characters'

export interface CharacterImageAsset {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

export const characterImageAssets = {
  inkling: {
    id: 'inkling',
    src: `${CHARACTER_ASSET_BASE}/char-8.png`,
    alt: 'Inkling character reference artwork',
    width: 421,
    height: 451,
  },
  octoling: {
    id: 'octoling',
    src: `${CHARACTER_ASSET_BASE}/char-10.png`,
    alt: 'Octoling character reference artwork',
    width: 425,
    height: 461,
  },
  salmonid: {
    id: 'salmonid',
    src: `${CHARACTER_ASSET_BASE}/salmonid.png`,
    alt: 'Salmonid character reference artwork',
    width: 331,
    height: 405,
  },
  gamePack: {
    id: 'game-pack',
    src: `${CHARACTER_ASSET_BASE}/game-pack.png`,
    alt: 'Game pack reference artwork',
    width: 150,
    height: 243,
  },
  char2: {
    id: 'char-2',
    src: `${CHARACTER_ASSET_BASE}/char-2.png`,
    alt: 'Character reference artwork 2',
    width: 261,
    height: 220,
  },
  char3: {
    id: 'char-3',
    src: `${CHARACTER_ASSET_BASE}/char-3.png`,
    alt: 'Character reference artwork 3',
    width: 207,
    height: 238,
  },
  char4: {
    id: 'char-4',
    src: `${CHARACTER_ASSET_BASE}/char-4.png`,
    alt: 'Character reference artwork 4',
    width: 515,
    height: 390,
  },
  char5: {
    id: 'char-5',
    src: `${CHARACTER_ASSET_BASE}/char-5.png`,
    alt: 'Character reference artwork 5',
    width: 295,
    height: 104,
  },
  char7: {
    id: 'char-7',
    src: `${CHARACTER_ASSET_BASE}/char-7.png`,
    alt: 'Character reference artwork 7',
    width: 343,
    height: 300,
  },
  char11: {
    id: 'char-11',
    src: `${CHARACTER_ASSET_BASE}/char-11.png`,
    alt: 'Character reference artwork 11',
    width: 346,
    height: 507,
  },
  char12: {
    id: 'char-12',
    src: `${CHARACTER_ASSET_BASE}/char-12.png`,
    alt: 'Character reference artwork 12',
    width: 375,
    height: 303,
  },
  char13: {
    id: 'char-13',
    src: `${CHARACTER_ASSET_BASE}/char-13.png`,
    alt: 'Character reference artwork 13',
    width: 607,
    height: 555,
  },
  char14: {
    id: 'char-14',
    src: `${CHARACTER_ASSET_BASE}/char-14.png`,
    alt: 'Character reference artwork 14',
    width: 858,
    height: 430,
  },
  char15: {
    id: 'char-15',
    src: `${CHARACTER_ASSET_BASE}/char-15.png`,
    alt: 'Character reference artwork 15',
    width: 570,
    height: 188,
  },
  char17: {
    id: 'char-17',
    src: `${CHARACTER_ASSET_BASE}/char-17.png`,
    alt: 'Character reference artwork 17',
    width: 450,
    height: 276,
  },
  char18: {
    id: 'char-18',
    src: `${CHARACTER_ASSET_BASE}/char-18.png`,
    alt: 'Character reference artwork 18',
    width: 343,
    height: 310,
  },
} satisfies Record<string, CharacterImageAsset>

export const pageTransitionCharacterAssets = {
  home: characterImageAssets.inkling,
  about: characterImageAssets.octoling,
  weapons: characterImageAssets.salmonid,
} as const
