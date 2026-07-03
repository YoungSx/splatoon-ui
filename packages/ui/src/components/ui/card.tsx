'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { DottedDivider } from './dotted-divider'
import { StapleCard } from './staple-card'
import { RuggedCard, type RuggedTheme } from './rugged-card'
import { TornCard } from './torn-card'

// ── CardContext for variant-sharing among sub-components ────────

type CardVariant = 'paper' | 'staple' | 'rugged' | 'torn'

export const CardContext = React.createContext<{
  variant?: CardVariant
  surface?: 'white' | 'dark'
}>({
  variant: 'paper',
  surface: 'white',
})

// ── Card Props ──────────────────────────────────────────────────

export interface CardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  variant?: CardVariant
  surface?: 'white' | 'dark'
  /** Card rotation angle (rugged/torn) */
  rotation?: string
  /** Theme preset (rugged only) */
  ruggedTheme?: RuggedTheme
  /** Custom background ReactNode (rugged/torn) */
  ruggedBackground?: React.ReactNode
  // For staple/paper/torn variant
  /** Image/media shown in the tilted image area */
  image?: React.ReactNode
  /** Convenience: renders a title paragraph in the info area */
  title?: React.ReactNode
  /** Convenience: renders a subtitle paragraph below the title */
  subtitle?: React.ReactNode
  /** Convenience: renders an action element at the bottom of info */
  action?: React.ReactNode
  /** Whether to show the decorative tape element at the top (staple/torn, default: true) */
  showTape?: boolean
  /** Enable hover tilt animation (staple/paper variant) */
  hoverTilt?: boolean
}

// ── Card Component (thin dispatcher) ───────────────────────────

function Card({
  className,
  variant = 'paper',
  surface = 'white',
  ruggedTheme,
  rotation,
  ruggedBackground,
  image,
  title,
  subtitle,
  action,
  showTape,
  hoverTilt,
  children,
  ...props
}: CardProps) {
  const ctx = { variant, surface }

  if (variant === 'torn') {
    return (
      <CardContext.Provider value={ctx}>
        <TornCard className={className} rotation={rotation} showTape={showTape} {...props}>
          {children}
        </TornCard>
      </CardContext.Provider>
    )
  }

  if (variant === 'rugged') {
    return (
      <CardContext.Provider value={ctx}>
        <RuggedCard
          className={className}
          ruggedTheme={ruggedTheme}
          ruggedRotation={rotation}
          ruggedBackground={ruggedBackground}
          {...props}
        >
          {children}
        </RuggedCard>
      </CardContext.Provider>
    )
  }

  // Both paper and staple render StapleCard
  // paper = no tape, staple = with tape
  const isStaple = variant === 'staple'

  return (
    <CardContext.Provider value={ctx}>
      <StapleCard
        className={className}
        image={image}
        title={title}
        subtitle={subtitle}
        action={action}
        surface={surface}
        showTape={isStaple ? (showTape ?? true) : false}
        hoverTilt={hoverTilt}
        {...props}
      >
        {children}
      </StapleCard>
    </CardContext.Provider>
  )
}

// ── Sub-components ──────────────────────────────────────────────

interface CardSectionProps extends React.ComponentProps<'div'> {
  showDivider?: boolean
}

function CardHeader({ className, children, showDivider = true, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header grid auto-rows-min items-start gap-1.5 pb-4 group-data-[size=sm]/card:pb-3',
        className
      )}
      {...props}
    >
      {children}
      {showDivider ? <DottedDivider aria-hidden="true" className="mt-2" /> : null}
    </div>
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'splat-skew text-2xl leading-none font-black tracking-wider text-current',
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-[15px] leading-snug font-medium opacity-80', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'relative z-20 flex w-full flex-col text-[16px] leading-relaxed font-medium text-current',
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, children, showDivider = true, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'relative mt-2 flex items-center justify-between pt-4 group-data-[size=sm]/card:mt-1 group-data-[size=sm]/card:pt-3',
        className
      )}
      {...props}
    >
      {showDivider ? (
        <DottedDivider aria-hidden="true" className="absolute top-0 right-0 left-0" />
      ) : null}
      {children}
    </div>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }

export { CardImage } from './card-image'
export type { CardImageProps } from './card-image'
