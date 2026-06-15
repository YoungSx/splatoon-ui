import * as React from "react"

import { cn } from "@/lib/utils"
import { Tape } from "./tape"

interface MarqueeProps extends React.ComponentProps<"div"> {
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  variant?: "default" | "tape" | "warning"
  showEdgeTape?: boolean
  tapeVariant?: "tape-1" | "tape-2" | "tape-3" | "scotch"
}

function Marquee({
  className,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  variant = "default",
  showEdgeTape = false,
  tapeVariant = "tape-2",
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      data-slot="marquee"
      data-variant={variant}
      className={cn(
        "group/marquee relative flex overflow-hidden select-none",
        "data-[variant=tape]:bg-primary data-[variant=tape]:text-primary-foreground data-[variant=tape]:border-y-2 data-[variant=tape]:border-foreground data-[variant=tape]:-rotate-[2deg]",
        "data-[variant=warning]:bg-[repeating-linear-gradient(45deg,var(--color-yellow),var(--color-yellow)_12px,var(--color-black)_12px,var(--color-black)_24px)] data-[variant=warning]:text-chaos-black data-[variant=warning]:border-y-2 data-[variant=warning]:border-foreground",
        "data-[variant=default]:bg-foreground data-[variant=default]:text-background data-[variant=default]:border-y-2 data-[variant=default]:border-foreground",
        className
      )}
      {...props}
    >
      {showEdgeTape && (
        <>
          <Tape variant={tapeVariant} position="top-left" className="z-30" />
          <Tape variant={tapeVariant} position="top-right" className="z-30" />
        </>
      )}
      <div
        className={cn(
          "flex w-max items-center gap-8 font-black uppercase tracking-widest text-sm whitespace-nowrap splat-heading text-[24px] px-8 py-2",
          "[animation:marquee_linear_infinite]",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          direction === "right" && "[animation-direction:reverse]"
        )}
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        {children}
        <span aria-hidden="true">{children}</span>
      </div>
    </div>
  )
}

function MarqueeItem({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marquee-item"
      className={cn("inline-flex items-center gap-2 shrink-0", className)}
      {...props}
    />
  )
}

export { Marquee, MarqueeItem }
