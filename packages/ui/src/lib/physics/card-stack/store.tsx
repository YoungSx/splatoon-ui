'use client'

import * as React from 'react'

import {
  applyCardAngularImpulse,
  cloneSceneSnapshot,
  createCardState,
  createCardSwingGeometry,
  getReferenceCardState,
  integrateCardState,
  type CardStackCarouselCardState,
  type CardStackCarouselSceneSnapshot,
  type CardStackCarouselSupportSnapshot,
  type CardSwingGeometry,
} from '@/lib/physics/card-stack/core'
import {
  defaultSupportMotionProfile,
  describeSupportMotionDriver,
  sampleSupportMotion,
  startSupportMotion,
  type SupportMotionProfile,
  type SupportMotionState,
} from '@/lib/physics/card-stack/support-driver'

export type CardStackCarouselPhysicsStore = {
  getSnapshot: () => CardStackCarouselSceneSnapshot
  registerCardMetrics: (
    cardId: string,
    metrics: Pick<CardSwingGeometry, 'cardWidthPx' | 'cardHeightPx' | 'hangerYPx' | 'pitchPx'>
  ) => void
  applyCardImpulse: (cardId: string, angularVelocityDelta: number) => void
  setTargetIndex: (index: number) => void
  subscribe: (listener: () => void) => () => void
}

export const CardStackCarouselPhysicsContext =
  React.createContext<CardStackCarouselPhysicsStore | null>(null)

export function useCardStackCarouselPhysicsStore() {
  const context = React.useContext(CardStackCarouselPhysicsContext)

  if (!context) {
    throw new Error('Card stack carousel physics must be used within CardStackCarouselScene')
  }

  return context
}

function getNow() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

export function resolveCardId(index: number) {
  return String(index)
}

const INITIALIZED_SUPPORT_TIMESTAMP_MS = 1

export function createInitialSceneSnapshot(
  fallbackGeometry: CardSwingGeometry,
  startingIndex = 0
): CardStackCarouselSceneSnapshot {
  const initialPositionPx = startingIndex * fallbackGeometry.pitchPx
  const zeroSupportSnapshot: CardStackCarouselSupportSnapshot = {
    positionPx: initialPositionPx,
    velocityPxPerSecond: 0,
    accelerationPxPerSecondSquared: 0,
    targetPositionPx: initialPositionPx,
    pitchPx: fallbackGeometry.pitchPx,
    lastUpdatedAt: INITIALIZED_SUPPORT_TIMESTAMP_MS,
  }

  return {
    support: zeroSupportSnapshot,
    cards: {},
  }
}

export function createZeroCardState(
  fallbackGeometry: CardSwingGeometry
): CardStackCarouselCardState {
  return createCardState({
    geometry: fallbackGeometry,
  })
}

function updateSceneSnapshot(
  scene: CardStackCarouselSceneSnapshot,
  now: number,
  supportMotionActive: boolean
) {
  let swingMoving = false

  for (const state of Object.values(scene.cards)) {
    swingMoving = integrateCardState(state, scene.support, now) || swingMoving
  }

  return supportMotionActive || swingMoving
}

