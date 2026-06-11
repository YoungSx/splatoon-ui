import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './tape-title.module.css'

interface TapeTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'black' | 'red' | 'yellow'
  scaling?: boolean
  children: React.ReactNode
}

export function TapeTitle({ color = 'black', scaling, className, children, ...props }: TapeTitleProps) {
  if (scaling) {
    return (
      <div className={cn(styles.scaling, className)} {...props}>
        <div className={cn(styles.container, color === 'red' && styles.red, color === 'yellow' && styles.yellow)}>
          <h2 className={styles.title}>{children}</h2>
        </div>
      </div>
    )
  }

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
