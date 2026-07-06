/**
 * IconButton — circular icon button for Splatoon UI controls.
 *
 * Variants control color; size is explicit override (default varies by variant).
 * Pass `size` to force a specific dimension regardless of variant defaults.
 */

import * as React from 'react'
import { splatoonColorVars } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import styles from './icon-button.module.css'
import { carouselArrowLeftPath, carouselArrowRightPath } from './card-stack-carousel-icons'

// ─── Types ──────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'carousel' | 'primary' | 'ghost' | 'yellow' | 'outline' | 'accent'
export type IconButtonSize = 'sm' | 'md' | 'lg'
export type IconButtonAnimation = 'squish' | 'pulse' | 'none'
export type IconButtonDirection = 'left' | 'right' | 'up' | 'down'

type IconButtonStyle = React.CSSProperties & {
  '--icon-button-bg'?: string
  '--icon-button-border-color'?: string
  '--icon-button-color'?: string
}

interface IconButtonColorPreset {
  backgroundColor: string
  borderColor?: string
  color: string
}

export interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /** Icon button color treatment. */
  variant?: IconButtonVariant
  /** Explicit size override. When omitted, variant determines default size. */
  size?: IconButtonSize
  /** Motion preset applied to the circular shell. */
  animation?: IconButtonAnimation
  /** Built-in arrow direction and squish direction. */
  direction?: IconButtonDirection
  /** Custom icon node. When omitted, direction renders the built-in arrow icon. */
  icon?: React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

// ─── Style maps ─────────────────────────────────────────────────────────────

const VARIANT_CLASS: Record<IconButtonVariant, string | null> = {
  carousel: styles.carousel,
  primary: null,
  ghost: null,
  yellow: null,
  outline: styles.outline,
  accent: null,
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

const ICON_BUTTON_COLOR_PRESETS: Record<IconButtonVariant, IconButtonColorPreset> = {
  carousel: {
    backgroundColor: splatoonColorVars.green,
    color: 'var(--theme-primary-alt, var(--color-black, #0d0d0d))',
  },
  primary: {
    backgroundColor: splatoonColorVars.blue,
    color: splatoonColorVars.white,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'currentColor',
  },
  yellow: {
    backgroundColor: splatoonColorVars.yellow,
    color: splatoonColorVars.black,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: 'currentColor',
    color: 'currentColor',
  },
  accent: {
    backgroundColor: 'var(--theme-accent, var(--color-black, #0d0d0d))',
    color: 'var(--theme-accent-alt, var(--color-white, #fff))',
  },
}

// ─── Built-in arrow paths ───────────────────────────────────────────────────

function ArrowIcon({ direction }: { direction: IconButtonDirection }) {
  const isLeft = direction === 'left'
  const path =
    isLeft || direction === 'up' || direction === 'down'
      ? carouselArrowLeftPath
      : carouselArrowRightPath

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

/**
 * IconButton — circular icon-only control for arrows and compact commands.
 */
export function IconButton({
  ref,
  variant = 'primary',
  size,
  animation = 'squish',
  direction,
  icon,
  className,
  style,
  disabled,
  ...props
}: IconButtonProps) {
  const squishDirection = direction === 'left' ? -1 : 1
  const resolvedIcon = icon ?? (direction ? <ArrowIcon direction={direction} /> : null)
  const colorPreset = ICON_BUTTON_COLOR_PRESETS[variant]

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      data-slot="icon-button"
      data-size={size}
      className={cn(
        styles.shell,
        VARIANT_CLASS[variant],
        size && SIZE_CLASS[size],
        ANIMATION_CLASS[animation],
        animation === 'squish' && (direction === 'left' ? styles.squishLeft : styles.squishRight),
        className
      )}
      style={
        {
          '--icon-button-bg': colorPreset.backgroundColor,
          '--icon-button-border-color': colorPreset.borderColor,
          '--icon-button-color': colorPreset.color,
          '--squish-direction': squishDirection,
          ...style,
        } as IconButtonStyle
      }
      {...props}
    >
      {resolvedIcon}
    </button>
  )
}
