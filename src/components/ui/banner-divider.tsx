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

export type BannerDividerRotation = "up" | "down"

export interface BannerDividerTape {
  variant: BannerDividerVariant
  rotate: BannerDividerRotation
  /** [base, medium-up] responsive top offset in px. Default varies by position. */
  offsetY?: [number, number]
  className?: string
}

export interface BannerDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pattern tape variant (design1/2/3). Combined with `color` for the common 2-tape divider. */
  pattern?: BannerDividerVariant
  /** Color tape variant. Combined with `pattern` for the common 2-tape divider. */
  color?: BannerDividerVariant
  /**
   * Explicit tape layers. Overrides `pattern`/`color` when provided.
   * Use for custom stacking or 3+ layer dividers.
   */
  tapes?: BannerDividerTape[]
}

const DEFAULT_TAPES: [BannerDividerTape, BannerDividerTape] = [
  { variant: "design1", rotate: "up", offsetY: [0, 0] },
  { variant: "green", rotate: "down", offsetY: [35, 45] },
]

function BannerDividerTapeLayer({ variant, rotate, offsetY, className }: BannerDividerTape) {
  const [base, mediumUp] = offsetY ?? [0, 0]
  return (
    <div
      aria-hidden="true"
      className={cn(
        styles.bannerDivider,
        styles[`banner-divider--${variant}`],
        rotate === "up" && styles.rotateUp,
        rotate === "down" && styles.rotateDown,
        className,
      )}
      style={{
        top: `${base}px`,
        ...(mediumUp !== base
          ? { "--banner-offset-medium": `${mediumUp}px` }
          : {}),
      }}
    />
  )
}

export function BannerDivider({
  pattern,
  color,
  tapes: tapesProp,
  className,
  ...props
}: BannerDividerProps) {
  const tapes = tapesProp ?? [
    { ...DEFAULT_TAPES[0], variant: pattern ?? DEFAULT_TAPES[0].variant },
    { ...DEFAULT_TAPES[1], variant: color ?? DEFAULT_TAPES[1].variant },
  ]

  return (
    <div className={cn("relative h-[70px] md:h-[90px] z-20", className)} {...props}>
      {tapes.map((tape, i) => (
        <BannerDividerTapeLayer key={i} {...tape} />
      ))}
    </div>
  )
}
