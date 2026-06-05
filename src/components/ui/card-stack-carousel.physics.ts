"use client"

export const cardSwingPhysics = {
  simulationPixelsPerMeter: 1000,
  gravityMetersPerSecondSquared: 9.80665,
  pivotCoulombFrictionSpecificTorquePx2PerSecondSquared: 84000,
  angularVelocitySwitchEpsilon: 0.0005,
} as const

export type CardSwingGeometry = {
  cardWidthPx: number
  cardHeightPx: number
  hangerYPx: number
  pitchPx: number
  centerDistancePx: number
  inertiaOverMassPx2: number
  restoringCoefficient: number
  forcingCoefficient: number
}

export type CardStackCarouselSceneSnapshot = {
  angle: number
  angularVelocity: number
  supportPositionPx: number
  supportVelocityPxPerSecond: number
  supportAccelerationPxPerSecondSquared: number
  targetPositionPx: number
  geometry: CardSwingGeometry
  lastUpdatedAt: number
}

const gravityPxPerSecondSquared =
  cardSwingPhysics.simulationPixelsPerMeter * cardSwingPhysics.gravityMetersPerSecondSquared

export function createCardSwingGeometry({
  cardWidthPx,
  cardHeightPx,
  hangerYPx,
  pitchPx,
}: Pick<CardSwingGeometry, "cardWidthPx" | "cardHeightPx" | "hangerYPx" | "pitchPx">): CardSwingGeometry {
  const centerDistancePx = Math.max(cardHeightPx / 2 - hangerYPx, 1)
  const inertiaOverMassPx2 =
    (cardWidthPx * cardWidthPx + cardHeightPx * cardHeightPx) / 12 + centerDistancePx * centerDistancePx

  return {
    cardWidthPx,
    cardHeightPx,
    hangerYPx,
    pitchPx,
    centerDistancePx,
    inertiaOverMassPx2,
    restoringCoefficient: (gravityPxPerSecondSquared * centerDistancePx) / inertiaOverMassPx2,
    forcingCoefficient: centerDistancePx / inertiaOverMassPx2,
  }
}

function resolveDriveAngularAcceleration(snapshot: CardStackCarouselSceneSnapshot) {
  const gravityAngularAcceleration = -Math.sin(snapshot.angle) * snapshot.geometry.restoringCoefficient
  const supportAngularAcceleration =
    -Math.cos(snapshot.angle) *
    snapshot.geometry.forcingCoefficient *
    snapshot.supportAccelerationPxPerSecondSquared

  return gravityAngularAcceleration + supportAngularAcceleration
}

function resolveCoulombFrictionAngularAcceleration(snapshot: CardStackCarouselSceneSnapshot) {
  return (
    cardSwingPhysics.pivotCoulombFrictionSpecificTorquePx2PerSecondSquared / snapshot.geometry.inertiaOverMassPx2
  )
}

export function integrateSceneSnapshot(snapshot: CardStackCarouselSceneSnapshot, now: number) {
  const dt = Math.min(Math.max((now - snapshot.lastUpdatedAt) / 1000, 0), 1 / 30)
  snapshot.lastUpdatedAt = now

  const driveAngularAcceleration = resolveDriveAngularAcceleration(snapshot)
  const frictionAngularAcceleration = resolveCoulombFrictionAngularAcceleration(snapshot)
  const isEffectivelyStill =
    Math.abs(snapshot.angularVelocity) <= cardSwingPhysics.angularVelocitySwitchEpsilon

  let netAngularAcceleration = driveAngularAcceleration

  if (isEffectivelyStill) {
    if (Math.abs(driveAngularAcceleration) <= frictionAngularAcceleration) {
      snapshot.angularVelocity = 0
      return false
    }

    netAngularAcceleration -= frictionAngularAcceleration * Math.sign(driveAngularAcceleration)
  } else {
    netAngularAcceleration -= frictionAngularAcceleration * Math.sign(snapshot.angularVelocity)
  }

  const nextAngularVelocity = snapshot.angularVelocity + netAngularAcceleration * dt
  const crossedZeroWhileFrictionDominated =
    Math.sign(snapshot.angularVelocity) !== 0 &&
    Math.sign(nextAngularVelocity) !== Math.sign(snapshot.angularVelocity) &&
    Math.abs(driveAngularAcceleration) <= frictionAngularAcceleration

  snapshot.angularVelocity = crossedZeroWhileFrictionDominated ? 0 : nextAngularVelocity
  snapshot.angle += snapshot.angularVelocity * dt

  return Math.abs(snapshot.angularVelocity) > cardSwingPhysics.angularVelocitySwitchEpsilon
}
