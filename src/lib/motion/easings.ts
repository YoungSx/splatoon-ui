import type { CubicBezierControlPoints } from "@/lib/motion/cubic-bezier"

/**
 * TypeScript mirror of the Splatoon-site easing CSS custom properties declared
 * in `src/app/globals.css`. The control-point tuples here MUST stay byte-for-byte
 * aligned with those declarations so JS-driven physics and pure-CSS transitions
 * agree on visuals.
 *
 * Source: splatoon.nintendo.com `_next/static/css/*.css` —
 *   --ease-in:           cubic-bezier(0.51, 0,    0.9,  0.43)
 *   --ease-back-in:      cubic-bezier(0.38, -0.37, 0.83, 0.23)
 *   --ease-back-out:     cubic-bezier(0.21, 0.12, 0.35, 1.43)
 *   --ease-out:          cubic-bezier(0.35, 0.91, 0.3,  0.99)
 *   --ease-in-out:       cubic-bezier(0.75, 0,    0.21, 0.99)
 *   --ease-in-out-quart: cubic-bezier(0.77, 0,    0.175, 1)
 */
export const splatoonEasings = {
  easeIn: [0.51, 0, 0.9, 0.43],
  easeBackIn: [0.38, -0.37, 0.83, 0.23],
  easeBackOut: [0.21, 0.12, 0.35, 1.43],
  easeOut: [0.35, 0.91, 0.3, 0.99],
  easeInOut: [0.75, 0, 0.21, 0.99],
  easeInOutQuart: [0.77, 0, 0.175, 1],
} as const satisfies Record<string, CubicBezierControlPoints>

export type SplatoonEasingName = keyof typeof splatoonEasings

/** CSS variable name for a given easing token, e.g. `easeInOut` -> `--ease-in-out`. */
export const splatoonEasingCssVariable: Record<SplatoonEasingName, string> = {
  easeIn: "--ease-in",
  easeBackIn: "--ease-back-in",
  easeBackOut: "--ease-back-out",
  easeOut: "--ease-out",
  easeInOut: "--ease-in-out",
  easeInOutQuart: "--ease-in-out-quart",
}
