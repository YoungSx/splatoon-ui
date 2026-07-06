import * as React from 'react'

import { cn } from '@/lib/utils'
import { createNewsStapleAssets } from './news-assets'
import { MediaDecoration } from './media-decoration'
import { PaperSurface } from './paper-surface'
import type { SplatoonAssetBasePath } from './assets'
import styles from './staple-card.module.css'

/* ── Variant config ── */

export type StapleCardVariant = 'a' | 'b' | 'c' | 'd'

const VARIANT_CONFIG = {
  /** No tape */
  a: { showTape: false },
  /** With tape */
  b: { showTape: true },
  /** With tape (alt) */
  c: { showTape: true },
  /** With tape (alt) */
  d: { showTape: true },
} as const

/* ── StapleCard ── */

export interface StapleCardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'> {
  /** Variant preset (controls tape visibility and position) */
  variant?: StapleCardVariant
  /** Image/media shown in the tilted image area */
  image?: React.ReactNode
  /** Convenience: renders a title paragraph in the info area */
  title?: React.ReactNode
  /** Convenience: renders a subtitle paragraph below the title */
  subtitle?: React.ReactNode
  /** Convenience: renders an action element (e.g. a Button) at the bottom of info */
  action?: React.ReactNode
  /** Visual surface: "white" (default) or "dark" (dark bg, white text) */
  surface?: 'white' | 'dark'
  /** Whether to show the decorative tape element (default: from variant config) */
  showTape?: boolean
  /** Enable hover tilt animation (default: false) */
  hoverTilt?: boolean
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  className?: string
  children?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export function StapleCard({
  ref,
  variant = 'b',
  image,
  title,
  subtitle,
  action,
  surface = 'white',
  showTape,
  hoverTilt = false,
  assetBasePath,
  className,
  children,
  ...props
}: StapleCardProps) {
  const config = VARIANT_CONFIG[variant]
  const resolvedShowTape = showTape ?? config.showTape
  const isDark = surface === 'dark'
  const newsStapleAssets = createNewsStapleAssets(assetBasePath)

  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant={variant}
      className={cn(styles.stapleCard, isDark && styles.surfaceDark, className)}
      {...props}
    >
      <div className={cn(styles.card, hoverTilt && styles.hoverTilt)}>
        <PaperSurface
          tone={isDark ? 'black' : 'white'}
          topEdgeClassName={styles.cardTop}
          bottomEdgeClassName={styles.cardBottom}
          contentClassName={styles.cardSurface}
        >
          <div className={styles.stapleLayer} aria-hidden="true">
            <div className={styles.stapleLeft}>
              {/* eslint-disable-next-line @next/next/no-img-element -- reusable library decoration with fixed public asset dimensions */}
              <img
                alt=""
                src={newsStapleAssets.left.src}
                width={newsStapleAssets.left.width}
                height={newsStapleAssets.left.height}
                decoding="async"
                loading="lazy"
              />
            </div>
            <div className={styles.stapleRight}>
              {/* eslint-disable-next-line @next/next/no-img-element -- reusable library decoration with fixed public asset dimensions */}
              <img
                alt=""
                src={newsStapleAssets.right.src}
                width={newsStapleAssets.right.width}
                height={newsStapleAssets.right.height}
                decoding="async"
                loading="lazy"
              />
            </div>
          </div>
          <div className={styles.cardLayout}>
            <div className={styles.image}>{image}</div>
            <div className={styles.info}>
              {children ?? (
                <>
                  {title && <p className={styles.title}>{title}</p>}
                  {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                  {action ? <div className={styles.action}>{action}</div> : null}
                </>
              )}
            </div>
          </div>
        </PaperSurface>
        {resolvedShowTape && (
          <MediaDecoration
            assetBasePath={assetBasePath}
            position="top-left"
            className={styles.tape}
            asset="sticker-9"
            responsive={false}
            media="(min-width: 400px)"
            imageClassName={styles.tapeImage}
            style={{
              left: '25%',
              transform: 'translate(-50%, -50%) rotate(-10deg)',
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ── */

export interface StapleCardTitleProps extends Omit<React.ComponentProps<'p'>, 'ref'> {
  ref?: React.Ref<HTMLParagraphElement>
}

export interface StapleCardDescriptionProps extends Omit<React.ComponentProps<'p'>, 'ref'> {
  ref?: React.Ref<HTMLParagraphElement>
}

function StapleCardTitle({ ref, className, ...props }: StapleCardTitleProps) {
  return <p ref={ref} data-slot="card-title" className={cn(styles.title, className)} {...props} />
}

function StapleCardDescription({ ref, className, ...props }: StapleCardDescriptionProps) {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn(styles.subtitle, className)}
      {...props}
    />
  )
}

export { StapleCardTitle, StapleCardDescription }
