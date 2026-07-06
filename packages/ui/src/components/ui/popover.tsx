'use client'

import * as React from 'react'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { cn } from '@/lib/utils'
import { uiZIndex } from '@/lib/ui-z-index'
import { createTriggerButton } from '@/components/ui/trigger-button'
import type { ButtonProps } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type {
  PrimitiveFocusTarget,
  PrimitiveOpenChangeDetails,
  PrimitiveOpenRenderState,
  PrimitivePopupAlign,
  PrimitivePopupOffset,
  PrimitivePopupSide,
  PrimitivePortalContainer,
  PrimitiveRender,
} from './types'

const POPOVER_Z_INDEX = uiZIndex.floating

// ── Sub-components (composable) ──

export interface PopoverProps {
  children?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  modal?: boolean | 'trap-focus'
  onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails) => void
  onOpenChangeComplete?: (open: boolean) => void
  triggerId?: string | null
  defaultTriggerId?: string | null
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  nativeButton?: boolean
  openOnHover?: boolean
  delay?: number
  closeDelay?: number
  render?: PrimitiveRender<HTMLButtonElement, PrimitiveOpenRenderState>
  ref?: React.Ref<HTMLButtonElement>
}

export interface PopoverPortalProps extends React.HTMLAttributes<HTMLDivElement> {
  keepMounted?: boolean
  container?: PrimitivePortalContainer
  ref?: React.Ref<HTMLDivElement>
}

export interface PopoverPositionerProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: PrimitivePopupAlign
  alignOffset?: PrimitivePopupOffset
  side?: PrimitivePopupSide
  sideOffset?: PrimitivePopupOffset
  render?: PrimitiveRender<HTMLDivElement, PrimitiveOpenRenderState>
  ref?: React.Ref<HTMLDivElement>
}

function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ref, ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger ref={ref} data-slot="popover-trigger" {...props} />
}

export type PopoverTriggerButtonProps = Omit<PopoverTriggerProps, 'children' | 'ref' | 'render'> &
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

const PopoverTriggerButtonImpl = createTriggerButton(PopoverPrimitive.Trigger, 'popover-trigger')

function PopoverTriggerButton(props: PopoverTriggerButtonProps) {
  return <PopoverTriggerButtonImpl {...props} />
}

function PopoverPortal({ ...props }: PopoverPortalProps) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
}

function PopoverPositioner({
  className,
  style,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: PopoverPositionerProps) {
  return (
    <PopoverPrimitive.Positioner
      data-slot="popover-positioner"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={cn('isolate', className)}
      style={{ zIndex: POPOVER_Z_INDEX, ...style }}
      {...props}
    />
  )
}

// ── High-level content (Portal + Positioner + Popup) ──

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: PrimitivePopupAlign
  alignOffset?: PrimitivePopupOffset
  side?: PrimitivePopupSide
  sideOffset?: PrimitivePopupOffset
  initialFocus?: PrimitiveFocusTarget
  finalFocus?: PrimitiveFocusTarget
  render?: PrimitiveRender<HTMLDivElement, PrimitiveOpenRenderState>
  ref?: React.Ref<HTMLDivElement>
}

type PopoverContentStyle = React.CSSProperties & {
  '--pop-in-duration'?: string
}

function PopoverContent({
  ref,
  className,
  align,
  alignOffset,
  side,
  sideOffset,
  style,
  ...props
}: PopoverContentProps) {
  const [isReducedMotion] = useReducedMotion()
  return (
    <PopoverPortal>
      <PopoverPositioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          ref={ref}
          data-slot="popover-content"
          className={cn(
            'scrap-panel-tight bg-popover text-popover-foreground flex w-72 origin-(--transform-origin) flex-col gap-2.5 px-3 py-2.5 text-sm shadow-none outline-hidden data-open:animate-[pop-in_var(--pop-in-duration,0.5s)_var(--ease-back-out)_both]',
            isReducedMotion && 'data-open:!animate-none',
            className
          )}
          style={
            {
              zIndex: POPOVER_Z_INDEX,
              '--pop-in-duration': isReducedMotion ? '0s' : '0.5s',
              ...style,
            } as PopoverContentStyle
          }
          {...props}
        />
      </PopoverPositioner>
    </PopoverPortal>
  )
}

// ── Layout helpers ──

export interface PopoverHeaderProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  ref?: React.Ref<HTMLDivElement>
}
export interface PopoverTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  render?: PrimitiveRender<HTMLHeadingElement>
  ref?: React.Ref<HTMLHeadingElement>
}

export interface PopoverDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  render?: PrimitiveRender<HTMLParagraphElement>
  ref?: React.Ref<HTMLParagraphElement>
}

function PopoverHeader({ ref, className, ...props }: PopoverHeaderProps) {
  return (
    <div
      ref={ref}
      data-slot="popover-header"
      className={cn('flex flex-col gap-0.5 text-sm', className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn('splat-heading', className)}
      {...props}
    />
  )
}

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn('text-muted-foreground', className)}
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
