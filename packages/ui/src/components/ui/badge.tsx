import * as React from 'react'
import { splatoonColorVars } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import styles from './badge.module.css'
import { TornBadge } from './torn-badge'

export type BadgeColor = 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'monochrome'
export type BadgeVariant = 'torn' | 'pin' | 'splashtag' | 'dot'
export type BadgeRank = 'gold' | 'silver' | 'bronze'
export type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export type BadgeSize = 'sm' | 'default' | 'lg'

export interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'> {
  color?: BadgeColor
  variant?: BadgeVariant
  rank?: BadgeRank
  dot?: boolean
  placement?: BadgePlacement
  size?: BadgeSize
  src?: string
  alt?: string
  children?: React.ReactNode
  ref?: React.Ref<HTMLSpanElement>
}

const COLOR_VAR: Record<BadgeColor, string> = {
  yellow: splatoonColorVars.yellow,
  blue: splatoonColorVars.blue,
  green: splatoonColorVars.green,
  red: splatoonColorVars.red,
  purple: splatoonColorVars.purple,
  monochrome: splatoonColorVars.black,
}

const DEFAULT_RANK_IMAGES: Record<BadgeRank, string> = {
  gold: '/_images/badges/judd-gold.png',
  silver: '/_images/badges/judd-silver.png',
  bronze: '/_images/badges/judd-bronze.png',
}

const PLACEMENT_CLASSES: Record<BadgePlacement, string> = {
  'top-right': styles.placeTopRight,
  'top-left': styles.placeTopLeft,
  'bottom-right': styles.placeBottomRight,
  'bottom-left': styles.placeBottomLeft,
}

const PIN_SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: styles.pinSm,
  default: styles.pinDefault,
  lg: styles.pinLg,
}

const DOT_SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: styles.dotSm,
  default: styles.dotDefault,
  lg: styles.dotLg,
}

// prettier-ignore
export function Badge({ ref, color = undefined, variant, rank, dot, placement = 'top-right', size = 'default', src, alt, className, style, children, ...props }: BadgeProps) {
  const isPin = variant === 'pin' || variant === 'splashtag' || Boolean(rank) || Boolean(src)
  const isDot = variant === 'dot' || Boolean(dot)

  // If variant is torn (or default without pin/splashtag/dot/rank/src), render authentic TornBadge
  if (!isPin && !isDot) {
    return (
      <TornBadge ref={ref} color={color ?? 'yellow'} className={className} style={style} {...props}>
        {children}
      </TornBadge>
    )
  }

  // Pin / Splashtag Badge (Official transparent in-game collectible badges, without extra borders/background)
  if (isPin) {
    const imgSrc = src ?? (rank ? DEFAULT_RANK_IMAGES[rank] : undefined)

    return (
      <span
        ref={ref}
        className={cn(styles.pinBadge, PIN_SIZE_CLASSES[size], className)}
        style={style}
        {...props}
      >
        {imgSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element -- Splashtag badges use small fixed-dimension static or remote images */
          <img
            src={imgSrc}
            alt={alt ?? (rank ? `${rank} rank badge` : 'Splashtag badge')}
            className={styles.pinImage}
            loading="lazy"
          />
        ) : (
          children
        )}
      </span>
    )
  }

  // Notification dot styling: official default is ink red unless explicitly passed
  const effectiveColor: BadgeColor = color ?? 'red'

  const colorStyles = {
    '--badge-bg': COLOR_VAR[effectiveColor],
    ...style,
  } as React.CSSProperties

  const dotElement = (
    <span
      className={cn(
        styles.dotBadge,
        DOT_SIZE_CLASSES[size],
        children ? PLACEMENT_CLASSES[placement] : undefined
      )}
      style={colorStyles}
      aria-hidden="true"
    />
  )

  if (children) {
    return (
      <span ref={ref} className={cn(styles.anchorWrapper, className)} {...props}>
        {children}
        {dotElement}
      </span>
    )
  }

  return (
    <span
      ref={ref}
      className={cn(styles.dotBadge, DOT_SIZE_CLASSES[size], className)}
      style={colorStyles}
      {...props}
      aria-hidden="true"
    />
  )
}
