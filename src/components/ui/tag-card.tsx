import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./tag-card.module.css"

export interface TagCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  background?: React.ReactNode
  rotation?: string | number
}

export function TagCard({
  className,
  children,
  background,
  rotation = "0deg",
  style,
  ...props
}: TagCardProps) {
  const mergedStyle = {
    ...style,
    "--rotation": typeof rotation === "number" ? `${rotation}deg` : rotation,
  } as React.CSSProperties

  return (
    <div className={cn(styles.tagCard, className)} style={mergedStyle} {...props}>
      <div className={styles.tagCardBackground}>{background}</div>
      <div className={styles.tagCardInner}>{children}</div>
    </div>
  )
}
