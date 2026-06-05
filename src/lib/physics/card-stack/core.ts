"use client"

import { cardStackPhysicsTuning, cardStackRuntimeTuning } from "@/lib/physics/card-stack/tuning"

export const cardSwingPhysics = {
  ...cardStackPhysicsTuning,
} as const

export type CardSwingGeometry = {
  cardWidthPx: number
  cardHeightPx: number
  hangerYPx: number
  pitchPx: number
  cardMassKilograms: number
  centerDistancePx: number
  momentOfInertiaKgPx2: number
  restoringTorqueCoefficient: number
  forcingTorqueCoefficient: number
}

export type CardStackCarouselSupportSnapshot = {
  positionPx: number
  velocityPxPerSecond: number
  accelerationPxPerSecondSquared: number
  targetPositionPx: number
  pitchPx: number
  lastUpdatedAt: number
}

export type CardStackCarouselCardState = {
  angle: number
  angularVelocity: number
  geometry: CardSwingGeometry
  lastUpdatedAt: number
}

export type CardStackCarouselSceneSnapshot = {
  support: CardStackCarouselSupportSnapshot
  cards: Record<string, CardStackCarouselCardState>
}

const gravityPxPerSecondSquared =
  cardSwingPhysics.simulationPixelsPerMeter * cardSwingPhysics.gravityMetersPerSecondSquared

export function createCardSwingGeometry({
  cardWidthPx,
  cardHeightPx,
  hangerYPx,
  pitchPx,
}: Pick<CardSwingGeometry, "cardWidthPx" | "cardHeightPx" | "hangerYPx" | "pitchPx">): CardSwingGeometry {
  const cardMassKilograms = cardSwingPhysics.cardMassKilograms
  const centerDistancePx = Math.max(cardHeightPx / 2 - hangerYPx, 1)
  const inertiaOverMassPx2 =
    (cardWidthPx * cardWidthPx + cardHeightPx * cardHeightPx) / 12 + centerDistancePx * centerDistancePx
  const momentOfInertiaKgPx2 = cardMassKilograms * inertiaOverMassPx2

  return {
    cardWidthPx,
    cardHeightPx,
    hangerYPx,
    pitchPx,
    cardMassKilograms,
    centerDistancePx,
    momentOfInertiaKgPx2,
    restoringTorqueCoefficient: cardMassKilograms * gravityPxPerSecondSquared * centerDistancePx,
    forcingTorqueCoefficient: cardMassKilograms * centerDistancePx,
  }
}

export function createCardState({
  geometry,
  lastUpdatedAt = 0,
  seedState,
}: {
  geometry: CardSwingGeometry
  lastUpdatedAt?: number
  seedState?: Pick<CardStackCarouselCardState, "angle" | "angularVelocity">
}): CardStackCarouselCardState {
  return {
    angle: seedState?.angle ?? 0,
    angularVelocity: seedState?.angularVelocity ?? 0,
    geometry,
    lastUpdatedAt,
  }
}

export function cloneCardState(state: CardStackCarouselCardState): CardStackCarouselCardState {
  return {
    angle: state.angle,
    angularVelocity: state.angularVelocity,
    geometry: {
      ...state.geometry,
    },
    lastUpdatedAt: state.lastUpdatedAt,
  }
}

export function cloneSceneSnapshot(scene: CardStackCarouselSceneSnapshot): CardStackCarouselSceneSnapshot {
  return {
    support: {
      ...scene.support,
    },
    cards: Object.fromEntries(Object.entries(scene.cards).map(([cardId, state]) => [cardId, cloneCardState(state)])),
  }
}

export function getReferenceCardState(
  cards: Record<string, CardStackCarouselCardState>,
  excludedCardId?: string
): CardStackCarouselCardState | null {
  for (const [cardId, state] of Object.entries(cards)) {
    if (cardId !== excludedCardId) {
      return state
    }
  }

  return null
}

function resolveDriveAngularAcceleration(
  state: CardStackCarouselCardState,
  support: CardStackCarouselSupportSnapshot
) {
  const gravityTorque = -Math.sin(state.angle) * state.geometry.restoringTorqueCoefficient
  const supportTorque =
    -Math.cos(state.angle) * state.geometry.forcingTorqueCoefficient * support.accelerationPxPerSecondSquared

  return (gravityTorque + supportTorque) / state.geometry.momentOfInertiaKgPx2
}

function resolveCoulombFrictionAngularAcceleration(state: CardStackCarouselCardState) {
  const frictionTorque =
    cardSwingPhysics.pivotCoulombFrictionSpecificTorquePx2PerSecondSquared * state.geometry.cardMassKilograms

  return frictionTorque / state.geometry.momentOfInertiaKgPx2
}

function resolveAirDragAngularAcceleration(state: CardStackCarouselCardState) {
  const airDragTorque =
    -cardSwingPhysics.airAngularDragCoefficientPerSecond *
    state.geometry.momentOfInertiaKgPx2 *
    state.angularVelocity

  return airDragTorque / state.geometry.momentOfInertiaKgPx2
}

export function integrateCardState(
  state: CardStackCarouselCardState,
  support: CardStackCarouselSupportSnapshot,
  now: number
) {
  const dt = Math.min(Math.max((now - state.lastUpdatedAt) / 1000, 0), cardStackRuntimeTuning.maxDeltaSeconds)
  state.lastUpdatedAt = now

  const driveAngularAcceleration = resolveDriveAngularAcceleration(state, support)
  const airDragAngularAcceleration = resolveAirDragAngularAcceleration(state)
  const frictionAngularAcceleration = resolveCoulombFrictionAngularAcceleration(state)
  const isEffectivelyStill = Math.abs(state.angularVelocity) <= cardSwingPhysics.angularVelocitySwitchEpsilon

  let netAngularAcceleration = driveAngularAcceleration + airDragAngularAcceleration

  if (isEffectivelyStill) {
    if (Math.abs(driveAngularAcceleration) <= frictionAngularAcceleration) {
      state.angularVelocity = 0
      return false
    }

    netAngularAcceleration -= frictionAngularAcceleration * Math.sign(driveAngularAcceleration)
  } else {
    netAngularAcceleration -= frictionAngularAcceleration * Math.sign(state.angularVelocity)
  }

  const nextAngularVelocity = state.angularVelocity + netAngularAcceleration * dt
  const crossedZeroWhileFrictionDominated =
    Math.sign(state.angularVelocity) !== 0 &&
    Math.sign(nextAngularVelocity) !== Math.sign(state.angularVelocity) &&
    Math.abs(driveAngularAcceleration) <= frictionAngularAcceleration

  state.angularVelocity = crossedZeroWhileFrictionDominated ? 0 : nextAngularVelocity
  state.angle += state.angularVelocity * dt

  return Math.abs(state.angularVelocity) > cardSwingPhysics.angularVelocitySwitchEpsilon
}

export function applyCardAngularImpulse(state: CardStackCarouselCardState, angularVelocityDelta: number) {
  state.angularVelocity += angularVelocityDelta
}
