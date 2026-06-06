import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./black-tape-container.module.css"

export interface BlackTapeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  tapeVariant?: "yellow"
  noVerticalPadding?: boolean
}

export function BlackTapeContainer({
  className,
  children,
  tapeVariant,
  noVerticalPadding = false,
  ...props
}: BlackTapeContainerProps) {
  return (
    <div
      className={cn(
        styles.blackTapeContainer,
        tapeVariant === "yellow" && styles.tapeYellow,
        noVerticalPadding && styles.noVerticalPadding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
