import * as React from 'react'

import { cn } from '@/lib/utils'
import { CardSlot, type CardSlotProps } from './card-slot'
import { TapeResponsivePictures } from './tape-picture'
import type { TapeImageVariant } from './tape-assets'
import { WideTornPaper } from './wide-torn-paper'
import styles from './torn-card.module.css'

type TornCardVariant = 'a' | 'b' | 'c'

interface TornCardVariantConfig {
  rotation: string
  tapePosition: 'top-right' | 'bottom-center'
  showSticker: boolean
  tapeAsset: TapeImageVariant
  stickerAsset?: TapeImageVariant
}

export { CardSlot as TornCardSlot }
export type { CardSlotProps as TornCardSlotProps }

export interface TornCardProps extends React.ComponentProps<'div'> {
  variant?: TornCardVariant
  rotation?: string
  background?: string
  /** Show decorative tape at the top edge (default: true) */
  showTape?: boolean
  /** Show decorative sticker (default: false) */
  showSticker?: boolean
  /** Tape position at card edge */
  tapePosition?: 'top-right' | 'bottom-center'
}

const VARIANT_CONFIG: Record<TornCardVariant, TornCardVariantConfig> = {
  a: {
    rotation: '2deg',
    tapePosition: 'top-right' as const,
    showSticker: false,
    tapeAsset: 'tape-3',
  },
  b: {
    rotation: '-1.5deg',
    tapePosition: 'top-right' as const,
    showSticker: false,
    tapeAsset: 'tape-2',
  },
  c: {
    rotation: '3deg',
    tapePosition: 'bottom-center' as const,
    showSticker: true,
    tapeAsset: 'tape-2',
    stickerAsset: 'sticker-10',
  },
} satisfies Record<TornCardVariant, TornCardVariantConfig>

export function TornCard({
  ref,
  className,
  variant = 'a',
  rotation,
  background = '#efefef',
  showTape = true,
  showSticker,
  tapePosition,
  children,
  ...props
}: TornCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const config = VARIANT_CONFIG[variant]
  const resolvedRotation = rotation ?? config.rotation
  const resolvedTapePosition = tapePosition ?? config.tapePosition
  const resolvedShowSticker = showSticker ?? config.showSticker

  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant={variant}
      style={
        {
          transform: `rotate(${resolvedRotation})`,
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,.3))',
        } as React.CSSProperties
      }
      className={cn('group/card text-chaos-black relative z-10 w-full text-center', className)}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none">
        <WideTornPaper bgColor={background} />
      </div>

      <div className="@container w-full">
        {showTape && (
          <CardSlot position={resolvedTapePosition}>
            <TapeResponsivePictures
              asset={config.tapeAsset}
              mobilePictureClassName={cn(styles.tape, styles.imgMobile)}
              desktopPictureClassName={cn(styles.tape, styles.imgDesktop)}
            />
          </CardSlot>
        )}

        {resolvedShowSticker && config.stickerAsset ? (
          <CardSlot position="top-right">
            <TapeResponsivePictures
              asset={config.stickerAsset}
              mobilePictureClassName={styles.imgMobile}
              desktopPictureClassName={styles.imgDesktop}
            />
          </CardSlot>
        ) : null}

        <div className={cn(styles.alertContent, 'relative z-10 flex flex-col gap-4')}>
          <div className="flex flex-col gap-2">{children}</div>
        </div>
      </div>
    </div>
  )
}

function isCssColor(value: string) {
  return (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('var(') ||
    value.startsWith('hsl')
  )
}

function TornCardTitle({
  className,
  textColor = 'text-blue',
  style,
  ...props
}: React.ComponentProps<'h2'> & { textColor?: string }) {
  const colorStyle = textColor && isCssColor(textColor) ? { color: textColor } : undefined
  const twClass = textColor && !isCssColor(textColor) ? textColor : ''
  return (
    <h2
      data-slot="card-title"
      className={cn('splat-heading text-2xl', twClass, className)}
      style={colorStyle ? { ...colorStyle, ...style } : style}
      {...props}
    />
  )
}

function TornCardDescription({
  className,
  textColor,
  style,
  ...props
}: React.ComponentProps<'p'> & { textColor?: string }) {
  const colorStyle = textColor && isCssColor(textColor) ? { color: textColor } : undefined
  const twClass = textColor && !isCssColor(textColor) ? textColor : ''
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm opacity-90', twClass, className)}
      style={colorStyle ? { ...colorStyle, ...style } : style}
      {...props}
    />
  )
}

export { TornCardTitle, TornCardDescription }
