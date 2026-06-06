import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./heading-tape.module.css"

export interface HeadingTapeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  stickerLeft?: React.ReactNode
  stickerRight?: React.ReactNode
  overlapTop?: boolean
  marginOffset?: number
}

export function HeadingTape({
  children,
  className,
  stickerLeft,
  stickerRight,
  overlapTop = false,
  marginOffset = 2,
  ...props
}: HeadingTapeProps) {
  return (
    <div
      className={cn(styles.headingTapeSection, overlapTop && styles.overlapTop, className)}
      style={{ "--margin-offset": String(marginOffset) } as React.CSSProperties}
      {...props}
    >
      <div className={styles.headingTapeContainer}>
        <div className={styles.headingTapeStickers}>
          <div className={styles.headingTapeSticker1}>{stickerLeft}</div>
          <div className={styles.headingTapeSticker2}>{stickerRight}</div>
        </div>
        <div className={styles.headingTapeText}>{children}</div>
      </div>
    </div>
  )
}
