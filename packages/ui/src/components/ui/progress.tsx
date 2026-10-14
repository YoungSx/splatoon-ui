import * as React from 'react'

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

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value?: number
  max?: number
  getValueLabel?: (value: number, max: number) => string
  variant?: ProgressVariant
  trackVariant?: ProgressTrackVariant
  size?: ProgressSize
  skewed?: boolean
  splattered?: boolean
  ref?: React.Ref<HTMLDivElement>
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
  getValueLabel,
  variant = 'yellow',
  trackVariant = 'dark',
  size = 'default',
  skewed = true,
  splattered = true,
  style,
  ...props
}: ProgressProps) {
  const safeMax = max > 0 ? max : 100
  const clampedValue = Math.min(Math.max(value, 0), safeMax)
  const percentage = (clampedValue / safeMax) * 100
  const fillColor = variantPalette[variant]
  const trackColor = trackPalette[trackVariant]
  const borderWidth = trackVariant === 'transparent' ? '2px' : '3px'
  const height = sizeHeights[size]

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clampedValue}
      aria-valuetext={getValueLabel?.(clampedValue, safeMax)}
      data-state={clampedValue >= safeMax ? 'complete' : 'loading'}
      data-value={clampedValue}
      data-max={safeMax}
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
        ...style,
      }}
      {...props}
    >
      <div
        aria-hidden="true"
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
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   TurfWarProgress: Official In-game Dual-Faction Confrontation Progress Bar
   Reference: Splatoon 3 Replay Graph / Weigh-In Bar
   ────────────────────────────────────────────────────────────────────────── */

export interface TurfWarProgressProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  alphaValue?: number
  bravoValue?: number
  alphaLabel?: React.ReactNode
  bravoLabel?: React.ReactNode
  alphaVariant?: ProgressVariant
  bravoVariant?: ProgressVariant
  alphaColor?: string
  bravoColor?: string
  size?: ProgressSize
  skewed?: boolean
  splattered?: boolean
  showPercentages?: boolean
  showLabels?: boolean
  showDanger?: boolean
  ref?: React.Ref<HTMLDivElement>
}

