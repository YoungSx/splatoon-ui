"use client"

import * as React from "react"
import {
  useMotionValue,
  type AnimationPlaybackControls,
} from "framer-motion"

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
} from "@/lib/physics/card-stack/core"
import {
  defaultSupportMotionProfile,
  describeSupportMotionDriver,
  startSupportAnimation,
  type SupportMotionProfile,
} from "@/lib/physics/card-stack/support-driver"
import { cardStackRuntimeTuning } from "@/lib/physics/card-stack/tuning"

export type CardStackCarouselPhysicsStore = {
  getSnapshot: () => CardStackCarouselSceneSnapshot
  registerCardMetrics: (
    cardId: string,
    metrics: Pick<CardSwingGeometry, "cardWidthPx" | "cardHeightPx" | "hangerYPx" | "pitchPx">
  ) => void
  applyCardImpulse: (cardId: string, angularVelocityDelta: number) => void
  setTargetIndex: (index: number) => void
  subscribe: (listener: () => void) => () => void
}

export const CardStackCarouselPhysicsContext = React.createContext<CardStackCarouselPhysicsStore | null>(null)

export function useCardStackCarouselPhysicsStore() {
  const context = React.useContext(CardStackCarouselPhysicsContext)

  if (!context) {
    throw new Error("Card stack carousel physics must be used within CardStackCarouselScene")
  }

  return context
}

function getNow() {
  return typeof performance !== "undefined" ? performance.now() : Date.now()
}

export function resolveCardId(index: number) {
  return String(index)
}

export function createZeroSceneSnapshot(fallbackGeometry: CardSwingGeometry): CardStackCarouselSceneSnapshot {
  const zeroSupportSnapshot: CardStackCarouselSupportSnapshot = {
    positionPx: 0,
    velocityPxPerSecond: 0,
    accelerationPxPerSecondSquared: 0,
    targetPositionPx: 0,
    pitchPx: fallbackGeometry.pitchPx,
    lastUpdatedAt: 0,
  }

  return {
    support: zeroSupportSnapshot,
    cards: {},
  }
}

export function createZeroCardState(fallbackGeometry: CardSwingGeometry): CardStackCarouselCardState {
  return createCardState({
    geometry: fallbackGeometry,
  })
}

function updateSceneSnapshot(scene: CardStackCarouselSceneSnapshot, now: number, supportMotionProfile: SupportMotionProfile) {
  let swingMoving = false

  for (const state of Object.values(scene.cards)) {
    swingMoving = integrateCardState(state, scene.support, now) || swingMoving
  }

  const supportMoving =
    Math.abs(scene.support.velocityPxPerSecond) >= supportMotionProfile.settleVelocityEpsilonPxPerSecond ||
    Math.abs(scene.support.targetPositionPx - scene.support.positionPx) >= supportMotionProfile.settlePositionEpsilonPx

  return supportMoving || swingMoving
}

