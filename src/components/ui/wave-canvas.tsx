"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Physics constants (matching official splatoon.nintendo.com) ──────────────

const NUM_POINTS = 20
const ELASTICITY = 0.0001
const FRICTION = 0.0025

// ─── Wave point ──────────────────────────────────────────────────────────────

class WavePoint {
  height = 0
  speed = 0
  acceleration = 0
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface WaveCanvasProps extends React.ComponentProps<"canvas"> {
  /** Fill color of the wave */
  color?: string
  /** Height of the canvas in px (default 200) */
  height?: number
  /** Enable mouse interaction (respects prefers-reduced-motion) */
  interactive?: boolean
  /** Number of wave points (default 20) */
  numPoints?: number
  /** Physics elasticity (default 0.0001) */
  elasticity?: number
  /** Physics friction (default 0.0025) */
  friction?: number
}

// ─── Component ───────────────────────────────────────────────────────────────

const WaveCanvas = React.forwardRef<HTMLCanvasElement, WaveCanvasProps>(
  (
    {
      color = "#0d0d0d",
      height = 200,
      interactive = true,
      numPoints = NUM_POINTS,
      elasticity = ELASTICITY,
      friction = FRICTION,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const internalRef = useMergedRef(canvasRef, ref)

    // ── Reduced motion ───────────────────────────────────────────────────────

    const prefersReducedMotion = usePrefersReducedMotion()
    const shouldAnimate = interactive && !prefersReducedMotion

    // ── Resize handling ──────────────────────────────────────────────────────

    const [canvasWidth, setCanvasWidth] = React.useState(0)

    React.useEffect(() => {
      const updateWidth = () => setCanvasWidth(document.body.clientWidth)
      updateWidth()
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }, [])

    // ── Wave simulation (faithful to official splatoon.nintendo.com) ──────────

    const pointsRef = React.useRef<WavePoint[]>([])
    const animFrameRef = React.useRef<number>(0)
    const oldMouseYRef = React.useRef<number>(0)

    // Build points
    React.useEffect(() => {
      if (canvasWidth === 0) return
      const points: WavePoint[] = []
      for (let i = 0; i <= numPoints; i++) {
        points.push(new WavePoint())
      }
      pointsRef.current = points
    }, [canvasWidth, numPoints])

    // ── Animation loop ───────────────────────────────────────────────────────

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas || canvasWidth === 0) return

      const ctx = canvas.getContext("2d")!
      const segWidth = canvasWidth / numPoints
      let running = true

      const render = () => {
        if (!running) return

        const points = pointsRef.current
        const halfH = height / 2

        // Clear
        ctx.clearRect(0, 0, canvasWidth, height)

        // ── Physics step (official algorithm) ───────────────────────────────

        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          const prev = points[i - 1]
          const next = points[i + 1]
          const prev2 = points[i - 2]
          const next2 = points[i + 2]

          const hPrev = prev ? prev.height : 0
          const hNext = next ? next.height : 0
          const hPrev2 = prev2 ? prev2.height : 0
          const hNext2 = next2 ? next2.height : 0

          // Immediate neighbors (full elasticity)
          p.acceleration =
            (-0.3 * p.height + (hPrev - p.height) + (hNext - p.height)) *
              elasticity -
            p.speed * friction

          // Extended neighbors (half elasticity)
          p.acceleration +=
            (-0.3 * p.height + (hPrev2 - p.height) + (hNext2 - p.height)) *
              (elasticity / 2) -
            p.speed * friction

          p.speed += 5 * p.acceleration
          p.height += 10 * p.speed
        }

        // ── Draw (official quadraticCurveTo algorithm) ─────────────────────

        ctx.beginPath()
        ctx.moveTo(0, halfH)

        for (let i = 0; i < points.length; i++) {
          const prev = points[i - 1]
          const curr = points[i]

          const d = { x: segWidth * (i - 1), y: halfH + (prev ? prev.height : 0) }
          const f = { x: segWidth * i, y: halfH + curr.height }
          const g = (d.x + f.x) / 2
          const m = (d.y + f.y) / 2

          ctx.quadraticCurveTo(d.x, d.y, g, m)
        }

        // Close the wave shape down to canvas bottom
        const last = points[points.length - 1]
        const endPt = { x: segWidth * numPoints, y: halfH + last.height }
        const closePt = { x: segWidth * numPoints + 1, y: halfH }
        const endMidX = (endPt.x + closePt.x) / 2
        const endMidY = (endPt.y + closePt.y) / 2
        ctx.quadraticCurveTo(endPt.x, endPt.y, endMidX, endMidY)
        ctx.lineTo(canvasWidth, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()

        animFrameRef.current = requestAnimationFrame(render)
      }

      animFrameRef.current = requestAnimationFrame(render)

      return () => {
        running = false
        cancelAnimationFrame(animFrameRef.current)
      }
    }, [canvasWidth, height, color, numPoints, elasticity, friction])

    // ── Mouse handlers (official: detect Y-axis crossing) ────────────────────

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!shouldAnimate) return
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const mouseY = e.clientY - rect.top
        const oldY = oldMouseYRef.current
        const halfH = height / 2

        // Detect if mouse crossed the wave's Y-axis (official behavior)
        // Guard: skip on first frame (oldY === 0 is the default/uninitialized value)
        if (oldY !== 0 && (mouseY - halfH) * (oldY - halfH) < 0) {
          const speed = oldY - mouseY
          const points = pointsRef.current
          const segWidth = canvasWidth / numPoints

          // Apply force to the nearest point (official: sets height directly)
          const ptIndex = Math.round((e.clientX - rect.left) / segWidth)
          const clampedIndex = Math.max(0, Math.min(points.length - 1, ptIndex))
          const clampedSpeed = Math.max(-200, Math.min(200, 5 * speed))
          if (points[clampedIndex]) {
            points[clampedIndex].height += -clampedSpeed
          }
        }

        oldMouseYRef.current = mouseY
      },
      [shouldAnimate, height, canvasWidth, numPoints],
    )

    // Official behavior: do NOT reset oldMousePos on leave.
    // This prevents false crossings when the mouse re-enters from the opposite side.

    // ── Render ───────────────────────────────────────────────────────────────

    if (canvasWidth === 0) return null

    return (
      <canvas
        ref={internalRef}
        data-slot="wave-canvas"
        width={canvasWidth}
        height={height}
        className={cn("pointer-events-auto block", className)}
        style={{
          position: "absolute",
          bottom: "calc(100% - 1px)",
          left: 0,
          zIndex: 10,
          ...style,
        }}
        onMouseMove={handleMouseMove}
        {...props}
      />
    )
  },
)

WaveCanvas.displayName = "WaveCanvas"

export { WaveCanvas }

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Merge external ref with internal ref */
function useMergedRef<T>(
  ...refs: React.Ref<T>[]
): React.RefCallback<T> {
  return React.useCallback((node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref && typeof ref === "object") (ref as React.MutableRefObject<T>).current = node
    }
  }, refs)
}

/** Listen for prefers-reduced-motion changes */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mql.matches)

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return reduced
}
