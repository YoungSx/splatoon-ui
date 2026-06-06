import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./button-drip.module.css"

export interface ButtonDripProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  hoverText?: React.ReactNode
  useAccentColors?: boolean
}

export function ButtonDrip({
  icon,
  hoverText,
  useAccentColors,
  className,
  children,
  type = "button",
  ...props
}: ButtonDripProps) {
  return (
    <button
      type={type}
      className={cn(styles.button, useAccentColors && styles.useAccentColors, className)}
      {...props}
    >
      <span className={styles.content}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <span>{children}</span>
      </span>
      <span className={styles.hoverContent}>
        <span>{hoverText ?? children}</span>
      </span>
    </button>
  )
}
