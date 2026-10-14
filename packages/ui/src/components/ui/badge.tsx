import * as React from 'react'
import { splatoonColorVars } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import styles from './badge.module.css'
import { TornBadge } from './torn-badge'

export type BadgeColor = 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'monochrome'
export type BadgeVariant = 'torn' | 'pin' | 'splashtag' | 'dot'
export type BadgeRank = 'gold' | 'silver' | 'bronze'
export type BadgePin = 'judd' | 'steelhead' | 'cohozuna' | 'big-run' | 'splattershot'
export type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export type BadgeSize = 'sm' | 'default' | 'lg'

export interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'> {
  color?: BadgeColor
  variant?: BadgeVariant
  rank?: BadgeRank
  pin?: BadgePin
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

const OFFICIAL_PIN_PRESETS: Record<BadgePin, Record<BadgeRank, string>> = {
  judd: {
    gold: '/_images/badges/judd-gold.png',
    silver: '/_images/badges/judd-silver.png',
    bronze: '/_images/badges/judd-bronze.png',
  },
  steelhead: {
    gold: '/_images/badges/steelhead-gold.png',
    silver: '/_images/badges/steelhead-silver.png',
    bronze: '/_images/badges/steelhead-bronze.png',
  },
  cohozuna: {
    gold: '/_images/badges/cohozuna-gold.png',
    silver: '/_images/badges/cohozuna-silver.png',
    bronze: '/_images/badges/cohozuna-bronze.png',
  },
  'big-run': {
    gold: '/_images/badges/big-run-gold.png',
    silver: '/_images/badges/big-run-silver.png',
    bronze: '/_images/badges/big-run-bronze.png',
  },
  splattershot: {
    gold: '/_images/badges/splattershot-5star-gold.png',
    silver: '/_images/badges/splattershot-4star.png',
    bronze: '/_images/badges/splattershot-4star.png',
  },
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

function ExclamationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.75 2.5C6.75 1.95 7.2 1.5 7.75 1.5H8.25C8.8 1.5 9.25 1.95 9.25 2.5L8.9 8.6C8.88 8.95 8.6 9.2 8.25 9.2H7.75C7.4 9.2 7.12 8.95 7.1 8.6L6.75 2.5Z" />
      <circle cx="8" cy="12.5" r="1.35" />
    </svg>
  )
}

function resolvePinImage(
  pin?: BadgePin,
  rank?: BadgeRank,
  explicitSrc?: string
): string | undefined {
  if (explicitSrc) return explicitSrc
  const effectiveRank: BadgeRank = rank ?? 'gold'
  if (pin && OFFICIAL_PIN_PRESETS[pin]) {
    return OFFICIAL_PIN_PRESETS[pin][effectiveRank]
  }
  if (rank) {
    return OFFICIAL_PIN_PRESETS.judd[rank]
  }
  return undefined
}

// prettier-ignore
export function Badge({ ref, color = undefined, variant, rank, pin, dot, placement = 'top-right', size = 'default', src, alt, className, style, children, ...props }: BadgeProps) {
  const isPin = variant === 'pin' || variant === 'splashtag' || Boolean(pin) || Boolean(rank) || Boolean(src)
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
    const imgSrc = resolvePinImage(pin, rank, src)

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
            alt={alt ?? (pin ? `${pin} badge` : rank ? `${rank} rank badge` : 'Splashtag badge')}
            className={styles.pinImage}
            loading="lazy"
          />
        ) : (
          children
        )}
      </span>
    )
  }

  // Official In-Game Alert / Notification Exclamation Bubble styling
  const effectiveColor: BadgeColor = color ?? 'red'
  const textColor = effectiveColor === 'yellow' ? '#000000' : '#ffffff'

  const colorStyles = {
    '--badge-bg': COLOR_VAR[effectiveColor],
    '--badge-color': textColor,
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
    >
      <ExclamationIcon className={styles.dotIcon} />
    </span>
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
    >
      <ExclamationIcon className={styles.dotIcon} />
    </span>
  )
}
