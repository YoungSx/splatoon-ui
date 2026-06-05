"use client"

import * as React from "react"
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
  type HTMLMotionProps,
  type PanInfo,
} from "framer-motion"

import { CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel"
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
} from "@/components/ui/card-stack-carousel.physics"
import { cn } from "@/lib/utils"

const cardStackLayout = {
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

function easeInBack(progress: number) {
  const overshoot = 1.70158
  const coefficient = overshoot + 1
  return coefficient * progress * progress * progress - overshoot * progress * progress
}

type SupportMotionDriver =
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

const supportMotionProfile = {
  driver: {
    kind: "curve",
    durationSeconds: 0.72,
    ease: easeInBack,
    label: "easeInBack",
  } satisfies SupportMotionDriver,
  settleVelocityEpsilonPxPerSecond: 2,
  settlePositionEpsilonPx: 0.75,
} as const

type CardStackCarouselPhysicsStore = {
  getSnapshot: () => CardStackCarouselSceneSnapshot
  registerCardMetrics: (
    cardId: string,
    metrics: Pick<CardSwingGeometry, "cardWidthPx" | "cardHeightPx" | "hangerYPx" | "pitchPx">
  ) => void
  applyCardImpulse: (cardId: string, angularVelocityDelta: number) => void
  setTargetIndex: (index: number) => void
  subscribe: (listener: () => void) => () => void
}

const FALLBACK_GEOMETRY: CardSwingGeometry = createCardSwingGeometry({
  cardWidthPx: cardStackLayout.fallbackCardWidthPx,
  cardHeightPx: cardStackLayout.fallbackCardHeightPx,
  hangerYPx: cardStackLayout.fallbackHangerYPx,
  pitchPx: cardStackLayout.fallbackCardWidthPx * cardStackLayout.deckStepWidthMultiplier,
})

const ZERO_CARD_STATE: CardStackCarouselCardState = createCardState({
  geometry: FALLBACK_GEOMETRY,
})

const ZERO_SUPPORT_SNAPSHOT: CardStackCarouselSupportSnapshot = {
  positionPx: 0,
  velocityPxPerSecond: 0,
  accelerationPxPerSecondSquared: 0,
  targetPositionPx: 0,
  pitchPx: FALLBACK_GEOMETRY.pitchPx,
  lastUpdatedAt: 0,
}

const ZERO_SCENE_SNAPSHOT: CardStackCarouselSceneSnapshot = {
  support: {
    ...ZERO_SUPPORT_SNAPSHOT,
  },
  cards: {},
}

const CardStackCarouselPhysicsContext = React.createContext<CardStackCarouselPhysicsStore | null>(null)

function useCardStackCarouselPhysicsStore() {
  const context = React.useContext(CardStackCarouselPhysicsContext)

  if (!context) {
    throw new Error("Card stack carousel physics must be used within CardStackCarouselScene")
  }

  return context
}

function getNow() {
  return typeof performance !== "undefined" ? performance.now() : Date.now()
}

function radiansToDegrees(value: number) {
  return value * (180 / Math.PI)
}

function resolveCardId(index: number) {
  return String(index)
}

function updateSceneSnapshot(scene: CardStackCarouselSceneSnapshot, now: number) {
  let swingMoving = false

  for (const state of Object.values(scene.cards)) {
    swingMoving = integrateCardState(state, scene.support, now) || swingMoving
  }

  const supportMoving =
    Math.abs(scene.support.velocityPxPerSecond) >= supportMotionProfile.settleVelocityEpsilonPxPerSecond ||
    Math.abs(scene.support.targetPositionPx - scene.support.positionPx) >= supportMotionProfile.settlePositionEpsilonPx

  return supportMoving || swingMoving
}

function getPrimaryCardState(scene: CardStackCarouselSceneSnapshot) {
  return Object.values(scene.cards)[0] ?? ZERO_CARD_STATE
}

function getCardState(scene: CardStackCarouselSceneSnapshot, cardId: string) {
  return scene.cards[cardId] ?? ZERO_CARD_STATE
}

function startSupportAnimation(
  supportPositionPxMotion: ReturnType<typeof useMotionValue<number>>,
  targetPositionPx: number,
  driver: SupportMotionDriver
) {
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

function describeSupportMotionDriver(driver: SupportMotionDriver) {
  return driver.kind === "curve" ? driver.label : "spring"
}

export function CardStackCarouselScene({ children }: { children: React.ReactNode }) {
  const animationFrameRef = React.useRef<number | null>(null)
  const sceneSnapshotRef = React.useRef<CardStackCarouselSceneSnapshot>(cloneSceneSnapshot(ZERO_SCENE_SNAPSHOT))
  const publishedSnapshotRef = React.useRef<CardStackCarouselSceneSnapshot>(cloneSceneSnapshot(ZERO_SCENE_SNAPSHOT))
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
      const dt = Math.min(Math.max((now - sceneSnapshotRef.current.support.lastUpdatedAt) / 1000, 0), 1 / 30)

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
      const hasMeaningfulMotion = updateSceneSnapshot(sceneSnapshotRef.current, now)
      publishSceneState()

      if (hasMeaningfulMotion) {
        animationFrameRef.current = window.requestAnimationFrame(stepPhysicsFrame)
      } else {
        animationFrameRef.current = null
      }
    },
    [publishSceneState, syncSupportKinematicsFromMotion]
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
        updateSceneSnapshot(sceneSnapshotRef.current, now)

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
        updateSceneSnapshot(sceneSnapshotRef.current, now)
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
    [publishSceneState, startPhysicsLoop, supportPositionPxMotion, syncSupportKinematicsFromMotion]
  )

  const sceneSnapshot = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const primaryCardState = getPrimaryCardState(sceneSnapshot)

  React.useEffect(() => {
    return () => {
      supportAnimationRef.current?.stop()
      stopPhysicsLoop()
    }
  }, [stopPhysicsLoop])

  return (
    <CardStackCarouselPhysicsContext.Provider value={store}>
      <div
        data-slot="card-stack-carousel-scene"
        data-card-count={Object.keys(sceneSnapshot.cards).length}
        data-support-driver={describeSupportMotionDriver(supportMotionProfile.driver)}
        data-shared-angle={radiansToDegrees(primaryCardState.angle).toFixed(4)}
        data-shared-velocity={radiansToDegrees(primaryCardState.angularVelocity).toFixed(4)}
        data-support-position={(sceneSnapshot.support.pitchPx > 0 ? sceneSnapshot.support.positionPx / sceneSnapshot.support.pitchPx : 0).toFixed(4)}
        data-support-velocity={(sceneSnapshot.support.pitchPx > 0 ? sceneSnapshot.support.velocityPxPerSecond / sceneSnapshot.support.pitchPx : 0).toFixed(4)}
      >
        {children}
      </div>
    </CardStackCarouselPhysicsContext.Provider>
  )
}

