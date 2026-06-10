"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselPagination, SwipeableGallery, useCarousel } from "@/components/ui/carousel"
import { IconButton } from "./icon-button"
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
    <Carousel itemCount={items.length} className={cn(styles.galleryWrapper, className)} {...props}>
      <SwipeableGallery>
        <WeaponsGalleryContent>
          {items.map((item, index) => (
            <WeaponsGalleryItem key={item.id} data-index={index} item={item} />
          ))}
        </WeaponsGalleryContent>
      </SwipeableGallery>
      <WeaponsGalleryControls />
      <CarouselPagination className={styles.galleryPagination} />
    </Carousel>
  )
}

WeaponsGalleryCarousel.displayName = "WeaponsGalleryCarousel"

const WeaponsGalleryContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <CarouselContent ref={ref} className={cn(styles.gallery, className)} {...props}>
        {children}
      </CarouselContent>
    )
  }
)
WeaponsGalleryContent.displayName = "WeaponsGalleryContent"

interface WeaponsGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: WeaponsGalleryCarouselItem
  "data-index"?: number
}

const WeaponsGalleryItem = React.forwardRef<HTMLDivElement, WeaponsGalleryItemProps>(
  ({ className, item, "data-index": index = 0, ...props }, ref) => {
    const { currentIndex } = useCarousel()
    const isActive = currentIndex === index

    return (
      <CarouselItem
        ref={ref}
        data-index={index}
        fade
        rotateAmount={2}
        className={cn(styles.galleryItem, isActive && styles.galleryItemActive, className)}
        {...props}
      >
        <div className={styles.itemLayout}>
          <div className={styles.galleryPhoto}>
            <picture className={styles.tapeDecoration}>
              <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-2-medium-up.webp 1x, /_images/tape-assets/tape-2-medium-up-2x.webp 2x" />
              <source srcSet="/_images/tape-assets/tape-2.webp 1x, /_images/tape-assets/tape-2-2x.webp 2x" />
              <img src="/_images/tape-assets/tape-2.png" alt="" draggable={false} />
            </picture>
            <div className={styles.galleryImage}>
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
      </CarouselItem>
    )
  }
)
WeaponsGalleryItem.displayName = "WeaponsGalleryItem"

const WeaponsGalleryControls = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { goToNext, goToPrev, canGoNext, canGoPrev } = useCarousel()

    return (
      <div ref={ref} className={cn(styles.galleryControls, className)} {...props}>
        <div>
          <IconButton
            variant="carousel"
            direction="left"
            animation="squish"
            className={styles.controlButton}
            onClick={goToPrev}
            disabled={!canGoPrev}
            aria-label="Previous gallery item"
          />
        </div>
        <div>
          <IconButton
            variant="carousel"
            direction="right"
            animation="squish"
            className={styles.controlButton}
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Next gallery item"
          />
        </div>
      </div>
    )
  }
)
WeaponsGalleryControls.displayName = "WeaponsGalleryControls"

