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
        perspective: `${cardStackLayout.perspectivePx}px`,
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
)
CardStackCarouselItem.displayName = "CardStackCarouselItem"

export const CardStackCarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, style, ...props }, ref) => {
  const { canGoPrev, goToPrev } = useCarousel()

  return (
    <div
      data-slot="card-stack-carousel-previous"
      className={cn("absolute z-50", styles.left)}
      style={{
        left: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <IconButton
        ref={ref}
        variant="carousel"
        direction="left"
        animation="squish"
        aria-label="Previous carousel item"
        disabled={!canGoPrev}
        onClick={goToPrev}
        className={className}
        style={style}
        {...(props as Omit<React.ComponentPropsWithoutRef<typeof IconButton>, 'variant' | 'direction' | 'animation'>)}
      />
    </div>
  )
})
CardStackCarouselPrevious.displayName = "CardStackCarouselPrevious"

export const CardStackCarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, style, ...props }, ref) => {
  const { canGoNext, goToNext } = useCarousel()

  return (
    <div
      data-slot="card-stack-carousel-next"
      className={cn("absolute z-50", styles.right)}
      style={{
        right: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <IconButton
        ref={ref}
        variant="carousel"
        direction="right"
        animation="squish"
        aria-label="Next carousel item"
        disabled={!canGoNext}
        onClick={goToNext}
        className={className}
        style={style}
        {...(props as Omit<React.ComponentPropsWithoutRef<typeof IconButton>, 'variant' | 'direction' | 'animation'>)}
      />
    </div>
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
