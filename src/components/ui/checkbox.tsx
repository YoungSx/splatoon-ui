"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { Splat11 } from "@/components/ui/splats/splat-11"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5.5 shrink-0 items-center justify-center border-[3px] border-chaos-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] skew-x-[-10deg] transition-[transform,box-shadow,background-color] duration-150 outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-chaos-black/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-chaos-black data-checked:bg-yellow data-checked:text-chaos-black data-checked:translate-x-[1px] data-checked:translate-y-[1px] data-checked:shadow-none",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none data-checked:animate-in data-checked:zoom-in-50 data-checked:spin-in-12 data-checked:duration-200"
      >
        <Splat11 className="size-4 fill-current text-chaos-black skew-x-[10deg]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
