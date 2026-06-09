/* ──────────────────────────────────────────────
   Drip Animation Math
   Pure cubic-bezier utilities for ink-drip clip-path animation.
   No React dependencies — testable in isolation.
   ────────────────────────────────────────────── */

export interface DripControlPoint {
  y1: number // leave amplitude offset
  y2: number // enter amplitude offset
}

export type DripAnimationState = "idle" | "entering" | "entered" | "leaving"

export const DRIP_ANIMATION_DURATION_MS = 1800
export const DRIP_PATH_START_Y = -8

export const cubicAt = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const inverseT = 1 - t
  return (
    inverseT ** 3 * p0 +
    3 * inverseT ** 2 * t * p1 +
    3 * inverseT * t ** 2 * p2 +
    t ** 3 * p3
  )
}

export const cubicBezierProgressAtTime = (timeFraction: number) => {
  // CSS `ease` is cubic-bezier(0.25, 0.1, 0.25, 1).
  let lower = 0
  let upper = 1

  for (let i = 0; i < 24; i++) {
    const midpoint = (lower + upper) / 2
    const x = cubicAt(0, 0.25, 0.25, 1, midpoint)

    if (x < timeFraction) {
      lower = midpoint
    } else {
      upper = midpoint
    }
  }

  return cubicAt(0, 0.1, 1, 1, (lower + upper) / 2)
}

export const timeFractionForCssEaseProgress = (targetProgress: number) => {
  let lower = 0
  let upper = 1

  for (let i = 0; i < 24; i++) {
    const midpoint = (lower + upper) / 2
    const progress = cubicBezierProgressAtTime(midpoint)

    if (progress < targetProgress) {
      lower = midpoint
    } else {
      upper = midpoint
    }
  }

  return (lower + upper) / 2
}

export const cubicBezierYExtrema = (p0: number, p1: number, p2: number, p3: number) => {
  const a = -p0 + 3 * p1 - 3 * p2 + p3
  const b = 2 * (p0 - 2 * p1 + p2)
  const c = p1 - p0
  const roots = [0, 1]

  if (Math.abs(a) < Number.EPSILON) {
    if (Math.abs(b) > Number.EPSILON) {
      roots.push(-c / b)
    }
  } else {
    const discriminant = b ** 2 - 4 * a * c

    if (discriminant >= 0) {
      const sqrtDiscriminant = Math.sqrt(discriminant)
      roots.push((-b + sqrtDiscriminant) / (2 * a), (-b - sqrtDiscriminant) / (2 * a))
    }
  }

  return roots
    .filter((root) => root >= 0 && root <= 1)
    .map((root) => cubicAt(p0, p1, p2, p3, root))
}

export const calculateDripVisualFillDelayMs = (
  height: number,
  maxAmplitude: number,
  controlPoints: DripControlPoint[]
) => {
  if (height <= 0 || controlPoints.length === 0) return 0

  const endY = height + maxAmplitude
  const lowestFilledY = Math.min(
    ...controlPoints.flatMap((point) =>
      cubicBezierYExtrema(endY, endY + point.y2, endY + point.y2, endY)
    )
  )

  if (lowestFilledY <= height) return DRIP_ANIMATION_DURATION_MS

  const requiredProgress = Math.min(
    1,
    Math.max(0, (height - DRIP_PATH_START_Y) / (lowestFilledY - DRIP_PATH_START_Y))
  )

  return timeFractionForCssEaseProgress(requiredProgress) * DRIP_ANIMATION_DURATION_MS
}
