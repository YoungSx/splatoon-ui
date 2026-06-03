import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 border-2 border-foreground/30 bg-card px-3 py-2 text-base font-medium transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:uppercase placeholder:text-xs placeholder:tracking-wider focus-visible:border-foreground focus-visible:shadow-solid-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[3px_3px_0px_oklch(0.55_0.25_25)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
