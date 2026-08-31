import * as React from 'react'

import {
  createDripControlPoints,
  createDripPath,
  DRIP_MAX_AMPLITUDE,
  type DripControlPoint,
  type DripAnimationState,
  calculateDripVisualFillDelayMs,
} from '@/lib/drip-math'
import { observeElementResize } from '@/lib/observe-element-resize'

export interface DripStyle {
  '--drip-in-start'?: string
  '--drip-in-end'?: string
  '--drip-out-start'?: string
  '--drip-out-end'?: string
  '--drip-speed-factor'?: string
}

export function useDripAnimation(buttonRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [dimensions, setDimensions] = React.useState({ width: 100, height: 50 })
  const [controlPoints, setControlPoints] = React.useState<DripControlPoint[]>([])
  const [speedFactorActive, setSpeedFactorActive] = React.useState(false)
  const [dripAnimationState, setDripAnimationState] = React.useState<DripAnimationState>('idle')
  const pendingDripLeaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const dripEnterStartedAtRef = React.useRef(0)

  const measure = React.useCallback(() => {
    const element = buttonRef.current
    if (!element) return

    const width = Math.ceil(element.offsetWidth)
    const height = Math.ceil(element.offsetHeight) + 2

    setDimensions((current) =>
      current.width === width && current.height === height ? current : { width, height }
    )

    setControlPoints((prev) => createDripControlPoints({ existing: prev, width }))
  }, [buttonRef])

  React.useEffect(() => {
    if (!enabled) return

    const element = buttonRef.current
    if (!element) return

    measure()
    const unobserveResize = observeElementResize(element, measure)

    const timer = setTimeout(() => {
      setSpeedFactorActive(true)
    }, 500)

    return () => {
      unobserveResize()
      clearTimeout(timer)
      if (pendingDripLeaveTimerRef.current) {
        clearTimeout(pendingDripLeaveTimerRef.current)
      }
    }
  }, [buttonRef, enabled, measure])

  const dripPaths = React.useMemo(() => {
    if (dimensions.width <= 0 || controlPoints.length === 0) return null

    const pathOptions = {
      controlPoints,
      height: dimensions.height,
      width: dimensions.width,
    }

    return {
      inStart: createDripPath({ ...pathOptions, phase: 'enter', stage: 'start' }),
      inEnd: createDripPath({ ...pathOptions, phase: 'enter', stage: 'end' }),
      outStart: createDripPath({ ...pathOptions, phase: 'leave', stage: 'start' }),
      outEnd: createDripPath({ ...pathOptions, phase: 'leave', stage: 'end' }),
    }
  }, [controlPoints, dimensions.height, dimensions.width])

  const startDripEnter = React.useCallback(() => {
    if (!enabled) return

    // Re-measure at animation start: some browsers snapshot keyframe var()
    // endpoints when the animation begins, so the paths must reflect the live
    // box at this exact moment, not whatever the last ResizeObserver tick saw.
    measure()
    if (pendingDripLeaveTimerRef.current) {
      clearTimeout(pendingDripLeaveTimerRef.current)
      pendingDripLeaveTimerRef.current = null
    }
    dripEnterStartedAtRef.current = performance.now()
    setDripAnimationState('entering')
  }, [enabled, measure])

  const startDripLeave = React.useCallback(() => {
    if (!enabled) return

    measure()
    setDripAnimationState((current) => {
      if (current === 'entering') {
        if (!pendingDripLeaveTimerRef.current) {
          const elapsedSinceEnter = performance.now() - dripEnterStartedAtRef.current
          const visualFillDelayMs = calculateDripVisualFillDelayMs(
            dimensions.height,
            DRIP_MAX_AMPLITUDE,
            controlPoints
          )
          const remainingFillTime = Math.max(0, visualFillDelayMs - elapsedSinceEnter)
          pendingDripLeaveTimerRef.current = setTimeout(() => {
            pendingDripLeaveTimerRef.current = null
            measure()
            setDripAnimationState('leaving')
          }, remainingFillTime)
        }
        return current
      }

      return current === 'idle' ? current : 'leaving'
    })
  }, [controlPoints, dimensions.height, enabled, measure])

  const handleDripAnimationEnd = React.useCallback(() => {
    setDripAnimationState((current) => {
      if (current === 'entering') return 'entered'
      if (current === 'leaving') return 'idle'
      return current
    })
  }, [])

  const dripStyle: DripStyle | undefined = dripPaths
    ? {
        '--drip-in-start': `path("${dripPaths.inStart}")`,
        '--drip-in-end': `path("${dripPaths.inEnd}")`,
        '--drip-out-start': `path("${dripPaths.outStart}")`,
        '--drip-out-end': `path("${dripPaths.outEnd}")`,
        '--drip-speed-factor': speedFactorActive ? '1' : '0',
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
