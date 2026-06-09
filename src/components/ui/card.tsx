"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "@/lib/utils"
import { PaperCardFrame, type NewsSurface, type PaperLabelConfig } from "./paper-card-frame"
import { TagHanger } from "./tag-hanger"

// ── CardContext for variant-sharing among sub-components ────────

type CardVariant = "news" | "tag" | "plain"
type PlainStyle = "default" | "cream" | "colored"

export const CardContext = React.createContext<{ variant?: CardVariant; surface?: "paper" | "cream" | "danger" }>({
  variant: "news",
  surface: "paper",
})

// ── Tag theme map ───────────────────────────────────────────────

const tagThemeMap = {
  yellow: "text-[#eaff3d] text-[#0d0d0d]",
  blue: "text-[#603bff] text-[#ffffff]",
  purple: "text-[#a51ee1] text-[#ffffff]",
  orange: "text-[#fa5a00] text-[#ffffff]",
  green: "text-[#00c8b4] text-[#0d0d0d]",
}

// ── Plain style classes (module-level) ──────────────────────────

const plainStyleClasses = {
  default: "bg-white dark:bg-[#151515]",
  cream: "bg-[#f5f0e8] dark:bg-[#151515]",
  colored: "",
} satisfies Record<PlainStyle, string>

// ── Card Props ──────────────────────────────────────────────────

export interface CardProps extends React.ComponentProps<"div"> {
  asChild?: boolean
  variant?: CardVariant
  paperFasteners?: boolean
  paperLabel?: PaperLabelConfig
  surface?: NewsSurface
  /** Show sticker-9 overlay decoration (news variant only) */
  showSticker9?: boolean
  /** Index for built-in rotation stagger (news variant only) */
  staggerIndex?: number
  // For tag variant
  tagTheme?: "yellow" | "blue" | "purple" | "orange" | "green"
  tagRotation?: string
  /** Custom background ReactNode for tag variant (replaces built-in SVG) */
  tagBackground?: React.ReactNode
  // For plain variant
  plainStyle?: PlainStyle
}

// ── Card Component ──────────────────────────────────────────────

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      asChild = false,
      variant = "news",
      paperFasteners,
      paperLabel,
      surface = "paper",
      showSticker9,
      staggerIndex,
      // For tag
      tagTheme = "yellow",
      tagRotation = "2deg",
      tagBackground,
      // For plain
      plainStyle = "default",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div"

    if (variant === "plain") {
      return (
        <CardContext.Provider value={{ variant, surface }}>
          <Comp
            ref={ref}
            data-slot="card"
            data-variant="plain"
            className={cn(
              "rounded-xl border-[3px] border-chaos-black dark:border-white/15 transition-colors duration-300",
              plainStyleClasses[plainStyle],
              className
            )}
            {...props}
          >
            {children}
          </Comp>
        </CardContext.Provider>
      )
    }

    if (variant === "tag") {
      const themeClasses = tagThemeMap[tagTheme] || tagThemeMap.yellow
      const [bgColorClass, fgColorClass] = themeClasses.split(" ")

      return (
        <CardContext.Provider value={{ variant, surface }}>
          <Comp
            ref={ref}
            data-slot="card"
            data-variant="tag"
            style={{
              transform: `rotate(${tagRotation})`,
            } as React.CSSProperties}
            className={cn(
              "group/card relative w-full pt-[12%] px-[6%] pb-[8%] transition-transform duration-300 ease-out hover:scale-[1.025] select-none text-center flex flex-col justify-between gap-4 z-10",
              fgColorClass,
              className
            )}
            {...props}
          >
            {/* Tag Hanger Background SVG */}
            <div className={cn("absolute inset-0 w-full h-full z-0 pointer-events-none select-none", bgColorClass)}>
              {tagBackground ?? <TagHanger />}
            </div>

            {/* Inner Content Area */}
            <div className="relative h-full flex flex-col justify-between gap-4 z-10 text-center">
              {children}
            </div>
          </Comp>
        </CardContext.Provider>
      )
    }

    return (
      <CardContext.Provider value={{ variant, surface }}>
        <PaperCardFrame
          asChild={asChild}
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
)
Card.displayName = "Card"

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
CardHeader.displayName = "CardHeader"

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
CardTitle.displayName = "CardTitle"

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[15px] font-medium opacity-80 leading-snug", className)}
      {...props}
    />
  )
}
CardDescription.displayName = "CardDescription"

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
CardAction.displayName = "CardAction"

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("relative z-20 flex flex-col font-medium text-[16px] text-current leading-relaxed", className)}
      {...props}
    />
  )
}
CardContent.displayName = "CardContent"

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
CardFooter.displayName = "CardFooter"

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
