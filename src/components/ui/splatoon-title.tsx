'use client'

/**
 * SplatoonTitle — Splatoon-style heading component.
 *
 * Uses official Nintendo Splatoon assets when available:
 * - Official logo image for main titles
 * - Official section title images for navigation
 * - Fallback to styled text when images unavailable
 *
 * Based on the official Splatoon 3 visual language.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SplatoonTitleVariant = 'logo' | 'section' | 'text'
export type SplatoonTitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface SplatoonTitleProps extends React.ComponentProps<'div'> {
  /** Title variant */
  variant?: SplatoonTitleVariant
  /** Section name for official images (story, character, world, fashion, music, gallery, history) */
  section?: string
  /** Title size */
  size?: SplatoonTitleSize
  /** Primary color for text fallback */
  color?: string
  /** Secondary color for gradients */
  color2?: string
  /** Enable skew effect */
  skewed?: boolean
  /** Enable 3D shadow */
  shadow?: boolean
  /** Enable ink splatter decorations */
  splat?: boolean
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
    hover: '/official/nav-fashion.png',
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

export const SplatoonTitle = React.forwardRef<HTMLDivElement, SplatoonTitleProps>(
  function SplatoonTitle(
    {
      variant = 'text',
      section,
      size = 'lg',
      color = '#eaff3d',
      color2 = '#603bff',
      skewed = false,
      shadow = true,
      splat = false,
      animate = false,
      image,
      imageHover,
      children,
      className,
      ...props
    },
    ref,
  ) {
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
          />
        </div>
      )
    }

    // Text variant: styled text fallback
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block',
          animate && 'transition-all duration-700 ease-out',
          animate && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'),
          className,
        )}
        {...props}
      >
        {/* Ink splatter decorations */}
        {splat && (
          <>
            <div
              className="absolute -top-4 -left-4 w-16 h-16 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
                transform: 'rotate(-15deg)',
              }}
            />
            <div
              className="absolute -bottom-4 -right-4 w-20 h-20 opacity-15 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${color2} 0%, transparent 70%)`,
                transform: 'rotate(25deg)',
              }}
            />
          </>
        )}

        {/* Main title text */}
        <h1
          className={cn(
            'font-heading font-black uppercase tracking-wider leading-none',
            skewed && '-skew-x-6',
          )}
          style={{
            color: color,
            textShadow: shadow ? `3px 3px 0px rgba(0,0,0,0.5)` : 'none',
            fontSize: `clamp(2rem, 5vw, ${size === '2xl' ? '6rem' : size === 'xl' ? '4rem' : size === 'lg' ? '3rem' : size === 'md' ? '2rem' : '1.5rem'})`,
          }}
        >
          {children}
        </h1>
      </div>
    )
  },
)
