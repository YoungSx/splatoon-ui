'use client'

/**
 * SplatoonTitle — Official Splatoon image-based heading.
 *
 * Uses official Nintendo Splatoon assets:
 * - `logo` variant: official logo image
 * - `section` variant: official section title images (story/character/world/fashion/music/gallery/history)
 *
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SplatoonTitleVariant = 'logo' | 'section'
export type SplatoonTitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface SplatoonTitleProps extends React.ComponentProps<'div'> {
  /** Title variant */
  variant?: SplatoonTitleVariant
  /** Section name for official images (story, character, world, fashion, music, gallery, history) */
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

/** Sections without dedicated hover images — use CSS filter as fallback */
const FILTER_HOVER_SECTIONS = new Set(['music', 'gallery', 'history'])

const SECTION_IMAGES: Record<string, { title: string; hover: string }> = {
  story: {
    title: '/official/nav-story.png',
    hover: '/official/nav-story-hover.png',
  },
  character: {
    title: '/official/nav-character.png',
    hover: '/official/nav-character-hover.png',
  },
  world: {
    title: '/official/nav-world.png',
    hover: '/official/nav-world-hover.png',
  },
  fashion: {
    title: '/official/nav-fashion.png',
    hover: '/official/nav-fashion-hover.png',
  },
  music: {
    title: '/official/nav-music.png',
    hover: '/official/nav-music.png',
  },
  gallery: {
    title: '/official/nav-gallery.png',
    hover: '/official/nav-gallery.png',
  },
  history: {
    title: '/official/nav-history.png',
    hover: '/official/nav-history.png',
  },
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

    // Determine image sources
    const sectionImages = section ? SECTION_IMAGES[section] : null
    const titleImage = image || sectionImages?.title || '/images/splatoon-logo-official.png'
    const hoverImage = imageHover || sectionImages?.hover || titleImage

    // Logo variant: use official logo
    if (variant === 'logo') {
      return (
        <div
          ref={ref}
          className={cn(
            'relative inline-block',
            animate && 'transition-all duration-700 ease-out',
            animate && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'),
            className,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        >
          <img
            src={titleImage}
            alt={typeof children === 'string' ? children : 'Splatoon'}
            className={cn(
              'object-contain transition-transform duration-300',
              SIZE_CLASSES[size],
              isHovered && 'scale-105',
            )}
          />
        </div>
      )
    }

    // Section variant: use official section title images
    if (variant === 'section' && sectionImages) {
      const usesFilterFallback = section ? FILTER_HOVER_SECTIONS.has(section) : false

      return (
        <div
          ref={ref}
          className={cn(
            'relative inline-block cursor-pointer',
            animate && 'transition-all duration-700 ease-out',
            animate && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'),
            className,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        >
          <img
            src={isHovered ? hoverImage : titleImage}
            alt={typeof children === 'string' ? children : section}
            className={cn(
              'object-contain transition-all duration-300',
              SIZE_CLASSES[size],
            )}
            style={
              usesFilterFallback && isHovered
                ? { filter: 'brightness(1.2) saturate(1.3)' }
                : undefined
            }
          />
        </div>
      )
    }

  }
