import * as React from "react"

import { cn } from "@/lib/utils"
import { Tape } from "./tape"
import styles from "./heading-tape.module.css"

type HeadingTapeColor = "yellow" | "blue" | "green" | "purple" | "orange" | "red"

export interface HeadingTapeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  color?: HeadingTapeColor
  stickerLeft?: React.ReactNode
  stickerRight?: React.ReactNode
  overlapTop?: boolean
  marginOffset?: number
}

export function HeadingTape({
  children,
  className,
  color,
  stickerLeft,
  stickerRight,
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
      <div className={styles.headingTapeContainer}>
        <div className={styles.headingTapeStickers}>
          <div className={styles.headingTapeSticker1}>
            {stickerLeft ?? <Tape variant="torn" position="bottom-left" color="yellow" />}
          </div>
          <div className={styles.headingTapeSticker2}>
            {stickerRight ?? <Tape variant="torn" position="top-right" color="red" />}
          </div>
        </div>
        <div className={cn(styles.headingTapeText, color && styles[color])}>{children}</div>
      </div>
    </div>
  )
}
