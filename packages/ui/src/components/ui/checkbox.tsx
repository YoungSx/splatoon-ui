'use client'

import * as React from 'react'
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'

import { cn } from '@/lib/utils'
import { Splat11 } from '@/components/ui/splats/splat-11'
import type { PrimitiveChangeDetails, PrimitiveCheckedRenderState, PrimitiveRender } from './types'

export interface CheckboxProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'checked' | 'children' | 'defaultChecked' | 'onChange' | 'value'
> {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  form?: string
  indeterminate?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  name?: string
  nativeButton?: boolean
  onCheckedChange?: (checked: boolean, eventDetails: PrimitiveChangeDetails) => void
  parent?: boolean
  readOnly?: boolean
  render?: PrimitiveRender<HTMLElement, PrimitiveCheckedRenderState>
  required?: boolean
  ref?: React.Ref<HTMLElement>
  uncheckedValue?: string
  value?: string
}

function Checkbox({ ref, className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        'peer border-chaos-black focus-visible:ring-chaos-black/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-chaos-black data-checked:bg-yellow data-checked:text-chaos-black relative flex size-5.5 shrink-0 skew-x-[-10deg] items-center justify-center border-[3px] bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow,background-color] duration-150 outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-checked:translate-x-[1px] data-checked:translate-y-[1px] data-checked:shadow-none',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="data-checked:animate-in data-checked:zoom-in-50 data-checked:spin-in-12 grid place-content-center text-current transition-none data-checked:duration-200"
      >
        <Splat11 className="text-chaos-black size-4 skew-x-[10deg] fill-current" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
