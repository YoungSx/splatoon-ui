import * as React from 'react'

import { cn } from '@/lib/utils'
import { isTapeImageVariant, type TapeImageVariant } from './tape-assets'
import { MediaDecoration } from './media-decoration'
import styles from './photo-frame.module.css'

/* ── PhotoFrame — unified styled-photo with tape decoration ── */

type PhotoFrameVariant = 'a' | 'b' | 'c' | 'd' | 'e'

interface PhotoTapeAssetConfig {
  asset: TapeImageVariant
  /** Tape rotation */
  rotation: string
}

interface PhotoDecorationAssetConfig {
  asset: TapeImageVariant
}

export interface PhotoFrameProps extends React.ComponentProps<'div'> {
  /** Image source */
  src?: string
  /** Image alt text */
  alt?: string
  /** Border style variant */
  border?: 'default' | 'thin' | 'medium'
  /** Component variant preset */
  variant?: PhotoFrameVariant
  /** Show decorative tape (default: from variant config) */
  showTape?: boolean
  /** Show decorative sticker (default: from variant config) */
  showSticker?: boolean
  /** Tape position at photo edge */
  tapePosition?: 'center' | 'left' | 'right'
  /** CSS custom property for rotation */
  rotation?: string
  /** CSS custom property for margin offset */
  marginOffset?: number
  /** Nested mode (smaller, scaled tape) */
  nested?: boolean
  /** Fill width (block display) */
  fillWidth?: boolean
}

/* ── Variant presets ── */

const TAPE_CONFIG = {
  'tape-2': {
    asset: 'tape-2',
    rotation: '6deg',
  },
  'tape-5': {
    asset: 'tape-5',
    rotation: '0deg',
  },
} satisfies Record<string, PhotoTapeAssetConfig>

const DECORATION_CONFIG = {
  'sticker-9': {
    asset: 'sticker-9',
  },
  'sticker-10': {
    asset: 'sticker-10',
  },
} satisfies Record<string, PhotoDecorationAssetConfig>

const VARIANT_CONFIG = {
  /** No tape, no decoration */
  a: {
    rotation: '1deg',
    border: 'default' as const,
    showTape: false,
    showSticker: false,
    tapeType: 'tape-2',
    tapePosition: 'center' as const,
    decorationType: 'sticker-9',
    decorationPosition: 'bottomLeft' as const,
  },
  /** Top-center tape-2 */
  b: {
    rotation: '0deg',
    border: 'default' as const,
    showTape: true,
    showSticker: false,
    tapeType: 'tape-2',
    tapePosition: 'center' as const,
    decorationType: 'sticker-9',
    decorationPosition: 'bottomLeft' as const,
  },
  /** Top-center tape-5 + bottom-left sticker-9 */
  c: {
    rotation: '-2deg',
    border: 'medium' as const,
    showTape: true,
    showSticker: true,
    tapeType: 'tape-5',
    tapePosition: 'center' as const,
    decorationType: 'sticker-9',
    decorationPosition: 'bottomLeft' as const,
  },
  /** Top-right sticker-10 */
  d: {
    rotation: '1deg',
    border: 'thin' as const,
    showTape: false,
    showSticker: true,
    tapeType: 'tape-2',
    tapePosition: 'center' as const,
    decorationType: 'sticker-10',
    decorationPosition: 'topRight' as const,
  },
  /** Top-center tape-5 only (no sticker) */
  e: {
    rotation: '-2deg',
    border: 'medium' as const,
    showTape: true,
    showSticker: false,
    tapeType: 'tape-5',
    tapePosition: 'center' as const,
    decorationType: 'sticker-9',
    decorationPosition: 'bottomLeft' as const,
  },
} as const

