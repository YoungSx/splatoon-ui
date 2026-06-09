import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./divider.module.css"

export interface DividerProps extends React.ComponentProps<"div"> {
  variant?: "wave" | "rip-left" | "rip-right" | "paper-tear"
  color?: "black" | "white" | "sand" | "yellow" | "blue" | "custom"
  customColor?: string
  direction?: "up" | "down" // For paper-tear variant
  desktopOnly?: boolean
}

const sideRipWidthPx = 47
const paperTearHeights = {
  up: 60,
  down: 24,
} as const

const waveDividerStyle = {
  height: "clamp(40px, 6vw, 140px)",
} as const

const colorMap = {
  black: "#0d0d0d",
  white: "#F4F4F4",
  sand: "#f5f0e8",
  yellow: "#eaff3d",
  blue: "#603bff",
  custom: "currentColor",
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, variant = "wave", color = "black", customColor, direction = "up", desktopOnly = false, ...props }, ref) => {
    const fillColor = color === "custom" && customColor ? customColor : colorMap[color] || colorMap.black

    if (variant === "rip-left" || variant === "rip-right") {
      const isLeft = variant === "rip-left"
      const svgUrl = isLeft ? "/svgs/rip-left.svg" : "/svgs/rip-right.svg"
      return (
        <div
          ref={ref}
          data-slot="divider"
          data-variant={variant}
          className={cn(
            "pointer-events-none absolute top-0 bottom-0 z-10 select-none",
            isLeft ? "left-0" : "right-0",
            desktopOnly ? styles.desktopOnly : undefined,
            className
          )}
          style={{
            width: `${sideRipWidthPx}px`,
            backgroundColor: fillColor,
            WebkitMaskImage: `url('${svgUrl}')`,
            maskImage: `url('${svgUrl}')`,
            WebkitMaskRepeat: "repeat-y",
            maskRepeat: "repeat-y",
            WebkitMaskSize: "100% auto",
            maskSize: "100% auto",
            ...props.style
          }}
          {...props}
        />
      )
    }

    if (variant === "wave") {
      return (
        <div
          ref={ref}
          data-slot="divider"
          data-variant="wave"
          className={cn(
            "pointer-events-none relative w-full select-none",
            desktopOnly ? styles.desktopOnly : undefined,
            className
          )}
          style={{
            ...waveDividerStyle,
            backgroundColor: fillColor,
            WebkitMaskImage: `url('/svgs/wave.svg')`,
            maskImage: `url('/svgs/wave.svg')`,
            WebkitMaskRepeat: "repeat-x",
            maskRepeat: "repeat-x",
            WebkitMaskSize: "auto 100%",
            maskSize: "auto 100%",
            ...props.style
          }}
          {...props}
        />
      )
    }

    if (variant === "paper-tear") {
      const isUp = direction === "up"
      const svgUrl = isUp ? "/svgs/paper-tear-up.svg" : "/svgs/paper-tear-down.svg"
      return (
        <div
          ref={ref}
          data-slot="divider"
          data-variant="paper-tear"
          className={cn("pointer-events-none relative w-full select-none", desktopOnly ? styles.desktopOnly : undefined, className)}
          style={{
            height: `${paperTearHeights[direction]}px`,
            backgroundColor: fillColor,
            WebkitMaskImage: `url('${svgUrl}')`,
            maskImage: `url('${svgUrl}')`,
            WebkitMaskRepeat: "repeat-x",
            maskRepeat: "repeat-x",
            WebkitMaskSize: "auto 100%",
            maskSize: "auto 100%",
            ...props.style
          }}
          {...props}
        />
      )
    }

    return null
  }
)
Divider.displayName = "Divider"

export { Divider }
