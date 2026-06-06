import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./banner-divider.module.css"

export type BannerDividerVariant =
  | "design1"
  | "design2"
  | "design3"
  | "yellow"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"

export interface BannerDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BannerDividerVariant
}

export function BannerDivider({ variant = "design1", className, ...props }: BannerDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(styles.bannerDivider, styles[`banner-divider--${variant}`], className)}
      {...props}
    />
  )
}
