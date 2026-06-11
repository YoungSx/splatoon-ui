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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  /** Numeric badge (2 or 3) for Splatoon 2/3 items */
  numberBadge?: 2 | 3
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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Map of number badge values to their official image paths */
const NUMBER_BADGE_IMAGES: Record<number, string> = {
  2: '/official/gallery/number2.png',
  3: '/official/gallery/number3.png',
}

/** Try to extract a Splatoon number (2 or 3) from section or title */
function detectNumberBadge(item: GalleryItem): number | undefined {
  if (item.numberBadge) return item.numberBadge
  const section = (item.section ?? '').trim()
  const text = `${section} ${item.title ?? ''}`.toLowerCase()
  // Exact section match (e.g. section="2" or section="Splatoon 3")
  if (/^splatoon\s*3$/.test(section) || /^3$/.test(section)) return 3
  if (/^splatoon\s*2$/.test(section) || /^2$/.test(section)) return 2
  // Title contains explicit Splatoon version
  if (/\bsplatoon\s*3\b/.test(text)) return 3
  if (/\bsplatoon\s*2\b/.test(text)) return 2
  return undefined
}

// ─── Component ──────────────────────────────────────────────────────────────

export function SplatoonGallery({
  ref,
  items,
  title = 'Gallery',
  hover = true,
  columns = 3,
  className,
  ...props
}: SplatoonGalleryProps & { ref?: React.Ref<HTMLDivElement> }) {
    const [selectedItem, setSelectedItem] = React.useState<GalleryItem | null>(null)

    React.useEffect(() => {
      function onHashChange() {
        const hash = window.location.hash.slice(1)
        if (!hash) {
          setSelectedItem(null)
          return
        }
        const match = items.find((item) => item.id === hash)
        if (match) {
          setSelectedItem(match)
        }
      }

      onHashChange()
      window.addEventListener('hashchange', onHashChange)
      return () => window.removeEventListener('hashchange', onHashChange)
    }, [items])

    function handleOpenChange(open: boolean) {
      if (!open) {
        setSelectedItem(null)
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }

    function handleItemClick(e: React.MouseEvent<HTMLAnchorElement>, item: GalleryItem) {
      if (item.href) return
      e.preventDefault()
      window.location.hash = item.id
    }

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
          <h2 className="text-3xl font-black uppercase tracking-wider text-chaos-black">
            {title}
          </h2>
        </div>

        {/* Gallery grid */}
        <div className={cn('grid gap-6', gridCols[columns])}>
          {items.map((item, index) => (
            <a
              key={item.id}
              href={item.href || `#${item.id}`}
              onClick={(e) => handleItemClick(e, item)}
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

              {/* Section badge + number badge */}
              {(item.section || detectNumberBadge(item)) && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {item.section && (
                    <span className="inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-black/70 text-white rounded">
                      {item.section}
                    </span>
                  )}
                  {(() => {
                    const num = detectNumberBadge(item)
                    return num && NUMBER_BADGE_IMAGES[num] ? (
                      <img
                        src={NUMBER_BADGE_IMAGES[num]}
                        alt={`Splatoon ${num}`}
                        className="w-6 h-6 object-contain drop-shadow-md"
                      />
                    ) : null
                  })()}
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Hash-routed detail modal */}
        <Dialog open={!!selectedItem} onOpenChange={handleOpenChange}>
          <DialogContent className="max-w-2xl">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-black uppercase tracking-wider">
                    {selectedItem.title}
                  </DialogTitle>
                  {selectedItem.section && (
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {selectedItem.section}
                    </span>
                  )}
                </DialogHeader>
                <div className="mt-4">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full rounded-lg object-cover"
                  />
                </div>
                {selectedItem.description && (
                  <DialogDescription className="mt-4 text-base">
                    {selectedItem.description}
                  </DialogDescription>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }
