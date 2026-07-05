'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselPagination,
  CarouselSwipeArea,
  CarouselViewport,
  type CarouselProps,
  FadeCarouselItem,
  useCarouselItemState,
} from '@/components/ui/carousel-core'
import { GalleryControls } from './gallery-controls'
import { PhotoFrame } from './photo-frame'
import baseStyles from './gallery-base.module.css'
import styles from './marquee-carousel.module.css'

export interface GalleryItem {
  id: React.Key
  image: string
  className?: string
}

export interface MarqueeCarouselItem extends GalleryItem {
  alt?: string
}

export interface MarqueeCarouselProps extends Omit<CarouselProps, 'children'> {
  items: MarqueeCarouselItem[]
  pagination?: React.ReactNode
  renderItem?: (item: MarqueeCarouselItem, index: number) => React.ReactNode
}

export function MarqueeCarousel({
  items,
  className,
  pagination,
  renderItem,
  ...props
}: MarqueeCarouselProps) {
  return (
    <Carousel
      itemCount={items.length}
      className={cn(baseStyles.galleryWrapper, className)}
      {...props}
    >
      <CarouselViewport>
        <CarouselSwipeArea>
          <CarouselContent className={baseStyles.gallery}>
            {items.map((item, index) =>
              renderItem ? (
                renderItem(item, index)
              ) : (
                <MarqueeGalleryItem key={item.id} data-index={index} item={item} />
              )
            )}
          </CarouselContent>
        </CarouselSwipeArea>
      </CarouselViewport>
      <GalleryControls />
      {pagination ?? <CarouselPagination />}
    </Carousel>
  )
}

export interface MarqueeGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: MarqueeCarouselItem
  'data-index'?: number
  ref?: React.Ref<HTMLDivElement>
}

export function MarqueeGalleryItem({
  ref,
  className,
  item,
  'data-index': index = 0,
  ...props
}: MarqueeGalleryItemProps) {
  const { isActive } = useCarouselItemState(index)

  return (
    <FadeCarouselItem
      ref={ref}
      data-index={index}
      rotateAmount={3}
      className={cn(baseStyles.galleryItem, isActive && baseStyles.galleryItemActive, className)}
      {...props}
    >
      <PhotoFrame
        variant="b"
        src={item.image}
        alt={item.alt || ''}
        className={cn(baseStyles.galleryFrame, styles.photoFrame)}
      />
    </FadeCarouselItem>
  )
}
