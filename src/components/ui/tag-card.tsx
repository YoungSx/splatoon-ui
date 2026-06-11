import * as React from "react"

import { cn } from "@/lib/utils"
import { TagHanger } from "./tag-hanger"

export type TagTheme = "yellow" | "blue" | "purple" | "orange" | "green"

const tagThemeMap: Record<TagTheme, { bg: string; fg: string }> = {
  yellow: { bg: "text-[#eaff3d]", fg: "text-[#0d0d0d]" },
  blue: { bg: "text-[#603bff]", fg: "text-[#ffffff]" },
  purple: { bg: "text-[#a51ee1]", fg: "text-[#ffffff]" },
  orange: { bg: "text-[#fa5a00]", fg: "text-[#ffffff]" },
  green: { bg: "text-[#00c8b4]", fg: "text-[#0d0d0d]" },
}

export interface TagCardProps extends React.ComponentProps<"div"> {
  tagTheme?: TagTheme
  tagRotation?: string
  tagBackground?: React.ReactNode
}

export function TagCard({
  ref,
  className,
  tagTheme = "yellow",
  tagRotation = "2deg",
  tagBackground,
  children,
  ...props
}: TagCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const theme = tagThemeMap[tagTheme] ?? tagThemeMap.yellow

  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant="tag"
      style={{ transform: `rotate(${tagRotation})` } as React.CSSProperties}
      className={cn(
        "group/card relative w-full pt-[12%] px-[6%] pb-[8%] transition-transform duration-300 ease-out hover:scale-[1.025] select-none text-center flex flex-col justify-between gap-4 z-10",
        theme.fg,
        className
      )}
      {...props}
    >
      <div className={cn("absolute inset-0 w-full h-full z-0 pointer-events-none select-none", theme.bg)}>
        {tagBackground ?? <TagHanger />}
      </div>

      <div className="relative h-full flex flex-col justify-between gap-4 z-10 text-center">
        {children}
      </div>
    </div>
  )
}
