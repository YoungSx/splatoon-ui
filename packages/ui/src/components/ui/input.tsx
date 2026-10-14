import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './input.module.css'

export type InputVariant = 'field-cut'
export type InputFocusColor = 'yellow' | 'blue' | 'purple' | 'pink' | 'green' | 'orange'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'children' | 'ref'> {
  ref?: React.Ref<HTMLInputElement>
  variant?: InputVariant
  focusColor?: InputFocusColor
}

const focusColorMap: Record<InputFocusColor, string> = {
  yellow: 'var(--color-yellow, #eaff3d)',
  blue: 'var(--color-blue, #2b3bf6)',
  purple: 'var(--color-purple, #6a0dad)',
  pink: 'var(--color-pink, #ff007f)',
  green: 'var(--color-green, #00e676)',
  orange: 'var(--color-orange, #ff6600)',
}

function Input({ ref, className, type, ...props }: InputProps) {
  const { variant = 'field-cut', focusColor = 'yellow', style, ...rest } = props

  const inlineStyle: React.CSSProperties = {
    '--input-focus-color': focusColorMap[focusColor] ?? focusColor,
    ...style,
  } as React.CSSProperties

  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      data-variant={variant}
      style={inlineStyle}
      className={cn(styles.inputField, className)}
      {...rest}
    />
  )
}

export { Input }
