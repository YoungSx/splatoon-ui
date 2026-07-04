import * as React from 'react'

import { cn } from '@/lib/utils'
import { CardSlot } from './card-slot'
import { MediaDecoration } from './media-decoration'
import type { TapeImageVariant } from './tape-assets'
import type { SplatoonColorValue } from './theme-tokens'
import { WideTornPaper } from './wide-torn-paper'
import styles from './torn-card.module.css'

export type TornCardVariant = 'a' | 'b' | 'c'

interface TornCardVariantConfig {
  rotation: string
  tapePosition: 'top-right' | 'bottom-center'
  showSticker: boolean
  tapeAsset: TapeImageVariant
  stickerAsset?: TapeImageVariant
}

export type TornCardSlotPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface TornCardSlotProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  /** Preset position. Omit for fully custom positioning via style. */
  position?: TornCardSlotPosition
  ref?: React.Ref<HTMLDivElement>
}

export function TornCardSlot({ ref, ...props }: TornCardSlotProps) {
  return <CardSlot ref={ref} {...props} />
}

export interface TornCardProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  variant?: TornCardVariant
  rotation?: string
  background?: SplatoonColorValue
  /** Show decorative tape at the top edge (default: true) */
  showTape?: boolean
  /** Show decorative sticker (default: false) */
  showSticker?: boolean
  /** Tape position at card edge */
  tapePosition?: 'top-right' | 'bottom-center'
  ref?: React.Ref<HTMLDivElement>
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
}: TornCardProps) {
  const config = VARIANT_CONFIG[variant]
  const resolvedRotation = rotation ?? config.rotation
  const resolvedTapePosition = tapePosition ?? config.tapePosition
  const resolvedShowSticker = showSticker ?? config.showSticker

  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant={variant}
      className={cn('group/card text-chaos-black relative z-10 w-full text-center', className)}
      {...props}
    >
      <div
        className={styles.visual}
        style={{ '--torn-card-rotation': resolvedRotation } as React.CSSProperties}
      >
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none">
          <WideTornPaper backgroundColor={background} />
        </div>

        <div className="@container w-full">
          {showTape && (
            <MediaDecoration
              position={resolvedTapePosition}
              asset={config.tapeAsset}
              mobilePictureClassName={cn(styles.tape, styles.imgMobile)}
              desktopPictureClassName={cn(styles.tape, styles.imgDesktop)}
            />
          )}

          {resolvedShowSticker && config.stickerAsset ? (
            <MediaDecoration
              position="top-right"
              asset={config.stickerAsset}
              mobilePictureClassName={styles.imgMobile}
              desktopPictureClassName={styles.imgDesktop}
            />
          ) : null}

          <div className={cn(styles.alertContent, 'relative z-10 flex flex-col gap-4')}>
            <div className="flex flex-col gap-2">{children}</div>
          </div>
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

export interface TornCardTitleProps extends Omit<React.ComponentProps<'h2'>, 'ref'> {
  textColor?: string
  ref?: React.Ref<HTMLHeadingElement>
}

function TornCardTitle({
  ref,
  className,
  textColor = 'text-blue',
  style,
  ...props
}: TornCardTitleProps) {
  const colorStyle = textColor && isCssColor(textColor) ? { color: textColor } : undefined
  const twClass = textColor && !isCssColor(textColor) ? textColor : ''
  return (
    <h2
      ref={ref}
      data-slot="card-title"
      className={cn('splat-heading text-2xl', twClass, className)}
      style={colorStyle ? { ...colorStyle, ...style } : style}
      {...props}
    />
  )
}

export interface TornCardDescriptionProps extends Omit<React.ComponentProps<'p'>, 'ref'> {
  textColor?: string
  ref?: React.Ref<HTMLParagraphElement>
}

function TornCardDescription({
  ref,
  className,
  textColor,
  style,
  ...props
}: TornCardDescriptionProps) {
  const colorStyle = textColor && isCssColor(textColor) ? { color: textColor } : undefined
  const twClass = textColor && !isCssColor(textColor) ? textColor : ''
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn('text-sm opacity-90', twClass, className)}
      style={colorStyle ? { ...colorStyle, ...style } : style}
      {...props}
    />
  )
}

export { TornCardTitle, TornCardDescription }
