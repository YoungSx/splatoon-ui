"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"
import { createTriggerButton } from "@/components/ui/trigger-button"

// ── Sub-components (composable) ──

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

const PopoverTriggerButton = createTriggerButton(
  PopoverPrimitive.Trigger as unknown as React.ComponentType<Record<string, unknown>>,
  "popover-trigger"
)

function PopoverPortal({ ...props }: PopoverPrimitive.Portal.Props) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
}

function PopoverPositioner({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Positioner.Props) {
  return (
    <PopoverPrimitive.Positioner
      data-slot="popover-positioner"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={cn("isolate z-50", className)}
      {...props}
    />
  )
}

// ── High-level content (Portal + Positioner + Popup) ──

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverPrimitive.Popup.Props & {
  align?: PopoverPrimitive.Positioner.Props['align']
  alignOffset?: PopoverPrimitive.Positioner.Props['alignOffset']
  side?: PopoverPrimitive.Positioner.Props['side']
  sideOffset?: PopoverPrimitive.Positioner.Props['sideOffset']
}>(
  function PopoverContent(
    { className, align, alignOffset, side, sideOffset, ...props },
    ref,
  ) {
    return (
      <PopoverPortal>
        <PopoverPositioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
          <PopoverPrimitive.Popup
            ref={ref}
            data-slot="popover-content"
            className={cn(
              "scrap-panel-tight z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 bg-popover px-3 py-2.5 text-sm text-popover-foreground shadow-none outline-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              className
            )}
            {...props}
          />
        </PopoverPositioner>
      </PopoverPortal>
    )
  },
)

// ── Layout helpers ──

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("splat-heading", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverPortal,
  PopoverPositioner,
  PopoverTitle,
  PopoverTrigger,
  PopoverTriggerButton,
}
