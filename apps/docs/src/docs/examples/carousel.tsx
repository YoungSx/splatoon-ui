'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Button } from 'splatoon-ui/button'
import {
  FeedCarousel,
  IconPaginatedCarousel,
  MarqueeCarousel,
  WeaponsGalleryCarousel,
} from 'splatoon-ui/carousel'

type CarouselExampleProps = {
  variant: 'feed' | 'marquee' | 'weapons' | 'icon'
}

const marqueeItems = [
  {
    id: 'social-1',
    image: '/_images/weapons/marquee/s3_weapons_social-1.jpg',
    alt: 'Ink weapon action shot',
  },
  {
    id: 'social-6',
    image: '/_images/weapons/marquee/s3_weapons_social-6.jpg',
    alt: 'Splatoon weapon showcase',
  },
  {
    id: 'social-13',
    image: '/_images/weapons/marquee/s3_weapons_social-13.jpg',
    alt: 'Weapon kit preview',
  },
]

const shopItems = [
  {
    id: 'hotlantis',
    title: 'Hotlantis',
    description: 'Sticker-heavy shop frame with icon pagination.',
    image: '/_images/weapons/shops-gallery/weapons-express-hotlantis-1.jpg',
    icon: '/_images/weapons/shops-gallery/harmony-icon.png',
    iconRotate: -7,
  },
  {
    id: 'ammo-knights',
    title: 'Ammo Knights',
    description: 'Focused product gallery with bounce motion.',
    image: '/_images/weapons/shops-gallery/weapons-express-ammo-knights-2.jpg',
    icon: '/_images/weapons/shops-gallery/sheldon-icon.png',
    iconRotate: 5,
  },
  {
    id: 'naut-couture',
    title: 'Naut Couture',
    description: 'Curated shop slide with framed media.',
    image: '/_images/weapons/shops-gallery/weapons-express-naut-couture-3.jpg',
    icon: '/_images/weapons/shops-gallery/jella-icon.png',
    iconRotate: -3,
  },
]

const feedItems = [
  {
    id: 'big-run',
    title: 'Big Run',
    subtitle: 'Event recap and reward status.',
    image: (
      <img
        className="block h-full w-full object-cover"
        src="/_images/events/big-run-callout.jpg"
        alt="Big Run event"
      />
    ),
    action: (
      <Button size="sm" variant="arrow">
        Read
      </Button>
    ),
    hoverTilt: true,
  },
  {
    id: 'splatnet',
    title: 'SplatNet',
    subtitle: 'News card with a stable media ratio.',
    image: (
      <img
        className="block h-full w-full object-cover"
        src="/_images/events/splatnet-blade.jpg"
        alt="SplatNet event"
      />
    ),
    action: (
      <Button size="sm" variant="arrow">
        Open
      </Button>
    ),
    hoverTilt: true,
  },
  {
    id: 'next-page',
    title: 'Rotation',
    subtitle: 'A stacked card carousel for feed surfaces.',
    image: (
      <img
        className="block h-full w-full object-cover"
        src="/_images/news/next-page.png"
        alt="News rotation"
      />
    ),
    action: (
      <Button size="sm" variant="arrow">
        View
      </Button>
    ),
    hoverTilt: true,
  },
]

export function CarouselExample({ variant }: CarouselExampleProps) {
  if (variant === 'feed') {
    return <FeedCarousel items={feedItems} className="w-full" />
  }

  if (variant === 'weapons') {
    return <WeaponsGalleryCarousel items={shopItems} className="w-full max-w-3xl" />
  }

  if (variant === 'icon') {
    return <IconPaginatedCarousel items={shopItems} className="w-full max-w-3xl" />
  }

  return <MarqueeCarousel items={marqueeItems} className="w-full max-w-3xl" />
}
// docs-source-end

export const carouselExample: DocsExampleDefinitionInput<CarouselExampleProps> = {
  id: 'carousel',
  title: 'Carousel',
  description: 'Switch between the production carousel variants shipped by Splatoon UI.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['feed', 'marquee', 'weapons', 'icon'],
      defaultValue: 'feed',
    },
  ],
  initialProps: { variant: 'feed' },
  Component: CarouselExample,
}
