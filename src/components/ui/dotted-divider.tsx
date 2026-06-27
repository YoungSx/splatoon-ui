import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './dotted-divider.module.css'

export interface DottedDividerProps extends React.ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical'
  color?: string
}

type DottedDividerStyle = React.CSSProperties & {
  '--dotted-divider-color'?: string
}

export function DottedDivider({
  orientation = 'horizontal',
  color,
  className,
  style,
  ...props
}: DottedDividerProps) {
  const resolvedStyle: DottedDividerStyle = {
    ...(color ? { '--dotted-divider-color': color } : null),
    ...style,
  }

  return (
    <div
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
