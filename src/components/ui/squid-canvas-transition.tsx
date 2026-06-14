'use client'

/**
 * SquidCanvasTransition — Canvas 2D rotating squid mask transition.
 *
 * Faithfully reproduces the Nintendo JP Splatoon gallery page transition:
 * a squid image rotates and scales on a canvas, then a black fill
 * with source-out compositing covers/reveals the page.
 *
 * Original asset: /jp/character/splatoon/images/common/ika.png (438×481)
 * Original code: commonJS.js — GSAP timeline animating lt.rotate/lt.scale
 */

import * as React from 'react'

// ─── Handle ─────────────────────────────────────────────────────────────────

export interface SquidCanvasTransitionHandle {
  transitionOut: (options?: { duration?: number }) => Promise<void>
  transitionIn: (options?: { duration?: number }) => void
  readonly state: Phase
}

// ─── Props ──────────────────────────────────────────────────────────────────

export interface SquidCanvasTransitionProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  durationIn?: number
  durationOut?: number
  autoReveal?: boolean
  onCovered?: () => void
  onRevealed?: () => void
}

// ─── Phase ──────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'covering' | 'covered' | 'revealing'

// ─── Animation config (from original commonJS.js) ───────────────────────────

interface TweenState {
  rotate: number
  scale: number
}

const COVER_START: TweenState = { rotate: 200, scale: 1 }
const COVER_END: TweenState = { rotate: 560, scale: 0 }

const REVEAL_START: TweenState = { rotate: 170, scale: 0 }
const REVEAL_END: TweenState = { rotate: 400, scale: 1 }

// ─── Component ──────────────────────────────────────────────────────────────

export function SquidCanvasTransition({
  ref,
  durationIn = 700,
  durationOut = 1000,
  autoReveal = false,
  onCovered,
  onRevealed,
  className,
  children,
  ...props
}: SquidCanvasTransitionProps & { ref?: React.Ref<SquidCanvasTransitionHandle> }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const squidImgRef = React.useRef<HTMLImageElement | null>(null)
  const tweenRef = React.useRef<number>(0)
  const coverResolveRef = React.useRef<(() => void) | null>(null)
  const maxScaleRef = React.useRef(1)

  const [phase, setPhase] = React.useState<Phase>('idle')

  // Derived state — single source of truth
  const covered = phase === 'covered'
  const canvasVisible = phase !== 'idle'

  // ── Load original ika.png ──────────────────────────────────────────────────

  React.useEffect(() => {
    const img = new Image()
    img.src = '/_images/squid/ika.png'
    img.onload = () => {
      squidImgRef.current = img
    }
    return () => {
      squidImgRef.current = null
    }
  }, [])

  // ── Canvas setup + resize ──────────────────────────────────────────────────

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)

      const img = squidImgRef.current
      if (img) {
        maxScaleRef.current = Math.max(rect.width, rect.height) / Math.max(img.width, img.height)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Draw frame (matching original ut() function) ──────────────────────────

  const drawFrame = React.useCallback((tween: TweenState, maxScale: number) => {
    const canvas = canvasRef.current
    const img = squidImgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    const scale = tween.scale * maxScale

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
    ctx.scale(dpr, dpr)
    ctx.translate(w / 2, h / 2)
    ctx.clearRect(-w / 2, -h / 2, w, h)

    ctx.save()
    ctx.rotate((tween.rotate * Math.PI) / 180)
    ctx.drawImage(img, -img.width / 2 * scale, -img.height / 2 * scale, img.width * scale, img.height * scale)
    ctx.restore()

    ctx.globalCompositeOperation = 'source-out'
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.rect(-w / 2, -h / 2, w, h)
    ctx.fill()
    ctx.restore()
  }, [])

  // ── Transition animation ──────────────────────────────────────────────────

  const runTransition = React.useCallback(
    (
      start: TweenState,
      end: TweenState,
      duration: number,
      onComplete: () => void,
    ) => {
      cancelAnimationFrame(tweenRef.current)
      let startTime: number | null = null

      const animate = (now: number) => {
        if (startTime === null) startTime = now
        const elapsed = now - startTime
        const rawT = Math.min(elapsed / duration, 1)
        const t = 1 - Math.pow(1 - rawT, 3)

        const tween: TweenState = {
          rotate: start.rotate + (end.rotate - start.rotate) * t,
          scale: start.scale + (end.scale - start.scale) * t,
        }
        drawFrame(tween, maxScaleRef.current)

        if (rawT < 1) {
          tweenRef.current = requestAnimationFrame(animate)
        } else {
          drawFrame(end, maxScaleRef.current)
          onComplete()
        }
      }

      tweenRef.current = requestAnimationFrame(animate)
    },
    [drawFrame],
  )

  // ── Expose handle ─────────────────────────────────────────────────────────

  React.useImperativeHandle(
    ref,
    () => ({
      transitionOut: (options) => {
        return new Promise<void>((resolve) => {
          setPhase('covering')
          coverResolveRef.current = resolve
          runTransition(COVER_START, COVER_END, options?.duration ?? durationIn, () => {
            setPhase('covered')
            onCovered?.()
            coverResolveRef.current?.()
            coverResolveRef.current = null
            if (autoReveal) {
              setTimeout(() => {
                setPhase('revealing')
                runTransition(REVEAL_START, REVEAL_END, durationOut, () => {
                  setPhase('idle')
                  onRevealed?.()
                })
              }, 150)
            }
          })
        })
      },
      transitionIn: (options) => {
        setPhase('revealing')
        runTransition(REVEAL_START, REVEAL_END, options?.duration ?? durationOut, () => {
          setPhase('idle')
          onRevealed?.()
        })
      },
      get state() {
        return phase
      },
    }),
    [phase, durationIn, durationOut, autoReveal, onCovered, onRevealed, runTransition],
  )

  // ── Cleanup ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    return () => cancelAnimationFrame(tweenRef.current)
  }, [])

  return (
    <div className={`relative w-full h-full ${className ?? ''}`} {...props}>
      <div
        className={`w-full h-full transition-opacity ${
          covered ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {children}
      </div>

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50"
        style={{ display: canvasVisible ? 'block' : 'none' }}
      />
    </div>
  )
}