export function useCreateCardStackCarouselScene({
  fallbackGeometry,
  startingIndex = 0,
  supportMotionProfile = defaultSupportMotionProfile,
}: {
  fallbackGeometry: CardSwingGeometry
  startingIndex?: number
  supportMotionProfile?: SupportMotionProfile
}) {
  const animationFrameRef = React.useRef<number | null>(null)
  const sceneSnapshotRef = React.useRef<CardStackCarouselSceneSnapshot>(
    cloneSceneSnapshot(createInitialSceneSnapshot(fallbackGeometry, startingIndex))
  )
  const publishedSnapshotRef = React.useRef<CardStackCarouselSceneSnapshot>(
    cloneSceneSnapshot(createInitialSceneSnapshot(fallbackGeometry, startingIndex))
  )
  const listenersRef = React.useRef(new Set<() => void>())
  const supportMotionStateRef = React.useRef<SupportMotionState | null>(null)

  const publishSceneState = React.useCallback(() => {
    publishedSnapshotRef.current = cloneSceneSnapshot(sceneSnapshotRef.current)

    for (const listener of listenersRef.current) {
      listener()
    }
  }, [])

  const syncSupportKinematics = React.useCallback(
    (now: number) => {
      const activeMotion = supportMotionStateRef.current

      if (!activeMotion) {
        sceneSnapshotRef.current.support.velocityPxPerSecond = 0
        sceneSnapshotRef.current.support.accelerationPxPerSecondSquared = 0
        sceneSnapshotRef.current.support.lastUpdatedAt = now
        return false
      }

      const sample = sampleSupportMotion(activeMotion, supportMotionProfile, now)

      sceneSnapshotRef.current.support.positionPx = sample.positionPx
      sceneSnapshotRef.current.support.velocityPxPerSecond = sample.velocityPxPerSecond
      sceneSnapshotRef.current.support.accelerationPxPerSecondSquared =
        sample.accelerationPxPerSecondSquared
      sceneSnapshotRef.current.support.lastUpdatedAt = now

      if (sample.done) {
        supportMotionStateRef.current = null
      }

      return !sample.done
    },
    [supportMotionProfile]
  )

  const stopPhysicsLoop = React.useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const stepPhysics = React.useCallback(
    function stepPhysicsFrame(now: number) {
      const supportMotionActive = syncSupportKinematics(now)
      const hasMeaningfulMotion = updateSceneSnapshot(
        sceneSnapshotRef.current,
        now,
        supportMotionActive
      )
      publishSceneState()

      if (hasMeaningfulMotion) {
        animationFrameRef.current = window.requestAnimationFrame(stepPhysicsFrame)
      } else {
        animationFrameRef.current = null
      }
    },
    [publishSceneState, syncSupportKinematics]
  )

  const startPhysicsLoop = React.useCallback(() => {
    if (typeof window === 'undefined' || animationFrameRef.current !== null) return
    animationFrameRef.current = window.requestAnimationFrame(stepPhysics)
  }, [stepPhysics])

  const store = React.useMemo<CardStackCarouselPhysicsStore>(
    () => ({
      getSnapshot: () => publishedSnapshotRef.current,
      registerCardMetrics: (cardId, metrics) => {
        const nextGeometry = createCardSwingGeometry(metrics)
        const currentCard = sceneSnapshotRef.current.cards[cardId]
        const pitchRatio =
          sceneSnapshotRef.current.support.pitchPx > 0
            ? nextGeometry.pitchPx / sceneSnapshotRef.current.support.pitchPx
            : 1
        const pitchChanged =
          Math.abs(sceneSnapshotRef.current.support.pitchPx - nextGeometry.pitchPx) > 0.5
        const geometryChanged =
          !currentCard ||
          Math.abs(currentCard.geometry.cardWidthPx - nextGeometry.cardWidthPx) > 0.5 ||
          Math.abs(currentCard.geometry.cardHeightPx - nextGeometry.cardHeightPx) > 0.5 ||
          Math.abs(currentCard.geometry.hangerYPx - nextGeometry.hangerYPx) > 0.5 ||
          Math.abs(currentCard.geometry.pitchPx - nextGeometry.pitchPx) > 0.5

        if (!geometryChanged && !pitchChanged) return

        if (pitchChanged) {
          sceneSnapshotRef.current.support.positionPx *= pitchRatio
          sceneSnapshotRef.current.support.targetPositionPx *= pitchRatio
          sceneSnapshotRef.current.support.velocityPxPerSecond *= pitchRatio
          sceneSnapshotRef.current.support.accelerationPxPerSecondSquared *= pitchRatio
          sceneSnapshotRef.current.support.pitchPx = nextGeometry.pitchPx

          if (supportMotionStateRef.current) {
            supportMotionStateRef.current = {
              ...supportMotionStateRef.current,
              fromPositionPx: supportMotionStateRef.current.fromPositionPx * pitchRatio,
              targetPositionPx: supportMotionStateRef.current.targetPositionPx * pitchRatio,
              initialVelocityPxPerSecond:
                supportMotionStateRef.current.initialVelocityPxPerSecond * pitchRatio,
              initialAccelerationPxPerSecondSquared:
                supportMotionStateRef.current.initialAccelerationPxPerSecondSquared * pitchRatio,
            }
          }
        }

        const seedState =
          currentCard ?? getReferenceCardState(sceneSnapshotRef.current.cards, cardId)

        sceneSnapshotRef.current.cards[cardId] = createCardState({
          geometry: nextGeometry,
          lastUpdatedAt:
            currentCard?.lastUpdatedAt ??
            seedState?.lastUpdatedAt ??
            sceneSnapshotRef.current.support.lastUpdatedAt,
          seedState,
        })

        publishSceneState()
      },
      applyCardImpulse: (cardId, angularVelocityDelta) => {
        const cardState = sceneSnapshotRef.current.cards[cardId]
        if (!cardState) return

        const now = getNow()
        const supportMotionActive = syncSupportKinematics(now)
        updateSceneSnapshot(sceneSnapshotRef.current, now, supportMotionActive)

        applyCardAngularImpulse(cardState, angularVelocityDelta)
        publishSceneState()
        startPhysicsLoop()
      },
      setTargetIndex: (index) => {
        const targetPositionPx = index * sceneSnapshotRef.current.support.pitchPx
        if (Math.abs(sceneSnapshotRef.current.support.targetPositionPx - targetPositionPx) < 0.001)
          return

        const now = getNow()

        if (sceneSnapshotRef.current.support.lastUpdatedAt === 0) {
          sceneSnapshotRef.current.support.targetPositionPx = targetPositionPx
          sceneSnapshotRef.current.support.positionPx = targetPositionPx
          sceneSnapshotRef.current.support.velocityPxPerSecond = 0
          sceneSnapshotRef.current.support.accelerationPxPerSecondSquared = 0
          sceneSnapshotRef.current.support.lastUpdatedAt = now

          for (const state of Object.values(sceneSnapshotRef.current.cards)) {
            state.angle = 0
            state.angularVelocity = 0
            state.lastUpdatedAt = now
          }

          publishSceneState()
          return
        }

        const supportMotionActive = syncSupportKinematics(now)
        updateSceneSnapshot(sceneSnapshotRef.current, now, supportMotionActive)
        sceneSnapshotRef.current.support.targetPositionPx = targetPositionPx
        sceneSnapshotRef.current.support.lastUpdatedAt = now
        supportMotionStateRef.current = startSupportMotion({
          driver: supportMotionProfile.driver,
          fromPositionPx: sceneSnapshotRef.current.support.positionPx,
          targetPositionPx,
          initialVelocityPxPerSecond: sceneSnapshotRef.current.support.velocityPxPerSecond,
          initialAccelerationPxPerSecondSquared:
            sceneSnapshotRef.current.support.accelerationPxPerSecondSquared,
          startedAt: now,
        })
        publishSceneState()
        startPhysicsLoop()
      },
      subscribe: (listener) => {
        listenersRef.current.add(listener)
        return () => {
          listenersRef.current.delete(listener)
        }
      },
    }),
    [publishSceneState, startPhysicsLoop, supportMotionProfile.driver, syncSupportKinematics]
  )

  const sceneSnapshot = React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  )

  React.useEffect(() => {
    return () => {
      supportMotionStateRef.current = null
      stopPhysicsLoop()
    }
  }, [stopPhysicsLoop])

  return {
    sceneSnapshot,
    store,
    supportDriverLabel: describeSupportMotionDriver(supportMotionProfile.driver),
  }
}

export function getCardState(
  scene: CardStackCarouselSceneSnapshot,
  cardId: string,
  fallbackCardState: CardStackCarouselCardState
) {
  return scene.cards[cardId] ?? fallbackCardState
}

export function getPrimaryCardState(
  scene: CardStackCarouselSceneSnapshot,
  fallbackCardState: CardStackCarouselCardState
) {
  return Object.values(scene.cards)[0] ?? fallbackCardState
}
