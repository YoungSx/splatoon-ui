'use client'

/**
 * SplatoonGallery — Splatoon-style artwork gallery.
 *
 * Uses official Nintendo Splatoon gallery assets:
 * - Official gallery entrance icon
 * - Official number icons for sections
 * - Grid layout with hover effects
 *
 * Based on the official Splatoon gallery page structure.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GalleryItem {
  /** Item ID */
  id: string
  /** Item title */
  title: string
  /** Item description */
  description?: string
  /** Image URL */
  image: string
  /** Section/category */
  section?: string
  /** Link URL */
  href?: string
}

export interface SplatoonGalleryProps extends React.ComponentProps<'div'> {
  /** Gallery items */
  items: GalleryItem[]
  /** Gallery title */
  title?: string
  /** Enable hover effects */
  hover?: boolean
  /** Grid columns */
  columns?: 2 | 3 | 4
}

// ─── Component ──────────────────────────────────────────────────────────────

export const SplatoonGallery = React.forwardRef<HTMLDivElement, SplatoonGalleryProps>(
  function SplatoonGallery(
    {
      items,
      title = 'Gallery',
      hover = true,
      columns = 3,
      className,
      ...props
    },
    ref,
  ) {
    const gridCols = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-8', className)}
        {...props}
      >
        {/* Gallery header with official assets */}
        <div className="flex items-center justify-center gap-4">
          <img
            src="/official/gallery/icon-entrance.png"
            alt=""
            className="w-12 h-12 object-contain"
          />
          <h2 className="text-3xl font-black uppercase tracking-wider text-white">
            {title}
          </h2>
        </div>

        {/* Gallery grid */}
        <div className={cn('grid gap-6', gridCols[columns])}>
          {items.map((item, index) => (
            <a
              key={item.id}
              href={item.href || '#'}
              className={cn(
                'group relative block overflow-hidden rounded-lg',
                'transition-all duration-300',
                hover && 'hover:scale-[1.03] hover:-rotate-1',
              )}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-500',
                    hover && 'group-hover:scale-110',
                  )}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Section number */}
                  {item.section && (
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1 block">
                      {item.section}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-black uppercase tracking-wider text-white">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-white/80 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Section badge */}
              {item.section && (
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-black/70 text-white rounded">
                    {item.section}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    )
  },
)
