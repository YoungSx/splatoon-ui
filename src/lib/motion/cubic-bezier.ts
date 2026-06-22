/**
 * Cubic-bezier sampler.
 *
 * CSS `cubic-bezier(x1, y1, x2, y2)` defines a parametric curve in (x, y) where
 * x is normalized time and y is the eased output. Control points are fixed at
 * P0=(0,0) and P3=(1,1), so only the two interior control points are configurable.
 *
 * For a given input progress s in [0, 1], the eased output is computed by
 * (1) solving for the parameter t such that x(t) = s, then
 * (2) evaluating y(t) and its derivatives via the chain rule.
 *
 * The solver uses Newton-Raphson with bisection fallback for numerical
 * robustness near vertical tangents, matching the algorithm shipped by every
 * mainstream browser engine.
 */

export type CubicBezierControlPoints = readonly [
  x1: number,
  y1: number,
  x2: number,
  y2: number,
]

export type CubicBezierSample = {
  /** Eased output y, evaluated at t such that x(t) = progress. */
  value: number
  /** First derivative dy/dx at the same point. */
  slope: number
  /** Second derivative d^2 y / d x^2 at the same point. */
  curvature: number
}

const NEWTON_ITERATIONS = 8
const NEWTON_MIN_SLOPE = 1e-3
const SUBDIVISION_PRECISION = 1e-7
const SUBDIVISION_MAX_ITERATIONS = 12

function bezierAxis(t: number, p1: number, p2: number) {
  // Bernstein form for control points (0, p1, p2, 1):
  //   B(t) = 3 (1 - t)^2 t * p1 + 3 (1 - t) t^2 * p2 + t^3
  // Expanded so we can reuse intermediate products in the derivative helpers.
  return ((1 - 3 * p2 + 3 * p1) * t + (3 * p2 - 6 * p1)) * t * t + 3 * p1 * t
}

function bezierAxisSlope(t: number, p1: number, p2: number) {
  // dB/dt
  return 3 * (1 - 3 * p2 + 3 * p1) * t * t + 2 * (3 * p2 - 6 * p1) * t + 3 * p1
}

function bezierAxisCurvature(t: number, p1: number, p2: number) {
  // d^2 B / d t^2
  return 6 * (1 - 3 * p2 + 3 * p1) * t + 2 * (3 * p2 - 6 * p1)
}

function solveParameter(progress: number, x1: number, x2: number) {
  let t = progress

  // Newton-Raphson — converges quadratically when the slope is well-behaved.
  for (let i = 0; i < NEWTON_ITERATIONS; i += 1) {
    const slope = bezierAxisSlope(t, x1, x2)
    if (Math.abs(slope) < NEWTON_MIN_SLOPE) break
    const error = bezierAxis(t, x1, x2) - progress
    const next = t - error / slope
    if (next === t) return t
    t = next
  }

  // Bisection fallback for the rare cases where Newton stalls.
  let low = 0
  let high = 1
  let mid = progress

  for (let i = 0; i < SUBDIVISION_MAX_ITERATIONS; i += 1) {
    const x = bezierAxis(mid, x1, x2)
    const delta = x - progress
    if (Math.abs(delta) <= SUBDIVISION_PRECISION) return mid
    if (delta > 0) {
      high = mid
    } else {
      low = mid
    }
    mid = (low + high) / 2
  }

  return mid
}

export type CubicBezierSampler = (progress: number) => CubicBezierSample

/**
 * Build a sampler for the supplied control points. The returned function is
 * pure and safe to call from per-frame solvers; intermediate state is local.
 */
export function createCubicBezierSampler(
  controlPoints: CubicBezierControlPoints
): CubicBezierSampler {
  const [x1, y1, x2, y2] = controlPoints

  return (progress: number) => {
    if (progress <= 0) {
      // Use the right-hand limits so consumers integrating with carry terms
      // observe a continuous launch slope/curvature instead of a hard zero.
      const slopeRatio = (3 * y1) / Math.max(3 * x1, Number.EPSILON)
      return {
        value: 0,
        slope: x1 === 0 ? 0 : slopeRatio,
        curvature: 0,
      }
    }
    if (progress >= 1) {
      const xs = bezierAxisSlope(1, x1, x2)
      const ys = bezierAxisSlope(1, y1, y2)
      return {
        value: 1,
        slope: xs === 0 ? 0 : ys / xs,
        curvature: 0,
      }
    }

    const t = solveParameter(progress, x1, x2)
    const value = bezierAxis(t, y1, y2)
    const xSlope = bezierAxisSlope(t, x1, x2)
    const ySlope = bezierAxisSlope(t, y1, y2)
    const xCurvature = bezierAxisCurvature(t, x1, x2)
    const yCurvature = bezierAxisCurvature(t, y1, y2)

    // Convert dy/dt, d^2 y / d t^2 into dy/dx, d^2 y / d x^2 via the chain rule:
    //   y'(x)  = y'(t) / x'(t)
    //   y''(x) = (y''(t) * x'(t) - y'(t) * x''(t)) / x'(t)^3
    const safeXSlope = Math.abs(xSlope) < Number.EPSILON ? Number.EPSILON : xSlope
    const slope = ySlope / safeXSlope
    const curvature = (yCurvature * safeXSlope - ySlope * xCurvature) / (safeXSlope * safeXSlope * safeXSlope)

    return { value, slope, curvature }
  }
}
