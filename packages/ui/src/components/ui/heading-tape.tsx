import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './heading-tape.module.css'

export type HeadingTapeDecorationPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
export type HeadingTapeDecorationSet = 'stickers' | 'none'
export type HeadingTapeSafeAreaEdge = 'inlineStart' | 'inlineEnd' | 'blockStart' | 'blockEnd'
export type HeadingTapeSize = 'default' | 'compact'

export type HeadingTapeDecorationSafeArea = Partial<Record<HeadingTapeSafeAreaEdge, string>>

export interface HeadingTapeDecorationImage {
  src: string
  srcSet?: string
  width: number
  height: number
  alt?: string
}

export interface HeadingTapeDecoration {
  id: React.Key
  position: HeadingTapeDecorationPosition
  mobile: HeadingTapeDecorationImage
  desktop?: HeadingTapeDecorationImage
  rotate?: string
  inlineOffset?: string
  blockOffset?: string
  inlineSize?: string
  maxInlineSize?: string
  safeArea?: HeadingTapeDecorationSafeArea
  className?: string
  imageClassName?: string
  style?: React.CSSProperties
}

const defaultDecorations = [
  {
    id: 'sticker-8',
    position: 'bottom-left',
    rotate: '-2deg',
    inlineOffset: '-19px',
    blockOffset: '-17px',
    safeArea: {
      inlineStart: '19px',
      blockEnd: '17px',
    },
    mobile: {
      src: '/_images/tape-assets/sticker-8.png',
      srcSet: '/_images/tape-assets/sticker-8.webp 1x, /_images/tape-assets/sticker-8-2x.webp 2x',
      width: 198,
      height: 35,
      alt: '',
    },
    desktop: {
      src: '/_images/tape-assets/sticker-8-medium-up.png',
      srcSet:
        '/_images/tape-assets/sticker-8-medium-up.webp 1x, /_images/tape-assets/sticker-8-medium-up-2x.webp 2x',
      width: 406,
      height: 71.5,
      alt: '',
    },
  },
  {
    id: 'sticker-12',
    position: 'top-right',
    rotate: '1deg',
    inlineOffset: '-17px',
    blockOffset: '-15px',
    safeArea: {
      inlineEnd: '17px',
      blockStart: '15px',
    },
    mobile: {
      src: '/_images/tape-assets/sticker-12.png',
      srcSet: '/_images/tape-assets/sticker-12.webp 1x, /_images/tape-assets/sticker-12-2x.webp 2x',
      width: 416,
      height: 58,
      alt: '',
    },
    desktop: {
      src: '/_images/tape-assets/sticker-12-medium-up.png',
      srcSet:
        '/_images/tape-assets/sticker-12-medium-up.webp 1x, /_images/tape-assets/sticker-12-medium-up-2x.webp 2x',
      width: 641,
      height: 89,
      alt: '',
    },
  },
] satisfies HeadingTapeDecoration[]

const decorationSets = {
  stickers: defaultDecorations,
  none: [],
} satisfies Record<HeadingTapeDecorationSet, readonly HeadingTapeDecoration[]>

const decorationPositionClassName = {
  'top-left': styles.decorationTopLeft,
  'top-right': styles.decorationTopRight,
  'bottom-left': styles.decorationBottomLeft,
  'bottom-right': styles.decorationBottomRight,
} satisfies Record<HeadingTapeDecorationPosition, string>

const safeAreaCssVariable = {
  inlineStart: '--heading-tape-safe-inline-start',
  inlineEnd: '--heading-tape-safe-inline-end',
  blockStart: '--heading-tape-safe-block-start',
  blockEnd: '--heading-tape-safe-block-end',
} satisfies Record<HeadingTapeSafeAreaEdge, string>

