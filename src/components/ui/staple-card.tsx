import * as React from 'react'

import { cn } from '@/lib/utils'
import { newsStapleAssets } from './news-assets'
import { MediaDecoration } from './media-decoration'
import { PaperSurface } from './paper-surface'
import styles from './staple-card.module.css'

/* ── Variant config ── */

type StapleCardVariant = 'a' | 'b' | 'c' | 'd'

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

export interface StapleCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
  className?: string
  children?: React.ReactNode
}

export function StapleCard({
  variant = 'b',
  image,
  title,
  subtitle,
  action,
  surface = 'white',
  showTape,
  hoverTilt = false,
  className,
  children,
  ...props
}: StapleCardProps) {
  const config = VARIANT_CONFIG[variant]
  const resolvedShowTape = showTape ?? config.showTape
  const isDark = surface === 'dark'

  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(styles.stapleCard, isDark && styles.surfaceDark, className)}
      {...props}
    >
      <div className={cn(styles.card, '@container', hoverTilt && styles.hoverTilt)}>
        <PaperSurface
          tone={isDark ? 'black' : 'white'}
          topEdgeClassName={styles.cardTop}
          bottomEdgeClassName={styles.cardBottom}
          contentClassName={styles.cardLayout}
        >
          <div className={styles.stapleLeft}>
            <picture>
              <img
                className={styles.imgMobile}
                alt=""
                src={newsStapleAssets.left.src}
                width={newsStapleAssets.left.width}
                height={newsStapleAssets.left.height}
              />
              <img
                className={styles.imgDesktop}
                alt=""
                src={newsStapleAssets.left.src}
                width={newsStapleAssets.left.width}
                height={newsStapleAssets.left.height}
              />
            </picture>
          </div>
          <div className={styles.stapleRight}>
            <picture>
              <img
                className={styles.imgMobile}
                alt=""
                src={newsStapleAssets.right.src}
                width={newsStapleAssets.right.width}
                height={newsStapleAssets.right.height}
              />
              <img
                className={styles.imgDesktop}
                alt=""
                src={newsStapleAssets.right.src}
                width={newsStapleAssets.right.width}
                height={newsStapleAssets.right.height}
              />
            </picture>
          </div>
          <div className={styles.image}>{image}</div>
          <div className={styles.info}>
            {children ?? (
              <>
                {title && <p className={styles.title}>{title}</p>}
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                {action}
              </>
            )}
          </div>
        </PaperSurface>
        {resolvedShowTape && (
          <MediaDecoration
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

function StapleCardTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="card-title" className={cn(styles.title, className)} {...props} />
}

function StapleCardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="card-description" className={cn(styles.subtitle, className)} {...props} />
}

export { StapleCardTitle, StapleCardDescription }