function TurfWarProgress({
  ref,
  className,
  alphaValue = 50,
  bravoValue = 50,
  alphaLabel = 'ALPHA',
  bravoLabel = 'BRAVO',
  alphaVariant = 'yellow',
  bravoVariant = 'purple',
  alphaColor,
  bravoColor,
  size = 'default',
  skewed = true,
  splattered = true,
  showPercentages = true,
  showLabels = true,
  showDanger = true,
  style,
  ...props
}: TurfWarProgressProps) {
  const safeAlpha = Math.max(0, alphaValue)
  const safeBravo = Math.max(0, bravoValue)
  const total = safeAlpha + safeBravo > 0 ? safeAlpha + safeBravo : 100
  const alphaPercent = Number(((safeAlpha / total) * 100).toFixed(1))
  const bravoPercent = Number((100 - alphaPercent).toFixed(1))

  const fillAlpha = alphaColor || variantPalette[alphaVariant] || 'var(--color-yellow)'
  const fillBravo = bravoColor || variantPalette[bravoVariant] || 'var(--color-purple)'
  const height = sizeHeights[size]

  const isAlphaDanger = showDanger && alphaPercent <= 35
  const isBravoDanger = showDanger && bravoPercent <= 35

  return (
    <div
      ref={ref}
      className={cn('flex w-full flex-col gap-1.5', className)}
      style={style}
      {...props}
    >
      {(showLabels || showPercentages) && (
        <div className="flex items-center justify-between px-1 text-xs font-black tracking-wider select-none sm:text-sm">
          {/* Alpha Team Header */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex -skew-x-6 items-center rounded border-2 border-[var(--color-black)] px-2 py-0.5 font-black text-[var(--color-black)] shadow-[2px_2px_0px_var(--color-black)]"
              style={{ backgroundColor: fillAlpha }}
            >
              {showLabels && alphaLabel}
            </span>
            {showPercentages && (
              <span className="font-mono text-base font-black text-[var(--color-foreground)] sm:text-lg">
                {alphaPercent.toFixed(1)}%
              </span>
            )}
            {isAlphaDanger && (
              <span
                className={cn(
                  'py-0.2 rounded border border-[var(--color-black)] bg-[var(--color-red)] px-1.5 text-[10px] font-black text-white sm:text-xs',
                  styles.dangerFlash
                )}
              >
                DANGER!
              </span>
            )}
          </div>

          {/* VS Center Marker */}
          <span className="text-muted-foreground -skew-x-12 rounded-full bg-[var(--color-black)] px-2 py-0.5 text-[11px] font-black text-white shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
            VS
          </span>

          {/* Bravo Team Header */}
          <div className="flex items-center gap-2">
            {isBravoDanger && (
              <span
                className={cn(
                  'py-0.2 rounded border border-[var(--color-black)] bg-[var(--color-red)] px-1.5 text-[10px] font-black text-white sm:text-xs',
                  styles.dangerFlash
                )}
              >
                DANGER!
              </span>
            )}
            {showPercentages && (
              <span className="font-mono text-base font-black text-[var(--color-foreground)] sm:text-lg">
                {bravoPercent.toFixed(1)}%
              </span>
            )}
            <span
              className="inline-flex skew-x-6 items-center rounded border-2 border-[var(--color-black)] px-2 py-0.5 font-black text-white shadow-[2px_2px_0px_var(--color-black)]"
              style={{ backgroundColor: fillBravo }}
            >
              {showLabels && bravoLabel}
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        role="progressbar"
        aria-label="Turf War confrontation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={alphaPercent}
        className={cn(
          'relative w-full shrink-0 overflow-hidden rounded-full border-3 border-[var(--color-black)] bg-[var(--color-black)] shadow-[3px_3px_0px_var(--color-black)]',
          skewed && '-skew-x-12'
        )}
        style={{ height }}
      >
        {/* Alpha Fill (Left) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${alphaPercent}%`,
            backgroundColor: fillAlpha,
            color: fillAlpha,
          }}
        >
          <div
            aria-hidden="true"
            className={cn('pointer-events-none absolute inset-0', styles.stripes)}
          />
          {splattered && alphaPercent > 0 && (
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
          )}
        </div>

        {/* Central 3D Black Divider Line */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 z-20 -ml-[2.5px] w-[5px] bg-[var(--color-black)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ left: `${alphaPercent}%` }}
        />

        {/* Bravo Fill (Right) */}
        <div
          className="absolute inset-y-0 right-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${bravoPercent}%`,
            backgroundColor: fillBravo,
            color: fillBravo,
          }}
        >
          <div
            aria-hidden="true"
            className={cn('pointer-events-none absolute inset-0', styles.stripes)}
          />
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   TricolorProgress: Official In-game 3-Way Splatfest Confrontation Progress Bar
   Reference: Splatoon 3 Tricolor Battle Replay Graph
   ────────────────────────────────────────────────────────────────────────── */

export interface TricolorProgressProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  attacker1Value?: number
  defenderValue?: number
  attacker2Value?: number
  attacker1Label?: React.ReactNode
  defenderLabel?: React.ReactNode
  attacker2Label?: React.ReactNode
  attacker1Variant?: ProgressVariant
  defenderVariant?: ProgressVariant
  attacker2Variant?: ProgressVariant
  attacker1Color?: string
  defenderColor?: string
  attacker2Color?: string
  size?: ProgressSize
  skewed?: boolean
  showPercentages?: boolean
  showLabels?: boolean
  ref?: React.Ref<HTMLDivElement>
}

function TricolorProgress({
  ref,
  className,
  attacker1Value = 33.3,
  defenderValue = 33.4,
  attacker2Value = 33.3,
  attacker1Label = 'ATTACK 1',
  defenderLabel = 'DEFENSE',
  attacker2Label = 'ATTACK 2',
  attacker1Variant = 'yellow',
  defenderVariant = 'blue',
  attacker2Variant = 'orange',
  attacker1Color,
  defenderColor,
  attacker2Color,
  size = 'default',
  skewed = true,
  showPercentages = true,
  showLabels = true,
  style,
  ...props
}: TricolorProgressProps) {
  const safeA1 = Math.max(0, attacker1Value)
  const safeDef = Math.max(0, defenderValue)
  const safeA2 = Math.max(0, attacker2Value)
  const total = safeA1 + safeDef + safeA2 > 0 ? safeA1 + safeDef + safeA2 : 100

  const p1 = Number(((safeA1 / total) * 100).toFixed(1))
  const pDef = Number(((safeDef / total) * 100).toFixed(1))
  const p2 = Number(Math.max(0, 100 - p1 - pDef).toFixed(1))

  const fillA1 = attacker1Color || variantPalette[attacker1Variant] || 'var(--color-yellow)'
  const fillDef = defenderColor || variantPalette[defenderVariant] || 'var(--color-blue)'
  const fillA2 = attacker2Color || variantPalette[attacker2Variant] || 'var(--color-orange)'
  const height = sizeHeights[size]

  return (
    <div
      ref={ref}
      className={cn('flex w-full flex-col gap-1.5', className)}
      style={style}
      {...props}
    >
      {(showLabels || showPercentages) && (
        <div className="grid grid-cols-3 items-center px-1 text-xs font-black tracking-wider select-none sm:text-sm">
          {/* Attacker 1 Header */}
          <div className="flex items-center justify-start gap-1.5">
            <span
              className="inline-flex -skew-x-6 items-center rounded border-2 border-[var(--color-black)] px-1.5 py-0.5 text-[10px] font-black text-[var(--color-black)] shadow-[1px_1px_0px_var(--color-black)] sm:text-xs"
              style={{ backgroundColor: fillA1 }}
            >
              {showLabels && attacker1Label}
            </span>
            {showPercentages && (
              <span className="font-mono text-xs font-black text-[var(--color-foreground)] sm:text-sm">
                {p1.toFixed(1)}%
              </span>
            )}
          </div>

          {/* Defender Header */}
          <div className="flex items-center justify-center gap-1.5">
            <span
              className="inline-flex items-center rounded border-2 border-[var(--color-black)] px-1.5 py-0.5 text-[10px] font-black text-white shadow-[1px_1px_0px_var(--color-black)] sm:text-xs"
              style={{ backgroundColor: fillDef }}
            >
              {showLabels && defenderLabel}
            </span>
            {showPercentages && (
              <span className="font-mono text-xs font-black text-[var(--color-foreground)] sm:text-sm">
                {pDef.toFixed(1)}%
              </span>
            )}
          </div>

          {/* Attacker 2 Header */}
          <div className="flex items-center justify-end gap-1.5">
            {showPercentages && (
              <span className="font-mono text-xs font-black text-[var(--color-foreground)] sm:text-sm">
                {p2.toFixed(1)}%
              </span>
            )}
            <span
              className="inline-flex skew-x-6 items-center rounded border-2 border-[var(--color-black)] px-1.5 py-0.5 text-[10px] font-black text-[var(--color-black)] shadow-[1px_1px_0px_var(--color-black)] sm:text-xs"
              style={{ backgroundColor: fillA2 }}
            >
              {showLabels && attacker2Label}
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        role="progressbar"
        aria-label="Tricolor Turf War progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pDef}
        className={cn(
          'relative w-full shrink-0 overflow-hidden rounded-full border-3 border-[var(--color-black)] bg-[var(--color-black)] shadow-[3px_3px_0px_var(--color-black)]',
          skewed && '-skew-x-12'
        )}
        style={{ height }}
      >
        {/* Attacker 1 Segment (Left) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${p1}%`,
            backgroundColor: fillA1,
            color: fillA1,
          }}
        >
          <div
            aria-hidden="true"
            className={cn('pointer-events-none absolute inset-0', styles.stripes)}
          />
        </div>

        {/* Divider 1 */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 z-20 -ml-[2px] w-[4px] bg-[var(--color-black)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ left: `${p1}%` }}
        />

        {/* Defender Segment (Center) */}
        <div
          className="absolute inset-y-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            left: `${p1}%`,
            width: `${pDef}%`,
            backgroundColor: fillDef,
            color: fillDef,
          }}
        >
          <div
            aria-hidden="true"
            className={cn('pointer-events-none absolute inset-0', styles.stripes)}
          />
        </div>

        {/* Divider 2 */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 z-20 -ml-[2px] w-[4px] bg-[var(--color-black)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ left: `${p1 + pDef}%` }}
        />

        {/* Attacker 2 Segment (Right) */}
        <div
          className="absolute inset-y-0 right-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${p2}%`,
            backgroundColor: fillA2,
            color: fillA2,
          }}
        >
          <div
            aria-hidden="true"
            className={cn('pointer-events-none absolute inset-0', styles.stripes)}
          />
        </div>
      </div>
    </div>
  )
}

export { Progress, TurfWarProgress, TricolorProgress }
