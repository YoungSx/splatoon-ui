'use client'

import * as React from 'react'
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { uiZIndex } from '@/lib/ui-z-index'
import { createTriggerButton } from '@/components/ui/trigger-button'
import { WaveButton } from './wave-button'
import styles from './sheet.module.css'

const SHEET_Z_INDEX = {
  overlay: uiZIndex.sheetOverlay,
  content: uiZIndex.sheet,
} as const

// ── Sub-components (composable) ──

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

const SheetTriggerButton = createTriggerButton(
  SheetPrimitive.Trigger as unknown as React.ComponentType<Record<string, unknown>>,
  'sheet-trigger'
)

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, style, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        'bg-overlay fixed inset-0 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm',
        className
      )}
      style={{ zIndex: SHEET_Z_INDEX.overlay, ...style }}
      {...props}
    />
  )
}

// ── Low-level popup primitive (no Portal/Overlay/Close) ──

type SheetSide = 'top' | 'right' | 'bottom' | 'left'

const SIDE_CLASS: Record<SheetSide, string> = {
  top: styles.sideTop,
  right: styles.sideRight,
  bottom: styles.sideBottom,
  left: styles.sideLeft,
}

const CLOSE_BUTTON_CLASS: Record<SheetSide, string> = {
  top: 'top-0 left-3 -translate-y-1/2',
  right: 'top-3 left-0 -translate-x-1/2',
  bottom: 'bottom-0 left-3 translate-y-1/2',
  left: 'top-3 right-0 translate-x-1/2',
}

const SheetPopup = React.forwardRef<
  HTMLDivElement,
  SheetPrimitive.Popup.Props & {
    side?: SheetSide
    closeButton?: React.ReactNode
  }
>(function SheetPopup({ className, side = 'right', style, children, closeButton, ...props }, ref) {
  return (
    <SheetPrimitive.Popup
      ref={ref}
      data-slot="sheet-popup"
      data-side={side}
      className={cn(
        'transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0',
        SIDE_CLASS[side]
      )}
      style={{ zIndex: SHEET_Z_INDEX.content, ...style }}
      {...props}
    >
      <div
        data-slot="sheet-body"
        className={cn(
          'drawer-sheet bg-popover text-popover-foreground flex flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain bg-clip-padding text-sm shadow-none',
          styles.sheetBody,
          className
        )}
      >
        {children}
      </div>
      {closeButton}
    </SheetPrimitive.Popup>
  )
})

// ── High-level content (Portal + Overlay + Popup + Close) ──

const SheetContent = React.forwardRef<
  HTMLDivElement,
  SheetPrimitive.Popup.Props & {
    side?: SheetSide
    showCloseButton?: boolean
  }
>(function SheetContent(
  { className, children, side = 'right', showCloseButton = true, ...props },
  ref
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPopup
        ref={ref}
        className={className}
        side={side}
        closeButton={
          showCloseButton ? (
            <div className={cn('absolute z-10', CLOSE_BUTTON_CLASS[side])}>
              <SheetPrimitive.Close render={<WaveButton />} />
            </div>
          ) : null
        }
        {...props}
      >
        {children}
      </SheetPopup>
    </SheetPortal>
  )
})

// ── Layout helpers ──

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-0.5 p-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'splat-heading text-base font-black tracking-wider text-current uppercase',
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Sheet,
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
