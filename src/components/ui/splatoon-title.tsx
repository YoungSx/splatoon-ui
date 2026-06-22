'use client'

/**
 * SplatoonTitle — image-capable heading for the Splatoon UI demo.
 * Pass custom image assets when a bitmap title is needed; otherwise the
 * component renders an accessible text fallback.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SplatoonTitleVariant = 'logo' | 'section'
export type SplatoonTitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface SplatoonTitleProps extends React.ComponentProps<'div'> {
  /** Title variant */
  variant?: SplatoonTitleVariant
  /** Optional section key used for text fallback labels */
  section?: string
  /** Title size */
  size?: SplatoonTitleSize
  /** Animation on mount */
  animate?: boolean
  /** Custom image URL (overrides section) */
  image?: string
  /** Custom image URL for hover state */
  imageHover?: string
  /** Text content (used as fallback or alt text) */
  children?: React.ReactNode
}

// ─── Constants ──────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<SplatoonTitleSize, string> = {
  sm: 'h-16',
  md: 'h-24',
  lg: 'h-32',
  xl: 'h-40',
  '2xl': 'h-48',
}

const SECTION_LABELS: Record<string, string> = {
  story: 'Story',
  character: 'Characters',
  world: 'World',
  fashion: 'Fashion',
  music: 'Music',
  gallery: 'Gallery',
  history: 'History',
}

// ─── Component ──────────────────────────────────────────────────────────────

export function SplatoonTitle({
  ref,
  variant = 'section',
  section,
  size = 'lg',
  animate = false,
  image,
  imageHover,
  children,
  className,
  ...props
}: SplatoonTitleProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(!animate)

  React.useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [animate])

  const titleImage = image
  const hoverImage = imageHover || titleImage
  const fallbackLabel =
    typeof children === 'string'
      ? children
      : section
        ? (SECTION_LABELS[section] ?? section)
        : 'Splatoon UI'

  if (titleImage) {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block',
          animate && 'transition-all duration-700 ease-out',
          animate && (isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'),
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- optional caller-provided title art, not a page LCP image */}
        <img
          src={isHovered ? hoverImage : titleImage}
          alt={fallbackLabel}
          className={cn(
            'object-contain transition-all duration-300',
            SIZE_CLASSES[size],
            isHovered && 'scale-105'
          )}
          decoding="async"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'font-heading relative inline-block font-black tracking-wider uppercase',
        animate && 'transition-all duration-700 ease-out',
        animate && (isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'),
        variant === 'logo' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl',
        className
      )}
      {...props}
    >
      {fallbackLabel}
    </div>
  )
}
