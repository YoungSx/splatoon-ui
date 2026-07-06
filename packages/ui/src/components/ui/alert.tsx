import * as React from 'react'

import { cn } from '@/lib/utils'
import type { SplatoonAssetBasePath } from './assets'
import { TornCard } from './torn-card'
import type { SplatoonColorValue } from './tokens'

export type AlertVariant = 'default' | 'destructive'
const AlertVariantContext = React.createContext<AlertVariant>('default')
const ALERT_DESTRUCTIVE_TITLE_COLOR = 'var(--danger-surface-title)'
const ALERT_DESTRUCTIVE_DESCRIPTION_COLOR = 'var(--danger-surface-description)'

export interface AlertProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  variant?: AlertVariant
  rotation?: string
  background?: SplatoonColorValue
  showTape?: boolean
  showSticker?: boolean
  tapePosition?: 'top-right' | 'bottom-center'
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  ref?: React.Ref<HTMLDivElement>
}

const ALERT_VARIANT_MAP = {
  default: {
    tornVariant: 'b' as const,
    background: undefined,
  },
  destructive: {
    tornVariant: 'c' as const,
    background: 'var(--color-red)',
  },
} as const

function isCssColor(value: string) {
  return (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('var(') ||
    value.startsWith('hsl')
  )
}

export function Alert({
  ref,
  variant = 'default',
  showTape = true,
  background,
  className,
  children,
  ...props
}: AlertProps) {
  const config = ALERT_VARIANT_MAP[variant]

  return (
    <AlertVariantContext.Provider value={variant}>
      <TornCard
        ref={ref}
        variant={config.tornVariant}
        showTape={showTape}
        background={background ?? config.background}
        className={className}
        {...props}
      >
        {children}
      </TornCard>
    </AlertVariantContext.Provider>
  )
}

export interface AlertTitleProps extends Omit<React.ComponentProps<'h2'>, 'ref'> {
  textColor?: string
  ref?: React.Ref<HTMLHeadingElement>
}

function AlertTitle({ ref, className, textColor, style, ...props }: AlertTitleProps) {
  const variant = React.useContext(AlertVariantContext)
  const resolvedTextColor =
    textColor ?? (variant === 'destructive' ? ALERT_DESTRUCTIVE_TITLE_COLOR : 'text-blue')

  return (
    <h2
      ref={ref}
      data-slot="alert-title"
      className={cn(
        'splat-heading text-2xl',
        resolvedTextColor && isCssColor(resolvedTextColor) ? '' : resolvedTextColor,
        className
      )}
      style={
        resolvedTextColor && isCssColor(resolvedTextColor)
          ? { color: resolvedTextColor, ...style }
          : style
      }
      {...props}
    />
  )
}

export interface AlertDescriptionProps extends Omit<React.ComponentProps<'p'>, 'ref'> {
  textColor?: string
  ref?: React.Ref<HTMLParagraphElement>
}

function AlertDescription({ ref, className, textColor, style, ...props }: AlertDescriptionProps) {
  const variant = React.useContext(AlertVariantContext)
  const resolvedTextColor =
    textColor ?? (variant === 'destructive' ? ALERT_DESTRUCTIVE_DESCRIPTION_COLOR : undefined)

  return (
    <p
      ref={ref}
      data-slot="alert-description"
      className={cn('text-sm opacity-90', className)}
      style={resolvedTextColor ? { color: resolvedTextColor, ...style } : style}
      {...props}
    />
  )
}

export { AlertTitle, AlertDescription }
