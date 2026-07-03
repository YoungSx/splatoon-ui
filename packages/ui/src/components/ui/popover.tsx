'use client'

import * as React from 'react'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { cn } from '@/lib/utils'
import { uiZIndex } from '@/lib/ui-z-index'
import { createTriggerButton } from '@/components/ui/trigger-button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const POPOVER_Z_INDEX = uiZIndex.floating

// ── Sub-components (composable) ──

export type PopoverProps = PopoverPrimitive.Root.Props
export type PopoverTriggerProps = PopoverPrimitive.Trigger.Props
export type PopoverPortalProps = PopoverPrimitive.Portal.Props
export type PopoverPositionerProps = PopoverPrimitive.Positioner.Props

function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

const PopoverTriggerButton = createTriggerButton(
  PopoverPrimitive.Trigger as unknown as React.ComponentType<Record<string, unknown>>,
  'popover-trigger'
)

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

export interface PopoverContentProps extends PopoverPrimitive.Popup.Props {
  align?: PopoverPrimitive.Positioner.Props['align']
  alignOffset?: PopoverPrimitive.Positioner.Props['alignOffset']
  side?: PopoverPrimitive.Positioner.Props['side']
  sideOffset?: PopoverPrimitive.Positioner.Props['sideOffset']
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { className, align, alignOffset, side, sideOffset, style, ...props },
    ref
  ) {
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
              } as unknown as React.CSSProperties
            }
            {...props}
          />
        </PopoverPositioner>
      </PopoverPortal>
    )
  }
)

// ── Layout helpers ──

export type PopoverHeaderProps = React.ComponentProps<'div'>
export type PopoverTitleProps = PopoverPrimitive.Title.Props
export type PopoverDescriptionProps = PopoverPrimitive.Description.Props

function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
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
