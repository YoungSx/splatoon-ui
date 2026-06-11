"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, FadeCarouselItem, CarouselPagination, SwipeableGallery, useCarousel } from "@/components/ui/carousel"
import { GalleryControls, GalleryTapeDecoration } from "./gallery-controls"
import baseStyles from "./gallery-base.module.css"
import styles from "./weapons-gallery-carousel.module.css"

export interface WeaponsGalleryCarouselItem {
  id: React.Key
  image: string
  title: string
  description?: string
  className?: string
}

export interface WeaponsGalleryCarouselProps extends Omit<React.ComponentPropsWithoutRef<typeof Carousel>, "children"> {
  items: WeaponsGalleryCarouselItem[]
}

export function WeaponsGalleryCarousel({ items, className, ...props }: WeaponsGalleryCarouselProps) {
  return (
    <Carousel itemCount={items.length} className={cn(baseStyles.galleryWrapper, styles.galleryWrapper, className)} {...props}>
      <SwipeableGallery>
        <CarouselContent className={baseStyles.gallery}>
          {items.map((item, index) => (
            <WeaponsGalleryItem key={item.id} data-index={index} item={item} />
          ))}
        </CarouselContent>
      </SwipeableGallery>
      <GalleryControls
        className={styles.galleryControls}
        wrapButton={(direction, button) => <div>{button}</div>}
      />
      <CarouselPagination className={styles.galleryPagination} />
    </Carousel>
  )
}

WeaponsGalleryCarousel.displayName = "WeaponsGalleryCarousel"

interface WeaponsGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: WeaponsGalleryCarouselItem
  "data-index"?: number
}

const WeaponsGalleryItem = React.forwardRef<HTMLDivElement, WeaponsGalleryItemProps>(
  ({ className, item, "data-index": index = 0, ...props }, ref) => {
    const { currentIndex } = useCarousel()
    const isActive = currentIndex === index

    return (
      <FadeCarouselItem
        ref={ref}
        data-index={index}
        rotateAmount={2}
        className={cn(baseStyles.galleryItem, isActive && baseStyles.galleryItemActive, className)}
        {...props}
      >
        <div className={styles.itemLayout}>
          <div className={cn(baseStyles.photoFrame, styles.photoFrame)}>
            <GalleryTapeDecoration />
            <div className={cn(baseStyles.photoImage, styles.photoImage)}>
              <img src={item.image} alt={item.title} />
            </div>
          </div>
          <div className={styles.galleryContent}>
            <h3 className="color-primary">{item.title}</h3>
            {item.description && (
              <p>{item.description}</p>
            )}
          </div>
        </div>
      </FadeCarouselItem>
    )
  }
)
WeaponsGalleryItem.displayName = "WeaponsGalleryItem"
