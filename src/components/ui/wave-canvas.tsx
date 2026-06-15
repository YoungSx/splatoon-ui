"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

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

function WaveCanvas({
  ref,
  color = "#0d0d0d",
  height = 200,
  interactive = true,
  numPoints = NUM_POINTS,
  elasticity = ELASTICITY,
  friction = FRICTION,
  className,
  style,
  ...props
}: WaveCanvasProps & { ref?: React.Ref<HTMLCanvasElement> }) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const internalRef = useMergedRef(canvasRef, ref as React.Ref<HTMLCanvasElement>)

    // ── Reduced motion ───────────────────────────────────────────────────────

    const [prefersReducedMotion] = useReducedMotion()
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
    // Previous mouse position in SCREEN coordinates (clientX/clientY).
    // Matches official splatoon.nintendo.com — listener is on window so it
    // tracks the mouse continuously across the entire page, not just over
    // the canvas. null = first event, no previous position yet.
    const oldMousePosRef = React.useRef<{ x: number; y: number } | null>(null)

    // Build points with initial perturbation (wave is visible at rest)
    React.useEffect(() => {
      if (canvasWidth === 0) return
      const points: WavePoint[] = []
      for (let i = 0; i <= numPoints; i++) {
        const pt = new WavePoint()
        const t = i / numPoints
        pt.height = Math.sin(t * Math.PI * 4) * 8 + Math.sin(t * Math.PI * 7) * 4
        points.push(pt)
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

    // ── Mouse handler (window-level, faithful to official implementation) ────
    //
    // The official splatoon.nintendo.com attaches mousemove on `window`,
    // tracks oldMousePos in SCREEN coordinates continuously across the page,
    // and triggers an impulse only on the frame the cursor crosses the
    // canvas's vertical centerline (in screen coords).
    //
    // Listening on the canvas itself was the bug: it only fires while the
    // mouse is over the canvas, and the user rarely moves vertically *within*
    // a 120px-tall strip enough to trigger crossing detection. Listening on
    // window means the mouse approaching the wave area from above the page
    // will naturally cross the centerline and produce a splash — the intended
    // "finger piercing the water surface" feel.
    //
    // Recreated from the minified official code:
    //   const t = { x: e.clientX, y: e.clientY }
    //   const n = { x: oldPos.x - t.x, y: oldPos.y - t.y }   // oldPos - new
    //   const r = stage.getBoundingClientRect()
    //   const surfaceY = r.top + height/2
    //   if ((t.y - surfaceY) * (oldPos.y - surfaceY) < 0) {
    //     const i = pointIndex(t.x - r.left)
    //     const o = points[i]
    //     let a = 5 * n.y                  // n.y = oldY - newY
    //     a = clamp(a, -200, 200)
    //     if (o) o.height += -a
    //   }
    //   oldPos = t  // always updated

    React.useEffect(() => {
      if (!shouldAnimate) return
      const canvas = canvasRef.current
      if (!canvas) return

      const onMouseMove = (e: MouseEvent) => {
        const t = { x: e.clientX, y: e.clientY }
        const oldPos = oldMousePosRef.current

        if (oldPos !== null) {
          const rect = canvas.getBoundingClientRect()
          const surfaceY = rect.top + height / 2

          // Crossing check in screen coordinates: did the cursor cross the
          // canvas's vertical centerline between the previous and current frame?
          if ((t.y - surfaceY) * (oldPos.y - surfaceY) < 0) {
            const points = pointsRef.current
            const segWidth = canvasWidth / numPoints
            const localX = t.x - rect.left
            const ptIndex = Math.round(localX / segWidth)
            const idx = Math.max(0, Math.min(points.length - 1, ptIndex))
            const ny = oldPos.y - t.y
            const a = Math.max(-200, Math.min(200, 5 * ny))
            if (points[idx]) {
              points[idx].height += -a
            }
          }
        }

        oldMousePosRef.current = t
      }

      window.addEventListener("mousemove", onMouseMove, { passive: true })
      return () => {
        window.removeEventListener("mousemove", onMouseMove)
      }
    }, [shouldAnimate, canvasWidth, numPoints, height])

    // ── Render ───────────────────────────────────────────────────────────────

    if (canvasWidth === 0) return null

    return (
      <canvas
        ref={internalRef}
        data-slot="wave-canvas"
        width={canvasWidth}
        height={height}
        className={cn("block", className)}
        style={{
          position: "absolute",
          bottom: "100%",
          left: 0,
          zIndex: 10,
          pointerEvents: "none",
          ...style,
        }}
        {...props}
      />
    )
  }

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
