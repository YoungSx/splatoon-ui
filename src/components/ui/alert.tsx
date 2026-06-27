import * as React from 'react'

import { cn } from '@/lib/utils'
import { TornCard } from './torn-card'

type AlertVariant = 'default' | 'destructive'
const AlertVariantContext = React.createContext<AlertVariant>('default')
const ALERT_DESTRUCTIVE_TITLE_COLOR = 'var(--danger-surface-title)'
const ALERT_DESTRUCTIVE_DESCRIPTION_COLOR = 'var(--danger-surface-description)'

export interface AlertProps extends Omit<React.ComponentProps<typeof TornCard>, 'variant'> {
  variant?: AlertVariant
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

function AlertTitle({
  className,
  textColor,
  style,
  ...props
}: React.ComponentProps<'h2'> & { textColor?: string }) {
  const variant = React.useContext(AlertVariantContext)
  const resolvedTextColor =
    textColor ?? (variant === 'destructive' ? ALERT_DESTRUCTIVE_TITLE_COLOR : 'text-blue')

  return (
    <h2
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

function AlertDescription({
  className,
  textColor,
  style,
  ...props
}: React.ComponentProps<'p'> & { textColor?: string }) {
  const variant = React.useContext(AlertVariantContext)
  const resolvedTextColor =
    textColor ?? (variant === 'destructive' ? ALERT_DESTRUCTIVE_DESCRIPTION_COLOR : undefined)

  return (
    <p
      data-slot="alert-description"
      className={cn('text-sm opacity-90', className)}
      style={resolvedTextColor ? { color: resolvedTextColor, ...style } : style}
      {...props}
    />
  )
}

export { AlertTitle, AlertDescription }
