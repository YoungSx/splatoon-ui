"use client"

import * as React from "react"
import { motion, type HTMLMotionProps, type PanInfo } from "framer-motion"

import { CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel"
import {
  createCardSwingGeometry,
  type CardStackCarouselCardState,
  type CardSwingGeometry,
} from "@/lib/physics/card-stack/core"
import {
  CardStackCarouselPhysicsContext,
  createZeroCardState,
  getCardState,
  getPrimaryCardState,
  resolveCardId,
  useCardStackCarouselPhysicsStore,
  useCreateCardStackCarouselScene,
} from "@/lib/physics/card-stack/store"
import { defaultSupportMotionProfile } from "@/lib/physics/card-stack/support-driver"
import { cardStackLayoutTuning } from "@/lib/physics/card-stack/tuning"
import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import styles from "./card-stack-carousel.module.css"

const cardStackLayout = {
  ...cardStackLayoutTuning,
} as const

const FALLBACK_GEOMETRY: CardSwingGeometry = createCardSwingGeometry({
  cardWidthPx: cardStackLayout.fallbackCardWidthPx,
  cardHeightPx: cardStackLayout.fallbackCardHeightPx,
  hangerYPx: cardStackLayout.fallbackHangerYPx,
  pitchPx: cardStackLayout.fallbackCardWidthPx * cardStackLayout.deckStepWidthMultiplier,
})

const ZERO_CARD_STATE: CardStackCarouselCardState = createZeroCardState(FALLBACK_GEOMETRY)

function radiansToDegrees(value: number) {
  return value * (180 / Math.PI)
}

export function CardStackCarouselScene({ children }: { children: React.ReactNode }) {
  const { sceneSnapshot, store, supportDriverLabel } = useCreateCardStackCarouselScene({
    fallbackGeometry: FALLBACK_GEOMETRY,
    supportMotionProfile: defaultSupportMotionProfile,
  })
  const primaryCardState = getPrimaryCardState(sceneSnapshot, ZERO_CARD_STATE)

  return (
    <CardStackCarouselPhysicsContext.Provider value={store}>
      <div
        data-slot="card-stack-carousel-scene"
        data-card-count={Object.keys(sceneSnapshot.cards).length}
        data-support-driver={supportDriverLabel}
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

export function CardStackCarouselContent({
  ref,
  className,
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof CarouselContent> & { ref?: React.Ref<HTMLDivElement> }) {
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
        perspective: `${cardStackLayout.perspectivePx}px`,
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...props}
    />
  )
}

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

export function CardStackCarouselItem({
  ref,
  className,
  children,
  shellClassName,
  shellStyle,
  style,
  "data-index": index = 0,
  ...props
}: CardStackCarouselItemProps & { ref?: React.Ref<HTMLDivElement> }) {
    const { currentIndex, goToIndex, goToNext, goToPrev } = useCarousel()
    const physicsStore = useCardStackCarouselPhysicsStore()
    const sceneSnapshot = React.useSyncExternalStore(physicsStore.subscribe, physicsStore.getSnapshot, physicsStore.getSnapshot)
    const swingRef = React.useRef<HTMLDivElement | null>(null)
    const cardId = resolveCardId(index)
    const cardState = getCardState(sceneSnapshot, cardId, ZERO_CARD_STATE)

    const pitchPx = sceneSnapshot.support.pitchPx
    const cardAnchorPx = index * pitchPx
    const offsetPx = cardAnchorPx - sceneSnapshot.support.positionPx
    const continuousOffset = pitchPx > 0 ? offsetPx / pitchPx : 0
    const logicalOffset = index - currentIndex
    const isActive = logicalOffset === 0
    const isVisible = Math.abs(continuousOffset) <= cardStackLayout.visibleOffsetLimit + cardStackLayout.visibleOffsetBuffer
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

        if (
          info.offset.x < -cardStackLayout.swipeOffsetThresholdPx ||
          swipePower < -cardStackLayout.swipePowerThreshold
        ) {
          navigateByDirection(1)
          return
        }

        if (
          info.offset.x > cardStackLayout.swipeOffsetThresholdPx ||
          swipePower > cardStackLayout.swipePowerThreshold
        ) {
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

interface CardStackCarouselArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "previous" | "next"
}

function CardStackCarouselArrow({
  ref,
  direction,
  className,
  style,
  ...props
}: CardStackCarouselArrowProps & { ref?: React.Ref<HTMLButtonElement> }) {
    const { canGoPrev, goToPrev, canGoNext, goToNext } = useCarousel()
    const isPrev = direction === "previous"

    return (
      <div
        data-slot={`card-stack-carousel-${direction}`}
        className={cn("absolute z-50", isPrev ? styles.left : styles.right)}
        style={{
          [isPrev ? "left" : "right"]: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <IconButton
          ref={ref}
          variant="carousel"
          direction={isPrev ? "left" : "right"}
          animation="squish"
          aria-label={isPrev ? "Previous carousel item" : "Next carousel item"}
          disabled={isPrev ? !canGoPrev : !canGoNext}
          onClick={isPrev ? goToPrev : goToNext}
          className={className}
          style={style}
          {...(props as Omit<React.ComponentPropsWithoutRef<typeof IconButton>, 'variant' | 'direction' | 'animation'>)}
        />
      </div>
    )
  }

export function CardStackCarouselPrevious({
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }) {
  return <CardStackCarouselArrow ref={ref} direction="previous" {...props} />
}

export function CardStackCarouselNext({
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }) {
  return <CardStackCarouselArrow ref={ref} direction="next" {...props} />
}
