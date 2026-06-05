"use client"

// Card swing layer: these parameters feed the hanging-card rigid-body solver itself.
// If motion changes here, it is the card pendulum dynamics changing.
export const cardStackPhysicsTuning = {
  // Common daily tuning knobs: start here when you want to change how the cards feel.
  // These parameters are the ones you'll most likely tweak while iterating on motion.
  // Gravity acceleration used by the rigid-body solver before conversion into pixel units.
  // Increase: faster, stronger return toward equilibrium. Decrease: looser, slower swing.
  gravityMetersPerSecondSquared: 9.80665,
  // Rigid-body mass of one hanging card. Ideal gravity/support drive mostly cancel this out;
  // dissipation terms feel it through inertia.
  // Increase: more inertia, so the same dissipative torques slow it less. Decrease: easier to damp out.
  cardMassKilograms: 5,
  // Linear air-drag torque coefficient in tau = -c * omega.
  // Increase: faster decay while moving, shorter tail. Decrease: freer motion, longer oscillation.
  airAngularDragTorqueCoefficientKgPx2PerSecond: 1123333.3333333335,
  // Load-dependent dry friction coefficient at the pivot. Multiplied by the pivot radial load proxy.
  // Increase: more load-driven dry friction, steadier but more likely to stop at a slight tilt. Decrease: less static sticking.
  pivotLoadFrictionTorquePerUnitNormalPx: 0.0005098581064889644,
  // Viscous friction torque coefficient at the pivot in tau = -c * omega.
  // Increase: smoother velocity-proportional damping without as much hard lock. Decrease: less pivot damping.
  pivotViscousFrictionTorqueCoefficientKgPx2PerSecond: 0,

  // Advanced/model-scale tuning below this line. Change these only when you want to alter solver scale or lock behavior.
  // Simulation scale factor that maps 1 meter in the model to this many CSS pixels.
  // Increase: stronger effective gravity/drive in pixel space. Decrease: softer, slower response.
  simulationPixelsPerMeter: 5000,
  // Mass-independent dry friction torque at the pivot. This creates a true lock zone even with zero load.
  // Increase: easier small-angle lock/stick, stronger dead-zone feel. Decrease: less tendency to freeze off-center.
  pivotConstantFrictionTorqueKgPx2PerSecondSquared: 0,
  // Engineering epsilon for deciding when angular velocity is close enough to zero to test static lock.
  // Increase: enters near-rest/static-lock checks sooner. Decrease: requires a truer near-zero velocity before treating it as settled.
  angularVelocitySwitchEpsilon: 0.0005,
} as const

// Support input layer: these parameters shape how the invisible support/pivot moves.
// If motion changes here, it is the external shove/retarget curve changing before the card physics even reacts.
export const cardStackSupportDriverTuning = {
  easeInBack: {
    // Total support motion duration for the easeInBack driver.
    // Increase: longer support travel time, more drawn-out shove. Decrease: snappier support motion.
    durationSeconds: 0.72,
    // Standard easeInBack overshoot amount; larger values create a stronger backward wind-up.
    // Increase: more reverse wind-up before release. Decrease: straighter, less theatrical launch.
    overshoot: 1.70158,
    // Human-readable label used for diagnostics/UI.
    label: "easeInBack",
  },
  gentleSpring: {
    // Spring stiffness for the alternative support driver.
    // Increase: stronger spring pull, faster snap toward target. Decrease: softer spring response.
    stiffness: 14,
    // Spring damping for the alternative support driver.
    // Increase: less overshoot, quicker settling. Decrease: bouncier spring motion.
    damping: 11,
    // Virtual mass for the alternative support spring driver.
    // Increase: heavier spring body, slower response. Decrease: lighter, more reactive spring response.
    mass: 1.9,
  },
  // Velocity threshold below which support motion is considered settled.
  // Increase: support is declared settled earlier. Decrease: waits for a cleaner stop.
  settleVelocityEpsilonPxPerSecond: 2,
  // Position threshold below which support motion is considered settled.
  // Increase: support is declared settled with more positional slack. Decrease: stricter target convergence.
  settlePositionEpsilonPx: 0.75,
} as const

// Runtime integration layer: engineering stability knobs for the per-frame solver.
export const cardStackRuntimeTuning = {
  // Maximum simulation step size. Larger frame gaps are clamped to this for stability.
  // Increase: less clamping, potentially less stable under frame drops. Decrease: more stable but less faithful to very large frame gaps.
  maxDeltaSeconds: 1 / 30,
} as const

// Layout/presentation layer: scene geometry and interaction thresholds, not physical forces.
export const cardStackLayoutTuning = {
  // Minimum scene height reserved for the carousel section.
  // Increase: taller reserved stage. Decrease: more compact section height.
  minHeightPx: 500,
  // CSS perspective distance for the overlapping card stack.
  // Increase: flatter/weaker perspective. Decrease: stronger perspective distortion.
  perspectivePx: 1200,
  // Previous/next navigation button width.
  // Increase: wider nav hit area. Decrease: narrower button footprint.
  navButtonWidthPx: 64,
  // Previous/next navigation button height.
  // Increase: taller nav hit area. Decrease: shorter button footprint.
  navButtonHeightPx: 80,
  // Indicator pill width.
  // Increase: wider indicators. Decrease: tighter indicator pills.
  indicatorWidthPx: 32,
  // Indicator pill height.
  // Increase: thicker indicators. Decrease: slimmer indicators.
  indicatorHeightPx: 12,
  // Maximum signed card offset that stays mounted as a primary visible neighbor.
  // Increase: more neighboring cards stay visibly active. Decrease: tighter visible stack.
  visibleOffsetLimit: 2,
  // Extra buffer before cards are treated as fully out of the active visible window.
  // Increase: cards linger longer near the visible boundary. Decrease: cards drop out of the active window sooner.
  visibleOffsetBuffer: 0.6,
  // Horizontal spacing multiplier between neighboring cards in the deck.
  // Increase: cards spread farther apart. Decrease: cards overlap more tightly.
  deckStepWidthMultiplier: 1.08,
  // Fallback measured card width before real DOM metrics are registered.
  // Increase: larger provisional card width before measurement. Decrease: smaller provisional width.
  fallbackCardWidthPx: 320,
  // Fallback measured card height before real DOM metrics are registered.
  // Increase: larger provisional card height before measurement. Decrease: smaller provisional height.
  fallbackCardHeightPx: 360,
  // Fallback vertical pivot position used before real DOM metrics are registered.
  // Increase: pivot sits lower in provisional geometry. Decrease: pivot sits higher.
  fallbackHangerYPx: 20,
  // Drag distance threshold required to trigger a swipe navigation.
  // Increase: harder to trigger swipe by distance. Decrease: easier to trigger.
  swipeOffsetThresholdPx: 50,
  // Drag power threshold required to trigger a swipe navigation.
  // Increase: requires a stronger flick. Decrease: lighter flicks can navigate.
  swipePowerThreshold: 500,
} as const
