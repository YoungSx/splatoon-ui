'use client'

import * as React from 'react'

import {
  Carousel,
  CarouselBleedBoundary,
  CarouselPagination,
  type CarouselProps,
} from '@/components/ui/carousel-core'
import {
  CardStackCarouselContent,
  CardStackCarouselItem,
  CardStackCarouselNext,
  CardStackCarouselPrevious,
  CardStackCarouselScene,
} from '@/components/ui/card-stack-carousel'
import { StapleCard, type StapleCardProps } from '@/components/ui/staple-card'
import { cn } from '@/lib/utils'

const DEFAULT_FEED_CAROUSEL_MEDIA_ASPECT_RATIO = '558 / 313'

export interface FeedCarouselItem extends Pick<
  StapleCardProps,
  'image' | 'title' | 'subtitle' | 'action' | 'surface' | 'showTape' | 'hoverTilt'
> {
  id: React.Key
  cardClassName?: string
}

export interface FeedCarouselProps extends Omit<CarouselProps, 'children'> {
  items: FeedCarouselItem[]
  mediaAspectRatio?: React.CSSProperties['aspectRatio'] | false
}

export function FeedCarousel({
  items,
  className,
  mediaAspectRatio = DEFAULT_FEED_CAROUSEL_MEDIA_ASPECT_RATIO,
  ...props
}: FeedCarouselProps) {
  return (
    <CarouselBleedBoundary>
      <Carousel itemCount={items.length} className={cn('max-w-none', className)} {...props}>
        <CardStackCarouselScene>
          <CardStackCarouselContent>
            {items.map((item, index) => (
              <CardStackCarouselItem key={item.id} data-index={index} itemLayout="feed">
                <StapleCard
                  className={item.cardClassName}
                  image={
                    mediaAspectRatio ? (
                      <span
                        data-slot="feed-carousel-media"
                        className="block w-full overflow-hidden"
                        style={{ aspectRatio: mediaAspectRatio }}
                      >
                        {item.image}
                      </span>
                    ) : (
                      item.image
                    )
                  }
                  title={item.title}
                  subtitle={item.subtitle}
                  action={item.action}
                  surface={item.surface}
                  showTape={item.showTape}
                  hoverTilt={item.hoverTilt}
                />
              </CardStackCarouselItem>
            ))}
          </CardStackCarouselContent>
          <CardStackCarouselPrevious />
          <CardStackCarouselNext />
          <CarouselPagination />
        </CardStackCarouselScene>
      </Carousel>
    </CarouselBleedBoundary>
  )
}
