'use client'

import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'

import { cn } from '@/lib/utils'
import styles from './select.module.css'
import type {
  PrimitiveChangeDetails,
  PrimitiveFocusTarget,
  PrimitiveOpenRenderState,
  PrimitivePopupAlign,
  PrimitivePopupOffset,
  PrimitivePopupSide,
  PrimitiveRender,
} from './types'

const CHEVRON_PATH =
  'M0,11.23.12,11l.32-.47.3-.12-.16-.35.18-.49.4-.21L1.09,9l.23-.35.26-.21.32-.21L2,7.84l.2-.38v-.3l.47-.47-.05-.38L3,6.08l-.19-.77,0-.26-.26-.3-.1-.31-.42-.25,0-.38-.32-.23L1.5,3.25l0-.32-.05-.26L1,2.37.94,2,.66,1.76.51,1.41.23,1.08.3.66.14.41,0,.13l.7,0L1,.08l.14.14L1.68,0,2,.12,2.21,0l.66.21.26,0h.42l.33.14L4.3.69l0,.38.29.27.14.4L5,2l.07.37,0,.14L5.48,3l.07.09.42.3.1.33L6,4.07l.24.33.42.25,0,.35.1.4.16.47-.11.42-.21.33L6.41,7,6.2,7.2,6,7.6,6,7.93l-.28.31-.3.3,0,.19-.16.37L5,9.43l-.18.14-.23.33-.21.38.09.42-.3.33,0,.18-.66.24-.39.1-.52.09,0-.09-.5-.09-.46.07-.26.09-.4,0-.39-.07-.45.17L0,11.23Z'

const SQUID_BODY_PATH =
  'M256,31.6c-33.5,0-212.4,191.6-198.6,243.7c6.4,23.9,79.1,28.1,79.1,28.1s24.2,52.4,16.8,78.5c-2.9,10.2-33.1,46.3,16.7,77.8c0,0,28-17.6,29.5-53.3c-0.2,3.7-2.4,51.9,29.1,63.6c0,0,27.3-5.8,27.3-60.3c0,54.5,27.3,60.3,27.3,60.3c31.6-11.7,29.4-59.9,29.1-63.6c1.5,35.7,29.6,53.3,29.6,53.3c49.8-31.6,19.6-67.7,16.7-77.8c-7.4-26.1,16.8-78.5,16.8-78.5s72.7-4.2,79.1-28.1C468.4,223.3,289.5,31.6,256,31.6z'

const SQUID_MASK_PATH =
  'M309.6,341.7c-34.3,0-37.5-14.2-53.6-14.2c-16.1,0-19.3,14.2-53.6,14.2c-36.1,0-65.5-33.9-65.5-75.8c0-39.4,24.8-79.1,76.3-74.6c26,2.2,32.8,13.1,42.8,13.1c10,0,16.8-10.9,42.8-13.1c51.5-4.4,76.3,35.3,76.3,74.6C375.1,307.8,345.8,341.7,309.6,341.7z'

const SQUID_EYES_PATH =
  'M306.5,199.5c-22.3,0-41.4,13.9-50.5,34.1c-9-20.2-28.2-34.1-50.4-34.1c-30.9,0-55.9,26.9-55.9,60c0,33.1,25.1,60,55.9,60c22.2,0,41.4-13.9,50.4-34.1c9,20.2,28.2,34.1,50.5,34.1c30.9,0,55.9-26.9,55.9-60C362.4,226.4,337.3,199.5,306.5,199.5z M209.9,271.4c-18.3,0-33.1-14-33.1-31.2c0-17.3,14.8-31.3,33.1-31.3c18.3,0,33.1,14,33.1,31.3C242.9,257.4,228.1,271.4,209.9,271.4z M302.2,271.4c-18.3,0-33.1-14-33.1-31.2c0-17.3,14.8-31.3,33.1-31.3c18.3,0,33.1,14,33.1,31.3C335.3,257.4,320.4,271.4,302.2,271.4z'

export type SelectChevronDirection = 'down' | 'up' | 'left' | 'right'

