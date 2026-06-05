"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressVariant = "yellow" | "blue" | "green" | "purple" | "orange" | "red" | "black" | "white"
type ProgressTrackVariant = "dark" | "light" | "transparent"
type ProgressSize = "sm" | "default" | "lg"

export interface ProgressProps extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, "children" | "max" | "value"> {
  value?: number
  max?: number
  variant?: ProgressVariant
  trackVariant?: ProgressTrackVariant
  size?: ProgressSize
  skewed?: boolean
  splattered?: boolean
}

const sizeHeights = {
  sm: "1rem",
  default: "2rem",
  lg: "3rem",
} as const satisfies Record<ProgressSize, string>

const variantPalette = {
  yellow: "#E3FF00",
  blue: "#4100FF",
  green: "#11D87A",
  purple: "#AF50FF",
  orange: "#FA5A00",
  red: "#E60012",
  black: "#181818",
  white: "#F4F4F4",
} as const satisfies Record<ProgressVariant, string>

const trackPalette = {
  dark: "#181818",
  light: "#F4F4F4",
  transparent: "transparent",
} as const satisfies Record<ProgressTrackVariant, string>

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "yellow",
      trackVariant = "dark",
      size = "default",
      skewed = true,
      splattered = true,
      ...props
    },
    ref
  ) => {
    const safeMax = max > 0 ? max : 100
    const clampedValue = Math.min(Math.max(value, 0), safeMax)
    const percentage = (clampedValue / safeMax) * 100
    const fillColor = variantPalette[variant]
    const trackColor = trackPalette[trackVariant]
    const borderWidth = trackVariant === "transparent" ? "2px" : "3px"
    const height = sizeHeights[size]

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={clampedValue}
        max={safeMax}
        className={cn(
          "relative w-full shrink-0 overflow-hidden rounded-full",
          skewed && "-skew-x-12",
          className
        )}
        style={{
          height,
          backgroundColor: trackColor,
          borderStyle: "solid",
          borderWidth,
          borderColor: "#181818",
          ...(trackVariant !== "transparent" ? { boxShadow: "3px 3px 0px #181818" } : null),
        }}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="relative h-full w-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            backgroundColor: fillColor,
            color: fillColor,
            transform: `translateX(-${100 - percentage}%)`,
          }}
        >
          {splattered && percentage > 0 ? (
            <div className="pointer-events-none absolute -right-[18px] inset-y-[-30%] z-10 w-[36px]">
              <svg
                viewBox="0 0 36 100"
                preserveAspectRatio="none"
                className="h-full w-full"
                style={{ fill: "currentColor" }}
                aria-hidden="true"
              >
                <path d="M0,0 Q18,15 12,30 T24,60 T9,85 T18,100 L0,100 Z" />
                <circle cx="20" cy="20" r="3.5" />
                <circle cx="26" cy="45" r="4.5" />
                <circle cx="22" cy="75" r="2.5" />
              </svg>
            </div>
          ) : null}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white/15 mix-blend-overlay"
            style={{
              maskImage: "repeating-linear-gradient(-45deg, transparent, transparent 8px, black 8px, black 16px)",
            }}
          />
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    )
  }
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
