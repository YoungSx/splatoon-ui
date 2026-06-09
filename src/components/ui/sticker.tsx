import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────
   Sticker — scattered decorative emoji
   ────────────────────────────────────────────── */
export interface StickerProps extends React.ComponentProps<"div"> {
  emoji?: string
  rotation?: number
}

export function Sticker({
  className,
  emoji = "⭐",
  rotation = -12,
  ...props
}: StickerProps) {
  return (
    <div
      data-slot="sticker"
      className={cn(
        "absolute z-20 pointer-events-none select-none text-2xl",
        "drop-shadow-[2px_2px_0px_var(--chaos-black)]",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      {...props}
    >
      {emoji}
    </div>
  )
}
