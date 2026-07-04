import * as React from 'react'
import { cn } from '@/lib/utils'
import { AssetImage } from './asset-image'
import { squidImageAssets, squidSpriteAssets } from './squid-assets'
import styles from './loader.module.css'

export type LoaderAnimation = 'glyph' | 'morph' | 'swim'

export interface LoaderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Loader color variant. */
  variant?: 'default' | 'blue' | 'red'
  /** Animation source used by the loader. */
  animation?: LoaderAnimation
  /** Size in CSS units (e.g. '1em', '2rem', '32px'). */
  size?: string
  /** Accessible status label. */
  label?: string
  ref?: React.Ref<HTMLSpanElement>
}

/**
 * Loader — image-backed animated squid loading glyph.
 */
export function Loader({
  ref,
  variant = 'default',
  animation = 'glyph',
  size,
  label = 'Loading',
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: LoaderProps) {
  const asset = squidImageAssets.loader
  const spriteAsset =
    animation === 'morph'
      ? squidSpriteAssets.loaderMorph
      : animation === 'swim'
        ? squidSpriteAssets.loaderSwim
        : null
  const resolvedLabel = ariaLabel ?? label

  return (
    <span
      ref={ref}
      data-slot="loader"
      data-animation={animation}
      className={cn(
        styles.loader,
        variant === 'blue' && styles.blue,
        variant === 'red' && styles.red,
        className
      )}
      style={
        {
          ...(size ? { '--size': size } : {}),
          ...(spriteAsset
            ? {
                '--loader-sprite-url': `url("${spriteAsset.src}")`,
                '--loader-sprite-duration': `${spriteAsset.durationMs}ms`,
              }
            : {}),
          ...style,
        } as React.CSSProperties
      }
      role="status"
      aria-label={resolvedLabel}
      {...props}
    >
      {animation === 'glyph' ? (
        <span className={styles.surface} aria-hidden="true">
          <AssetImage asset={asset} className={styles.image} decorative />
        </span>
      ) : (
        <span
          className={cn(
            styles.sprite,
            animation === 'morph' && styles.morphSprite,
            animation === 'swim' && styles.swimSprite
          )}
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{resolvedLabel}</span>
    </span>
  )
}
