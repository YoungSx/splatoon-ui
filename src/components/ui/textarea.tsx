import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full border-2 border-foreground/30 bg-card px-3 py-2 text-base font-medium transition-all outline-none placeholder:text-muted-foreground placeholder:uppercase placeholder:text-xs placeholder:tracking-wider focus-visible:border-foreground focus-visible:shadow-solid-sm disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[3px_3px_0px_oklch(0.55_0.25_25)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
