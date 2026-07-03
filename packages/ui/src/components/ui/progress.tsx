'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'
import styles from './progress.module.css'

export type ProgressVariant =
  | 'yellow'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'black'
  | 'white'
export type ProgressTrackVariant = 'dark' | 'light' | 'transparent'
export type ProgressSize = 'sm' | 'default' | 'lg'

export interface ProgressProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'children' | 'max' | 'value'
> {
  value?: number
  max?: number
  variant?: ProgressVariant
  trackVariant?: ProgressTrackVariant
  size?: ProgressSize
  skewed?: boolean
  splattered?: boolean
}

const sizeHeights = {
  sm: '1rem',
  default: '2rem',
  lg: '3rem',
} as const satisfies Record<ProgressSize, string>

const variantPalette = {
  yellow: 'var(--color-yellow)',
  blue: 'var(--color-blue)',
  green: 'var(--color-green)',
  purple: 'var(--color-purple)',
  orange: 'var(--color-orange)',
  red: 'var(--color-red)',
  black: 'var(--color-black)',
  white: 'var(--color-white)',
} as const satisfies Record<ProgressVariant, string>

const trackPalette = {
  dark: 'var(--color-black)',
  light: 'var(--color-white)',
  transparent: 'transparent',
} as const satisfies Record<ProgressTrackVariant, string>

function Progress({
  ref,
  className,
  value = 0,
  max = 100,
  variant = 'yellow',
  trackVariant = 'dark',
  size = 'default',
  skewed = true,
  splattered = true,
  ...props
}: ProgressProps & { ref?: React.Ref<React.ElementRef<typeof ProgressPrimitive.Root>> }) {
  const safeMax = max > 0 ? max : 100
  const clampedValue = Math.min(Math.max(value, 0), safeMax)
  const percentage = (clampedValue / safeMax) * 100
  const fillColor = variantPalette[variant]
  const trackColor = trackPalette[trackVariant]
  const borderWidth = trackVariant === 'transparent' ? '2px' : '3px'
  const height = sizeHeights[size]

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={clampedValue}
      max={safeMax}
      className={cn(
        'relative w-full shrink-0 overflow-hidden rounded-full',
        skewed && '-skew-x-12',
        className
      )}
      style={{
        height,
        backgroundColor: trackColor,
        borderStyle: 'solid',
        borderWidth,
        borderColor: 'var(--color-black)',
        ...(trackVariant !== 'transparent'
          ? { boxShadow: '3px 3px 0px var(--color-black)' }
          : null),
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="relative h-full w-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          backgroundColor: fillColor,
          color: fillColor,
          transform: `translateX(-${100 - percentage}%)`,
        }}
      >
        {splattered && percentage > 0 ? (
          <div className="pointer-events-none absolute inset-y-[-30%] -right-[18px] z-10 w-[36px]">
            <svg
              viewBox="0 0 36 100"
              preserveAspectRatio="none"
              className="h-full w-full"
              style={{ fill: 'currentColor' }}
              aria-hidden="true"
            >
              <path d="M0,0 C6,4 18,10 14,22 C10,34 22,38 18,52 C14,66 26,70 16,82 C10,90 20,96 18,100 L0,100 Z" />
              <circle cx="21" cy="18" r="4" />
              <circle cx="27" cy="40" r="5.5" />
              <circle cx="18" cy="55" r="2.5" />
              <circle cx="25" cy="70" r="3.5" />
              <circle cx="30" cy="60" r="2" />
              <circle cx="14" cy="88" r="3" />
            </svg>
          </div>
        ) : null}

        <div
          aria-hidden="true"
          className={cn('pointer-events-none absolute inset-0', styles.stripes)}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
