'use client'

/**
 * WeaponCard — Splatoon FASHION section style weapon card.
 *
 * Matches the official Nintendo Splatoon navigation card visual:
 * - PNG image-based content (not SVG icons)
 * - Bouncy hover effect (cubic-bezier 0.34, 1.56, 0.64, 1)
 * - Scale transform on hover
 * - Official color palette
 * - FASHION section layout pattern
 *
 * Based on the official Splatoon site navigation cards.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface WeaponCardProps extends React.ComponentProps<'a'> {
  /** Weapon name */
  name: string
  /** Weapon description */
  description?: string
  /** Weapon image URL */
  image: string
  /** Section label */
  section?: string
  /** Link URL */
  href?: string
  /** Card size */
  size?: 'sm' | 'md' | 'lg'
  /** URL for a circular weapon category icon overlay */
  categoryIcon?: string
  /** Render the weapon name as vertical text on the left edge (visible on hover) */
  verticalTitle?: boolean
}

// ─── Constants ──────────────────────────────────────────────────────────────

const SIZE_CLASSES = {
  sm: 'w-32 h-20',
  md: 'w-48 h-28',
  lg: 'w-64 h-36',
}

// ─── Component ──────────────────────────────────────────────────────────────

export const WeaponCard = React.forwardRef<HTMLAnchorElement, WeaponCardProps>(
  function WeaponCard(
    {
      name,
      description,
      image,
      section,
      href = '#',
      size = 'md',
      categoryIcon,
      verticalTitle,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'group relative block overflow-hidden',
          'transition-all duration-200',
          'hover:scale-105',
          // Official bouncy easing
          'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          className,
        )}
        style={{
          transitionDuration: '0.25s',
        }}
        {...props}
      >
        {/* Card image */}
        <div className={cn('relative overflow-hidden rounded-lg', SIZE_CLASSES[size])}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-2">
              {/* Section badge */}
              {section && (
                <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-black/70 text-white rounded mb-1">
                  {section}
                </span>
              )}

              {/* Name */}
              <h3 className="text-xs font-black uppercase tracking-wider text-white leading-tight">
                {name}
              </h3>
            </div>
          </div>

          {/* Vertical title on left edge (visible on hover) */}
          {verticalTitle && (
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none font-heading text-xs font-black uppercase tracking-wider text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {name}
            </span>
          )}

          {/* Circular category icon frame */}
          {categoryIcon && (
            <div className="pointer-events-none absolute bottom-3 right-3 h-16 w-16 rounded-full border-3 border-chaos-black bg-white dark:bg-gray-800">
              <img src={categoryIcon} alt="" className="h-full w-full object-contain p-1" />
            </div>
          )}
        </div>

        {/* Section label below card */}
        {section && (
          <div className="mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-chaos-black/60 dark:text-white/60">
              {section}
            </span>
          </div>
        )}
      </a>
    )
  },
)
