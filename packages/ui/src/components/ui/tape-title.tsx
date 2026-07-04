import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './tape-title.module.css'

export interface TapeTitleProps extends Omit<React.ComponentProps<'div'>, 'color' | 'ref'> {
  color?: 'black' | 'red' | 'yellow'
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export function TapeTitle({ ref, color = 'black', className, children, ...props }: TapeTitleProps) {
  return (
    <div
      ref={ref}
      className={cn(
        styles.container,
        color === 'red' && styles.red,
        color === 'yellow' && styles.yellow,
        className
      )}
      {...props}
    >
      <h2 className={styles.title}>{children}</h2>
    </div>
  )
}
