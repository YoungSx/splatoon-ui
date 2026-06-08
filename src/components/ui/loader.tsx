'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './loader.module.css'

export interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Loader color variant. Official: default(currentcolor), 'blue', 'red' */
  variant?: 'default' | 'blue' | 'red'
  /** Size in CSS units (e.g. '1em', '2rem', '32px'). Official default: 1em */
  size?: string
}

/**
 * Loader — CSS border spinner.
 * Faithfully reproduces the official splatoon.nintendo.com loader.
 *
 * Official CSS:
 * - border: 3px solid var(--color), border-right-color: transparent
 * - animation: 1s linear infinite rotate(359deg) — 359deg avoids reset glitch
 * - size controlled by --size CSS var (default 1em)
 * - variants: blue (--color: blue), red (--color: red)
 */
export function Loader({
  variant = 'default',
  size,
  className,
  style,
  ...props
}: LoaderProps) {
  return (
    <span
      data-slot="loader"
      className={cn(
        styles.loader,
        variant === 'blue' && styles.blue,
        variant === 'red' && styles.red,
        className
      )}
      style={{
        ...(size ? { '--size': size } : {}),
        ...style,
      } as React.CSSProperties}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </span>
  )
}
