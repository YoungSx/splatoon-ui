'use client'

import * as React from 'react'
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { uiZIndex } from '@/lib/ui-z-index'
import { createTriggerButton } from '@/components/ui/trigger-button'
import { WaveButton } from './wave-button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import styles from './sheet.module.css'

const SHEET_Z_INDEX = {
  overlay: uiZIndex.sheetOverlay,
  content: uiZIndex.sheet,
} as const

// ── Sub-components (composable) ──

export type SheetProps = SheetPrimitive.Root.Props
export type SheetTriggerProps = SheetPrimitive.Trigger.Props
export type SheetPortalProps = SheetPrimitive.Portal.Props
export type SheetOverlayProps = SheetPrimitive.Backdrop.Props

function Sheet({ ...props }: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetTriggerProps) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

const SheetTriggerButton = createTriggerButton(
  SheetPrimitive.Trigger as unknown as React.ComponentType<Record<string, unknown>>,
  'sheet-trigger'
)

function SheetPortal({ ...props }: SheetPortalProps) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, style, ...props }: SheetOverlayProps) {
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

export type SheetSide = 'top' | 'right' | 'bottom' | 'left'

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

export interface SheetPopupProps extends SheetPrimitive.Popup.Props {
  side?: SheetSide
  closeButton?: React.ReactNode
}

const SheetPopup = React.forwardRef<HTMLDivElement, SheetPopupProps>(function SheetPopup(
  { className, side = 'right', style, children, closeButton, ...props },
  ref
) {
  const [isReducedMotion] = useReducedMotion()
  return (
    <SheetPrimitive.Popup
      ref={ref}
      data-slot="sheet-popup"
      data-side={side}
      className={cn(SIDE_CLASS[side], isReducedMotion && styles.reducedMotion)}
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

export interface SheetContentProps extends SheetPrimitive.Popup.Props {
  side?: SheetSide
  showCloseButton?: boolean
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
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

export type SheetHeaderProps = React.ComponentProps<'div'>
export type SheetFooterProps = React.ComponentProps<'div'>
export type SheetTitleProps = SheetPrimitive.Title.Props
export type SheetDescriptionProps = SheetPrimitive.Description.Props

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-0.5 p-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('splat-heading text-base font-black tracking-wider text-current', className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
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
