import * as React from "react"

import { cn } from "@/lib/utils"
import { TagHanger } from "./tag-hanger"

export type RuggedTheme = "yellow" | "blue" | "purple" | "orange" | "green"

const ruggedThemeMap: Record<RuggedTheme, { bg: string; fg: string }> = {
  yellow: { bg: "text-yellow", fg: "text-black" },
  blue: { bg: "text-blue", fg: "text-white" },
  purple: { bg: "text-purple", fg: "text-white" },
  orange: { bg: "text-orange", fg: "text-white" },
  green: { bg: "text-green", fg: "text-black" },
}

export interface RuggedCardProps extends React.ComponentProps<"div"> {
  ruggedTheme?: RuggedTheme
  ruggedRotation?: string
  ruggedBackground?: React.ReactNode
}

export function RuggedCard({
  ref,
  className,
  ruggedTheme = "yellow",
  ruggedRotation = "2deg",
  ruggedBackground,
  children,
  ...props
}: RuggedCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const theme = ruggedThemeMap[ruggedTheme] ?? ruggedThemeMap.yellow

  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant="rugged"
      style={{ transform: `rotate(${ruggedRotation})` } as React.CSSProperties}
      className={cn(
        "group/card relative w-full pt-[12%] px-[6%] pb-[8%] select-none text-center flex flex-col justify-between gap-4 z-10",
        theme.fg,
        className
      )}
      {...props}
    >
      <div className={cn("absolute inset-0 w-full h-full z-0 pointer-events-none select-none", theme.bg)}>
        {ruggedBackground ?? <TagHanger />}
      </div>

      <div className="relative h-full flex flex-col justify-between gap-4 z-10 text-center">
        {children}
      </div>
    </div>
  )
}
