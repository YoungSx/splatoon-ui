"use client"

import * as React from "react"
import { motion, PanInfo, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

const carouselLayout = {
  minHeightPx: 500,
  cardMaxWidth: "min(28rem, 100%)",
  navButtonWidthPx: 64,
  navButtonHeightPx: 80,
  indicatorWidthPx: 32,
  indicatorHeightPx: 12,
} as const

interface CarouselContextType {
  currentIndex: number
  itemCount: number
  goToNext: () => void
  goToPrev: () => void
  goToIndex: (idx: number) => void
}

const CarouselContext = React.createContext<CarouselContextType | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("useCarousel must be used within a Carousel")
  return context
}

// Internal context to communicate item count from Content up to Provider
const CarouselCountContext = React.createContext<(count: number) => void>(() => {})

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  initialIndex?: number
  onIndexChange?: (index: number) => void
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ children, className, initialIndex = 0, onIndexChange, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
    const [itemCount, setItemCount] = React.useState(0)

    const goToNext = React.useCallback(() => {
      setCurrentIndex((prev) => {
        const next = Math.min(prev + 1, itemCount - 1)
        if (next !== prev) onIndexChange?.(next)
        return next
      })
    }, [itemCount, onIndexChange])

    const goToPrev = React.useCallback(() => {
      setCurrentIndex((prev) => {
        const next = Math.max(prev - 1, 0)
        if (next !== prev) onIndexChange?.(next)
        return next
      })
    }, [onIndexChange])

    const goToIndex = React.useCallback((idx: number) => {
      setCurrentIndex((prev) => {
        const next = Math.max(0, Math.min(idx, itemCount - 1))
        if (next !== prev) onIndexChange?.(next)
        return next
      })
    }, [itemCount, onIndexChange])

    return (
      <CarouselContext.Provider value={{ currentIndex, itemCount, goToNext, goToPrev, goToIndex }}>
        <CarouselCountContext.Provider value={setItemCount}>
          <div
            ref={ref}
            data-slot="carousel"
            className={cn("relative mx-auto w-full py-8", className)}
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
  ({ className, children, style, ...props }, ref) => {
    const setItemCount = React.useContext(CarouselCountContext)
    const childrenArray = React.Children.toArray(children).filter(React.isValidElement)
    
    React.useEffect(() => {
      setItemCount(childrenArray.length)
    }, [childrenArray.length, setItemCount])

    return (
      <div 
        data-slot="carousel-content"
        ref={ref} 
        className={cn("relative flex w-full items-center justify-center overflow-hidden", className)}
        style={{
          minHeight: `${carouselLayout.minHeightPx}px`,
          perspective: "1000px",
          ...style,
        }}
        {...props}
      >
        {childrenArray.map((child, index) => {
          return React.cloneElement(
            child as React.ReactElement<{ "data-index"?: number }>,
            { "data-index": index }
          )
        })}
      </div>
    )
  }
)
CarouselContent.displayName = "CarouselContent"

type CarouselItemProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode
  "data-index"?: number
}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, children, style, "data-index": index = 0, ...props }, ref) => {
    const { currentIndex, goToNext, goToPrev, goToIndex } = useCarousel()
    
    const offset = index - currentIndex
    const isActive = offset === 0

    // Randomize slightly for the Splatoon scrapbook feel
    // Use the index as a seed so it's stable and chaotic
    const seed = index * 137
    const randomRotate = -3 + (seed % 7) // between -3 and 3 degrees
    const baseRotate = isActive ? randomRotate : randomRotate + (offset > 0 ? 6 : -6)

    // Layout math for 3D stacking
    const xOffset = offset * 65 // 65% of width shifted per item
    const zOffset = 50 - Math.abs(offset)
    const scale = isActive ? 1 : Math.max(0.75, 1 - Math.abs(offset) * 0.15)
    // Only show items within +/- 2 distance to optimize DOM & visual clarity
    const opacity = Math.abs(offset) > 2 ? 0 : 1

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset: dragOffset, velocity }: PanInfo) => {
      const swipePower = Math.abs(dragOffset.x) * velocity.x
      if (dragOffset.x < -50 || swipePower < -500) {
        goToNext()
      } else if (dragOffset.x > 50 || swipePower > 500) {
        goToPrev()
      }
    }

    return (
      <div
        data-slot="carousel-item-shell"
        className="pointer-events-none absolute inset-0 m-auto flex w-full items-center justify-center"
        style={{ maxWidth: carouselLayout.cardMaxWidth }}
      >
        <motion.div
          ref={ref}
          data-slot="carousel-item"
          className={cn(
            "origin-center transition-colors duration-300 w-full pointer-events-auto",
            className
          )}
          initial={false}
          animate={{
            x: `${xOffset}%`,
            scale,
            zIndex: zOffset,
            rotate: baseRotate,
            opacity,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1
          }}
          drag={isActive ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={isActive ? handleDragEnd : undefined}
          onClick={() => {
            if (!isActive && opacity > 0) goToIndex(index)
          }}
          style={{
            cursor: isActive ? "grab" : "pointer",
            pointerEvents: opacity === 0 ? "none" : "auto",
            ...style,
          }}
          {...props}
        >
          {children}
          {/* Dim overlay for non-active cards to emphasize depth */}
          <motion.div 
            className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none"
            initial={false}
            animate={{ opacity: isActive ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    )
  }
)
CarouselItem.displayName = "CarouselItem"

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, style, ...props }, ref) => {
    const { currentIndex, goToPrev } = useCarousel()
    const disabled = currentIndex === 0

    return (
      <button
        ref={ref}
        data-slot="carousel-previous"
        onClick={goToPrev}
        disabled={disabled}
        className={cn(
          "absolute z-50",
          "flex items-center justify-center",
          "bg-[var(--chaos-black,#181818)] text-[var(--neon-yellow,#E3FF00)]",
          "transition-transform duration-200 active:scale-90 disabled:opacity-30 disabled:hover:scale-100",
          "hover:scale-110 shadow-solid",
          className
        )}
        style={{
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          width: `${carouselLayout.navButtonWidthPx}px`,
          height: `${carouselLayout.navButtonHeightPx}px`,
          clipPath: "polygon(20% 0%, 100% 10%, 80% 100%, 0% 90%)",
          ...style,
        }}
        {...props}
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
        </svg>
      </button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

export const CarouselNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, style, ...props }, ref) => {
    const { currentIndex, itemCount, goToNext } = useCarousel()
    const disabled = currentIndex >= itemCount - 1

    return (
      <button
        ref={ref}
        data-slot="carousel-next"
        onClick={goToNext}
        disabled={disabled}
        className={cn(
          "absolute z-50",
          "flex items-center justify-center",
          "bg-[var(--chaos-black,#181818)] text-[var(--neon-yellow,#E3FF00)]",
          "transition-transform duration-200 active:scale-90 disabled:opacity-30 disabled:hover:scale-100",
          "hover:scale-110 shadow-solid",
          className
        )}
        style={{
          right: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          width: `${carouselLayout.navButtonWidthPx}px`,
          height: `${carouselLayout.navButtonHeightPx}px`,
          clipPath: "polygon(0% 10%, 80% 0%, 100% 90%, 20% 100%)",
          ...style,
        }}
        {...props}
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
        </svg>
      </button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export const CarouselIndicators = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { currentIndex, itemCount, goToIndex } = useCarousel()
    
    return (
      <div
        ref={ref}
        data-slot="carousel-indicators"
        className={cn("relative z-50 mt-6 flex flex-wrap items-center justify-center gap-3", className)}
        {...props}
      >
        {Array.from({ length: itemCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              currentIndex === i 
                ? "bg-[var(--neon-yellow,#E3FF00)] scale-110 shadow-[2px_2px_0px_var(--chaos-black,#181818)]" 
                : "bg-[var(--chaos-black,#181818)]/40 hover:bg-[var(--chaos-black,#181818)]/70 scale-100"
            )}
            style={{
              width: `${carouselLayout.indicatorWidthPx}px`,
              height: `${carouselLayout.indicatorHeightPx}px`,
              clipPath: "polygon(10% 0, 100% 15%, 90% 100%, 0 85%)"
            }}
          />
        ))}
      </div>
    )
  }
)
CarouselIndicators.displayName = "CarouselIndicators"
