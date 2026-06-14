'use client'

/**
 * IconButton — circular icon button following splatoon.nintendo.com design.
 *
 * Variants control color; size is explicit override (default varies by variant).
 * Pass `size` to force a specific dimension regardless of variant defaults.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './icon-button.module.css'
import {
  splatoonCarouselArrowLeftPath,
  splatoonCarouselArrowRightPath,
} from './card-stack-carousel-icons'

// ─── Types ──────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'carousel' | 'primary' | 'ghost' | 'yellow' | 'outline' | 'accent'
export type IconButtonSize = 'sm' | 'md' | 'lg'
export type IconButtonAnimation = 'squish' | 'pulse' | 'none'
export type IconButtonDirection = 'left' | 'right' | 'up' | 'down'

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: IconButtonVariant
  /** Explicit size override. When omitted, variant determines default size. */
  size?: IconButtonSize
  animation?: IconButtonAnimation
  direction?: IconButtonDirection
  icon?: React.ReactNode
}

// ─── Style maps ─────────────────────────────────────────────────────────────

const VARIANT_CLASS: Record<IconButtonVariant, string> = {
  carousel: styles.carousel,
  primary: styles.primary,
  ghost: styles.ghost,
  yellow: styles.yellow,
  outline: styles.outline,
  accent: styles.accent,
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

// ─── Built-in arrow paths (official ink-splatter SVG) ───────────────────────

function ArrowIcon({ direction }: { direction: IconButtonDirection }) {
  const isLeft = direction === 'left'
  const path = isLeft || direction === 'up' || direction === 'down'
    ? splatoonCarouselArrowLeftPath
    : splatoonCarouselArrowRightPath

  const rotation: Record<IconButtonDirection, string> = {
    left: '0deg',
    right: '0deg',
    up: '90deg',
    down: '-90deg',
  }

  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.icon}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation[direction]})` }}
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
      variant = 'primary',
      size,
      animation = 'squish',
      direction,
      icon,
      className,
      style,
      disabled,
      ...props
    },
    ref,
  ) {
    const squishDirection = direction === 'left' ? -1 : 1
    const resolvedIcon = icon ?? (direction ? <ArrowIcon direction={direction} /> : null)

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        data-size={size}
        className={cn(
          styles.shell,
          VARIANT_CLASS[variant],
          size && SIZE_CLASS[size],
          ANIMATION_CLASS[animation],
          animation === 'squish' && (direction === 'left' ? styles.squishLeft : styles.squishRight),
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
  }
)
