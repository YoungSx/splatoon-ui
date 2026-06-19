import * as React from 'react'

import { newsStapleAssets } from './news-assets'
import { isTapeImageVariant, type TapeImageVariant } from './tape-assets'
import { TapePicture } from './tape-picture'
import { cn } from '@/lib/utils'

/* ──────────────────────────────────────────────
   Tape — curated tape/sticker image assets with utility fallbacks
   ────────────────────────────────────────────── */
type TapeUtilityVariant = 'torn' | 'smooth' | 'scotch'
export type TapeVariant = TapeImageVariant | TapeUtilityVariant

export interface TapeProps extends React.ComponentProps<'div'> {
  variant?: TapeVariant
  position?: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right' | 'news' | 'event'
  color?: 'yellow' | 'red' | 'blue' | 'green'
  text?: string
}

function Tape({
  className,
  variant = 'tape-1',
  position = 'top-left',
  color = 'yellow',
  text,
  children,
  ...props
}: TapeProps) {
  const stickerColorMap = {
    yellow: { bg: 'var(--color-yellow)', text: 'var(--color-black)' },
    red: { bg: 'var(--color-red)', text: 'var(--color-white)' },
    blue: { bg: 'var(--color-blue)', text: 'var(--color-yellow)' },
    green: { bg: 'var(--color-green)', text: 'var(--color-black)' },
  }

  const colors = stickerColorMap[color] || stickerColorMap.yellow
  const displayText = text || (variant === 'torn' ? '' : 'ALERT!')
  const imageAsset = isTapeImageVariant(variant) ? variant : null

  const renderUtilitySvg = () => {
    switch (variant) {
      case 'torn':
        return (
          <svg
            viewBox="0 0 96 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]"
          >
            <path
              d="M 4,1.5
               Q 27,0.5 48,1.2 Q 70,0.5 92,1.5
               L 93,3 L 91.5,4.5 L 94,6 L 92,7.5 L 94.5,9 L 92.5,11 L 95,12.5 L 93,14 L 95.5,15.5 L 93.5,17 L 95,18.5 L 93,20 L 94.5,22 L 92.5,23.5 L 94,25 L 92,26.5 L 93.5,28 L 91,29.5
               Q 70,30.5 48,29.2 Q 26,30 4,29.5
               L 2.5,28 L 4,26.5 L 1.8,25 L 3.5,23.5 L 1.2,22 L 3.2,20.5 L 1,19 L 2.8,17.5 L 0.8,16 L 2.5,14.5 L 0.5,13 L 2.2,11.5 L 0.8,10 L 2.8,8.5 L 1.2,7 L 3.2,5.5 L 1.8,4 L 4,1.5
               Z"
              fill={colors.bg}
            />
            <g fill={colors.text}>
              <path d="M74,7 h4.5 c1.5,0 2.5,0.8 2.5,1.8 v0.2 c0,0.8 -0.6,1.4 -1.5,1.6 c1,0.2 1.7,0.8 1.7,1.7 v0.2 c0,1 -1,1.8 -2.5,1.8 h-4.7 z M76.5,8.8 v2.2 h1.8 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z M76.5,12.5 v2.2 h2 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z" />
              <text
                x="73"
                y="26"
                fontFamily="monospace"
                fontWeight="900"
                fontSize="4.5"
                letterSpacing="0.2"
              >
                VALK
              </text>
            </g>
            <g fill={colors.text}>
              <rect x="11" y="9" width="3" height="13" />
              <circle cx="21" cy="15" r="5" stroke={colors.text} strokeWidth="1.8" fill="none" />
              <line x1="26.5" y1="9" x2="26.5" y2="22" stroke={colors.text} strokeWidth="1.8" />
              <rect x="36" y="10" width="5.5" height="1" />
              <rect x="36" y="15" width="5.5" height="1" />
              <rect x="36" y="20" width="5.5" height="1" />
              <rect x="46" y="20" width="5.5" height="1" />
            </g>
            <g fill={colors.text}>
              {displayText && displayText !== 'NEWS!' && displayText !== '8W-157' ? (
                <text
                  x="8"
                  y="19.5"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  fontSize={
                    displayText.length > 12 ? '6.5' : displayText.length > 9 ? '7.5' : '8.5'
                  }
                  letterSpacing="0.3"
                >
                  {displayText.toUpperCase()}
                </text>
              ) : (
                <path
                  d="M10,21 L16,11 H22 L16,21 H10 Z M20,21 L26,11 H32 L26,21 H20 Z M30,21 L36,11 H42 L36,21 H30 Z M40,21 L46,11 H52 L46,21 H40 Z"
                  opacity="0.85"
                />
              )}
            </g>
          </svg>
        )
      case 'smooth':
        return (
          <svg
            viewBox="0 0 96 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]"
          >
            <rect width="96" height="31" rx="5" fill={colors.bg} />
            {/* Right logo */}
            <g fill={colors.text}>
              <path d="M74,7 h4.5 c1.5,0 2.5,0.8 2.5,1.8 v0.2 c0,0.8 -0.6,1.4 -1.5,1.6 c1,0.2 1.7,0.8 1.7,1.7 v0.2 c0,1 -1,1.8 -2.5,1.8 h-4.7 z M76.5,8.8 v2.2 h1.8 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z M76.5,12.5 v2.2 h2 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z" />
              <text
                x="73"
                y="26"
                fontFamily="monospace"
                fontWeight="900"
                fontSize="4.5"
                letterSpacing="0.2"
              >
                VALK
              </text>
            </g>
            {/* Text content */}
            <g fill={colors.text}>
              <text
                x="8"
                y="19.5"
                fontFamily="sans-serif"
                fontWeight="900"
                fontSize={displayText.length > 12 ? '6.5' : displayText.length > 9 ? '7.5' : '8.5'}
                letterSpacing="0.3"
              >
                {displayText.toUpperCase()}
              </text>
            </g>
          </svg>
        )
      case 'scotch':
        return (
          <svg
            viewBox="0 0 100 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full"
          >
            <path d="M5 6 L95 2 L93 24 L3 28 Z" fill="#0d0d0d" opacity="0.15" />
            <path
              d="M3 4 L93 0 L91 22 L1 26 Z"
              fill="#f4f4f4"
              fillOpacity="0.65"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M3 4 L1.5 8 L2.5 12 L0.5 16 L2 20 L0.5 24 L1 26 M93 0 L91.5 4 L92.5 8 L90.5 12 L92 16 L90.5 20 L91 22"
              stroke="#18181b"
              strokeWidth="1.2"
            />
          </svg>
        )
      default:
        return null
    }
  }

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
      {imageAsset ? (
        <TapePicture asset={imageAsset} className="drop-shadow-[1px_2px_1.5px_rgba(0,0,0,0.28)]" />
      ) : (
        renderUtilitySvg()
      )}
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
          height={asset.height}
          src={asset.src}
          width={asset.width}
        />
      </picture>
    </div>
  )
}

export { Tape, Staple }
