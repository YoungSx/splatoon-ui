import * as React from 'react'

import { newsStapleAssets } from './news-assets'
import { type TapeImageVariant } from './tape-assets'
import { TapePicture } from './tape-picture'
import { cn } from '@/lib/utils'

/* ──────────────────────────────────────────────
   Tape — curated tape/sticker image assets
   ────────────────────────────────────────────── */
export type TapeVariant = TapeImageVariant

export interface TapeProps extends React.ComponentProps<'div'> {
  variant?: TapeVariant
  position?: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right' | 'news' | 'event'
}

function Tape({
  className,
  variant = 'tape-1',
  position = 'top-left',
  children,
  ...props
}: TapeProps) {
  // Determine static layout positioning if no custom classes override it
  const hasCustomPositioning =
    className?.includes('top-') ||
    className?.includes('bottom-') ||
    className?.includes('left-') ||
    className?.includes('right-') ||
    className?.includes('translate-')

  return (
    <div
      data-slot="tape"
      data-variant={variant}
      data-position={position}
      className={cn(
        'pointer-events-none absolute z-20 select-none',
        !hasCustomPositioning && [
          'w-[35%] max-w-[120px] data-[position=top-left]:-top-3 data-[position=top-left]:-left-2 data-[position=top-left]:rotate-[-8deg]',
          'w-[35%] max-w-[120px] data-[position=top-right]:-top-3 data-[position=top-right]:-right-2 data-[position=top-right]:rotate-[6deg]',
          'w-[35%] max-w-[120px] data-[position=center]:top-1/2 data-[position=center]:left-1/2 data-[position=center]:-translate-x-1/2 data-[position=center]:-translate-y-1/2 data-[position=center]:rotate-[-3deg]',
          'w-[35%] max-w-[120px] data-[position=bottom-left]:-bottom-3 data-[position=bottom-left]:-left-2 data-[position=bottom-left]:rotate-[4deg]',
          'w-[35%] max-w-[120px] data-[position=bottom-right]:-right-2 data-[position=bottom-right]:-bottom-3 data-[position=bottom-right]:rotate-[-5deg]',
          'w-[35%] max-w-[120px] data-[position=news]:-top-5 data-[position=news]:left-6 data-[position=news]:origin-center data-[position=news]:[transform:translate(0,-50%)_rotate(-12deg)]',
          'w-[35%] max-w-[120px] data-[position=event]:-top-5 data-[position=event]:right-6 data-[position=event]:origin-center data-[position=event]:[transform:translate(0,-50%)_rotate(12deg)]',
        ],
        className
      )}
      {...props}
    >
      <TapePicture asset={variant} className="drop-shadow-[1px_2px_1.5px_rgba(0,0,0,0.28)]" />
      {children}
    </div>
  )
}

/* ──────────────────────────────────────────────
   Staple — curated image-backed news staple pin
   ────────────────────────────────────────────── */
export interface StapleProps extends React.ComponentProps<'div'> {
  position?: 'left' | 'right' | 'top' | 'bottom'
}

function Staple({ className, position = 'left', ...props }: StapleProps) {
  const asset = position === 'left' ? newsStapleAssets.left : newsStapleAssets.right

  // Check if custom positioning classes are passed
  const hasCustomPositioning =
    className?.includes('top-') ||
    className?.includes('bottom-') ||
    className?.includes('left-') ||
    className?.includes('right-') ||
    className?.includes('translate-')

  return (
    <div
      data-slot="staple"
      data-position={position}
      className={cn(
        'pointer-events-none absolute z-30 select-none',
        !hasCustomPositioning && [
          'w-[14%] max-w-[90px] data-[position=left]:bottom-0 data-[position=left]:left-[20px]',
          'w-[10%] max-w-[90px] data-[position=right]:right-[20px] data-[position=right]:bottom-0',
          'w-[10%] max-w-[90px] rotate-90 data-[position=top]:top-0 data-[position=top]:left-[20px]',
          'w-[10%] max-w-[90px] rotate-90 data-[position=bottom]:bottom-0 data-[position=bottom]:left-[20px]',
        ],
        className
      )}
      {...props}
    >
      <picture>
        <img
          alt=""
          className={cn(
            'block h-auto w-full',
            position === 'left'
              ? 'drop-shadow-[1px_2px_2px_rgba(0,0,0,0.25)]'
              : 'drop-shadow-[1px_1.5px_1.5px_rgba(0,0,0,0.25)]'
          )}
          decoding="async"
          draggable={false}
          loading="lazy"
          height={asset.height}
          src={asset.src}
          width={asset.width}
        />
      </picture>
    </div>
  )
}

export { Tape, Staple }
