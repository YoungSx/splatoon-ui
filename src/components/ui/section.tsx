import * as React from "react"
import { cn } from "@/lib/utils"
import { type Pattern, SectionBackground } from "./section-background"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Base size — controls vertical padding. `md` = 64px, `lg` = 80px */
  size?: "md" | "lg"
  /** Pass a HeadingTape element to auto-increase padding for sticker overflow */
  headingTape?: React.ReactNode
  /** Optional pattern texture overlay */
  pattern?: Pattern
  /** Tailwind background class (e.g. "bg-white") */
  bgColor?: string
  /** Tailwind text color class (e.g. "text-chaos-black") */
  text?: string
  /** Render as "section" or "div" */
  as?: "section" | "div"
  style?: React.CSSProperties
}

export function Section({
  size = "md",
  headingTape,
  pattern,
  bgColor,
  text,
  as = "section",
  className,
  children,
  style,
  ...props
}: SectionProps) {
  const paddingY = headingTape
    ? size === "lg" ? "py-28" : "py-24"
    : size === "lg" ? "py-20" : "py-16"

  return (
    <SectionBackground
      as={as}
      pattern={pattern}
      className={cn(
        paddingY,
        "px-6 relative z-[var(--z-deco)]",
        bgColor,
        text,
        className,
      )}
      style={style}
      {...props}
    >
      {headingTape}
      {children}
    </SectionBackground>
  )
}
