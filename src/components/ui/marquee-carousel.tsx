"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, FadeCarouselItem, CarouselPagination, SwipeableGallery, useCarousel } from "@/components/ui/carousel"
import { GalleryControls, GalleryTapeDecoration } from "./gallery-controls"
import baseStyles from "./gallery-base.module.css"
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
    <Carousel itemCount={items.length} className={cn(baseStyles.galleryWrapper, className)} {...props}>
      <SwipeableGallery>
        <CarouselContent className={baseStyles.gallery}>
          {items.map((item, index) => (
            <MarqueeGalleryItem key={item.id} data-index={index} item={item} />
          ))}
        </CarouselContent>
      </SwipeableGallery>
      <GalleryControls />
      <CarouselPagination />
    </Carousel>
  )
}

interface MarqueeGalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: MarqueeCarouselItem
  "data-index"?: number
}

function MarqueeGalleryItem({
  ref,
  className,
  item,
  "data-index": index = 0,
  ...props
}: MarqueeGalleryItemProps & { ref?: React.Ref<HTMLDivElement> }) {
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
        <div className={cn(baseStyles.photoFrame, styles.photoFrame)}>
          <GalleryTapeDecoration />
          <div className={cn(baseStyles.photoImage, styles.photoImage)}>
            <img src={item.image} alt={item.alt || ""} />
          </div>
        </div>
      </FadeCarouselItem>
    )
  }
