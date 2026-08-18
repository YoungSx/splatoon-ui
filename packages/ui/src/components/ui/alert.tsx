import * as React from 'react'

import { isCssColor } from '@/lib/css-color'
import { cn } from '@/lib/utils'
import type { SplatoonAssetBasePath } from './assets'
import { TornCard } from './torn-card'
import type { SplatoonColorValue } from './tokens'

export type AlertVariant = 'default' | 'destructive'

/**
 * Variant text colors travel down as custom properties rather than through
 * React context, which keeps this module usable from Server Components.
 */
const ALERT_TITLE_COLOR_VAR = '--alert-title-color'
const ALERT_DESCRIPTION_COLOR_VAR = '--alert-description-color'

type AlertStyle = React.CSSProperties & {
  [ALERT_TITLE_COLOR_VAR]?: string
  [ALERT_DESCRIPTION_COLOR_VAR]?: string
}

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
    titleColor: 'var(--color-blue)',
    descriptionColor: 'inherit',
  },
  destructive: {
    tornVariant: 'c' as const,
    background: 'var(--color-red)',
    titleColor: 'var(--danger-surface-title)',
    descriptionColor: 'var(--danger-surface-description)',
  },
} as const

export function Alert({
  ref,
  variant = 'default',
  showTape = true,
  background,
  className,
  children,
  style,
  ...props
}: AlertProps) {
  const config = ALERT_VARIANT_MAP[variant]
  const resolvedStyle: AlertStyle = {
    [ALERT_TITLE_COLOR_VAR]: config.titleColor,
    [ALERT_DESCRIPTION_COLOR_VAR]: config.descriptionColor,
    ...style,
  }

  return (
    <TornCard
      ref={ref}
      variant={config.tornVariant}
      showTape={showTape}
      background={background ?? config.background}
      className={className}
      style={resolvedStyle}
      {...props}
    >
      {children}
    </TornCard>
  )
}

export interface AlertTitleProps extends Omit<React.ComponentProps<'h2'>, 'ref'> {
  textColor?: string
  ref?: React.Ref<HTMLHeadingElement>
}

function AlertTitle({ ref, className, textColor, style, ...props }: AlertTitleProps) {
  const isClassNameColor = textColor !== undefined && !isCssColor(textColor)
  const color = isClassNameColor
    ? undefined
    : (textColor ?? `var(${ALERT_TITLE_COLOR_VAR}, var(--color-blue))`)

  return (
    <h2
      ref={ref}
      data-slot="alert-title"
      className={cn('splat-heading text-2xl', isClassNameColor ? textColor : '', className)}
      style={color ? { color, ...style } : style}
      {...props}
    />
  )
}

export interface AlertDescriptionProps extends Omit<React.ComponentProps<'p'>, 'ref'> {
  textColor?: string
  ref?: React.Ref<HTMLParagraphElement>
}

function AlertDescription({ ref, className, textColor, style, ...props }: AlertDescriptionProps) {
  const isClassNameColor = textColor !== undefined && !isCssColor(textColor)
  const color = isClassNameColor
    ? undefined
    : (textColor ?? `var(${ALERT_DESCRIPTION_COLOR_VAR}, inherit)`)

  return (
    <p
      ref={ref}
      data-slot="alert-description"
      className={cn('text-sm opacity-90', isClassNameColor ? textColor : '', className)}
      style={color ? { color, ...style } : style}
      {...props}
    />
  )
}

export { AlertTitle, AlertDescription }
