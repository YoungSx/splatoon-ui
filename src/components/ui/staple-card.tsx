import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./staple-card.module.css"

export interface StapleCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Image/media shown in the tilted image area */
  image?: React.ReactNode
  /** Convenience: renders a title paragraph in the info area */
  title?: React.ReactNode
  /** Convenience: renders a subtitle paragraph below the title */
  subtitle?: React.ReactNode
  /** Convenience: renders an action element (e.g. a Button) at the bottom of info */
  action?: React.ReactNode
  /** Visual surface: "white" (default) or "dark" (dark bg, white text) */
  surface?: "white" | "dark"
  /** Whether to show the decorative tape element at the top */
  showTape?: boolean
  /** Enable hover tilt animation (default: false) */
  hoverTilt?: boolean
  className?: string
  children?: React.ReactNode
}

export function StapleCard({
  image,
  title,
  subtitle,
  action,
  surface = "white",
  showTape = true,
  hoverTilt = false,
  className,
  children,
  ...props
}: StapleCardProps) {
  const isDark = surface === "dark"
  const svgFill = isDark ? "#1a1a1a" : "#FFF"

  return (
    <div
      className={cn(styles.stapleCard, isDark && styles.surfaceDark, className)}
      {...props}
    >
      <div className={cn(styles.card, hoverTilt && styles.hoverTilt)}>
        <svg className={styles.cardTop} viewBox="0 0 448 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M253.96 23.774a4.711 4.711 0 0 1-4.693 4.328h-49.535c-.131 0-.255-.027-.384-.038-2.431-.198-4.348-2.205-4.348-4.68a4.724 4.724 0 0 1 4.732-4.716h18.204c-.006-.106-.017-.21-.017-.315 0-3.452 2.808-6.25 6.27-6.25h.62a6.26 6.26 0 0 1 5.038 2.54 6.194 6.194 0 0 1 1.233 3.71c0 .106-.01.21-.016.315H249.267c2.614 0 4.733 2.111 4.733 4.717 0 .133-.029.258-.04.389M53.446.102H9.693C4.34.102 0 4.437 0 9.782v50.044h448V9.783c0-5.346-4.338-9.68-9.693-9.68H53.445Z" fill={svgFill} fillRule="evenodd"/>
        </svg>
        <div className={styles.cardLayout}>
          <div className={styles.stapleLeft}>
            <picture>
              <source srcSet="/images/news/news-staple-left.webp 1x, /images/news/news-staple-left-2x.webp 2x" type="image/webp" width={75} height={48} />
              <source srcSet="/images/news/news-staple-left.png 1x, /images/news/news-staple-left-2x.png 2x" type="image/png" width={75} height={48} />
              <img alt="" src="/images/news/news-staple-left.png" />
            </picture>
          </div>
          <div className={styles.stapleRight}>
            <picture>
              <source srcSet="/images/news/news-staple-right.webp 1x, /images/news/news-staple-right-2x.webp 2x" type="image/webp" width={45} height={17} />
              <source srcSet="/images/news/news-staple-right.png 1x, /images/news/news-staple-right-2x.png 2x" type="image/png" width={45} height={17} />
              <img alt="" src="/images/news/news-staple-right.png" />
            </picture>
          </div>
          {showTape && (
            <div className={styles.tapeNews}>
              <picture>
                <source media="(min-width: 640px)" srcSet="/images/tape-assets/sticker-9-medium-up.webp 1x, /images/tape-assets/sticker-9-medium-up-2x.webp 2x" type="image/webp" />
                <source media="(min-width: 640px)" srcSet="/images/tape-assets/sticker-9-medium-up.png 1x, /images/tape-assets/sticker-9-medium-up-2x.png 2x" type="image/png" />
                <source srcSet="/images/tape-assets/sticker-9.webp 1x, /images/tape-assets/sticker-9-2x.webp 2x" type="image/webp" />
                <source srcSet="/images/tape-assets/sticker-9.png 1x, /images/tape-assets/sticker-9-2x.png 2x" type="image/png" />
                <img alt="" src="/images/tape-assets/sticker-9.png" width={96} height={31} />
              </picture>
            </div>
          )}
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
        </div>
        <svg className={styles.cardBottom} viewBox="0 0 448 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 .826c0 9.527 5.976 17.64 14.378 20.862 2.49.955 5.184 1.5 8.01 1.5h403.223c4.635 0 8.94-1.407 12.514-3.816C444.082 15.354 448 8.548 448 .826H0Z" fill={svgFill} fillRule="evenodd"/>
        </svg>
      </div>
    </div>
  )
}
