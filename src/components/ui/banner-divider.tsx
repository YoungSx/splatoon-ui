import * as React from "react"

import { cn } from "@/lib/utils"
import inViewStyles from "./in-view.module.css"
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
  /** InView animation direction. Default: "left" */
  animDirection?: "left" | "right"
  /** InView animation delay level (0-20). Default: auto (index-based) */
  animDelay?: number
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
  /** Enable InView fly-in animation on each tape (official logo-tape-header behavior). */
  animate?: boolean
  /** Root margin for InView IntersectionObserver. */
  rootMargin?: string
}

const DEFAULT_TAPES: [BannerDividerTape, BannerDividerTape] = [
  { variant: "design1", rotate: "up", offsetY: [0, 0] },
  { variant: "green", rotate: "down", offsetY: [35, 45] },
]

const THREE_TAPES: [BannerDividerTape, BannerDividerTape, BannerDividerTape] = [
  { variant: "design1", rotate: "up", offsetY: [0, 0] },
  { variant: "design2", rotate: "down", offsetY: [35, 45] },
  { variant: "blue", rotate: "up", offsetY: [70, 90] },
]

// Official logo-tape-header animation parameters per tape index
const ANIM_PARAMS = [
  { startX: "-100%", startY: "-50%", endX: "-50%", endY: "-25%", endRotate: "-1.5deg" },
  { startX: "100%", startY: "-50%", endX: "-50%", endY: "-50%", endRotate: "1.5deg" },
  { startX: "-100%", startY: "-50%", endX: "-50%", endY: "-50%", endRotate: "-2deg" },
]

function BannerDividerTapeLayer({
  variant,
  rotate,
  offsetY,
  className,
  animate,
  animDirection = "left",
  animDelay,
  index,
  rootMargin,
}: BannerDividerTape & {
  animate?: boolean
  index: number
  rootMargin?: string
}) {
  const [base, mediumUp] = offsetY ?? [0, 0]
  const ref = React.useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    if (!animate) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(el)
        }
      },
      { rootMargin: rootMargin ?? "0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animate, rootMargin])

  const tape = (
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

  if (!animate) return tape

  const params = ANIM_PARAMS[index] ?? ANIM_PARAMS[0]
  const delay = animDelay ?? index
  const directionClass = animDirection === "right" ? inViewStyles.right : inViewStyles.left

  return (
    <div
      ref={ref}
      className={cn(
        isInView && inViewStyles.inView,
        styles.bannerAnimWrapper,
      )}
      style={{
        "--start-x": params.startX,
        "--start-y": params.startY,
        "--end-x": params.endX,
        "--end-y": params.endY,
        "--end-rotate": params.endRotate,
        "--start-rotate": "0deg",
      } as React.CSSProperties}
    >
      <div
        className={cn(
          inViewStyles.anim,
          directionClass,
          delay > 0 && inViewStyles[`delay${delay}` as keyof typeof inViewStyles],
        )}
      >
        {tape}
      </div>
    </div>
  )
}

export function BannerDivider({
  pattern,
  color,
  tapes: tapesProp,
  animate,
  rootMargin,
  className,
  ...props
}: BannerDividerProps) {
  const tapes = tapesProp ?? [
    { ...DEFAULT_TAPES[0], variant: pattern ?? DEFAULT_TAPES[0].variant },
    { ...DEFAULT_TAPES[1], variant: color ?? DEFAULT_TAPES[1].variant },
  ]

  return (
    <div className={cn("relative", className)} {...props}>
      {tapes.map((tape, i) => (
        <BannerDividerTapeLayer
          key={i}
          {...tape}
          animate={animate}
          index={i}
          rootMargin={rootMargin}
        />
      ))}
    </div>
  )
}

/** Convenience: 3-tape variant (design1 + design2 + blue) */
BannerDivider.three = THREE_TAPES
