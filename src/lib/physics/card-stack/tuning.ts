"use client"

export const cardStackPhysicsTuning = {
  simulationPixelsPerMeter: 1000,
  gravityMetersPerSecondSquared: 9.80665,
  pivotCoulombFrictionSpecificTorquePx2PerSecondSquared: 42000,
  angularVelocitySwitchEpsilon: 0.0005,
} as const

export const cardStackSupportDriverTuning = {
  easeInBack: {
    durationSeconds: 0.72,
    overshoot: 1.70158,
    label: "easeInBack",
  },
  gentleSpring: {
    stiffness: 14,
    damping: 11,
    mass: 1.9,
  },
  settleVelocityEpsilonPxPerSecond: 2,
  settlePositionEpsilonPx: 0.75,
} as const

export const cardStackLayoutTuning = {
  minHeightPx: 500,
  navButtonWidthPx: 64,
  navButtonHeightPx: 80,
  indicatorWidthPx: 32,
  indicatorHeightPx: 12,
  visibleOffsetLimit: 2,
  deckStepWidthMultiplier: 1.08,
  fallbackCardWidthPx: 320,
  fallbackCardHeightPx: 360,
  fallbackHangerYPx: 20,
} as const