export function PhotoFrame({
  ref,
  src,
  alt,
  border,
  variant = 'a',
  showTape,
  showSticker,
  tapePosition,
  rotation,
  marginOffset,
  nested = false,
  fillWidth = false,
  className,
  children,
  style,
  ...props
}: PhotoFrameProps & { ref?: React.Ref<HTMLDivElement> }) {
  const config = VARIANT_CONFIG[variant]
  const resolvedBorder = border ?? config.border
  const resolvedShowTape = showTape ?? config.showTape
  const resolvedShowSticker = showSticker ?? config.showSticker
  const resolvedTapePosition = tapePosition ?? config.tapePosition
  const resolvedRotation = rotation ?? config.rotation
  const resolvedTapeType = config.tapeType
  const tapeConfig = TAPE_CONFIG[resolvedTapeType]
  const resolvedTapeRotation = tapeConfig.rotation

  return (
    <div
      ref={ref}
      data-slot="photo-frame"
      data-variant={variant}
      className={cn(
        styles.photoFrame,
        fillWidth && styles.fillWidth,
        nested && styles.nested,
        resolvedBorder === 'thin' && styles.thinBorder,
        resolvedBorder === 'medium' && styles.mediumBorder,
        className
      )}
      style={
        {
          '--end-rotate': resolvedRotation,
          '--tape-rotation': resolvedTapeRotation,
          '--margin-offset': marginOffset ?? 6,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {resolvedShowTape && <PhotoTape position={resolvedTapePosition} type={resolvedTapeType} />}

      {resolvedShowSticker && (
        <PhotoDecoration position={config.decorationPosition} type={config.decorationType} />
      )}

      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? 'Styled photo'} className={styles.photo} />
      ) : (
        children
      )}
    </div>
  )
}

/* ── PhotoTape — tape decoration ── */

const TAPE_POSITION: Record<string, string> = {
  center: styles.tapeCenter,
  left: styles.tapeLeft,
  right: styles.tapeRight,
  bottomCenter: styles.tapeBottomCenter,
  bottomLeft: styles.tapeBottomLeft,
  bottomRight: styles.tapeBottomRight,
}

export interface PhotoTapeProps extends React.ComponentProps<'div'> {
  /** Tape position */
  position?: 'center' | 'left' | 'right' | 'bottomCenter' | 'bottomLeft' | 'bottomRight'
  /** Tape type */
  type?: string
}

export function PhotoTape({
  position = 'center',
  type = 'tape-2',
  className,
  ...props
}: PhotoTapeProps) {
  const config = TAPE_CONFIG[type as keyof typeof TAPE_CONFIG]
  if (!config) return null

  return (
    <MediaDecoration
      asset={config.asset}
      className={cn(styles.tape, TAPE_POSITION[position], className)}
      mobilePictureClassName={styles.tapeMobile}
      desktopPictureClassName={styles.tapeDesktop}
      {...props}
    />
  )
}

/* ── PhotoDecoration — decorative sticker ── */

const DECORATION_POSITION: Record<string, string> = {
  bottomLeft: styles.decorationBottomLeft,
  topRight: styles.decorationTopRight,
  bottomRight: styles.decorationBottomRight,
  center: styles.decorationCenter,
}

export interface PhotoDecorationProps extends React.ComponentProps<'div'> {
  /** Decoration position */
  position?: 'bottomLeft' | 'topRight' | 'bottomRight' | 'center'
  /** Decoration type */
  type?: string
}

export function PhotoDecoration({
  position = 'bottomLeft',
  type = 'sticker-9',
  className,
  ...props
}: PhotoDecorationProps) {
  const config = DECORATION_CONFIG[type as keyof typeof DECORATION_CONFIG]
  const asset = config?.asset ?? (isTapeImageVariant(type) ? type : null)
  if (!asset) return null

  return (
    <MediaDecoration
      asset={asset}
      className={cn(styles.decoration, DECORATION_POSITION[position], className)}
      mobilePictureClassName={styles.decorationMobile}
      desktopPictureClassName={styles.decorationDesktop}
      {...props}
    />
  )
}
