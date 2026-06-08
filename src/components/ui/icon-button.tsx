'use client'

/**
 * IconButton — Official splatoon.nintendo.com circular icon button.
 *
 * A standalone, reusable circular button component extracted from the
 * card-stack-carousel pattern. Supports multiple size/color variants
 * and the official squish entrance animation.
 *
 * Official CSS custom properties:
 *   --icon-button-size  (set by size variant)
 *   --icon-button-icon-size (set by size variant)
 *   --scale             (hover: 1.1)
 *   --squish-direction  (1 or -1, for squish animation direction)
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './icon-button.module.css'
import {
  splatoonCarouselArrowLeftPath,
  splatoonCarouselArrowRightPath,
} from './card-stack-carousel-icons'

// ─── Types ──────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'carousel' | 'primary' | 'ghost' | 'yellow' | 'outline'
export type IconButtonSize = 'sm' | 'md' | 'lg'
export type IconButtonAnimation = 'squish' | 'pulse' | 'none'
export type IconButtonDirection = 'left' | 'right' | 'up' | 'down'

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Color variant */
  variant?: IconButtonVariant
  /** Size (sm=40px, md=48px, lg=60px). If omitted, sizing is controlled by parent CSS custom properties. */
  size?: IconButtonSize
  /** Entrance animation (squish = official squish, pulse = gentle, none) */
  animation?: IconButtonAnimation
  /** Direction for arrow icon and squish animation */
  direction?: IconButtonDirection
  /** Explicit icon element (overrides built-in arrow) */
  icon?: React.ReactNode
}

// ─── Style maps ─────────────────────────────────────────────────────────────

const VARIANT_CLASS: Record<IconButtonVariant, string> = {
  carousel: styles.carousel,
  primary: styles.primary,
  ghost: styles.ghost,
  yellow: styles.yellow,
  outline: styles.outline,
}

const SIZE_CLASS: Record<IconButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

const ANIMATION_CLASS: Record<IconButtonAnimation, string | null> = {
  squish: styles.squish,
  pulse: styles.pulse,
  none: null,
}

// ─── Built-in arrow paths ───────────────────────────────────────────────────

function ArrowIcon({ direction }: { direction: IconButtonDirection }) {
  let path: string
  let rotation: string

  switch (direction) {
    case 'left':
      path = splatoonCarouselArrowLeftPath
      rotation = '0deg'
      break
    case 'right':
      path = splatoonCarouselArrowRightPath
      rotation = '0deg'
      break
    case 'up':
      path = splatoonCarouselArrowLeftPath
      rotation = '90deg'
      break
    case 'down':
      path = splatoonCarouselArrowLeftPath
      rotation = '-90deg'
      break
  }

  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.icon}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation})` }}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = 'carousel',
      size,
      animation = 'none',
      direction,
      icon,
      className,
      style,
      disabled,
      ...props
    },
    ref,
  ) {
    // Determine squish direction from the arrow direction
    const squishDirection = direction === 'left' ? -1 : 1

    // Resolve the icon to render
    const resolvedIcon = icon ?? (direction ? <ArrowIcon direction={direction} /> : null)

    // Animation class
    const animClass = ANIMATION_CLASS[animation]
    const sizeClass = size ? SIZE_CLASS[size] : null

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          styles.shell,
          VARIANT_CLASS[variant],
          sizeClass,
          animClass,
          className,
        )}
        style={{
          '--squish-direction': squishDirection,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {resolvedIcon}
      </button>
    )
  },
)
