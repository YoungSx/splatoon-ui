const EVENT_ASSET_BASE = '/_images/events'

export interface EventImageAsset {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

export const eventImageAssets = {
  bigRunCallout: {
    id: 'big-run-callout',
    src: `${EVENT_ASSET_BASE}/big-run-callout.jpg`,
    alt: 'Event callout reference screenshot',
    width: 382,
    height: 215,
  },
  goldenEgg: {
    id: 'golden-egg',
    src: `${EVENT_ASSET_BASE}/golden-egg.png`,
    alt: 'Golden egg reference icon',
    width: 52,
    height: 46,
  },
  splatnetBlade: {
    id: 'splatnet-blade',
    src: `${EVENT_ASSET_BASE}/splatnet-blade.jpg`,
    alt: 'Stage event reference artwork',
    width: 558,
    height: 313,
  },
  splatnetNextPage: {
    id: 'splatnet-next-page',
    src: `${EVENT_ASSET_BASE}/splatnet-next-page.png`,
    alt: 'Graffiti event panel background',
    width: 342,
    height: 221,
  },
} satisfies Record<string, EventImageAsset>
