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

// Official logo-tape-header per-tape CSS custom properties
// (from https://splatoon.nintendo.com/en/gameplay/ CSS)
const TAPE_VARS: Record<number, React.CSSProperties> = {
  0: { "--start-x": "-100%", "--start-y": "-50%", "--end-x": "-50%", "--end-y": "-25%", "--end-rotate": "-1.5deg" } as React.CSSProperties,
  1: { "--start-x": "100%", "--start-y": "-50%", "--end-x": "-50%", "--end-y": "-50%", "--end-rotate": "1.5deg" } as React.CSSProperties,
  2: { "--start-x": "-100%", "--start-y": "-50%", "--end-x": "-50%", "--end-y": "-50%", "--end-rotate": "-2deg" } as React.CSSProperties,
}

function BannerDividerTapeLayer({
  variant,
  rotate,
  offsetY,
  className,
  animate,
  animDelay,
  index,
}: BannerDividerTape & {
  animate?: boolean
  index: number
}) {
  const [base, mediumUp] = offsetY ?? [0, 0]
  const delay = animDelay ?? index

  // Official: .banner { position: absolute; left: 50% } + CSS custom properties
  // in-view__anim base: opacity: 0; transform: translate(var(--start-x), var(--start-y))
  // in-view .in-view__anim: opacity: 1; transform: translate(var(--end-x), var(--end-y)) rotate(var(--end-rotate))
  const animVars = animate ? (TAPE_VARS[index] ?? TAPE_VARS[0]) : undefined

  return (
    <div
      aria-hidden="true"
      className={cn(
        animate && inViewStyles.anim,
        styles.bannerDividerTape,
        styles[`banner-divider--${variant}`],
        !animate && rotate === "up" && styles.rotateUp,
        !animate && rotate === "down" && styles.rotateDown,
        delay > 0 && inViewStyles[`delay${delay}` as keyof typeof inViewStyles],
        className,
      )}
      style={{
        top: `${base}px`,
        ...(mediumUp !== base
          ? { "--banner-offset-medium": `${mediumUp}px` }
          : {}),
        ...animVars,
      }}
    />
  )
}

export function BannerDivider({
  pattern,
  color,
  tapes: tapesProp,
  animate,
  rootMargin,
  className,
  style: styleProp,
  ...props
}: BannerDividerProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = React.useState(false)
  const tapes = tapesProp ?? [
    { ...DEFAULT_TAPES[0], variant: pattern ?? DEFAULT_TAPES[0].variant },
    { ...DEFAULT_TAPES[1], variant: color ?? DEFAULT_TAPES[1].variant },
  ]

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

  return (
    <div
      ref={animate ? ref : undefined}
      className={cn(
        styles.bannerDividerGroup,
        animate && isInView && inViewStyles.inView,
        className,
      )}
      style={styleProp}
      {...props}
    >
      {tapes.map((tape, i) => (
        <BannerDividerTapeLayer
          key={i}
          {...tape}
          animate={animate}
          index={i}
        />
      ))}
    </div>
  )
}

/** Convenience: 3-tape variant (design1 + design2 + blue) */
BannerDivider.three = THREE_TAPES
