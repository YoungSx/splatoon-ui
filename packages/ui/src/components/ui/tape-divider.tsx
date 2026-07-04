import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './tape-divider.module.css'

export interface TapeDividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Single tape strip or double (tape-2 + tape-3 stacked) */
  variant?: 'primary' | 'double'
  /** Rotation direction */
  rotate?: 'none' | 'left' | 'right' | 'strong'
  /** Apply negative margin so next section overlaps the tape */
  overlap?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export function TapeDivider({
  ref,
  variant = 'primary',
  rotate = 'none',
  overlap = false,
  className,
  ...props
}: TapeDividerProps) {
  const rotateClass =
    rotate === 'left'
      ? styles.rotateLeft
      : rotate === 'right'
        ? styles.rotateRight
        : rotate === 'strong'
          ? styles.rotateStrong
          : undefined

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        styles.tapeDivider,
        variant === 'double' && styles.double,
        overlap && styles.overlap,
        className
      )}
      {...props}
    >
      <div className={cn(styles.tapePrimary, rotateClass)} />
      {variant === 'double' && <div className={cn(styles.tapeSecondary, rotateClass)} />}
    </div>
  )
}
