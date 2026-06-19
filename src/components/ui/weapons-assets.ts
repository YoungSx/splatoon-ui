const WEAPONS_ASSET_BASE = '/_images/weapons'

export interface WeaponGalleryAsset {
  id: string
  image: string
  alt: string
  title: string
  description?: string
}

export interface WeaponShopGalleryAsset extends WeaponGalleryAsset {
  icon: string
  iconRotate?: number
}

export interface WeaponMarqueeAsset {
  id: string
  image: string
  alt: string
}

const weaponMarqueeSources = Array.from({ length: 22 }, (_, index) => {
  const item = index + 1
  return {
    id: `weapon-reference-${item}`,
    image: `${WEAPONS_ASSET_BASE}/marquee/s3_weapons_social-${item}.jpg`,
    alt: `Weapon reference artwork ${item}`,
  }
}) satisfies WeaponMarqueeAsset[]

export const weaponShowcaseItems = weaponMarqueeSources.slice(0, 6).map((asset, index) => ({
  ...asset,
  id: `loadout-panel-${index + 1}`,
  title: `Loadout Panel ${index + 1}`,
  description: [
    'Carousel frame using curated weapon reference artwork.',
    'Rotated media shell with curated source imagery.',
    'High-contrast gallery card for dense media pages.',
    'Responsive photo frame with tape and sticker accents.',
    'Sequential carousel state with fixed image rhythm.',
    'Reusable feature card for component-heavy sections.',
  ][index],
})) satisfies WeaponGalleryAsset[]

export const weaponShopGalleryItems = [
  {
    id: 'reference-shop-1',
    image: `${WEAPONS_ASSET_BASE}/shops-gallery/weapons-express-hotlantis-1.jpg`,
    icon: `${WEAPONS_ASSET_BASE}/shops-gallery/harmony-icon.png`,
    iconRotate: -14,
    alt: 'Shop reference artwork 1',
    title: 'Media Kit',
    description: 'Frames, carousels, and gallery controls for image-heavy layouts.',
  },
  {
    id: 'reference-shop-2',
    image: `${WEAPONS_ASSET_BASE}/shops-gallery/weapons-express-ammo-knights-2.jpg`,
    icon: `${WEAPONS_ASSET_BASE}/shops-gallery/sheldon-icon.png`,
    iconRotate: -38,
    alt: 'Shop reference artwork 2',
    title: 'Control Kit',
    description: 'Buttons, pagination, and navigation controls with bold silhouettes.',
  },
  {
    id: 'reference-shop-3',
    image: `${WEAPONS_ASSET_BASE}/shops-gallery/weapons-express-naut-couture-3.jpg`,
    icon: `${WEAPONS_ASSET_BASE}/shops-gallery/jella-icon.png`,
    iconRotate: -43,
    alt: 'Shop reference artwork 3',
    title: 'Surface Kit',
    description: 'Cards, tags, torn-paper surfaces, and layered content panels.',
  },
  {
    id: 'reference-shop-4',
    image: `${WEAPONS_ASSET_BASE}/shops-gallery/weapons-express-manoward-4.jpg`,
    icon: `${WEAPONS_ASSET_BASE}/shops-gallery/coco-icon.png`,
    iconRotate: 25,
    alt: 'Shop reference artwork 4',
    title: 'Overlay Kit',
    description: 'Dialogs, sheets, popovers, and full-screen media flows.',
  },
  {
    id: 'reference-shop-5',
    image: `${WEAPONS_ASSET_BASE}/shops-gallery/weapons-express-crush-station-5.jpg`,
    icon: `${WEAPONS_ASSET_BASE}/shops-gallery/eddy-icon.png`,
    iconRotate: 11,
    alt: 'Shop reference artwork 5',
    title: 'Feedback Kit',
    description: 'Alerts, progress indicators, loaders, and stateful UI feedback.',
  },
] satisfies WeaponShopGalleryAsset[]

export const weaponMarqueeItems = weaponMarqueeSources satisfies WeaponMarqueeAsset[]
