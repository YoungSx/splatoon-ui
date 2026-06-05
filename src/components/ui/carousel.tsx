"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface CarouselContextType {
  currentIndex: number
  itemCount: number
  canGoPrev: boolean
  canGoNext: boolean
  goToNext: () => void
  goToPrev: () => void
  goToIndex: (index: number) => void
}

const CarouselContext = React.createContext<CarouselContextType | null>(null)
const CarouselCountContext = React.createContext<(count: number) => void>(() => {})

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel")
  }
  return context
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  initialIndex?: number
  itemCount?: number
  onIndexChange?: (index: number) => void
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      className,
      initialIndex = 0,
      itemCount: itemCountProp,
      onIndexChange,
      onKeyDown,
      role = "region",
      tabIndex = 0,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
    const [itemCountState, setItemCount] = React.useState(0)
    const itemCount = itemCountProp ?? itemCountState

    const clampIndex = React.useCallback(
      (value: number) => {
        if (itemCount <= 0) return 0
        return Math.max(0, Math.min(value, itemCount - 1))
      },
      [itemCount]
    )

    const resolvedCurrentIndex = clampIndex(currentIndex)

    const commitIndex = React.useCallback(
      (updater: number | ((prev: number) => number)) => {
        setCurrentIndex((prev) => {
          const resolvedPrev = clampIndex(prev)
          const proposed = typeof updater === "function" ? updater(resolvedPrev) : updater
          const next = clampIndex(proposed)
          if (next !== resolvedPrev) {
            onIndexChange?.(next)
          }
          return next
        })
      },
      [clampIndex, onIndexChange]
    )

    const goToNext = React.useCallback(() => {
      commitIndex((prev) => prev + 1)
    }, [commitIndex])

    const goToPrev = React.useCallback(() => {
      commitIndex((prev) => prev - 1)
    }, [commitIndex])

    const goToIndex = React.useCallback(
      (index: number) => {
        commitIndex(index)
      },
      [commitIndex]
    )

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return

        if (event.key === "ArrowRight") {
          event.preventDefault()
          goToNext()
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault()
          goToPrev()
        }
      },
      [goToNext, goToPrev, onKeyDown]
    )

    const contextValue = React.useMemo(
      () => ({
        currentIndex: resolvedCurrentIndex,
        itemCount,
        canGoPrev: resolvedCurrentIndex > 0,
        canGoNext: resolvedCurrentIndex < itemCount - 1,
        goToNext,
        goToPrev,
        goToIndex,
      }),
      [goToIndex, goToNext, goToPrev, itemCount, resolvedCurrentIndex]
    )

    return (
      <CarouselContext.Provider value={contextValue}>
        <CarouselCountContext.Provider value={setItemCount}>
          <div
            ref={ref}
            data-slot="carousel"
            aria-roledescription="carousel"
            className={cn("relative mx-auto w-full py-8", className)}
            onKeyDown={handleKeyDown}
            role={role}
            tabIndex={tabIndex}
            {...props}
          >
            {children}
          </div>
        </CarouselCountContext.Provider>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

export const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const setItemCount = React.useContext(CarouselCountContext)
    const childrenArray = React.Children.toArray(children).filter(React.isValidElement)

    React.useEffect(() => {
      setItemCount(childrenArray.length)
    }, [childrenArray.length, setItemCount])

    return (
      <div ref={ref} data-slot="carousel-content" className={cn("relative w-full", className)} {...props}>
        {childrenArray.map((child, index) =>
          React.cloneElement(child as React.ReactElement<{ "data-index"?: number }>, {
            "data-index": index,
          })
        )}
      </div>
    )
  }
)
CarouselContent.displayName = "CarouselContent"

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-index"?: number
}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, children, "data-index": index, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="carousel-item" data-index={index} className={cn("relative", className)} {...props}>
        {children}
      </div>
    )
  }
)
CarouselItem.displayName = "CarouselItem"
