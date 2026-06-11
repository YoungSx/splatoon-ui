"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useCarousel } from "@/components/ui/carousel"
import { IconButton } from "./icon-button"
import baseStyles from "./gallery-base.module.css"

/* ── GalleryTapeDecoration ── */

export interface GalleryTapeDecorationProps extends React.HTMLAttributes<HTMLPictureElement> {
  className?: string
}

export const GalleryTapeDecoration = React.forwardRef<HTMLPictureElement, GalleryTapeDecorationProps>(
  ({ className, ...props }, ref) => {
    return (
      <picture ref={ref} className={cn(baseStyles.tapeDecoration, className)} {...props}>
        <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-2-medium-up.webp 1x, /_images/tape-assets/tape-2-medium-up-2x.webp 2x" />
        <source srcSet="/_images/tape-assets/tape-2.webp 1x, /_images/tape-assets/tape-2-2x.webp 2x" />
        <img src="/_images/tape-assets/tape-2.png" alt="" draggable={false} />
      </picture>
    )
  }
)
GalleryTapeDecoration.displayName = "GalleryTapeDecoration"

/* ── GalleryControls ── */

export interface GalleryControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  wrapButton?: (
    direction: "left" | "right",
    button: React.ReactNode
  ) => React.ReactNode
}

export const GalleryControls = React.forwardRef<HTMLDivElement, GalleryControlsProps>(
  ({ className, wrapButton, ...props }, ref) => {
    const { goToNext, goToPrev, canGoNext, canGoPrev } = useCarousel()

    const leftButton = (
      <IconButton
        variant="carousel"
        direction="left"
        animation="squish"
        className={baseStyles.controlButton}
        onClick={goToPrev}
        disabled={!canGoPrev}
        aria-label="Previous gallery item"
      />
    )

    const rightButton = (
      <IconButton
        variant="carousel"
        direction="right"
        animation="squish"
        className={baseStyles.controlButton}
        onClick={goToNext}
        disabled={!canGoNext}
        aria-label="Next gallery item"
      />
    )

    return (
      <div ref={ref} className={cn(baseStyles.galleryControls, className)} {...props}>
        {wrapButton ? wrapButton("left", leftButton) : leftButton}
        {wrapButton ? wrapButton("right", rightButton) : rightButton}
      </div>
    )
  }
)
GalleryControls.displayName = "GalleryControls"
