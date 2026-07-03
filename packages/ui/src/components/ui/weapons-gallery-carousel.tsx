'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselPagination,
  CarouselViewport,
  FadeCarouselItem,
  SwipeableGallery,
  useCarouselItemState,
} from '@/components/ui/carousel'
import { GalleryControls } from './gallery-controls'
import { PhotoFrame } from './photo-frame'
import baseStyles from './gallery-base.module.css'
import styles from './weapons-gallery-carousel.module.css'
import type { GalleryItem } from './marquee-carousel'

export interface WeaponsGalleryCarouselItem extends GalleryItem {
  title: string
  description?: string
}

export interface WeaponsGalleryCarouselProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Carousel>,
  'children'
> {
  items: WeaponsGalleryCarouselItem[]
}

export function WeaponsGalleryCarousel({
  items,
  className,
  ...props
}: WeaponsGalleryCarouselProps) {
  return (
    <Carousel
      itemCount={items.length}
      className={cn(baseStyles.galleryWrapper, styles.galleryWrapper, className)}
      {...props}
    >
      <CarouselViewport>
        <SwipeableGallery>
          <CarouselContent className={baseStyles.gallery}>
            {items.map((item, index) => (
              <WeaponsGalleryItem key={item.id} data-index={index} item={item} />
            ))}
          </CarouselContent>
        </SwipeableGallery>
      </CarouselViewport>
      <GalleryControls
        className={styles.galleryControls}
        wrapButton={(direction, button) => <div>{button}</div>}
      />
      <CarouselPagination className={styles.galleryPagination} />
    </Carousel>
  )
}

interface WeaponsGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: WeaponsGalleryCarouselItem
  'data-index'?: number
}

function WeaponsGalleryItem({
  ref,
  className,
  item,
  'data-index': index = 0,
  ...props
}: WeaponsGalleryItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { isActive } = useCarouselItemState(index)

  return (
    <FadeCarouselItem
      ref={ref}
      data-index={index}
      rotateAmount={2}
      className={cn(baseStyles.galleryItem, isActive && baseStyles.galleryItemActive, className)}
      {...props}
    >
      <div className={cn(baseStyles.galleryContentFade, styles.itemLayout)}>
        <PhotoFrame
          variant="c"
          src={item.image}
          alt={item.title}
          className={cn(baseStyles.galleryFrame, styles.photoFrame)}
        />
        <div className={cn(baseStyles.galleryContentFade, styles.galleryContent)}>
          <h3 className="color-primary">{item.title}</h3>
          {item.description && <p>{item.description}</p>}
        </div>
      </div>
    </FadeCarouselItem>
  )
}
