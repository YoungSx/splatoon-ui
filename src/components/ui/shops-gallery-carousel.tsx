"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, FadeCarouselItem, CarouselImagePagination, GalleryBounce, SwipeableGallery, useCarousel } from "@/components/ui/carousel"
import { GalleryControls, GalleryTapeDecoration } from "./gallery-controls"
import baseStyles from "./gallery-base.module.css"
import styles from "./shops-gallery-carousel.module.css"

export interface ShopsGalleryCarouselItem {
  id: React.Key
  image: string
  title: string
  description?: string
  icon: string
  iconRotate?: number
  className?: string
}

export interface ShopsGalleryCarouselProps extends Omit<React.ComponentPropsWithoutRef<typeof Carousel>, "children"> {
  items: ShopsGalleryCarouselItem[]
}

export function ShopsGalleryCarousel({ items, className, ...props }: ShopsGalleryCarouselProps) {
  return (
    <Carousel itemCount={items.length} className={cn(baseStyles.galleryWrapper, className)} {...props}>
      <SwipeableGallery>
        <CarouselContent className={baseStyles.gallery}>
          {items.map((item, index) => (
            <ShopsGalleryItem key={item.id} data-index={index} item={item} />
          ))}
        </CarouselContent>
      </SwipeableGallery>
      <GalleryControls className={styles.galleryControls} />
      <CarouselImagePagination images={items.map(item => ({ src: item.icon, alt: item.title, rotate: item.iconRotate ?? 0 }))} />
    </Carousel>
  )
}

ShopsGalleryCarousel.displayName = "ShopsGalleryCarousel"

interface ShopsGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ShopsGalleryCarouselItem
  "data-index"?: number
}

const ShopsGalleryItem = React.forwardRef<HTMLDivElement, ShopsGalleryItemProps>(
  ({ className, item, "data-index": index = 0, ...props }, ref) => {
    const { currentIndex } = useCarousel()
    const isActive = currentIndex === index

    return (
      <FadeCarouselItem
        ref={ref}
        data-index={index}
        rotateAmount={3}
        className={cn(baseStyles.galleryItem, isActive && baseStyles.galleryItemActive, className)}
        {...props}
      >
        <div className={styles.galleryItemContent}>
          <GalleryBounce>
            <div className={cn(baseStyles.photoFrame, styles.photoFrame)}>
              <GalleryTapeDecoration />
              <div className={cn(baseStyles.photoImage, styles.photoImage)}>
                <img src={item.image} alt={item.title} />
              </div>
            </div>
          </GalleryBounce>
          <div className={styles.galleryItemContent}>
            <h3 className="text-xl font-black uppercase tracking-wider">{item.title}</h3>
            {item.description && (
              <p className="text-sm font-medium text-chaos-black/60">{item.description}</p>
            )}
          </div>
        </div>
      </FadeCarouselItem>
    )
  }
)
ShopsGalleryItem.displayName = "ShopsGalleryItem"