export const CardStackCarouselContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CarouselContent>
>(({ className, style, ...props }, ref) => {
  const { currentIndex } = useCarousel()
  const physicsStore = useCardStackCarouselPhysicsStore()

  React.useEffect(() => {
    physicsStore.setTargetIndex(currentIndex)
  }, [currentIndex, physicsStore])

  return (
    <CarouselContent
      ref={ref}
      className={cn("relative flex w-full items-center justify-center overflow-visible", className)}
      style={{
        minHeight: `${cardStackLayout.minHeightPx}px`,
        perspective: "1200px",
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...props}
    />
  )
})
CardStackCarouselContent.displayName = "CardStackCarouselContent"

export interface CardStackCarouselItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
  shellClassName?: string
  shellStyle?: React.CSSProperties
  "data-index"?: number
}

function resolveHangerYPx(element: HTMLElement) {
  const transformOrigin = getComputedStyle(element).transformOrigin.split(" ")
  const hangerYPx = Number.parseFloat(transformOrigin[1] ?? "")
  return Number.isFinite(hangerYPx) ? hangerYPx : cardStackLayout.fallbackHangerYPx
}

export const CardStackCarouselItem = React.forwardRef<HTMLDivElement, CardStackCarouselItemProps>(
  ({ className, children, shellClassName, shellStyle, style, "data-index": index = 0, ...props }, ref) => {
    const { currentIndex, goToIndex, goToNext, goToPrev } = useCarousel()
    const physicsStore = useCardStackCarouselPhysicsStore()
    const sceneSnapshot = React.useSyncExternalStore(physicsStore.subscribe, physicsStore.getSnapshot, physicsStore.getSnapshot)
    const swingRef = React.useRef<HTMLDivElement | null>(null)
    const cardId = resolveCardId(index)
    const cardState = getCardState(sceneSnapshot, cardId)

    const pitchPx = sceneSnapshot.support.pitchPx
    const cardAnchorPx = index * pitchPx
    const offsetPx = cardAnchorPx - sceneSnapshot.support.positionPx
    const continuousOffset = pitchPx > 0 ? offsetPx / pitchPx : 0
    const logicalOffset = index - currentIndex
    const isActive = logicalOffset === 0
    const isVisible = Math.abs(continuousOffset) <= cardStackLayout.visibleOffsetLimit + 0.6
    const opacity = isVisible ? 1 : 0
    const deckTranslateYPx = 0
    const deckScale = 1
    const deckRotateDeg = 0
    const deckZIndex = 50 - Math.round(Math.abs(continuousOffset))

    React.useEffect(() => {
      if (!swingRef.current) return

      const measure = () => {
        if (!swingRef.current) return
        const rect = swingRef.current.getBoundingClientRect()
        physicsStore.registerCardMetrics(cardId, {
          cardWidthPx: rect.width,
          cardHeightPx: rect.height,
          hangerYPx: resolveHangerYPx(swingRef.current),
          pitchPx: rect.width * cardStackLayout.deckStepWidthMultiplier,
        })
      }

      measure()

      if (typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(measure)
      observer.observe(swingRef.current)
      return () => observer.disconnect()
    }, [cardId, physicsStore])

    const navigateByDirection = React.useCallback(
      (direction: 1 | -1) => {
        if (direction === 1) {
          goToNext()
          return
        }
        goToPrev()
      },
      [goToNext, goToPrev]
    )

    const handleDragEnd = React.useCallback(
      (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipePower = Math.abs(info.offset.x) * info.velocity.x

        if (info.offset.x < -50 || swipePower < -500) {
          navigateByDirection(1)
          return
        }

        if (info.offset.x > 50 || swipePower > 500) {
          navigateByDirection(-1)
        }
      },
      [navigateByDirection]
    )

    return (
      <div
        data-slot="card-stack-item-shell"
        className={cn("pointer-events-none absolute inset-0 m-auto flex w-full items-center justify-center", shellClassName)}
        style={shellStyle}
      >
        <motion.div
          ref={ref}
          data-slot="card-stack-item-deck"
          data-active={isActive ? "true" : "false"}
          data-offset={continuousOffset.toFixed(4)}
          className={cn("pointer-events-auto w-full origin-center transition-colors duration-300", className)}
          drag={isActive ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onClick={() => {
            if (!isActive && isVisible) {
              goToIndex(index)
            }
          }}
          onDragEnd={isActive ? handleDragEnd : undefined}
          style={{
            x: offsetPx,
            y: deckTranslateYPx,
            scale: deckScale,
            rotate: deckRotateDeg,
            opacity,
            zIndex: deckZIndex,
            cursor: isActive ? "grab" : "pointer",
            pointerEvents: opacity === 0 ? "none" : "auto",
            ...style,
          }}
          whileDrag={{ cursor: "grabbing" }}
          {...props}
        >
          <motion.div
            ref={swingRef}
            data-slot="card-stack-item-swing"
            data-card-id={cardId}
            data-angle={radiansToDegrees(cardState.angle).toFixed(4)}
            data-velocity={radiansToDegrees(cardState.angularVelocity).toFixed(4)}
            className="w-full"
            style={{
              rotate: `${radiansToDegrees(cardState.angle)}deg`,
              transformOrigin: "50% var(--card-hanger-y, 1.25rem)",
            }}
          >
            <CarouselItem data-index={index} className="w-full">
              {children}
            </CarouselItem>
          </motion.div>
        </motion.div>
      </div>
    )
  }
)
CardStackCarouselItem.displayName = "CardStackCarouselItem"

export const CardStackCarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, style, type = "button", ...props }, ref) => {
  const { canGoPrev, goToPrev } = useCarousel()

  return (
    <button
      ref={ref}
      type={type}
      data-slot="card-stack-carousel-previous"
      className={cn(
        "absolute z-50 flex items-center justify-center bg-[var(--chaos-black,#181818)] text-[var(--neon-yellow,#E3FF00)] transition-transform duration-200 shadow-solid",
        "hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100",
        className
      )}
      disabled={!canGoPrev}
      onClick={goToPrev}
      style={{
        left: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        width: `${cardStackLayout.navButtonWidthPx}px`,
        height: `${cardStackLayout.navButtonHeightPx}px`,
        clipPath: "polygon(20% 0%, 100% 10%, 80% 100%, 0% 90%)",
        ...style,
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current md:h-10 md:w-10" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="3" />
      </svg>
    </button>
  )
})
CardStackCarouselPrevious.displayName = "CardStackCarouselPrevious"

export const CardStackCarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, style, type = "button", ...props }, ref) => {
  const { canGoNext, goToNext } = useCarousel()

  return (
    <button
      ref={ref}
      type={type}
      data-slot="card-stack-carousel-next"
      className={cn(
        "absolute z-50 flex items-center justify-center bg-[var(--chaos-black,#181818)] text-[var(--neon-yellow,#E3FF00)] transition-transform duration-200 shadow-solid",
        "hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100",
        className
      )}
      disabled={!canGoNext}
      onClick={goToNext}
      style={{
        right: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        width: `${cardStackLayout.navButtonWidthPx}px`,
        height: `${cardStackLayout.navButtonHeightPx}px`,
        clipPath: "polygon(0% 10%, 80% 0%, 100% 90%, 20% 100%)",
        ...style,
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current md:h-10 md:w-10" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="3" />
      </svg>
    </button>
  )
})
CardStackCarouselNext.displayName = "CardStackCarouselNext"

export const CardStackCarouselIndicators = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { currentIndex, goToIndex, itemCount } = useCarousel()

    return (
      <div
        ref={ref}
        data-slot="card-stack-carousel-indicators"
        className={cn("relative z-40 mt-6 flex flex-wrap items-center justify-center gap-3", className)}
        {...props}
      >
        {Array.from({ length: itemCount }).map((_, index) => {
          const isActive = currentIndex === index

          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              data-active={isActive ? "true" : "false"}
              className={cn(
                "scale-100 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2",
                isActive
                  ? "scale-110 bg-[var(--neon-yellow,#E3FF00)] shadow-[2px_2px_0px_var(--chaos-black,#181818)]"
                  : "bg-[var(--chaos-black,#181818)]/40 hover:bg-[var(--chaos-black,#181818)]/70"
              )}
              onClick={() => {
                if (index === currentIndex) return
                goToIndex(index)
              }}
              style={{
                width: `${cardStackLayout.indicatorWidthPx}px`,
                height: `${cardStackLayout.indicatorHeightPx}px`,
                clipPath: "polygon(10% 0, 100% 15%, 90% 100%, 0 85%)",
              }}
            />
          )
        })}
      </div>
    )
  }
)
CardStackCarouselIndicators.displayName = "CardStackCarouselIndicators"
