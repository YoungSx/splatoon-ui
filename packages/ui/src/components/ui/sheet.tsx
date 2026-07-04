'use client'

import * as React from 'react'
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { uiZIndex } from '@/lib/ui-z-index'
import { createTriggerButton } from '@/components/ui/trigger-button'
import type { ButtonProps } from '@/components/ui/button'
import { WaveButton } from './wave-button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import styles from './sheet.module.css'
import type {
  PrimitiveFocusTarget,
  PrimitiveOpenChangeDetails,
  PrimitiveOpenRenderState,
  PrimitivePortalContainer,
  PrimitiveRender,
} from './primitive-types'

const SHEET_Z_INDEX = {
  overlay: uiZIndex.sheetOverlay,
  content: uiZIndex.sheet,
} as const

// ── Sub-components (composable) ──

export interface SheetProps {
  children?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  modal?: boolean | 'trap-focus'
  disablePointerDismissal?: boolean
  onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails) => void
  onOpenChangeComplete?: (open: boolean) => void
  triggerId?: string | null
  defaultTriggerId?: string | null
}

export interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  nativeButton?: boolean
  render?: PrimitiveRender<HTMLButtonElement, PrimitiveOpenRenderState>
  ref?: React.Ref<HTMLButtonElement>
}

export interface SheetPortalProps extends React.HTMLAttributes<HTMLDivElement> {
  keepMounted?: boolean
  container?: PrimitivePortalContainer
  ref?: React.Ref<HTMLDivElement>
}

export interface SheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: PrimitiveRender<HTMLDivElement, PrimitiveOpenRenderState>
  ref?: React.Ref<HTMLDivElement>
}

function Sheet({ ...props }: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ref, ...props }: SheetTriggerProps) {
  return <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />
}

export type SheetTriggerButtonProps = Omit<SheetTriggerProps, 'children' | 'ref' | 'render'> &
  Pick<
    ButtonProps,
    | 'children'
    | 'variant'
    | 'size'
    | 'theme'
    | 'hasChevron'
    | 'color'
    | 'hoverColor'
    | 'textColor'
    | 'textHoverColor'
  > & {
    ref?: React.Ref<HTMLButtonElement>
  }

const SheetTriggerButtonImpl = createTriggerButton(SheetPrimitive.Trigger, 'sheet-trigger')

function SheetTriggerButton(props: SheetTriggerButtonProps) {
  return <SheetTriggerButtonImpl {...props} />
}

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

interface SheetPopupBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  initialFocus?: PrimitiveFocusTarget
  finalFocus?: PrimitiveFocusTarget
  render?: PrimitiveRender<HTMLDivElement, PrimitiveOpenRenderState>
  ref?: React.Ref<HTMLDivElement>
}

export interface SheetPopupProps extends SheetPopupBaseProps {
  side?: SheetSide
  closeButton?: React.ReactNode
}

function SheetPopup({
  ref,
  className,
  side = 'right',
  style,
  children,
  closeButton,
  ...props
}: SheetPopupProps) {
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
}

// ── High-level content (Portal + Overlay + Popup + Close) ──

export interface SheetContentProps extends SheetPopupBaseProps {
  side?: SheetSide
  showCloseButton?: boolean
}

function SheetContent({
  ref,
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) {
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
}

// ── Layout helpers ──

export interface SheetHeaderProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  ref?: React.Ref<HTMLDivElement>
}

export interface SheetFooterProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  ref?: React.Ref<HTMLDivElement>
}
export interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  render?: PrimitiveRender<HTMLHeadingElement>
  ref?: React.Ref<HTMLHeadingElement>
}

export interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  render?: PrimitiveRender<HTMLParagraphElement>
  ref?: React.Ref<HTMLParagraphElement>
}

function SheetHeader({ ref, className, ...props }: SheetHeaderProps) {
  return (
    <div
      ref={ref}
      data-slot="sheet-header"
      className={cn('flex flex-col gap-0.5 p-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ ref, className, ...props }: SheetFooterProps) {
  return (
    <div
      ref={ref}
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
