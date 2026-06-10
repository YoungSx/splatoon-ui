"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselPagination, SwipeableGallery, useCarousel } from "@/components/ui/carousel"
import { IconButton } from "./icon-button"
import styles from "./marquee-carousel.module.css"

export interface MarqueeCarouselItem {
  id: React.Key
  image: string
  alt?: string
  className?: string
}

export interface MarqueeCarouselProps extends Omit<React.ComponentPropsWithoutRef<typeof Carousel>, "children"> {
  items: MarqueeCarouselItem[]
}

export function MarqueeCarousel({ items, className, ...props }: MarqueeCarouselProps) {
  return (
    <Carousel itemCount={items.length} className={cn(styles.galleryWrapper, className)} {...props}>
      <SwipeableGallery>
        <MarqueeCarouselContent>
          {items.map((item, index) => (
            <MarqueeCarouselItem key={item.id} data-index={index} item={item} />
          ))}
        </MarqueeCarouselContent>
      </SwipeableGallery>
      <MarqueeCarouselControls />
      <CarouselPagination />
    </Carousel>
  )
}

MarqueeCarousel.displayName = "MarqueeCarousel"

const MarqueeCarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <CarouselContent ref={ref} className={cn(styles.gallery, className)} {...props}>
        {children}
      </CarouselContent>
    )
  }
)
MarqueeCarouselContent.displayName = "MarqueeCarouselContent"

interface MarqueeCarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: MarqueeCarouselItem
  "data-index"?: number
}

const MarqueeCarouselItem = React.forwardRef<HTMLDivElement, MarqueeCarouselItemProps>(
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
        <div className={styles.photoWrap}>
          <picture className={styles.tapeDecoration}>
            <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-2-medium-up.webp 1x, /_images/tape-assets/tape-2-medium-up-2x.webp 2x" />
            <source srcSet="/_images/tape-assets/tape-2.webp 1x, /_images/tape-assets/tape-2-2x.webp 2x" />
            <img src="/_images/tape-assets/tape-2.png" alt="" draggable={false} />
          </picture>
          <div className={styles.photo}>
            <img src={item.image} alt={item.alt || ""} />
          </div>
        </div>
      </CarouselItem>
    )
  }
)
MarqueeCarouselItem.displayName = "MarqueeCarouselItem"

const MarqueeCarouselControls = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
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
MarqueeCarouselControls.displayName = "MarqueeCarouselControls"

