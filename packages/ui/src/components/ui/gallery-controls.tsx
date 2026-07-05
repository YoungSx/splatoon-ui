'use client'

import * as React from 'react'
import { motion, useAnimation, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCarousel } from '@/components/ui/carousel-core'
import { IconButton } from './icon-button'
import baseStyles from './gallery-base.module.css'

/* ── GalleryControls ── */

export interface GalleryControlsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  className?: string
  prevLabel?: string
  nextLabel?: string
  ref?: React.Ref<HTMLDivElement>
  wrapButton?: (direction: 'left' | 'right', button: React.ReactNode) => React.ReactNode
}

export function GalleryControls({
  ref,
  className,
  prevLabel = 'Previous gallery item',
  nextLabel = 'Next gallery item',
  wrapButton,
  ...props
}: GalleryControlsProps) {
  const { goToNext, goToPrev, canGoNext, canGoPrev } = useCarousel()

  const leftButton = (
    <IconButton
      variant="carousel"
      direction="left"
      animation="squish"
      onClick={goToPrev}
      disabled={!canGoPrev}
      aria-label={prevLabel}
    />
  )

  const rightButton = (
    <IconButton
      variant="carousel"
      direction="right"
      animation="squish"
      onClick={goToNext}
      disabled={!canGoNext}
      aria-label={nextLabel}
    />
  )

  return (
    <div ref={ref} className={cn(baseStyles.galleryControls, className)} {...props}>
      {wrapButton ? wrapButton('left', leftButton) : leftButton}
      {wrapButton ? wrapButton('right', rightButton) : rightButton}
    </div>
  )
}

/* ── GalleryBounce — spring bounce-in animation ── */

export interface GalleryBounceProps extends Omit<HTMLMotionProps<'div'>, 'animate' | 'children'> {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export function GalleryBounce({ ref, children, className, ...props }: GalleryBounceProps) {
  const { currentIndex, prevIndex } = useCarousel()
  const controls = useAnimation()

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const direction = currentIndex > prevIndex ? 1 : -1
    const randomSign = ((currentIndex * 2654435761) >>> 0) & 1 ? -1 : 1
    const startY = 100 * direction * randomSign

    controls.set({ y: startY, opacity: 1 })
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 1,
        ease: [0.21, 1.56, 0.64, 1],
      },
    })
  }, [currentIndex, prevIndex, controls])

  return (
    <motion.div ref={ref} className={className} {...props} animate={controls}>
      {children}
    </motion.div>
  )
}
