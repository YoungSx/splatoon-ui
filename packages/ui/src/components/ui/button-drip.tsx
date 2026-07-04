import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './button-drip.module.css'

export interface ButtonDripProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  hoverText?: React.ReactNode
  accentColors?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

export function ButtonDrip({
  ref,
  icon,
  hoverText,
  accentColors,
  className,
  children,
  type = 'button',
  ...props
}: ButtonDripProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.button, accentColors && styles.accentColors, className)}
      {...props}
    >
      <span className={styles.content}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <span>{children}</span>
      </span>
      <span className={styles.hoverContent}>
        <span>{hoverText ?? children}</span>
      </span>
    </button>
  )
}
