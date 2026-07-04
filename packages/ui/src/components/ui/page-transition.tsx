'use client'

/**
 * PageTransition — Splatoon-style ink splash page transition.
 *
 * Wraps page content and provides ink-cover/reveal transitions
 * using the existing InkSplashCanvas WebGL shader.
 *
 * Usage:
 *   const ref = useRef<PageTransitionHandle>(null)
 *   await ref.current?.transitionOut()
 *   // ... swap content ...
 *   ref.current?.transitionIn()
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { InkSplashCanvas } from './ink-splash-canvas'

// ─── Handle ─────────────────────────────────────────────────────────────────

export interface PageTransitionHandle {
  transitionOut: (options?: { color?: string; duration?: number }) => Promise<void>
  transitionIn: (options?: { color?: string; duration?: number }) => void
  readonly state: Phase
}

// ─── Props ──────────────────────────────────────────────────────────────────

export interface PageTransitionProps extends Omit<React.ComponentProps<'div'>, 'color' | 'ref'> {
  color?: string
  durationIn?: number
  durationOut?: number
  autoReveal?: boolean
  onCovered?: () => void
  onRevealed?: () => void
  ref?: React.Ref<PageTransitionHandle>
}

// ─── Phase ──────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'covering' | 'covered' | 'revealing'

// ─── Component ──────────────────────────────────────────────────────────────

export function PageTransition({
  ref,
  color: inkColor = 'var(--color-true-black)',
  durationIn = 700,
  durationOut = 1000,
  autoReveal = false,
  onCovered,
  onRevealed,
  className,
  children,
  ...props
}: PageTransitionProps) {
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [transitionCount, setTransitionCount] = React.useState(0)
  const [transitionColor, setTransitionColor] = React.useState(inkColor)
  const coverResolveRef = React.useRef<(() => void) | null>(null)

  // Derived state
  const covered = phase === 'covered'
  const canvasState: 'in' | 'out' | 'idle' =
    phase === 'covering' ? 'in' : phase === 'revealing' ? 'out' : 'idle'

  // ── Expose handle ──────────────────────────────────────────────────────────

  React.useImperativeHandle(
    ref,
    () => ({
      transitionOut: (options) => {
        return new Promise<void>((resolve) => {
          setTransitionColor(options?.color ?? inkColor)
          coverResolveRef.current = resolve
          setTransitionCount((count) => count + 1)
          setPhase('covering')
        })
      },
      transitionIn: (options) => {
        setTransitionColor(options?.color ?? inkColor)
        setTransitionCount((count) => count + 1)
        setPhase('revealing')
      },
      get state() {
        return phase
      },
    }),
    [inkColor, phase]
  )

  // ── Handle cover complete ──────────────────────────────────────────────────

  const handleCoverComplete = React.useCallback(() => {
    setPhase('covered')
    onCovered?.()
    coverResolveRef.current?.()
    coverResolveRef.current = null

    if (autoReveal) {
      setTimeout(() => {
        setTransitionCount((count) => count + 1)
        setPhase('revealing')
      }, 150)
    }
  }, [autoReveal, onCovered])

  // ── Handle reveal complete ─────────────────────────────────────────────────

  const handleRevealComplete = React.useCallback(() => {
    setPhase('idle')
    onRevealed?.()
  }, [onRevealed])

  // ── Handle canvas state change ─────────────────────────────────────────────

  const handleCanvasComplete = React.useCallback(() => {
    if (phase === 'covering') {
      handleCoverComplete()
    } else if (phase === 'revealing') {
      handleRevealComplete()
    }
  }, [phase, handleCoverComplete, handleRevealComplete])

  return (
    <div className={cn('relative h-full w-full', className)} {...props}>
      <div
        className={cn(
          'h-full w-full transition-opacity',
          covered ? 'pointer-events-none opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>

      <InkSplashCanvas
        state={canvasState}
        durationIn={durationIn}
        durationOut={durationOut}
        color={transitionColor}
        count={transitionCount}
        onComplete={handleCanvasComplete}
        className="pointer-events-none absolute inset-0 z-50"
      />
    </div>
  )
}
