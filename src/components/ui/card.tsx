"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { PaperCardFrame, type NewsSurface, type PaperLabelConfig } from "./paper-card-frame"
import { PlainCard, type PlainStyle } from "./plain-card"
import { TagCard, type TagTheme } from "./tag-card"

// ── CardContext for variant-sharing among sub-components ────────

type CardVariant = "news" | "tag" | "plain"

export const CardContext = React.createContext<{ variant?: CardVariant; surface?: "paper" | "cream" | "danger" }>({
  variant: "news",
  surface: "paper",
})

// ── Card Props ──────────────────────────────────────────────────

export interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant
  paperFasteners?: boolean
  paperLabel?: PaperLabelConfig
  surface?: NewsSurface
  /** Show sticker-9 overlay decoration (news variant only) */
  showSticker9?: boolean
  /** Index for built-in rotation stagger (news variant only) */
  staggerIndex?: number
  // For tag variant
  tagTheme?: TagTheme
  tagRotation?: string
  /** Custom background ReactNode for tag variant (replaces built-in SVG) */
  tagBackground?: React.ReactNode
  // For plain variant
  plainStyle?: PlainStyle
}

// ── Card Component (thin dispatcher) ───────────────────────────

function Card({
  ref,
  className,
  variant = "news",
  paperFasteners,
  paperLabel,
  surface = "paper",
  showSticker9,
  staggerIndex,
  tagTheme,
  tagRotation,
  tagBackground,
  plainStyle,
  children,
  ...props
}: CardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const ctx = { variant, surface }

  if (variant === "plain") {
    return (
      <CardContext.Provider value={ctx}>
        <PlainCard ref={ref} className={className} plainStyle={plainStyle} {...props}>
          {children}
        </PlainCard>
      </CardContext.Provider>
    )
  }

  if (variant === "tag") {
    return (
      <CardContext.Provider value={ctx}>
        <TagCard ref={ref} className={className} tagTheme={tagTheme} tagRotation={tagRotation} tagBackground={tagBackground} {...props}>
          {children}
        </TagCard>
      </CardContext.Provider>
    )
  }

  return (
    <CardContext.Provider value={ctx}>
      <PaperCardFrame
        className={className}
        dataVariant="news"
        surface={surface}
        paperLabel={paperLabel}
        paperFasteners={paperFasteners ?? false}
        showSticker9={showSticker9}
        staggerIndex={staggerIndex}
        forwardedRef={ref}
        props={props}
      >
        {children}
      </PaperCardFrame>
    </CardContext.Provider>
  )
}

// ── Sub-components ──────────────────────────────────────────────

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header grid auto-rows-min items-start gap-1.5 border-b border-dashed border-current/30 pb-4 group-data-[size=sm]/card:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "splat-skew text-2xl font-black uppercase tracking-wider leading-none text-current",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[15px] font-medium opacity-80 leading-snug", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("relative z-20 flex flex-col font-medium text-[16px] text-current leading-relaxed", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between border-t border-dashed border-current/30 pt-4 mt-2 group-data-[size=sm]/card:pt-3 group-data-[size=sm]/card:mt-1",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

export { CardImage } from "./card-image"
export type { CardImageProps } from "./card-image"
export type { NewsSurface, PaperLabelConfig }
