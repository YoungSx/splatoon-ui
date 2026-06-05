import * as React from "react"
import { cn } from "@/lib/utils"

export interface DividerProps extends React.ComponentProps<"div"> {
  variant?: "wave" | "rip-left" | "rip-right" | "paper-tear"
  color?: "black" | "white" | "sand" | "yellow" | "blue" | "custom"
  customColor?: string
  direction?: "up" | "down" // For paper-tear variant
}

const colorMap = {
  black: "#181818",
  white: "#F4F4F4",
  sand: "#EAD6B8",
  yellow: "#E3FF00",
  blue: "#4100FF",
  custom: "currentColor",
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, variant = "wave", color = "black", customColor, direction = "up", ...props }, ref) => {
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
            "absolute top-0 bottom-0 z-10 w-[47px] pointer-events-none select-none",
            isLeft ? "left-0" : "right-0",
            className
          )}
          style={{
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
            "w-full h-[6vw] min-h-[40px] max-h-[140px] pointer-events-none select-none relative",
            className
          )}
          style={{
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
          className={cn(
            "w-full pointer-events-none select-none relative",
            isUp ? "h-[60px]" : "h-[24px]", // The two SVG heights from official cards
            className
          )}
          style={{
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
