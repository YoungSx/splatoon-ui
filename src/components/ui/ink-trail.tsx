'use client'

/**
 * Canvas-based ink trail effect following mouse/touch movement.
 * Faithfully reproduces the splatoon.nintendo.com cursor trail:
 * organic ink blobs spawn at the cursor position and fade/shrink
 * naturally over time.
 *
 * Uses 2D Canvas with requestAnimationFrame — no external dependencies.
 * Respects prefers-reduced-motion (reduces density, never fully disables).
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './ink-trail.module.css'

// ─── Particle Pool ──────────────────────────────────────────────────────────

interface InkParticle {
  x: number
  y: number
  size: number
  targetSize: number
  color: string
  opacity: number
  rotation: number
  rotationSpeed: number
  age: number
  maxAge: number
  /** Pre-computed blob control points for organic shape */
  blobPoints: number[]
  alive: boolean
}

function createParticle(): InkParticle {
  return {
    x: 0,
    y: 0,
    size: 0,
    targetSize: 0,
    color: '#0d0d0d',
    opacity: 0,
    rotation: 0,
    rotationSpeed: 0,
    age: 0,
    maxAge: 1,
    blobPoints: new Array(8).fill(0),
    alive: false,
  }
}

function initParticleBlob(blobPoints: number[]) {
  // Generate 8 random radii for an organic blob shape
  for (let i = 0; i < blobPoints.length; i++) {
    blobPoints[i] = 0.7 + Math.random() * 0.6 // 0.7 – 1.3 range
  }
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_COLORS = [
  '#0d0d0d', // Chaos Black (default ink)
  '#603bff', // Ink Blue
  '#eaff3d', // Neon Yellow
  '#ff505e', // Ink Red
  '#6af7ce', // Ink Green
  '#af50ff', // Ink Purple
  '#ff9750', // Ink Orange
]

const POOL_SIZE = 200

// ─── Types ──────────────────────────────────────────────────────────────────

export interface InkTrailCanvasProps extends React.ComponentProps<'div'> {
  /** Enable the trail effect */
  enabled?: boolean
  /** Ink colors to cycle through */
  colors?: string[]
  /** Base size of each ink blob in px */
  blobSize?: number
  /** Random size variance (0-1) */
  sizeVariance?: number
  /** How often to spawn particles (ms). Lower = denser trail */
  spawnInterval?: number
  /** Maximum particle lifetime in ms */
  particleLifetime?: number
  /** Maximum distance from cursor to spawn particle (px) */
  spawnRadius?: number
  /** Opacity of newly spawned particles (0-1) */
  initialOpacity?: number
  /** Particle z-index layer */
  zIndex?: number
}

// ─── Hook: pointer tracking (always active) ────────────────────────────────

interface PointerState {
  x: number
  y: number
  active: boolean
}

function usePointerTracker(containerRef: React.RefObject<HTMLDivElement | null>) {
  const pointerRef = React.useRef<PointerState>({ x: 0, y: 0, active: false })
  const lastSpawnRef = React.useRef<number>(0)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      pointerRef.current.x = e.clientX - rect.left
      pointerRef.current.y = e.clientY - rect.top
      pointerRef.current.active = true
    }

    const handlePointerLeave = () => {
      pointerRef.current.active = false
    }

    const handlePointerDown = (e: PointerEvent) => {
      // Spawn a burst on click
      const rect = container.getBoundingClientRect()
      pointerRef.current.x = e.clientX - rect.left
      pointerRef.current.y = e.clientY - rect.top
      pointerRef.current.active = true
      lastSpawnRef.current = 0 // Force spawn on next frame
    }

    container.addEventListener('pointermove', handlePointerMove, { passive: true })
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    container.addEventListener('pointerdown', handlePointerDown, { passive: true })

    return () => {
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      container.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [containerRef])

  return { pointerRef, lastSpawnRef }
}

// ─── Hook: reduced motion (informational only — never disables) ────────────

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

// ─── Canvas Drawing ─────────────────────────────────────────────────────────

function drawBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  blobPoints: number[],
  color: string,
) {
  ctx.save()
  ctx.fillStyle = color
  ctx.translate(x, y)
  ctx.rotate(rotation)

  ctx.beginPath()
  const segments = blobPoints.length
  const angleStep = (Math.PI * 2) / segments

  for (let i = 0; i <= segments; i++) {
    const idx = i % segments
    const angle = idx * angleStep
    const r = size * blobPoints[idx]
    const px = Math.cos(angle) * r
    const py = Math.sin(angle) * r

    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      // Use quadratic curves for smoother organic shapes
      const prevIdx = (i - 1) % segments
      const prevAngle = prevIdx * angleStep
      const prevR = size * blobPoints[prevIdx]
      const cpx = Math.cos(prevAngle + angleStep * 0.5) * ((prevR + r) / 2) * 1.1
      const cpy = Math.sin(prevAngle + angleStep * 0.5) * ((prevR + r) / 2) * 1.1
      ctx.quadraticCurveTo(cpx, cpy, px, py)
    }
  }

  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// ─── Component ──────────────────────────────────────────────────────────────

export const InkTrailCanvas = React.forwardRef<HTMLDivElement, InkTrailCanvasProps>(
  function InkTrailCanvas(
    {
      enabled = true,
      colors = DEFAULT_COLORS,
      blobSize = 18,
      sizeVariance = 0.6,
      spawnInterval = 16,
      particleLifetime = 1200,
      spawnRadius = 30,
      initialOpacity = 0.55,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const poolRef = React.useRef<InkParticle[]>([])
    const animFrameRef = React.useRef<number>(0)
    const prefersReducedMotion = usePrefersReducedMotion()
    const lastFrameTimeRef = React.useRef<number>(0)
    // Expose a ref to trigger click bursts from outside
    const burstRef = React.useRef<(x?: number, y?: number) => void>(() => {})

    // Adjust intensity based on motion preference (never fully disable)
    const intensityScale = prefersReducedMotion ? 0.4 : 1.0
    const adjustedInterval = Math.round(spawnInterval / intensityScale)
    const adjustedLifetime = Math.round(particleLifetime * intensityScale)
    const adjustedBlobSize = Math.round(blobSize * (0.8 + intensityScale * 0.2))

    // ── Merged ref ────────────────────────────────────────────────────────

    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref],
    )

    // ── Pointer tracking (always active — no enabled gate) ─────────────────

    const { pointerRef, lastSpawnRef } = usePointerTracker(containerRef)

    // ── Initialize particle pool ──────────────────────────────────────────

    React.useEffect(() => {
      poolRef.current = Array.from({ length: POOL_SIZE }, () => createParticle())
    }, [])

    // ── Canvas resize ─────────────────────────────────────────────────────

    React.useEffect(() => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const resize = () => {
        const dpr = window.devicePixelRatio || 1
        const rect = container.getBoundingClientRect()
        // Skip if container hasn't fully laid out yet (CSS may not have applied)
        if (rect.width < 10 || rect.height < 10) return
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.scale(dpr, dpr)
      }

      resize()
      const observer = new ResizeObserver(resize)
      observer.observe(container)

      // Safety net: re-measure once after paint in case CSS wasn't applied yet
      const rafId = requestAnimationFrame(() => resize())

      return () => {
        observer.disconnect()
        cancelAnimationFrame(rafId)
      }
    }, [])

    // ── Spawn particle ────────────────────────────────────────────────────

    const spawnParticle = React.useCallback(
      (x: number, y: number, isBurst: boolean = false) => {
        if (!enabled) return
        const pool = poolRef.current
        // Find dead particle
        const p = pool.find((p) => !p.alive)
        if (!p) return

        const color = colors[Math.floor(Math.random() * colors.length)]
        const sizeJitter = 1 + (Math.random() - 0.5) * sizeVariance * 2
        const size = adjustedBlobSize * sizeJitter
        const offsetAngle = Math.random() * Math.PI * 2
        const offsetDist = isBurst ? Math.random() * spawnRadius * 2 : Math.random() * spawnRadius
        const lifetime = adjustedLifetime * (0.7 + Math.random() * 0.6)

        p.x = x + Math.cos(offsetAngle) * offsetDist
        p.y = y + Math.sin(offsetAngle) * offsetDist
        p.size = isBurst ? size * 0.3 : size * 0.1 // Start small, grow to target
        p.targetSize = size
        p.color = color
        p.opacity = isBurst ? initialOpacity * 1.2 : initialOpacity
        p.rotation = Math.random() * Math.PI * 2
        p.rotationSpeed = (Math.random() - 0.5) * 0.02
        p.age = 0
        p.maxAge = lifetime
        p.alive = true
        initParticleBlob(p.blobPoints)
      },
      [enabled, colors, adjustedBlobSize, sizeVariance, spawnRadius, adjustedLifetime, initialOpacity],
    )

    // ── Expose burst function ─────────────────────────────────────────────

    React.useEffect(() => {
      burstRef.current = (x?: number, y?: number) => {
        if (!enabled) return
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const cx = x ?? rect.width / 2
        const cy = y ?? rect.height / 2
        const count = 5 + Math.floor(Math.random() * 4)
        for (let i = 0; i < count; i++) {
          spawnParticle(cx, cy, true)
        }
      }
    }, [enabled, spawnParticle])

    // ── Click burst (always active) ───────────────────────────────────────

    React.useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const handleClick = (e: MouseEvent) => {
        if (!enabled) return
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        // Spawn burst of 5-8 particles
        const count = 5 + Math.floor(Math.random() * 4)
        for (let i = 0; i < count; i++) {
          spawnParticle(x, y, true)
        }
      }

      container.addEventListener('click', handleClick)
      return () => container.removeEventListener('click', handleClick)
    }, [enabled, spawnParticle])

    // ── Main animation loop (always running) ──────────────────────────────

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let running = true

      const loop = (timestamp: number) => {
        if (!running) return

        const dt = lastFrameTimeRef.current ? timestamp - lastFrameTimeRef.current : 16
        lastFrameTimeRef.current = timestamp

        const dpr = window.devicePixelRatio || 1
        const w = canvas.width / dpr
        const h = canvas.height / dpr

        // Clear canvas
        ctx.clearRect(0, 0, w, h)

        // ── Spawn new particles ─────────────────────────────────────────

        if (enabled) {
          const pointer = pointerRef.current
          const sinceLastSpawn = timestamp - lastSpawnRef.current

          if (pointer.active && sinceLastSpawn >= adjustedInterval) {
            spawnParticle(pointer.x, pointer.y)
            lastSpawnRef.current = timestamp
          }
        }

        // ── Update & draw particles ─────────────────────────────────────

        const pool = poolRef.current

        for (let i = 0; i < pool.length; i++) {
          const p = pool[i]
          if (!p.alive) continue

          p.age += dt
          if (p.age >= p.maxAge) {
            p.alive = false
            continue
          }

          const lifeRatio = p.age / p.maxAge

          // Size: grow in first 10%, then stay, shrink in last 40%
          let sizeScale: number
          if (lifeRatio < 0.1) {
            sizeScale = lifeRatio / 0.1
          } else if (lifeRatio > 0.6) {
            sizeScale = 1 - (lifeRatio - 0.6) / 0.4
          } else {
            sizeScale = 1
          }

          p.size = p.targetSize * sizeScale

          // Opacity: fade in first 10%, full in middle, fade in last 50%
          let opacityScale: number
          if (lifeRatio < 0.1) {
            opacityScale = lifeRatio / 0.1
          } else if (lifeRatio > 0.5) {
            opacityScale = 1 - (lifeRatio - 0.5) / 0.5
          } else {
            opacityScale = 1
          }

          const currentOpacity = p.opacity * opacityScale

          if (currentOpacity <= 0.01 || p.size <= 0.5) {
            p.alive = false
            continue
          }

          // Slow rotation
          p.rotation += p.rotationSpeed

          // Draw
          ctx.globalAlpha = currentOpacity
          drawBlob(ctx, p.x, p.y, p.size, p.rotation, p.blobPoints, p.color)
        }

        // Reset global alpha
        ctx.globalAlpha = 1

        animFrameRef.current = requestAnimationFrame(loop)
      }

      animFrameRef.current = requestAnimationFrame(loop)

      return () => {
        running = false
        cancelAnimationFrame(animFrameRef.current)
      }
    }, [
      enabled,
      adjustedInterval,
      pointerRef,
      lastSpawnRef,
      spawnParticle,
    ])

    // ── Render ──────────────────────────────────────────────────────────

    return (
      <div
        ref={mergedRef}
        className={cn(styles.inkTrailRoot, className)}
        style={style}
        {...props}
      >
        <canvas ref={canvasRef} className={styles.inkTrailCanvas} aria-hidden="true" />
        {children}
      </div>
    )
  },
)
