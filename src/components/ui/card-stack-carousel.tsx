"use client"

import * as React from "react"
import { motion, type HTMLMotionProps, type PanInfo } from "framer-motion"

import { CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

const cardStackLayout = {
  minHeightPx: 500,
  navButtonWidthPx: 64,
  navButtonHeightPx: 80,
  indicatorWidthPx: 32,
  indicatorHeightPx: 12,
  hangerFallback: "1.25rem",
} as const

export const CardStackCarouselContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CarouselContent>
>(({ className, style, ...props }, ref) => {
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

export const CardStackCarouselItem = React.forwardRef<HTMLDivElement, CardStackCarouselItemProps>(
  ({ className, children, shellClassName, shellStyle, style, "data-index": index = 0, ...props }, ref) => {
    const { currentIndex, goToIndex, goToNext, goToPrev } = useCarousel()

    const offset = index - currentIndex
    const isActive = offset === 0
    const visibleOffsetLimit = 2
    const opacity = Math.abs(offset) > visibleOffsetLimit ? 0 : 1
    const deckTranslateXPercent = offset * 108
    const deckTranslateYPx = 0
    const deckScale = 1
    const deckRotateDeg = 0
    const deckZIndex = 50 - Math.abs(offset)

    const prevIndexRef = React.useRef(currentIndex)
    const [swingKey, setSwingKey] = React.useState(0)
    const [swingDirection, setSwingDirection] = React.useState(1)

    React.useEffect(() => {
      if (currentIndex === prevIndexRef.current) return

      setSwingDirection(currentIndex > prevIndexRef.current ? 1 : -1)
      setSwingKey((value) => value + 1)
      prevIndexRef.current = currentIndex
    }, [currentIndex])

    const swingRotate =
      swingKey > 0 ? [0, swingDirection * 8, swingDirection * -5, swingDirection * 2.5, swingDirection * -1, 0] : 0

    const handleDragEnd = React.useCallback(
      (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipePower = Math.abs(info.offset.x) * info.velocity.x

        if (info.offset.x < -50 || swipePower < -500) {
          goToNext()
          return
        }

        if (info.offset.x > 50 || swipePower > 500) {
          goToPrev()
        }
      },
      [goToNext, goToPrev]
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
          data-offset={offset}
          className={cn("w-full origin-center pointer-events-auto transition-colors duration-300", className)}
          drag={isActive ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          initial={false}
          animate={{
            x: `${deckTranslateXPercent}%`,
            y: deckTranslateYPx,
            scale: deckScale,
            rotate: deckRotateDeg,
            opacity,
            zIndex: deckZIndex,
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 35,
            mass: 0.8,
          }}
          onClick={() => {
            if (!isActive && opacity > 0) {
              goToIndex(index)
            }
          }}
          onDragEnd={isActive ? handleDragEnd : undefined}
          style={{
            cursor: isActive ? "grab" : "pointer",
            pointerEvents: opacity === 0 ? "none" : "auto",
            ...style,
          }}
          whileDrag={{ cursor: "grabbing" }}
          {...props}
        >
          <motion.div
            data-slot="card-stack-item-swing"
            className="w-full"
            initial={false}
            animate={{ rotate: swingRotate }}
            transition={
              swingKey > 0
                ? {
                    duration: 0.7,
                    ease: "easeOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  }
                : {
                    duration: 0.2,
                  }
            }
            style={{ transformOrigin: `50% var(--card-hanger-y, ${cardStackLayout.hangerFallback})` }}
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
              onClick={() => goToIndex(index)}
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
