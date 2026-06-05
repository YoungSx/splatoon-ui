"use client"

import { cardStackSupportDriverTuning } from "@/lib/physics/card-stack/tuning"

export type SupportSpringDriver = {
  kind: "spring"
  stiffness: number
  damping: number
  mass: number
}

export type SupportCurveSample = {
  value: number
  slope: number
  curvature: number
}

export type SupportCurveDriver = {
  kind: "curve"
  durationSeconds: number
  sample: (progress: number) => SupportCurveSample
  label: string
}

export type SupportMotionDriver = SupportSpringDriver | SupportCurveDriver

export type SupportMotionProfile = {
  driver: SupportMotionDriver
  settleVelocityEpsilonPxPerSecond: number
  settlePositionEpsilonPx: number
}

export type SupportMotionState = {
  driver: SupportMotionDriver
  fromPositionPx: number
  targetPositionPx: number
  initialVelocityPxPerSecond: number
  initialAccelerationPxPerSecondSquared: number
  startedAt: number
}

export type SupportMotionSample = {
  positionPx: number
  velocityPxPerSecond: number
  accelerationPxPerSecondSquared: number
  done: boolean
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

function createEaseInBackSample({
  overshoot = cardStackSupportDriverTuning.easeInBack.overshoot,
}: EaseInBackOptions = {}): (progress: number) => SupportCurveSample {
  const validatedOvershoot = Number.isFinite(overshoot) ? overshoot : cardStackSupportDriverTuning.easeInBack.overshoot
  const safeOvershoot = Math.max(validatedOvershoot, 0)
  const coefficient = safeOvershoot + 1

  return (progress: number) => ({
    value: coefficient * progress * progress * progress - safeOvershoot * progress * progress,
    slope: 3 * coefficient * progress * progress - 2 * safeOvershoot * progress,
    curvature: 6 * coefficient * progress - 2 * safeOvershoot,
  })
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
  sample,
  label,
}: {
  durationSeconds: number
  sample: (progress: number) => SupportCurveSample
  label: string
}): SupportCurveDriver {
  return {
    kind: "curve",
    durationSeconds,
    sample,
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
    sample: createEaseInBackSample({ overshoot }),
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

export function startSupportMotion({
  driver,
  fromPositionPx,
  targetPositionPx,
  initialVelocityPxPerSecond,
  initialAccelerationPxPerSecondSquared,
  startedAt,
}: {
  driver: SupportMotionDriver
  fromPositionPx: number
  targetPositionPx: number
  initialVelocityPxPerSecond: number
  initialAccelerationPxPerSecondSquared: number
  startedAt: number
}): SupportMotionState {
  return {
    driver,
    fromPositionPx,
    targetPositionPx,
    initialVelocityPxPerSecond,
    initialAccelerationPxPerSecondSquared,
    startedAt,
  }
}

function sampleCurveMotion(
  state: SupportMotionState,
  settleVelocityEpsilonPxPerSecond: number,
  now: number
): SupportMotionSample {
  const driver = state.driver
  if (driver.kind !== "curve") {
    throw new Error("sampleCurveMotion requires a curve driver")
  }

  const durationMs = driver.durationSeconds * 1000
  const elapsedMs = Math.max(now - state.startedAt, 0)
  const progress = durationMs > 0 ? Math.min(elapsedMs / durationMs, 1) : 1
  const durationSeconds = Math.max(driver.durationSeconds, Number.EPSILON)
  const deltaPx = state.targetPositionPx - state.fromPositionPx
  const normalized = driver.sample(progress)
  const carryA = state.initialVelocityPxPerSecond * durationSeconds
  const carryB = (state.initialAccelerationPxPerSecondSquared * durationSeconds * durationSeconds) / 2
  // Keep the authored curve intact at the far end. We only correct the launch so mid-flight
  // retargets remain C2-continuous at the start; forcing a zero-velocity/zero-acceleration
  // landing turns easeInBack into a long tail that visibly "holds" the first apex.
  const carryC = -(carryA + carryB)
  const carryPosition =
    carryA * progress +
    carryB * progress * progress +
    carryC * progress * progress * progress
  const carrySlope =
    carryA +
    2 * carryB * progress +
    3 * carryC * progress * progress
  const carryCurvature = 2 * carryB + 6 * carryC * progress

  if (progress >= 1) {
    return {
      positionPx: state.targetPositionPx,
      velocityPxPerSecond: 0,
      accelerationPxPerSecondSquared: 0,
      done: true,
    }
  }

  return {
    positionPx: state.fromPositionPx + deltaPx * normalized.value + carryPosition,
    velocityPxPerSecond: (deltaPx * normalized.slope + carrySlope) / durationSeconds,
    accelerationPxPerSecondSquared: (deltaPx * normalized.curvature + carryCurvature) / (durationSeconds * durationSeconds),
    done: false,
  }
}

function sampleSpringMotion(
  state: SupportMotionState,
  settlePositionEpsilonPx: number,
  settleVelocityEpsilonPxPerSecond: number,
  now: number
): SupportMotionSample {
  const driver = state.driver
  if (driver.kind !== "spring") {
    throw new Error("sampleSpringMotion requires a spring driver")
  }

  const elapsedSeconds = Math.max((now - state.startedAt) / 1000, 0)
  const stiffness = driver.stiffness
  const damping = driver.damping
  const mass = Math.max(driver.mass, Number.EPSILON)
  const displacement0 = state.fromPositionPx - state.targetPositionPx
  const velocity0 = state.initialVelocityPxPerSecond
  const naturalFrequency = Math.sqrt(stiffness / mass)
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass))

  let displacement = displacement0
  let velocity = velocity0

  if (dampingRatio < 1 - 1e-6) {
    const decay = dampingRatio * naturalFrequency
    const dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio * dampingRatio)
    const coefficientA = displacement0
    const coefficientB = (velocity0 + decay * displacement0) / dampedFrequency
    const sin = Math.sin(dampedFrequency * elapsedSeconds)
    const cos = Math.cos(dampedFrequency * elapsedSeconds)
    const exponential = Math.exp(-decay * elapsedSeconds)

    displacement = exponential * (coefficientA * cos + coefficientB * sin)
    velocity =
      exponential *
      (velocity0 * cos -
        ((decay * velocity0 + naturalFrequency * naturalFrequency * displacement0) / dampedFrequency) * sin)
  } else if (Math.abs(dampingRatio - 1) <= 1e-6) {
    const decay = naturalFrequency
    const coefficient = velocity0 + decay * displacement0
    const exponential = Math.exp(-decay * elapsedSeconds)

    displacement = (displacement0 + coefficient * elapsedSeconds) * exponential
    velocity = (velocity0 - decay * coefficient * elapsedSeconds) * exponential
  } else {
    const decay = dampingRatio * naturalFrequency
    const root = naturalFrequency * Math.sqrt(dampingRatio * dampingRatio - 1)
    const lambda1 = -decay + root
    const lambda2 = -decay - root
    const coefficient1 = (velocity0 - lambda2 * displacement0) / (lambda1 - lambda2)
    const coefficient2 = displacement0 - coefficient1

    displacement = coefficient1 * Math.exp(lambda1 * elapsedSeconds) + coefficient2 * Math.exp(lambda2 * elapsedSeconds)
    velocity =
      coefficient1 * lambda1 * Math.exp(lambda1 * elapsedSeconds) +
      coefficient2 * lambda2 * Math.exp(lambda2 * elapsedSeconds)
  }

  const acceleration = -(damping / mass) * velocity - (stiffness / mass) * displacement
  const positionPx = state.targetPositionPx + displacement
  const done =
    Math.abs(positionPx - state.targetPositionPx) <= settlePositionEpsilonPx &&
    Math.abs(velocity) <= settleVelocityEpsilonPxPerSecond

  if (done) {
    return {
      positionPx: state.targetPositionPx,
      velocityPxPerSecond: 0,
      accelerationPxPerSecondSquared: 0,
      done: true,
    }
  }

  return {
    positionPx,
    velocityPxPerSecond: velocity,
    accelerationPxPerSecondSquared: acceleration,
    done: false,
  }
}

export function sampleSupportMotion(
  state: SupportMotionState,
  {
    settleVelocityEpsilonPxPerSecond,
    settlePositionEpsilonPx,
  }: Pick<SupportMotionProfile, "settleVelocityEpsilonPxPerSecond" | "settlePositionEpsilonPx">,
  now: number
): SupportMotionSample {
  if (state.driver.kind === "curve") {
    return sampleCurveMotion(state, settleVelocityEpsilonPxPerSecond, now)
  }

  return sampleSpringMotion(state, settlePositionEpsilonPx, settleVelocityEpsilonPxPerSecond, now)
}

export function describeSupportMotionDriver(driver: SupportMotionDriver) {
  return driver.kind === "curve" ? driver.label : "spring"
}
