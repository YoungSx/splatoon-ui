'use client'

/**
 * PageTransition — Splatoon-style ink splash page transition.
 *
 * Wraps page content and provides ink-cover/reveal transitions
 * using the existing InkSplashCanvas WebGL shader.
 *
 * Usage:
 *   const ref = useRef<PageTransitionHandle>(null)
 *
 *   // To transition to a new page:
 *   await ref.current?.transitionOut()
 *   // ... swap content ...
 *   ref.current?.transitionIn()
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { InkSplashCanvas } from './ink-splash-canvas'

// ─── Handle ─────────────────im─────────────────────────────────────────────

export interface PageTransitionHandle {
  /** Start the ink-cover animation (returns when covered) */
  transitionOut: (options?: { color?: string; duration?: number }) => Promise<void>
  /** Start the ink-reveal animation */
  transitionIn: (options?: { color?: string; duration?: number }) => void
  /** Current state */
  readonly state: 'idle' | 'covering' | 'covered' | 'revealing'
}

// ─── Props ──────────────────────────────────────────────────────────────────

export interface PageTransitionProps extends React.ComponentProps<'div'> {
  /** Ink color for transitions */
  inkColor?: string
  /** Duration for cover animation (ms) */
  durationIn?: number
  /** Duration for reveal animation (ms) */
  durationOut?: number
  /** Auto-reveal after covering completes (default: false) */
  autoReveal?: boolean
  /** Callback when cover animation completes (content is hidden) */
  onCovered?: () => void
  /** Callback when reveal animation completes (content is visible) */
  onRevealed?: () => void
}

// ─── Component ──────────────────────────────────────────────────────────────

export const PageTransition = React.forwardRef<PageTransitionHandle, PageTransitionProps>(
  function PageTransition(
    {
      inkColor = '#000000',
      durationIn = 700,
      durationOut = 1000,
      autoReveal = false,
      onCovered,
      onRevealed,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const [canvasState, setCanvasState] = React.useState<'in' | 'out' | 'idle'>('idle')
    const [covered, setCovered] = React.useState(false)
    const [transitionState, setTransitionState] = React.useState<
      'idle' | 'covering' | 'covered' | 'revealing'
    >('idle')
    const countRef = React.useRef(0)
    const coverResolveRef = React.useRef<(() => void) | null>(null)
    const currentColorRef = React.useRef(inkColor)

    // ── Expose handle ──────────────────────────────────────────────────────

    React.useImperativeHandle(
      ref,
      () => ({
        transitionOut: (options) => {
          return new Promise<void>((resolve) => {
            currentColorRef.current = options?.color ?? inkColor
            coverResolveRef.current = resolve
            countRef.current += 1
            setTransitionState('covering')
            setCanvasState('in')
          })
        },
        transitionIn: (options) => {
          currentColorRef.current = options?.color ?? inkColor
          countRef.current += 1
          setTransitionState('revealing')
          setCanvasState('out')
        },
        get state() {
          return transitionState
        },
      }),
      [inkColor, transitionState],
    )

    // ── Handle cover complete ───────────────────────────────────────────────

    const handleCoverComplete = React.useCallback(() => {
      setCovered(true)
      setTransitionState('covered')
      onCovered?.()
      coverResolveRef.current?.()
      coverResolveRef.current = null

      if (autoReveal) {
        // Auto-start reveal after a brief pause
        setTimeout(() => {
          countRef.current += 1
          setTransitionState('revealing')
          setCanvasState('out')
        }, 150)
      }
    }, [autoReveal, onCovered])

    // ── Handle reveal complete ──────────────────────────────────────────────

    const handleRevealComplete = React.useCallback(() => {
      setCovered(false)
      setTransitionState('idle')
      setCanvasState('idle')
      onRevealed?.()
    }, [onRevealed])

    // ── Handle canvas state change ──────────────────────────────────────────

    const handleCanvasComplete = React.useCallback(() => {
      if (transitionState === 'covering') {
        handleCoverComplete()
      } else if (transitionState === 'revealing') {
        handleRevealComplete()
      }
    }, [transitionState, handleCoverComplete, handleRevealComplete])

    return (
      <div
        className={cn('relative w-full h-full', className)}
        {...props}
      >
        {/* Page content — hidden when covered */}
        <div
          className={cn(
            'w-full h-full transition-opacity',
            covered ? 'opacity-0 pointer-events-none' : 'opacity-100',
          )}
        >
          {children}
        </div>

        {/* WebGL ink splash overlay */}
        <InkSplashCanvas
          state={canvasState}
          durationIn={durationIn}
          durationOut={durationOut}
          color={currentColorRef.current}
          count={countRef.current}
          onComplete={handleCanvasComplete}
          className="pointer-events-none absolute inset-0 z-50"
        />
      </div>
    )
  },
)