export interface SelectChevronProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'children' | 'ref'
> {
  direction?: SelectChevronDirection
  ref?: React.Ref<SVGSVGElement>
}

const chevronDirectionTransforms: Record<SelectChevronDirection, string> = {
  down: 'rotate(90 6 6) translate(2.5, 0)',
  up: 'rotate(-90 6 6) translate(2.5, 0)',
  left: 'rotate(180 6 6) translate(2.5, 0)',
  right: 'translate(2.5, 0)',
}

function SelectChevron({ ref, direction = 'down', className, ...props }: SelectChevronProps) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn('inline-block shrink-0 fill-current', className)}
      {...props}
    >
      <path d={CHEVRON_PATH} transform={chevronDirectionTransforms[direction]} />
    </svg>
  )
}

export interface SelectSquidIndicatorProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'children' | 'ref'
> {
  ref?: React.Ref<SVGSVGElement>
}

function SelectSquidIndicator({ ref, className, ...props }: SelectSquidIndicatorProps) {
  return (
    <svg
      ref={ref}
      viewBox="31.6 31.6 438.42 438.42"
      aria-hidden="true"
      className={cn('inline-block shrink-0', className)}
      {...props}
    >
      <g transform="rotate(-90 250.81 250.81)">
        <path fill="currentColor" d={SQUID_BODY_PATH} />
        <path fill="#0d0d0d" d={SQUID_MASK_PATH} />
        <path fill="#ffffff" d={SQUID_EYES_PATH} />
      </g>
    </svg>
  )
}

export type SquidArrowProps = SelectSquidIndicatorProps
const SquidArrow = SelectSquidIndicator

export type SelectFocusColor = 'yellow' | 'blue' | 'purple' | 'pink' | 'green' | 'orange'

const focusColorMap: Record<SelectFocusColor, string> = {
  yellow: 'var(--color-yellow, #eaff3d)',
  blue: 'var(--color-blue, #2b3bf6)',
  purple: 'var(--color-purple, #6a0dad)',
  pink: 'var(--color-pink, #ff007f)',
  green: 'var(--color-green, #00e676)',
  orange: 'var(--color-orange, #ff6600)',
}

const focusTextColorMap: Record<SelectFocusColor, string> = {
  yellow: 'var(--color-chaos-black, #0d0d0d)',
  blue: '#ffffff',
  purple: '#ffffff',
  pink: '#ffffff',
  green: 'var(--color-chaos-black, #0d0d0d)',
  orange: 'var(--color-chaos-black, #0d0d0d)',
}

interface SelectContextValue {
  focusColor: SelectFocusColor
  setFocusColor: (color: SelectFocusColor) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

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
  focusColor?: SelectFocusColor
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

function toSelectRootProps<Value, Multiple extends boolean | undefined>(
  props: SelectProps<Value, Multiple>
): SelectPrimitive.Root.Props<Value, Multiple> {
  const { focusColor: _focusColor, ...rootProps } = props
  return rootProps as SelectPrimitive.Root.Props<Value, Multiple>
}

function Select<Value = string, Multiple extends boolean | undefined = false>(
  props: SelectProps<Value, Multiple>
) {
  const [contextFocusColor, setContextFocusColor] = React.useState<SelectFocusColor>(
    props.focusColor ?? 'yellow'
  )

  React.useEffect(() => {
    if (props.focusColor) {
      setContextFocusColor(props.focusColor)
    }
  }, [props.focusColor])

  const contextValue = React.useMemo(
    () => ({
      focusColor: props.focusColor ?? contextFocusColor,
      setFocusColor: setContextFocusColor,
    }),
    [props.focusColor, contextFocusColor]
  )

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root {...toSelectRootProps(props)} />
    </SelectContext.Provider>
  )
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

function toSelectValueProps<Value, Multiple extends boolean | undefined>(
  props: SelectValueProps<Value, Multiple>
): SelectPrimitive.Value.Props {
  return props as SelectPrimitive.Value.Props
}

function SelectValue<Value = string, Multiple extends boolean | undefined = false>({
  className,
  ...props
}: SelectValueProps<Value, Multiple>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex min-w-0 flex-1 truncate text-left', className)}
      {...toSelectValueProps(props)}
    />
  )
}

