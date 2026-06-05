"use client"

import { animate, type AnimationPlaybackControls, type MotionValue } from "framer-motion"
import { cardStackSupportDriverTuning } from "@/lib/physics/card-stack/tuning"

export type SupportSpringDriver = {
  kind: "spring"
  stiffness: number
  damping: number
  mass: number
}

export type SupportCurveDriver = {
  kind: "curve"
  durationSeconds: number
  ease: (progress: number) => number
  label: string
}

export type SupportMotionDriver = SupportSpringDriver | SupportCurveDriver

export type SupportMotionProfile = {
  driver: SupportMotionDriver
  settleVelocityEpsilonPxPerSecond: number
  settlePositionEpsilonPx: number
}

export type EaseInBackOptions = {
  overshoot?: number
}

export type EaseInBackDriverOptions = EaseInBackOptions & {
  durationSeconds?: number
  label?: string
}

export function createEaseInBackEasing({
  overshoot = cardStackSupportDriverTuning.easeInBack.overshoot,
}: EaseInBackOptions = {}) {
  const validatedOvershoot = Number.isFinite(overshoot) ? overshoot : cardStackSupportDriverTuning.easeInBack.overshoot
  const safeOvershoot = Math.max(validatedOvershoot, 0)
  const coefficient = safeOvershoot + 1

  return (progress: number) => coefficient * progress * progress * progress - safeOvershoot * progress * progress
}

export function createSpringSupportMotionDriver({
  stiffness,
  damping,
  mass,
}: {
  stiffness: number
  damping: number
  mass: number
}): SupportSpringDriver {
  return {
    kind: "spring",
    stiffness,
    damping,
    mass,
  }
}

export function createCurveSupportMotionDriver({
  durationSeconds,
  ease,
  label,
}: {
  durationSeconds: number
  ease: (progress: number) => number
  label: string
}): SupportCurveDriver {
  return {
    kind: "curve",
    durationSeconds,
    ease,
    label,
  }
}

export function createEaseInBackSupportMotionDriver({
  durationSeconds = cardStackSupportDriverTuning.easeInBack.durationSeconds,
  overshoot = cardStackSupportDriverTuning.easeInBack.overshoot,
  label = cardStackSupportDriverTuning.easeInBack.label,
}: EaseInBackDriverOptions = {}): SupportCurveDriver {
  return createCurveSupportMotionDriver({
    durationSeconds,
    ease: createEaseInBackEasing({ overshoot }),
    label,
  })
}

export function createSupportMotionProfile({
  driver,
  settleVelocityEpsilonPxPerSecond = cardStackSupportDriverTuning.settleVelocityEpsilonPxPerSecond,
  settlePositionEpsilonPx = cardStackSupportDriverTuning.settlePositionEpsilonPx,
}: {
  driver: SupportMotionDriver
  settleVelocityEpsilonPxPerSecond?: number
  settlePositionEpsilonPx?: number
}): SupportMotionProfile {
  return {
    driver,
    settleVelocityEpsilonPxPerSecond,
    settlePositionEpsilonPx,
  }
}

export const supportMotionPresets = {
  easeInBack: createEaseInBackSupportMotionDriver(),
  gentleSpring: createSpringSupportMotionDriver({
    stiffness: cardStackSupportDriverTuning.gentleSpring.stiffness,
    damping: cardStackSupportDriverTuning.gentleSpring.damping,
    mass: cardStackSupportDriverTuning.gentleSpring.mass,
  }),
} as const

export const defaultSupportMotionProfile: SupportMotionProfile = createSupportMotionProfile({
  driver: supportMotionPresets.easeInBack,
})

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
