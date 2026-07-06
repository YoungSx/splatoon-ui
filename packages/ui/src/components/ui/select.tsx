'use client'

import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'

import { cn } from '@/lib/utils'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Splat10 } from './splats'
import type {
  PrimitiveChangeDetails,
  PrimitiveFocusTarget,
  PrimitiveOpenRenderState,
  PrimitivePopupAlign,
  PrimitivePopupOffset,
  PrimitivePopupSide,
  PrimitiveRender,
} from './types'

export type SelectValueType<
  Value,
  Multiple extends boolean | undefined = false,
> = Multiple extends true ? Value[] : Value

export type SelectCurrentValue<
  Value,
  Multiple extends boolean | undefined = false,
> = SelectValueType<Value, Multiple> | null

export interface SelectItemRecord<Value> {
  label: React.ReactNode
  value: Value
}

export interface SelectItemGroup<Value> {
  label?: React.ReactNode
  items: ReadonlyArray<SelectItemRecord<Value>>
}

export interface SelectProps<Value = string, Multiple extends boolean | undefined = false> {
  children?: React.ReactNode
  inputRef?: React.Ref<HTMLInputElement>
  name?: string
  form?: string
  autoComplete?: string
  id?: string
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
  multiple?: Multiple
  highlightItemOnHover?: boolean
  defaultOpen?: boolean
  open?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean, eventDetails: PrimitiveChangeDetails) => void
  onOpenChangeComplete?: (open: boolean) => void
  items?:
    | { readonly [value: string]: React.ReactNode }
    | ReadonlyArray<SelectItemRecord<Value>>
    | ReadonlyArray<SelectItemGroup<Value>>
  itemToStringLabel?: (itemValue: Value) => string
  itemToStringValue?: (itemValue: Value) => string
  isItemEqualToValue?: (itemValue: Value, value: Value) => boolean
  defaultValue?: SelectValueType<Value, Multiple> | null
  value?: SelectValueType<Value, Multiple> | null
  onValueChange?: (
    value: SelectValueType<Value, Multiple> | (Multiple extends true ? never : null),
    eventDetails: PrimitiveChangeDetails
  ) => void
}

function Select<Value = string, Multiple extends boolean | undefined = false>(
  props: SelectProps<Value, Multiple>
) {
  const primitiveProps = props as SelectPrimitive.Root.Props<Value, Multiple>
  return <SelectPrimitive.Root {...primitiveProps} />
}

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  )
}

export interface SelectValueProps<
  Value = string,
  Multiple extends boolean | undefined = false,
> extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  children?: React.ReactNode | ((value: SelectCurrentValue<Value, Multiple>) => React.ReactNode)
  placeholder?: React.ReactNode
  render?: PrimitiveRender<
    HTMLSpanElement,
    {
      value: SelectCurrentValue<Value, Multiple>
      placeholder: boolean
    }
  >
  ref?: React.Ref<HTMLSpanElement>
}

function SelectValue<Value = string, Multiple extends boolean | undefined = false>({
  className,
  ...props
}: SelectValueProps<Value, Multiple>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex min-w-0 flex-1 truncate text-left', className)}
      {...(props as SelectPrimitive.Value.Props)}
    />
  )
}

export interface SelectTriggerProps<
  Value = string,
  Multiple extends boolean | undefined = false,
> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default'
  render?: PrimitiveRender<
    HTMLButtonElement,
    PrimitiveOpenRenderState & {
      readOnly: boolean
      popupSide: PrimitivePopupSide | null
      value: SelectCurrentValue<Value, Multiple>
      placeholder: boolean
    }
  >
  ref?: React.Ref<HTMLButtonElement>
}

function SelectTrigger<Value = string, Multiple extends boolean | undefined = false>({
  className,
  size = 'default',
  children,
  ...props
}: SelectTriggerProps<Value, Multiple>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "field-cut border-foreground/30 bg-card focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground flex w-full max-w-full min-w-0 items-center justify-between gap-1.5 border-2 py-2 pr-2 pl-2.5 text-sm font-bold tracking-wider whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...(props as SelectPrimitive.Trigger.Props)}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="text-muted-foreground pointer-events-none size-4" />}
      />
    </SelectPrimitive.Trigger>
  )
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: PrimitivePopupAlign
  alignOffset?: PrimitivePopupOffset
  side?: PrimitivePopupSide
  sideOffset?: PrimitivePopupOffset
  alignItemWithTrigger?: boolean
  finalFocus?: PrimitiveFocusTarget
  showScrollButtons?: boolean
  render?: PrimitiveRender<HTMLDivElement, PrimitiveOpenRenderState>
  ref?: React.Ref<HTMLDivElement>
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = false,
  showScrollButtons = false,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-[var(--z-floating)]"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            'field-cut-popup border-foreground bg-popover text-popover-foreground shadow-soft-splat-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 relative isolate z-[var(--z-floating)] max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto border-2 data-[align-trigger=true]:animate-none',
            className
          )}
          {...props}
        >
          {showScrollButtons ? <SelectScrollUpButton /> : null}
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          {showScrollButtons ? <SelectScrollDownButton /> : null}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        'text-muted-foreground px-1.5 py-1 text-xs font-black tracking-widest',
        className
      )}
      {...props}
    />
  )
}

export interface SelectItemProps<Value = string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'value'
> {
  value?: Value
  disabled?: boolean
  label?: string
  render?: PrimitiveRender<
    HTMLElement,
    {
      disabled: boolean
      selected: boolean
      highlighted: boolean
    }
  >
  ref?: React.Ref<HTMLElement>
}

function SelectItem<Value = string>({ className, children, ...props }: SelectItemProps<Value>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground relative flex w-full cursor-default items-center gap-1.5 py-1 pr-10 pl-1.5 text-sm font-bold tracking-wider outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center" />
        }
      >
        <Splat10 className="pointer-events-none size-full" viewBox="20 20 280 280" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export interface SelectSeparatorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  orientation?: 'horizontal' | 'vertical'
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-foreground/20 pointer-events-none -mx-1 my-1 h-0.5', className)}
      {...props}
    />
  )
}

export interface SelectScrollUpButtonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  keepMounted?: boolean
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

export interface SelectScrollDownButtonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  keepMounted?: boolean
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function SelectScrollUpButton({ className, ...props }: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({ className, ...props }: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
