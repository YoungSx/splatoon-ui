"use client"

import * as React from "react"
import { motion, useAnimation } from "framer-motion"

import { cn } from "@/lib/utils"
import paginationStyles from "./carousel-pagination.module.css"

interface CarouselContextType {
  currentIndex: number
  prevIndex: number
  navigationDirection: number
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
    const [prevIndex, setPrevIndex] = React.useState(initialIndex)
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
            setPrevIndex(resolvedPrev)
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

    const navigationDirection = React.useMemo(() => {
      if (resolvedCurrentIndex === prevIndex) return 0
      return prevIndex - resolvedCurrentIndex
    }, [resolvedCurrentIndex, prevIndex])

    const contextValue = React.useMemo(
      () => ({
        currentIndex: resolvedCurrentIndex,
        prevIndex,
        navigationDirection,
        itemCount,
        canGoPrev: resolvedCurrentIndex > 0,
        canGoNext: resolvedCurrentIndex < itemCount - 1,
        goToNext,
        goToPrev,
        goToIndex,
      }),
      [goToIndex, goToNext, goToPrev, itemCount, resolvedCurrentIndex, prevIndex, navigationDirection]
    )

    return (
      <CarouselContext.Provider value={contextValue}>
        <CarouselCountContext.Provider value={setItemCount}>
          <div
            ref={ref}
            data-slot="carousel"
            aria-roledescription="carousel"
            className={cn("relative mx-auto w-full", className)}
            onKeyDown={handleKeyDown}
            role={role}
            tabIndex={tabIndex}
            {...props}
            style={{
              "--selected": resolvedCurrentIndex,
              "--total": itemCount,
              ...props.style,
            } as React.CSSProperties}
          >
            {children}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              Slide {resolvedCurrentIndex + 1} of {itemCount}
            </div>
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

export function useCarouselItemState(index: number | undefined) {
  const { currentIndex, prevIndex } = useCarousel()
  const isActive = currentIndex === index
  const wasActive = prevIndex === index
  const isLeft = index !== undefined ? index < currentIndex : false
  const isRight = index !== undefined ? index > currentIndex : false
  const offset = index !== undefined ? index - currentIndex : 0
  return { isActive, wasActive, isLeft, isRight, offset, currentIndex }
}

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-index"?: number
}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, children, "data-index": index, ...props }, ref) => {
    const { isActive, offset } = useCarouselItemState(index)

    return (
      <div
        ref={ref}
        data-slot="carousel-item"
        data-index={index}
        className={cn("relative", className)}
        style={{
          "--active": isActive ? "1" : "0",
          "--index-offset": String(offset),
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CarouselItem.displayName = "CarouselItem"

export interface FadeCarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-index"?: number
  rotateAmount?: number
}

export const FadeCarouselItem = React.forwardRef<HTMLDivElement, FadeCarouselItemProps>(
  ({ className, children, "data-index": index, rotateAmount, ...props }, ref) => {
    const { isActive, isLeft, offset, currentIndex } = useCarouselItemState(index)

    const randomValues = React.useMemo(() => {
      const seed = ((index ?? 0) * 2654435761) >>> 0
      const direction = (seed & 1) === 0 ? -1 : 1
      const fraction = ((seed >> 8) & 0xff) / 255
      return {
        rotateDirection: direction,
        rotateAmount: (rotateAmount ?? 3) + 0.3 * fraction,
      }
    }, [rotateAmount, index])

    const photoOffset = isActive ? 0 : isLeft ? -1 : 1

    return (
      <div
        ref={ref}
        data-slot="carousel-item"
        data-index={index}
        className={className}
        style={{
          "--active": isActive ? "1" : "0",
          "--index-offset": String(offset),
          "--photo-offset": String(photoOffset),
          "--rotateDirection": String(randomValues.rotateDirection),
          "--rotateAmount": `${randomValues.rotateAmount}deg`,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FadeCarouselItem.displayName = "FadeCarouselItem"

export function SwipeableGallery({ children, className }: { children: React.ReactNode; className?: string }) {
  const { goToNext, goToPrev } = useCarousel()
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const state = React.useRef({ startX: 0, dx: 0, offsetting: false, scrolling: true })

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    state.current.startX = e.touches[0].clientX
    state.current.dx = 0
    state.current.offsetting = false
    state.current.scrolling = true
  }, [])

  const onTouchMove = React.useCallback((e: React.TouchEvent) => {
    const s = state.current
    const dx = e.touches[0].clientX - s.startX

    if (!s.offsetting) {
      const dy = Math.abs(e.touches[0].clientY - (e.target as HTMLElement).getBoundingClientRect().top)
      if (dy > 20) return
      if (Math.abs(dx) > 10) {
        s.offsetting = true
        s.scrolling = false
      }
    }

    if (s.offsetting) {
      e.preventDefault()
      s.dx = dx
      wrapperRef.current?.style.setProperty("--touch-offset", String(dx))
    }
  }, [])

  const onTouchEnd = React.useCallback(() => {
    const s = state.current
    wrapperRef.current?.style.removeProperty("--touch-offset")

    if (s.offsetting && Math.abs(s.dx) > 50) {
      if (s.dx < 0) goToNext()
      else goToPrev()
    }

    s.startX = 0
    s.dx = 0
    s.offsetting = false
    s.scrolling = true
  }, [goToNext, goToPrev])

  return (
    <div
      ref={wrapperRef}
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  )
}
SwipeableGallery.displayName = "SwipeableGallery"

export interface CarouselPaginationProps extends React.HTMLAttributes<HTMLUListElement> {
  labels?: string[]
}

export const CarouselPagination = React.forwardRef<HTMLUListElement, CarouselPaginationProps>(
  ({ className, labels, ...props }, ref) => {
    const { currentIndex, itemCount, goToIndex } = useCarousel()

    return (
      <ul
        ref={ref}
        data-slot="carousel-pagination"
        className={cn(paginationStyles.pagination, className)}
        {...props}
      >
        {Array.from({ length: itemCount }, (_, index) => (
          <li key={index} className={paginationStyles.item}>
            <button onClick={() => goToIndex(index)} aria-label={labels?.[index] ?? `Go to slide ${index + 1}`}>
              <span className={paginationStyles.iconContainer}>
                <span
                  aria-hidden="true"
                  className={cn(
                    paginationStyles.paginationIcon,
                    currentIndex === index && paginationStyles.paginationActive,
                  )}
                />
                {labels?.[index] && (
                  <span className="sr-only">{labels[index]}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    )
  },
)
CarouselPagination.displayName = "CarouselPagination"

export interface CarouselImagePaginationItem {
  src: string
  alt?: string
  rotate?: number
}

export interface CarouselImagePaginationProps extends React.HTMLAttributes<HTMLUListElement> {
  images: CarouselImagePaginationItem[]
}

export const CarouselImagePagination = React.forwardRef<HTMLUListElement, CarouselImagePaginationProps>(
  ({ className, images, ...props }, ref) => {
    const { currentIndex, goToIndex } = useCarousel()

    return (
      <ul
        ref={ref}
        data-slot="carousel-image-pagination"
        className={cn(paginationStyles.pagination, className)}
        {...props}
      >
        {images.map((img, index) => (
          <li key={index} className={paginationStyles.item}>
            <button onClick={() => goToIndex(index)} aria-label={img.alt ? `Go to ${img.alt}` : `Go to slide ${index + 1}`}>
              <div
                style={{ "--rotate": `${img.rotate ?? 0}deg` } as React.CSSProperties}
                className={cn(
                  paginationStyles.imagePaginationButton,
                  currentIndex === index && paginationStyles.imagePaginationActive,
                )}
              >
                <div className={paginationStyles.imagePaginationImage}>
                  <img src={img.src} alt={img.alt || ""} />
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    )
  },
)
CarouselImagePagination.displayName = "CarouselImagePagination"

export function GalleryBounce({ children, className }: { children: React.ReactNode; className?: string }) {
  const { currentIndex, prevIndex } = useCarousel()
  const controls = useAnimation()

  React.useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const direction = currentIndex > prevIndex ? 1 : -1
    // Deterministic pseudo-random sign based on currentIndex (matches CarouselItem pattern)
    const randomSign = ((currentIndex * 2654435761) >>> 0) & 1 ? -1 : 1
    const startY = 100 * direction * randomSign

    controls.set({ y: startY, opacity: 1 })
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 1,
        ease: [0.21, 1.56, 0.64, 1],
      },
    })
  }, [currentIndex, prevIndex, controls])

  return (
    <motion.div className={className} animate={controls}>
      {children}
    </motion.div>
  )
}
GalleryBounce.displayName = "GalleryBounce"
