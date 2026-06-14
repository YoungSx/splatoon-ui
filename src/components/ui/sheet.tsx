"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { createTriggerButton } from "@/components/ui/trigger-button"
import { WaveButton } from "./wave-button"
import styles from "./sheet.module.css"

// ── Sub-components (composable) ──

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

const SheetTriggerButton = createTriggerButton(SheetPrimitive.Trigger, "sheet-trigger")

function SheetClose({ className, ...props }: SheetPrimitive.Close.Props) {
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      className={cn('cursor-pointer', className)}
      {...props}
    />
  )
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-[105] bg-overlay transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

// ── Low-level popup primitive (no Portal/Overlay/Close) ──

type SheetSide = "top" | "right" | "bottom" | "left"

const SIDE_CLASS: Record<SheetSide, string> = {
  top: styles.sideTop,
  right: styles.sideRight,
  bottom: styles.sideBottom,
  left: styles.sideLeft,
}

const SheetPopup = React.forwardRef<HTMLDivElement, SheetPrimitive.Popup.Props & {
  side?: SheetSide
}>(
  function SheetPopup({ className, side = "right", ...props }, ref) {
    return (
      <SheetPrimitive.Popup
        ref={ref}
        data-slot="sheet-popup"
        data-side={side}
        className={cn(
          "drawer-sheet flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-none transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0",
          SIDE_CLASS[side],
          className
        )}
        {...props}
      />
    )
  },
)

// ── High-level content (Portal + Overlay + Popup + Close) ──

const SheetContent = React.forwardRef<HTMLDivElement, SheetPrimitive.Popup.Props & {
  side?: SheetSide
  showCloseButton?: boolean
}>(
  function SheetContent(
    { className, children, side = "right", showCloseButton = true, ...props },
    ref,
  ) {
    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPopup ref={ref} className={className} side={side} {...props}>
          {children}
          {showCloseButton && (
            <div className="absolute top-3 right-3">
              <SheetPrimitive.Close render={<WaveButton />} />
            </div>
          )}
        </SheetPopup>
      </SheetPortal>
    )
  },
)

// ── Layout helpers ──

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("splat-heading text-base font-black uppercase tracking-wider text-current", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
  SheetTriggerButton,
}
