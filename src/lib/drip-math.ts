/* ──────────────────────────────────────────────
   Drip Animation Math
   Pure cubic-bezier utilities for ink-drip clip-path animation.
   No React dependencies — testable in isolation.
   ────────────────────────────────────────────── */

export interface DripControlPoint {
  x1Jitter: number
  x2Jitter: number
  y1: number // leave amplitude offset
  y2: number // enter amplitude offset
}

export type DripAnimationState = "idle" | "entering" | "entered" | "leaving"
export type DripPathPhase = "enter" | "leave"
export type DripPathStage = "start" | "end"

export const DRIP_ANIMATION_DURATION_MS = 1800
export const DRIP_BLEED_X = 16
export const DRIP_MAX_AMPLITUDE = 80
export const DRIP_PATH_START_Y = -8
export const DRIP_STEP_SIZE = 30
export const DRIP_X_JITTER = 4

export interface CreateDripControlPointsOptions {
  bleedX?: number
  existing?: DripControlPoint[]
  maxAmplitude?: number
  random?: () => number
  stepSize?: number
  width: number
}

export interface CreateDripPathOptions {
  bleedX?: number
  controlPoints: DripControlPoint[]
  height: number
  maxAmplitude?: number
  phase: DripPathPhase
  stage: DripPathStage
  stepSize?: number
  width: number
}

function clampPositive(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.ceil(value)) : 0
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function formatPathNumber(value: number) {
  return Number(value.toFixed(3)).toString()
}

function randomAmplitudeOffset(amplitude: number, random: () => number) {
  return 0.1 * amplitude + random() * (0.9 * amplitude)
}

export function getDripSegmentCount(
  width: number,
  stepSize: number = DRIP_STEP_SIZE,
  bleedX: number = DRIP_BLEED_X
) {
  return Math.max(1, Math.ceil((clampPositive(width) + bleedX * 2) / stepSize))
}

export function createDripControlPoints({
  bleedX = DRIP_BLEED_X,
  existing = [],
  maxAmplitude = DRIP_MAX_AMPLITUDE,
  random = Math.random,
  stepSize = DRIP_STEP_SIZE,
  width,
}: CreateDripControlPointsOptions) {
  const requiredCount = getDripSegmentCount(width, stepSize, bleedX)

  if (existing.length >= requiredCount) {
    return existing
  }

  const nextPoints = [...existing]

  for (let index = existing.length; index < requiredCount; index += 1) {
    const amplitude = index % 2 === 0 ? -maxAmplitude : maxAmplitude

    nextPoints.push({
      x1Jitter: (random() * 2 - 1) * DRIP_X_JITTER,
      x2Jitter: (random() * 2 - 1) * DRIP_X_JITTER,
      y1: randomAmplitudeOffset(amplitude, random),
      y2: randomAmplitudeOffset(amplitude, random),
    })
  }

  return nextPoints
}

export function createDripPath({
  bleedX = DRIP_BLEED_X,
  controlPoints,
  height,
  maxAmplitude = DRIP_MAX_AMPLITUDE,
  phase,
  stage,
  stepSize = DRIP_STEP_SIZE,
  width,
}: CreateDripPathOptions) {
  const safeWidth = clampPositive(width)
  const safeHeight = clampPositive(height)
  const segmentCount = getDripSegmentCount(safeWidth, stepSize, bleedX)
  const startX = -bleedX
  const endX = safeWidth + bleedX
  const edgeY = stage === "start" ? DRIP_PATH_START_Y : safeHeight + maxAmplitude
  const closeY = phase === "leave" ? safeHeight : DRIP_PATH_START_Y
  let path = `M${formatPathNumber(startX)} ${formatPathNumber(edgeY)}`

  for (let index = 0; index < segmentCount; index += 1) {
    const point = controlPoints[index] ?? {
      x1Jitter: 0,
      x2Jitter: 0,
      y1: 0,
      y2: 0,
    }
    const x0 = startX + index * stepSize
    const x3 = index === segmentCount - 1 ? endX : startX + (index + 1) * stepSize
    const segmentWidth = Math.max(0, x3 - x0)
    const yOffset = stage === "start" ? 0 : phase === "leave" ? point.y1 : point.y2
    const x1 = clamp(x0 + segmentWidth * 0.2 + point.x1Jitter, x0, x3)
    const x2 = clamp(x0 + segmentWidth * 0.8 + point.x2Jitter, x0, x3)
    const y = edgeY + yOffset

    path += `C${formatPathNumber(x1)} ${formatPathNumber(y)},${formatPathNumber(x2)} ${formatPathNumber(y)},${formatPathNumber(x3)} ${formatPathNumber(edgeY)}`
  }

  path += `L${formatPathNumber(endX)} ${formatPathNumber(closeY)}, ${formatPathNumber(startX)} ${formatPathNumber(closeY)}`
  path += "Z"

  return path
}

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
