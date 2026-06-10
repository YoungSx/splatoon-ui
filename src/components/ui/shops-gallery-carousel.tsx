"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselImagePagination, GalleryBounce, SwipeableGallery, useCarousel } from "@/components/ui/carousel"
import { IconButton } from "./icon-button"
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
    <Carousel itemCount={items.length} className={cn(styles.galleryWrapper, className)} {...props}>
      <SwipeableGallery>
        <ShopsGalleryContent>
          {items.map((item, index) => (
            <ShopsGalleryItem key={item.id} data-index={index} item={item} />
          ))}
        </ShopsGalleryContent>
      </SwipeableGallery>
      <ShopsGalleryControls />
      <CarouselImagePagination images={items.map(item => ({ src: item.icon, alt: item.title, rotate: item.iconRotate ?? 0 }))} />
    </Carousel>
  )
}

ShopsGalleryCarousel.displayName = "ShopsGalleryCarousel"

const ShopsGalleryContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <CarouselContent ref={ref} className={cn(styles.gallery, className)} {...props}>
        {children}
      </CarouselContent>
    )
  }
)
ShopsGalleryContent.displayName = "ShopsGalleryContent"

interface ShopsGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ShopsGalleryCarouselItem
  "data-index"?: number
}

const ShopsGalleryItem = React.forwardRef<HTMLDivElement, ShopsGalleryItemProps>(
  ({ className, item, "data-index": index = 0, ...props }, ref) => {
    const { currentIndex } = useCarousel()
    const isActive = currentIndex === index

    return (
      <CarouselItem
        ref={ref}
        data-index={index}
        fade
        rotateAmount={3}
        className={cn(styles.galleryItem, isActive && styles.galleryItemActive, className)}
        {...props}
      >
        <div className={styles.galleryItemContent}>
          <GalleryBounce>
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
          </GalleryBounce>
          <div className={styles.galleryItemContent}>
            <h3 className="text-xl font-black uppercase tracking-wider">{item.title}</h3>
            {item.description && (
              <p className="text-sm font-medium text-chaos-black/60">{item.description}</p>
            )}
          </div>
        </div>
      </CarouselItem>
    )
  }
)
ShopsGalleryItem.displayName = "ShopsGalleryItem"

const ShopsGalleryControls = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { goToNext, goToPrev, canGoNext, canGoPrev } = useCarousel()

    return (
      <div ref={ref} className={cn(styles.galleryControls, className)} {...props}>
        <IconButton
          variant="carousel"
          direction="left"
          animation="squish"
          className={styles.controlButton}
          onClick={goToPrev}
          disabled={!canGoPrev}
          aria-label="Previous gallery item"
        />
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
    )
  }
)
ShopsGalleryControls.displayName = "ShopsGalleryControls"

