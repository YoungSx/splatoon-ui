import * as React from "react"

import { cn } from "@/lib/utils"

export type PlainStyle = "default" | "cream" | "colored"

const plainStyleClasses = {
  default: "bg-white",
  cream: "bg-[#f5f0e8]",
  colored: "",
} satisfies Record<PlainStyle, string>

export interface PlainCardProps extends React.ComponentProps<"div"> {
  plainStyle?: PlainStyle
}

export function PlainCard({
  ref,
  className,
  plainStyle = "default",
  children,
  ...props
}: PlainCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant="plain"
      className={cn(
        "rounded-xl border-[3px] border-chaos-black transition-colors duration-300",
        plainStyleClasses[plainStyle],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
