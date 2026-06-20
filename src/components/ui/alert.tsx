import * as React from 'react'

import { cn } from '@/lib/utils'
import { TornCard } from './torn-card'

type AlertVariant = 'default' | 'destructive'

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
    <TornCard
      variant={config.tornVariant}
      showTape={showTape}
      background={background ?? config.background}
      className={className}
      {...props}
    >
      {children}
    </TornCard>
  )
}

function AlertTitle({
  className,
  textColor = 'text-blue',
  style,
  ...props
}: React.ComponentProps<'h2'> & { textColor?: string }) {
  return (
    <h2
      data-slot="alert-title"
      className={cn(
        'splat-heading text-2xl',
        textColor && isCssColor(textColor) ? '' : textColor,
        className
      )}
      style={textColor && isCssColor(textColor) ? { color: textColor, ...style } : style}
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
  return (
    <p
      data-slot="alert-description"
      className={cn('text-sm opacity-90', className)}
      style={textColor ? { color: textColor, ...style } : style}
      {...props}
    />
  )
}

export { AlertTitle, AlertDescription }
