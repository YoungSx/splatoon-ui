import * as React from 'react'

import { resolveSplatoonColorValue } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import styles from './dotted-divider.module.css'
import type { SplatoonColorValue } from './tokens'

export type { SplatoonColorValue } from './tokens'
export type DottedDividerOrientation = 'horizontal' | 'vertical'

export interface DottedDividerProps extends Omit<
  React.ComponentProps<'div'>,
  'children' | 'color' | 'ref'
> {
  orientation?: DottedDividerOrientation
  color?: SplatoonColorValue
  ref?: React.Ref<HTMLDivElement>
}

type DottedDividerStyle = React.CSSProperties & {
  '--dotted-divider-color'?: string
}

export function DottedDivider({
  ref,
  orientation = 'horizontal',
  color,
  className,
  style,
  ...props
}: DottedDividerProps) {
  const resolvedStyle: DottedDividerStyle = {
    ...(color ? { '--dotted-divider-color': resolveSplatoonColorValue(color) } : null),
    ...style,
  }

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-slot="dotted-divider"
      data-orientation={orientation}
      className={cn(styles.root, className)}
      style={resolvedStyle}
      {...props}
    />
  )
}
