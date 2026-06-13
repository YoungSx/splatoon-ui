"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CarouselImagePagination, FadeCarouselItem, useCarouselItemState } from "@/components/ui/carousel"
import { GalleryBounce, GalleryControls, GalleryTapeDecoration } from "./gallery-controls"
import baseStyles from "./gallery-base.module.css"
import { MarqueeCarousel } from "./marquee-carousel"
import styles from "./shops-gallery-carousel.module.css"
import marqueeStyles from "./marquee-carousel.module.css"
import type { GalleryItem } from "./marquee-carousel"

export interface ShopsGalleryCarouselItem extends GalleryItem {
  title: string
  description?: string
  icon: string
  iconRotate?: number
}

export interface ShopsGalleryCarouselProps extends React.ComponentPropsWithoutRef<typeof MarqueeCarousel> {
  items: ShopsGalleryCarouselItem[]
}

export function ShopsGalleryCarousel({ items, className, ...props }: ShopsGalleryCarouselProps) {
  return (
    <MarqueeCarousel
      items={items}
      className={className}
      pagination={
        <CarouselImagePagination
          className={styles.imagePagination}
          images={items.map(item => ({ src: item.icon, alt: item.title, rotate: item.iconRotate ?? 0 }))}
        />
      }
      renderItem={(item, index) => (
        <ShopsGalleryItem key={item.id} data-index={index} item={item as ShopsGalleryCarouselItem} />
      )}
      {...props}
    />
  )
}

interface ShopsGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ShopsGalleryCarouselItem
  "data-index"?: number
}

function ShopsGalleryItem({
  ref,
  className,
  item,
  "data-index": index = 0,
  ...props
}: ShopsGalleryItemProps & { ref?: React.Ref<HTMLDivElement> }) {
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
            <div className={cn(baseStyles.photoFrame, styles.photoFrame)}>
              <GalleryTapeDecoration />
              <div className={cn(baseStyles.photoImage, marqueeStyles.photoImage)}>
                <img src={item.image} alt={item.title} />
              </div>
            </div>
          </GalleryBounce>
          <div className={cn(baseStyles.galleryContentFade, styles.galleryItemText)}>
            <h3 className="text-xl font-black uppercase tracking-wider">{item.title}</h3>
            {item.description && (
              <p className="text-sm font-medium text-chaos-black/60">{item.description}</p>
            )}
          </div>
        </div>
      </FadeCarouselItem>
    )
  }
