"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"
import { Splat } from "@/components/ui/splats"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-5.5 shrink-0 rounded-full border-[3px] border-chaos-black dark:border-white bg-white dark:bg-[#1a1a1a] shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] transition-[transform,box-shadow,background-color] duration-150 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-chaos-black/20 dark:focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-checked:border-chaos-black dark:data-checked:border-white data-checked:bg-[#603bff] data-checked:translate-x-[1px] data-checked:translate-y-[1px] data-checked:shadow-none",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        <Splat
          id={12}
          className="size-3.5 fill-current text-[#eaff3d] transition-none group-data-checked/radio-group-item:animate-in group-data-checked/radio-group-item:zoom-in-50 group-data-checked/radio-group-item:spin-in-12 group-data-checked/radio-group-item:duration-200"
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
