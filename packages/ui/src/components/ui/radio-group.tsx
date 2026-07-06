'use client'

import * as React from 'react'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { cn } from '@/lib/utils'
import { Splat12 } from '@/components/ui/splats/splat-12'
import type {
  PrimitiveChangeDetails,
  PrimitiveCheckedRenderState,
  PrimitiveRender,
} from './types'

export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'value'
> {
  defaultValue?: string
  disabled?: boolean
  form?: string
  inputRef?: React.Ref<HTMLInputElement>
  name?: string
  onValueChange?: (value: string, eventDetails: PrimitiveChangeDetails) => void
  readOnly?: boolean
  ref?: React.Ref<HTMLDivElement>
  render?: PrimitiveRender<HTMLDivElement>
  required?: boolean
  value?: string
}

export interface RadioGroupItemProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'onChange' | 'value'
> {
  disabled?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  nativeButton?: boolean
  readOnly?: boolean
  ref?: React.Ref<HTMLElement>
  render?: PrimitiveRender<HTMLElement, PrimitiveCheckedRenderState>
  required?: boolean
  value: string
}

function RadioGroup({ ref, className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      ref={ref}
      data-slot="radio-group"
      className={cn('grid w-full gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({ ref, className, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      ref={ref}
      data-slot="radio-group-item"
      className={cn(
        'group/radio-group-item peer border-chaos-black focus-visible:ring-chaos-black/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-checked:border-chaos-black data-checked:bg-blue relative flex aspect-square size-5.5 shrink-0 rounded-full border-[3px] bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow,background-color] duration-150 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-checked:translate-x-[1px] data-checked:translate-y-[1px] data-checked:shadow-none',
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        <Splat12 className="text-yellow group-data-checked/radio-group-item:animate-in group-data-checked/radio-group-item:zoom-in-50 group-data-checked/radio-group-item:spin-in-12 size-3.5 fill-current transition-none group-data-checked/radio-group-item:duration-200" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
