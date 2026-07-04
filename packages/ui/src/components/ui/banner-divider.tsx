'use client'

import * as React from 'react'

import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import inViewStyles from './in-view.module.css'
import styles from './banner-divider.module.css'

export type BannerDividerVariant =
  | 'design1'
  | 'design2'
  | 'design3'
  | 'yellow'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'

export type BannerDividerOffsetY =
  | number
  | {
      base: number
      medium?: number
    }

export type BannerDividerEnterFrom = 'left' | 'right'

export interface BannerDividerTape {
  variant: BannerDividerVariant
  /** Final resting rotation in degrees. */
  rotate: number
  /** Responsive top offset in px. */
  offsetY?: BannerDividerOffsetY
  /** Direction used by the entrance animation. */
  enterFrom?: BannerDividerEnterFrom
  className?: string
  /** InView animation delay level (0-20). Default: auto (index-based) */
  animDelay?: number
}

export interface BannerDividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Explicit tape layers. Use two or three layers for the current Splatoon-style divider patterns. */
  tapes: BannerDividerTape[]
  /** Enable InView fly-in animation on each tape. */
  animate?: boolean
  /** Root margin for InView IntersectionObserver. */
  rootMargin?: string
  /**
   * Overlay matches the reference behavior: the divider paints across the section edge
   * without reserving document flow height. Use spacer only when a layout intentionally
   * needs the divider to occupy vertical space.
   */
  layout?: 'overlay' | 'spacer'
  ref?: React.Ref<HTMLDivElement>
}

function resolveOffsetY(offsetY: BannerDividerOffsetY | undefined) {
  if (typeof offsetY === 'number') {
    return { base: offsetY, medium: offsetY }
  }

  return {
    base: offsetY?.base ?? 0,
    medium: offsetY?.medium ?? offsetY?.base ?? 0,
  }
}

function resolveEnterFrom(index: number, enterFrom: BannerDividerEnterFrom | undefined) {
  return enterFrom ?? (index % 2 === 0 ? 'left' : 'right')
}

function BannerDividerTapeLayer({
  variant,
  rotate,
  offsetY,
  enterFrom,
  className,
  animate,
  isInView,
  animDelay,
  index,
}: BannerDividerTape & {
  animate?: boolean
  isInView?: boolean
  index: number
}) {
  const { base, medium } = resolveOffsetY(offsetY)
  const delay = animDelay ?? index
  const startX = resolveEnterFrom(index, enterFrom) === 'left' ? '-100%' : '100%'

  return (
    <div
      aria-hidden="true"
      className={cn(
        animate && inViewStyles.anim,
        animate && isInView && inViewStyles.inView,
        styles.bannerDividerTape,
        styles[`banner-divider--${variant}`],
        delay > 0 && inViewStyles[`delay${delay}` as keyof typeof inViewStyles],
        className
      )}
      style={
        {
          top: `${base}px`,
          '--banner-offset-medium': `${medium}px`,
          '--start-x': startX,
          '--start-y': '-50%',
          '--end-x': '-50%',
          '--end-y': index === 0 ? '-25%' : '-50%',
          '--start-rotate': '0deg',
          '--end-rotate': `${rotate}deg`,
        } as React.CSSProperties
      }
    />
  )
}

export function BannerDivider({
  ref,
  tapes,
  animate,
  rootMargin,
  layout = 'overlay',
  className,
  style: styleProp,
  ...props
}: BannerDividerProps) {
  const [isInView, inViewRef] = useInView<HTMLDivElement>({
    rootMargin: rootMargin ?? '0px',
    once: true,
    disabled: !animate,
  })
  const maxBaseOffset = Math.max(0, ...tapes.map((tape) => resolveOffsetY(tape.offsetY).base))
  const maxMediumOffset = Math.max(0, ...tapes.map((tape) => resolveOffsetY(tape.offsetY).medium))

  return (
    <div
      ref={ref}
      className={cn(
        styles.bannerDividerGroup,
        layout === 'spacer' && styles.bannerDividerGroupSpacer,
        className
      )}
      style={
        {
          '--banner-divider-max-offset': `${maxBaseOffset}px`,
          '--banner-divider-max-offset-medium': `${maxMediumOffset}px`,
          ...styleProp,
        } as React.CSSProperties
      }
      {...props}
      data-slot="banner-divider"
      data-layout={layout}
    >
      <div
        ref={animate ? inViewRef : undefined}
        className={cn(styles.bannerDividerViewport, animate && isInView && inViewStyles.inView)}
      >
        {tapes.map((tape, i) => (
          <BannerDividerTapeLayer
            key={i}
            {...tape}
            animate={animate}
            isInView={isInView}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