export interface SelectTriggerProps<
  Value = string,
  Multiple extends boolean | undefined = false,
> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default'
  focusColor?: SelectFocusColor
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

function toSelectTriggerProps<Value, Multiple extends boolean | undefined>(
  props: SelectTriggerProps<Value, Multiple>
): SelectPrimitive.Trigger.Props {
  const { focusColor: _focusColor, ...triggerProps } = props
  return triggerProps as SelectPrimitive.Trigger.Props
}

function SelectTrigger<Value = string, Multiple extends boolean | undefined = false>(
  props: SelectTriggerProps<Value, Multiple>
) {
  const context = React.useContext(SelectContext)
  const {
    className,
    size = 'default',
    focusColor: focusColorProp,
    style,
    children,
    ...rest
  } = props

  const focusColor = focusColorProp ?? context?.focusColor ?? 'yellow'

  React.useEffect(() => {
    if (focusColorProp && context?.setFocusColor) {
      context.setFocusColor(focusColorProp)
    }
  }, [focusColorProp, context])

  const focusColorToken = focusColorMap[focusColor] ?? focusColor
  const focusTextColor = focusTextColorMap[focusColor] ?? 'var(--color-chaos-black, #0d0d0d)'

  const inlineStyle: React.CSSProperties = {
    '--input-focus-color': focusColorToken,
    '--select-focus-color': focusColorToken,
    '--select-focus-text': focusTextColor,
    ...style,
  } as React.CSSProperties

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      style={inlineStyle}
      className={cn(
        styles.trigger,
        'flex w-full max-w-full min-w-0 items-center justify-between *:data-[slot=select-value]:min-w-0',
        className
      )}
      {...toSelectTriggerProps(props)}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <SelectChevron
            className={cn(
              styles.chevron,
              'pointer-events-none size-4 shrink-0 transition-transform duration-200 ease-out data-open:rotate-180 data-[popup-open]:rotate-180 data-[state=open]:rotate-180'
            )}
          />
        }
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
  focusColor?: SelectFocusColor
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
  focusColor: focusColorProp,
  style,
  ...props
}: SelectContentProps) {
  const context = React.useContext(SelectContext)
  const focusColor = focusColorProp ?? context?.focusColor ?? 'yellow'

  const focusColorToken = focusColorMap[focusColor] ?? focusColor
  const focusTextColor = focusTextColorMap[focusColor] ?? 'var(--color-chaos-black, #0d0d0d)'

  const inlineStyle: React.CSSProperties = {
    '--input-focus-color': focusColorToken,
    '--select-focus-color': focusColorToken,
    '--select-focus-text': focusTextColor,
    ...style,
  } as React.CSSProperties

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
          style={inlineStyle}
          className={cn(
            styles.content,
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 isolate z-[var(--z-floating)] origin-(--transform-origin) data-[align-trigger=true]:animate-none',
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
      className={cn(styles.label, 'px-1.5 py-1 text-xs font-black tracking-widest', className)}
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
        styles.item,
        'relative flex w-full cursor-pointer items-center gap-1.5 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute top-1/2 right-2 flex size-5.5 -translate-y-1/2 items-center justify-center text-current" />
        }
      >
        <SelectSquidIndicator className="pointer-events-none size-full" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export interface SelectSeparatorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(styles.separator, className)}
      {...props}
    />
  )
}

export interface SelectScrollUpButtonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function SelectScrollUpButton({ className, ...props }: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(styles.scrollButton, className)}
      {...props}
    >
      <SelectChevron direction="up" className="size-3.5" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

export interface SelectScrollDownButtonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  render?: PrimitiveRender<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function SelectScrollDownButton({ className, ...props }: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(styles.scrollButton, className)}
      {...props}
    >
      <SelectChevron direction="down" className="size-3.5" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSquidIndicator,
  SquidArrow,
  SelectChevron,
}
