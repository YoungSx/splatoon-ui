import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './tape-title.module.css'

interface TapeTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'black' | 'red' | 'yellow'
  children: React.ReactNode
}

export function TapeTitle({ color = 'black', className, children, ...props }: TapeTitleProps) {
  return (
    <div
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
