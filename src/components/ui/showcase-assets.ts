export interface ShowcaseImageAsset {
  src: string
  alt: string
  width: number
  height: number
}

export const showcaseMediaAssets = {
  trailerThumbnail: {
    src: '/_images/screenshots/video-trailer.jpg',
    alt: 'Splatoon UI media dialog preview',
    width: 748,
    height: 421,
  },
  fullscreenPreview: {
    src: '/_images/gameplay/battle-online/gameplay-battle-online-anarchy-1.jpg',
    alt: 'Fullscreen media dialog reference artwork',
    width: 658,
    height: 370,
  },
  ruggedLookbook: {
    src: '/_images/home/s3-home-intro-blade.jpg',
    alt: 'Rugged card lookbook reference artwork',
    width: 558,
    height: 313,
  },
  ruggedMode: {
    src: '/_images/gameplay/gameplay-salmonrun.jpg',
    alt: 'Rugged card mode reference artwork',
    width: 558,
    height: 313,
  },
  ruggedScene: {
    src: '/_images/gameplay/splatfest/gameplay-splatfest-1.jpg',
    alt: 'Rugged card scene reference artwork',
    width: 558,
    height: 313,
  },
  homeHeader: {
    src: '/_images/home/header-back.jpg',
    alt: 'Home header background reference artwork',
    width: 901,
    height: 1151,
  },
  homeCharacter: {
    src: '/_images/home/character.png',
    alt: 'Home character reference artwork',
    width: 1193,
    height: 767,
  },
  turfWarLeft: {
    src: '/_images/gameplay/battle-online/gameplay-battle-online-turfwar-left-screen.jpg',
    alt: 'Turf war left screen reference artwork',
    width: 658,
    height: 370,
  },
  turfWarRight: {
    src: '/_images/gameplay/battle-online/gameplay-battle-online-turfwar-right-screen.jpg',
    alt: 'Turf war right screen reference artwork',
    width: 658,
    height: 370,
  },
  splatfestSecondary: {
    src: '/_images/gameplay/splatfest/gameplay-splatfest-2.jpg',
    alt: 'Splatfest secondary reference artwork',
    width: 558,
    height: 313,
  },
} satisfies Record<string, ShowcaseImageAsset>
