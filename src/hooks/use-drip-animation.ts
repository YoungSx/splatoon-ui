import * as React from "react"

import {
  type DripControlPoint,
  type DripAnimationState,
  calculateDripVisualFillDelayMs,
} from "@/lib/drip-math"

const STEP_SIZE = 30
const MAX_AMPLITUDE = 80

export interface DripStyle {
  "--drip-in-start"?: string
  "--drip-in-end"?: string
  "--drip-out-start"?: string
  "--drip-out-end"?: string
  "--drip-speed-factor"?: string
}

export function useDripAnimation(
  buttonRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const [mounted, setMounted] = React.useState(false)
  const [dimensions, setDimensions] = React.useState({ width: 100, height: 50 })
  const [controlPoints, setControlPoints] = React.useState<DripControlPoint[]>([])
  const [speedFactorActive, setSpeedFactorActive] = React.useState(false)
  const [dripAnimationState, setDripAnimationState] = React.useState<DripAnimationState>("idle")
  const pendingDripLeaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const dripEnterStartedAtRef = React.useRef(0)

  React.useEffect(() => {
    setMounted(true)

    const generateControlPoints = (width: number): DripControlPoint[] => {
      const points: DripControlPoint[] = []
      const count = Math.ceil(width / STEP_SIZE)
      for (let r = 0; r < count; r++) {
        const amplitude = r % 2 === 0 ? -80 : MAX_AMPLITUDE
        const y1 = 0.1 * amplitude + Math.random() * (0.9 * amplitude)
        const y2 = 0.1 * amplitude + Math.random() * (0.9 * amplitude)
        points.push({ y1, y2 })
      }
      return points
    }

    // Generate control points once (stable across resizes)
    const handleResize = () => {
      if (!buttonRef.current) return
      const width = buttonRef.current.clientWidth
      const height = buttonRef.current.clientHeight + 2
      setDimensions({ width, height })

      setControlPoints((prev) => {
        if (prev.length > 0) return prev
        return generateControlPoints(width)
      })
    }

    // Initial generation + measurement
    if (buttonRef.current) {
      const width = buttonRef.current.clientWidth
      setControlPoints(generateControlPoints(width))
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    const timer = setTimeout(() => {
      setSpeedFactorActive(true)
    }, 500)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
      if (pendingDripLeaveTimerRef.current) {
        clearTimeout(pendingDripLeaveTimerRef.current)
      }
    }
  }, [buttonRef])

  const getDripPath = React.useCallback(
    (index: number, isOut: boolean) => {
      if (!dimensions.width || !dimensions.height || controlPoints.length === 0) return ""

      const r = index === 0 ? -8 : dimensions.height + MAX_AMPLITUDE
      let path = `M0 ${r}`

      for (let o = 0; o < controlPoints.length; o++) {
        const pt = controlPoints[o]
        const offset = index === 0 ? 0 : isOut ? pt.y1 : pt.y2
        const a = o * STEP_SIZE + (Math.random() * 12 - 6)
        path += `C${a + 6} ${r + offset},${a + 24} ${r + offset},${a + STEP_SIZE} ${r}`
      }

      if (isOut) {
        path += `L${dimensions.width} ${dimensions.height}, 0 ${dimensions.height}`
      } else {
        path += `L${dimensions.width} -8, 0 -8`
      }
      path += "Z"
      return path
    },
    [controlPoints, dimensions.height, dimensions.width]
  )

  const dripPaths = React.useMemo(() => {
    if (!mounted || dimensions.width <= 0) return null

    return {
      inStart: getDripPath(0, false),
      inEnd: getDripPath(1, false),
      outStart: getDripPath(0, true),
      outEnd: getDripPath(1, true),
    }
  }, [dimensions.width, getDripPath, mounted])

  const startDripEnter = React.useCallback(() => {
    if (!enabled) return

    if (pendingDripLeaveTimerRef.current) {
      clearTimeout(pendingDripLeaveTimerRef.current)
      pendingDripLeaveTimerRef.current = null
    }
    dripEnterStartedAtRef.current = performance.now()
    setDripAnimationState("entering")
  }, [enabled])

  const startDripLeave = React.useCallback(() => {
    if (!enabled) return

    setDripAnimationState((current) => {
      if (current === "entering") {
        if (!pendingDripLeaveTimerRef.current) {
          const elapsedSinceEnter = performance.now() - dripEnterStartedAtRef.current
          const visualFillDelayMs = calculateDripVisualFillDelayMs(
            dimensions.height,
            MAX_AMPLITUDE,
            controlPoints
          )
          const remainingFillTime = Math.max(0, visualFillDelayMs - elapsedSinceEnter)
          pendingDripLeaveTimerRef.current = setTimeout(() => {
            pendingDripLeaveTimerRef.current = null
            setDripAnimationState("leaving")
          }, remainingFillTime)
        }
        return current
      }

      return current === "idle" ? current : "leaving"
    })
  }, [controlPoints, dimensions.height, enabled])

  const handleDripAnimationEnd = React.useCallback(() => {
    setDripAnimationState((current) => {
      if (current === "entering") return "entered"
      if (current === "leaving") return "idle"
      return current
    })
  }, [])

  const dripStyle: DripStyle | undefined = dripPaths
    ? {
        "--drip-in-start": `path("${dripPaths.inStart}")`,
        "--drip-in-end": `path("${dripPaths.inEnd}")`,
        "--drip-out-start": `path("${dripPaths.outStart}")`,
        "--drip-out-end": `path("${dripPaths.outEnd}")`,
        "--drip-speed-factor": speedFactorActive ? "1" : "0",
      }
    : undefined

  return {
    dripAnimationState,
    dripStyle,
    startDripEnter,
    startDripLeave,
    handleDripAnimationEnd,
  }
}
