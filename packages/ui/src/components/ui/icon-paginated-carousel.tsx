'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  CarouselImagePagination,
  FadeCarouselItem,
  useCarouselItemState,
} from '@/components/ui/carousel-core'
import { GalleryBounce } from './gallery-controls'
import { PhotoFrame } from './photo-frame'
import baseStyles from './gallery-base.module.css'
import { MarqueeCarousel } from './marquee-carousel'
import styles from './icon-paginated-carousel.module.css'
import type { GalleryItem, MarqueeCarouselProps } from './marquee-carousel'

export interface IconPaginatedCarouselItem extends GalleryItem {
  title: string
  description?: string
  icon: string
  iconRotate?: number
}

export interface IconPaginatedCarouselProps extends Omit<
  MarqueeCarouselProps,
  'items' | 'pagination' | 'renderItem'
> {
  items: IconPaginatedCarouselItem[]
}

export function IconPaginatedCarousel({
  items,
  className,
  assetBasePath,
  ...props
}: IconPaginatedCarouselProps) {
  return (
    <MarqueeCarousel
      {...props}
      items={items}
      className={className}
      assetBasePath={assetBasePath}
      pagination={
        <CarouselImagePagination
          className={styles.imagePagination}
          assetBasePath={assetBasePath}
          images={items.map((item) => ({
            src: item.icon,
            alt: item.title,
            rotate: item.iconRotate ?? 0,
          }))}
        />
      }
      renderItem={(item, index) => (
        <IconPaginatedGalleryItem
          key={item.id}
          data-index={index}
          item={item as IconPaginatedCarouselItem}
          assetBasePath={assetBasePath}
        />
      )}
    />
  )
}

interface IconPaginatedGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: IconPaginatedCarouselItem
  'data-index'?: number
  assetBasePath?: IconPaginatedCarouselProps['assetBasePath']
  ref?: React.Ref<HTMLDivElement>
}

function IconPaginatedGalleryItem({
  ref,
  className,
  item,
  'data-index': index = 0,
  assetBasePath,
  ...props
}: IconPaginatedGalleryItemProps) {
  const { isActive } = useCarouselItemState(index)

  return (
    <FadeCarouselItem
      ref={ref}
      data-index={index}
      rotateAmount={3}
      className={cn(baseStyles.galleryItem, isActive && baseStyles.galleryItemActive, className)}
      {...props}
    >
      <div className={cn(baseStyles.galleryContentFade, styles.galleryItemContent)}>
        <GalleryBounce className={styles.galleryBounce}>
          <PhotoFrame
            variant="d"
            src={item.image}
            alt={item.title}
            assetBasePath={assetBasePath}
            className={cn(baseStyles.galleryFrame, styles.photoFrame)}
          />
        </GalleryBounce>
        <div className={cn(baseStyles.galleryContentFade, styles.galleryItemText)}>
          <h3 className="text-xl font-black tracking-wider">{item.title}</h3>
          {item.description && (
            <p className="text-chaos-black/60 text-sm font-medium">{item.description}</p>
          )}
        </div>
      </div>
    </FadeCarouselItem>
  )
}