function cssMax(values: Array<string | undefined>) {
  const resolvedValues = values.filter((value): value is string => Boolean(value))

  if (resolvedValues.length === 0) {
    return '0px'
  }

  return resolvedValues.length === 1 ? resolvedValues[0] : `max(${resolvedValues.join(', ')})`
}

function getDecorationSafeAreaStyle(decorations: readonly HeadingTapeDecoration[]) {
  return Object.fromEntries(
    (Object.keys(safeAreaCssVariable) as HeadingTapeSafeAreaEdge[]).map((edge) => [
      safeAreaCssVariable[edge],
      cssMax(decorations.map((decoration) => decoration.safeArea?.[edge])),
    ])
  ) as React.CSSProperties
}

export interface HeadingTapeProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  children: React.ReactNode
  className?: string
  decorationSet?: HeadingTapeDecorationSet
  decorations?: HeadingTapeDecoration[] | false
  overlapTop?: boolean
  marginOffset?: number
  size?: HeadingTapeSize
  ref?: React.Ref<HTMLDivElement>
}

function HeadingTapeDecorationSlot({ decoration }: { decoration: HeadingTapeDecoration }) {
  return (
    <span
      aria-hidden="true"
      data-slot="heading-tape-decoration"
      data-position={decoration.position}
      className={cn(
        styles.headingTapeDecoration,
        decorationPositionClassName[decoration.position],
        decoration.className
      )}
      style={
        {
          '--heading-tape-decoration-max-inline-size': decoration.maxInlineSize,
          '--heading-tape-decoration-inline-size': decoration.inlineSize,
          '--heading-tape-decoration-inline-offset': decoration.inlineOffset,
          '--heading-tape-decoration-block-offset': decoration.blockOffset,
          '--heading-tape-decoration-rotate': decoration.rotate ?? '0deg',
          ...decoration.style,
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={cn(
          styles.headingTapeDecorationImage,
          styles.headingTapeDecorationImageMobile,
          decoration.imageClassName
        )}
        alt={decoration.mobile.alt ?? ''}
        src={decoration.mobile.src}
        srcSet={decoration.mobile.srcSet}
        width={decoration.mobile.width}
        height={decoration.mobile.height}
        decoding="async"
        loading="lazy"
      />
      {decoration.desktop && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={cn(
            styles.headingTapeDecorationImage,
            styles.headingTapeDecorationImageDesktop,
            decoration.imageClassName
          )}
          alt={decoration.desktop.alt ?? ''}
          src={decoration.desktop.src}
          srcSet={decoration.desktop.srcSet}
          width={decoration.desktop.width}
          height={decoration.desktop.height}
          decoding="async"
          loading="lazy"
        />
      )}
    </span>
  )
}

export function HeadingTape({
  ref,
  children,
  className,
  decorationSet = 'stickers',
  decorations,
  overlapTop = false,
  marginOffset = 5,
  size = 'default',
  style,
  ...props
}: HeadingTapeProps) {
  const resolvedDecorations =
    decorations === false ? [] : (decorations ?? decorationSets[decorationSet])
  const decorationSafeAreaStyle = getDecorationSafeAreaStyle(resolvedDecorations)

  return (
    <div
      ref={ref}
      data-slot="heading-tape"
      data-has-decorations={resolvedDecorations.length > 0 ? 'true' : 'false'}
      data-size={size}
      className={cn(
        styles.headingTapeSection,
        size === 'compact' && styles.compact,
        overlapTop && styles.overlapTop,
        className
      )}
      style={
        {
          '--margin-offset': String(marginOffset),
          ...decorationSafeAreaStyle,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <span className={styles.headingTapeContainer}>
        {resolvedDecorations.length > 0 && (
          <span className={styles.headingTapeDecorations}>
            {resolvedDecorations.map((decoration) => (
              <HeadingTapeDecorationSlot key={decoration.id} decoration={decoration} />
            ))}
          </span>
        )}

        <span className={styles.headingTapeText}>{children}</span>
      </span>
    </div>
  )
}
