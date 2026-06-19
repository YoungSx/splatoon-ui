'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { AssetImage } from './asset-image'
import { squidImageAssets } from './squid-assets'
import styles from './loader.module.css'

export interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Loader color variant. */
  variant?: 'default' | 'blue' | 'red'
  /** Size in CSS units (e.g. '1em', '2rem', '32px'). */
  size?: string
  /** Accessible status label. */
  label?: string
}

/**
 * Loader — image-backed animated squid loading glyph.
 */
export function Loader({
  variant = 'default',
  size,
  label = 'Loading',
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: LoaderProps) {
  const asset = squidImageAssets.loader
  const resolvedLabel = ariaLabel ?? label

  return (
    <span
      data-slot="loader"
      className={cn(
        styles.loader,
        variant === 'blue' && styles.blue,
        variant === 'red' && styles.red,
        className
      )}
      style={
        {
          ...(size ? { '--size': size } : {}),
          ...style,
        } as React.CSSProperties
      }
      role="status"
      aria-label={resolvedLabel}
      {...props}
    >
      <span className={styles.surface} aria-hidden="true">
        <AssetImage asset={asset} className={styles.image} decorative />
      </span>
      <span className="sr-only">{resolvedLabel}</span>
    </span>
  )
}
