"use client"

import { animate, type AnimationPlaybackControls, type MotionValue } from "framer-motion"

export type SupportMotionDriver =
  | {
      kind: "spring"
      stiffness: number
      damping: number
      mass: number
    }
  | {
      kind: "curve"
      durationSeconds: number
      ease: (progress: number) => number
      label: string
    }

export type SupportMotionProfile = {
  driver: SupportMotionDriver
  settleVelocityEpsilonPxPerSecond: number
  settlePositionEpsilonPx: number
}

export function easeInBack(progress: number) {
  const overshoot = 1.70158
  const coefficient = overshoot + 1
  return coefficient * progress * progress * progress - overshoot * progress * progress
}

export const defaultSupportMotionProfile: SupportMotionProfile = {
  driver: {
    kind: "curve",
    durationSeconds: 0.72,
    ease: easeInBack,
    label: "easeInBack",
  },
  settleVelocityEpsilonPxPerSecond: 2,
  settlePositionEpsilonPx: 0.75,
}

export function startSupportAnimation(
  supportPositionPxMotion: MotionValue<number>,
  targetPositionPx: number,
  driver: SupportMotionDriver
): AnimationPlaybackControls {
  if (driver.kind === "spring") {
    return animate(supportPositionPxMotion, targetPositionPx, {
      type: "spring",
      stiffness: driver.stiffness,
      damping: driver.damping,
      mass: driver.mass,
    })
  }

  return animate(supportPositionPxMotion, targetPositionPx, {
    type: "tween",
    duration: driver.durationSeconds,
    ease: driver.ease,
  })
}

export function describeSupportMotionDriver(driver: SupportMotionDriver) {
  return driver.kind === "curve" ? driver.label : "spring"
}
