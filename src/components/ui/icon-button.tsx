'use client'

/**
 * IconButton — 1:1 replica of splatoon.nintendo.com circular icon button.
 *
 * Official CSS: .icon-button_iconButton__vRbEr
 * - 60x60px circle, no border, no box-shadow
 * - Solid var(--color-primary) background
 * - Icon: fill currentcolor, 50% of button size
 * - Squish animation: 2s ease-out infinite
 * - Hover: --scale: 1.1 (no background change)
 * - Disabled: transparent bg, opacity 0.2
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
  /** Color variant */
  variant?: IconButtonVariant
  /** Size (sm=40px, md=48px, lg=60px). Default: 60px. */
  size?: IconButtonSize
  /** Animation (squish = official bouncy squish, pulse = gentle, none) */
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

export function IconButton({
  ref,
  variant = 'carousel',
  size,
  animation = 'squish',
  direction,
  icon,
  className,
  style,
  disabled,
  ...props
}: IconButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
    // Determine squish direction from the arrow direction
    const squishDirection = direction === 'left' ? -1 : 1

    // Resolve the icon to render
    const resolvedIcon = icon ?? (direction ? <ArrowIcon direction={direction} /> : null)

    // Animation class
    const animClass = ANIMATION_CLASS[animation]
    const sizeClass = size ? SIZE_CLASS[size] : null

    // Squish direction class
    const squishDirClass = animation === 'squish'
      ? (direction === 'left' ? styles.squishLeft : styles.squishRight)
      : null

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
          squishDirClass,
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