export function useCreateCardStackCarouselScene({
  fallbackGeometry,
  supportMotionProfile = defaultSupportMotionProfile,
}: {
  fallbackGeometry: CardSwingGeometry
  supportMotionProfile?: SupportMotionProfile
}) {
  const animationFrameRef = React.useRef<number | null>(null)
  const sceneSnapshotRef = React.useRef<CardStackCarouselSceneSnapshot>(
    cloneSceneSnapshot(createZeroSceneSnapshot(fallbackGeometry))
  )
  const publishedSnapshotRef = React.useRef<CardStackCarouselSceneSnapshot>(
    cloneSceneSnapshot(createZeroSceneSnapshot(fallbackGeometry))
  )
  const listenersRef = React.useRef(new Set<() => void>())
  const supportPositionPxMotion = useMotionValue(0)
  const supportAnimationRef = React.useRef<AnimationPlaybackControls | null>(null)

  const publishSceneState = React.useCallback(() => {
    publishedSnapshotRef.current = cloneSceneSnapshot(sceneSnapshotRef.current)

    for (const listener of listenersRef.current) {
      listener()
    }
  }, [])

  const syncSupportKinematicsFromMotion = React.useCallback(
    (now: number) => {
      const previousVelocity = sceneSnapshotRef.current.support.velocityPxPerSecond
      const nextPosition = supportPositionPxMotion.get()
      const nextVelocity = supportPositionPxMotion.getVelocity()
      const dt = Math.min(
        Math.max((now - sceneSnapshotRef.current.support.lastUpdatedAt) / 1000, 0),
        cardStackRuntimeTuning.maxDeltaSeconds
      )

      sceneSnapshotRef.current.support.positionPx = nextPosition
      sceneSnapshotRef.current.support.velocityPxPerSecond = nextVelocity
      sceneSnapshotRef.current.support.accelerationPxPerSecondSquared = dt > 0 ? (nextVelocity - previousVelocity) / dt : 0
      sceneSnapshotRef.current.support.lastUpdatedAt = now
    },
    [supportPositionPxMotion]
  )

  const stopPhysicsLoop = React.useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const stepPhysics = React.useCallback(
    function stepPhysicsFrame(now: number) {
      syncSupportKinematicsFromMotion(now)
      const hasMeaningfulMotion = updateSceneSnapshot(sceneSnapshotRef.current, now, supportMotionProfile)
      publishSceneState()

      if (hasMeaningfulMotion) {
        animationFrameRef.current = window.requestAnimationFrame(stepPhysicsFrame)
      } else {
        animationFrameRef.current = null
      }
    },
    [publishSceneState, supportMotionProfile, syncSupportKinematicsFromMotion]
  )

  const startPhysicsLoop = React.useCallback(() => {
    if (typeof window === "undefined" || animationFrameRef.current !== null) return
    animationFrameRef.current = window.requestAnimationFrame(stepPhysics)
  }, [stepPhysics])

  const store = React.useMemo<CardStackCarouselPhysicsStore>(
    () => ({
      getSnapshot: () => publishedSnapshotRef.current,
      registerCardMetrics: (cardId, metrics) => {
        const nextGeometry = createCardSwingGeometry(metrics)
        const currentCard = sceneSnapshotRef.current.cards[cardId]
        const pitchRatio =
          sceneSnapshotRef.current.support.pitchPx > 0 ? nextGeometry.pitchPx / sceneSnapshotRef.current.support.pitchPx : 1
        const pitchChanged = Math.abs(sceneSnapshotRef.current.support.pitchPx - nextGeometry.pitchPx) > 0.5
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
          supportPositionPxMotion.set(sceneSnapshotRef.current.support.positionPx)
        }

        const seedState = currentCard ?? getReferenceCardState(sceneSnapshotRef.current.cards, cardId)

        sceneSnapshotRef.current.cards[cardId] = createCardState({
          geometry: nextGeometry,
          lastUpdatedAt: currentCard?.lastUpdatedAt ?? seedState?.lastUpdatedAt ?? sceneSnapshotRef.current.support.lastUpdatedAt,
          seedState,
        })

        publishSceneState()
      },
      applyCardImpulse: (cardId, angularVelocityDelta) => {
        const cardState = sceneSnapshotRef.current.cards[cardId]
        if (!cardState) return

        const now = getNow()
        syncSupportKinematicsFromMotion(now)
        updateSceneSnapshot(sceneSnapshotRef.current, now, supportMotionProfile)

        applyCardAngularImpulse(cardState, angularVelocityDelta)
        publishSceneState()
        startPhysicsLoop()
      },
      setTargetIndex: (index) => {
        const targetPositionPx = index * sceneSnapshotRef.current.support.pitchPx
        if (Math.abs(sceneSnapshotRef.current.support.targetPositionPx - targetPositionPx) < 0.001) return

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

          supportPositionPxMotion.set(targetPositionPx)
          publishSceneState()
          return
        }

        syncSupportKinematicsFromMotion(now)
        updateSceneSnapshot(sceneSnapshotRef.current, now, supportMotionProfile)
        sceneSnapshotRef.current.support.targetPositionPx = targetPositionPx
        sceneSnapshotRef.current.support.lastUpdatedAt = now
        supportAnimationRef.current?.stop()
        supportAnimationRef.current = startSupportAnimation(
          supportPositionPxMotion,
          targetPositionPx,
          supportMotionProfile.driver
        )
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
    [publishSceneState, startPhysicsLoop, supportMotionProfile, supportPositionPxMotion, syncSupportKinematicsFromMotion]
  )

  const sceneSnapshot = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  React.useEffect(() => {
    return () => {
      supportAnimationRef.current?.stop()
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
