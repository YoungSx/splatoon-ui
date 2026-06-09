import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./heading-tape.module.css"

type HeadingTapeColor = "yellow" | "blue" | "green" | "purple" | "orange" | "red"

export interface HeadingTapeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  color?: HeadingTapeColor
  overlapTop?: boolean
  marginOffset?: number
}

export function HeadingTape({
  children,
  className,
  color,
  overlapTop = false,
  marginOffset = 2,
  ...props
}: HeadingTapeProps) {
  return (
    <div
      data-slot="heading-tape"
      className={cn(styles.headingTapeSection, overlapTop && styles.overlapTop, className)}
      style={{ "--margin-offset": String(marginOffset) } as React.CSSProperties}
      {...props}
    >
      <span className={cn(styles.headingTapeContainer, color && styles[color])}>
        <span className={styles.headingTapeStickers}>
          {/* Sticker 1 (bottom-left) — official: sticker-8 */}
          <picture>
            <source media="(min-width: 640px)" srcSet="/_images/tape-assets/sticker-8-medium-up.webp 1x, /_images/tape-assets/sticker-8-medium-up-2x.webp 2x" type="image/webp" />
            <source media="(min-width: 640px)" srcSet="/_images/tape-assets/sticker-8-medium-up.png 1x, /_images/tape-assets/sticker-8-medium-up-2x.png 2x" type="image/png" />
            <source srcSet="/_images/tape-assets/sticker-8.webp 1x, /_images/tape-assets/sticker-8-2x.webp 2x" type="image/webp" />
            <source srcSet="/_images/tape-assets/sticker-8.png 1x, /_images/tape-assets/sticker-8-2x.png 2x" type="image/png" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={cn(styles.headingTapeSticker1)} alt="" src="/_images/tape-assets/sticker-8.png" />
          </picture>

          {/* Sticker 2 (top-right) — official: sticker-12 */}
          <picture>
            <source media="(min-width: 640px)" srcSet="/_images/tape-assets/sticker-12-medium-up.webp 1x, /_images/tape-assets/sticker-12-medium-up-2x.webp 2x" type="image/webp" />
            <source media="(min-width: 640px)" srcSet="/_images/tape-assets/sticker-12-medium-up.png 1x, /_images/tape-assets/sticker-12-medium-up-2x.png 2x" type="image/png" />
            <source srcSet="/_images/tape-assets/sticker-12.webp 1x, /_images/tape-assets/sticker-12-2x.webp 2x" type="image/webp" />
            <source srcSet="/_images/tape-assets/sticker-12.png 1x, /_images/tape-assets/sticker-12-2x.png 2x" type="image/png" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={cn(styles.headingTapeSticker2)} alt="" src="/_images/tape-assets/sticker-12.png" />
          </picture>
        </span>

        <span className={cn(styles.headingTapeText, color && styles[color])}>
          {children}
        </span>
      </span>
    </div>
  )
}
