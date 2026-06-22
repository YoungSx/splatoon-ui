'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import paginationStyles from './carousel-pagination.module.css'

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
const CarouselItemIndexContext = React.createContext<number | undefined>(undefined)

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a Carousel')
  }
  return context
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number
  defaultIndex?: number
  /** @deprecated Use defaultIndex for uncontrolled carousels. */
  initialIndex?: number
  itemCount?: number
  onIndexChange?: (index: number) => void
}

export function Carousel({
  ref,
  children,
  className,
  index,
  defaultIndex,
  initialIndex = 0,
  itemCount: itemCountProp,
  onIndexChange,
  onKeyDown,
  role = 'region',
  tabIndex = 0,
  ...props
}: CarouselProps & { ref?: React.Ref<HTMLDivElement> }) {
  const resolvedDefaultIndex = defaultIndex ?? initialIndex
  const isControlled = index !== undefined
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(resolvedDefaultIndex)
  const [prevIndex, setPrevIndex] = React.useState(index ?? resolvedDefaultIndex)
  const [itemCountState, setItemCount] = React.useState(0)
  const itemCount = itemCountProp ?? itemCountState
  const lastControlledIndexRef = React.useRef(index)

  const clampIndex = React.useCallback(
    (value: number) => {
      if (itemCount <= 0) return 0
      return Math.max(0, Math.min(value, itemCount - 1))
    },
    [itemCount]
  )

  const resolvedCurrentIndex = clampIndex(isControlled ? index : uncontrolledIndex)

  React.useEffect(() => {
    if (!isControlled) return

    const previous = lastControlledIndexRef.current
    if (previous !== undefined && previous !== index) {
      setPrevIndex(clampIndex(previous))
    }
    lastControlledIndexRef.current = index
  }, [clampIndex, index, isControlled])

  const commitIndex = React.useCallback(
    (updater: number | ((prev: number) => number)) => {
      const resolvedPrev = clampIndex(isControlled ? index : uncontrolledIndex)
      const proposed = typeof updater === 'function' ? updater(resolvedPrev) : updater
      const next = clampIndex(proposed)
      if (next === resolvedPrev) return

      setPrevIndex(resolvedPrev)
      if (!isControlled) {
        setUncontrolledIndex(next)
      }
      onIndexChange?.(next)
    },
    [clampIndex, index, isControlled, onIndexChange, uncontrolledIndex]
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

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext()
      }

      if (event.key === 'ArrowLeft') {
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
          className={cn('relative mx-auto w-full', className)}
          onKeyDown={handleKeyDown}
          role={role}
          tabIndex={tabIndex}
          {...props}
          style={
            {
              '--selected': resolvedCurrentIndex,
              '--total': itemCount,
              ...props.style,
            } as React.CSSProperties
          }
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

export function CarouselViewport({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="carousel-viewport"
      className={cn('relative w-full overflow-x-clip', className)}
      {...props}
    />
  )
}

export function CarouselBleedBoundary({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="carousel-bleed-boundary"
      className={cn(
        'relative left-1/2 w-[100cqw] max-w-[100cqw] -translate-x-1/2 overflow-x-clip',
        className
      )}
      {...props}
    />
  )
}

function indexCarouselChildren(children: React.ReactNode) {
  const childrenArray = React.Children.toArray(children)
  const indexedChildren: React.ReactNode[] = []
  let itemCount = 0

  for (const child of childrenArray) {
    if (!React.isValidElement(child)) {
      indexedChildren.push(child)
      continue
    }

    const index = itemCount
    itemCount += 1
    indexedChildren.push(
      <CarouselItemIndexContext.Provider key={child.key ?? index} value={index}>
        {child}
      </CarouselItemIndexContext.Provider>
    )
  }

  return { indexedChildren, itemCount }
}

export function CarouselContent({
  ref,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  const setItemCount = React.useContext(CarouselCountContext)
  const { indexedChildren, itemCount } = indexCarouselChildren(children)

  React.useEffect(() => {
    setItemCount(itemCount)
  }, [itemCount, setItemCount])

  return (
    <div
      ref={ref}
      data-slot="carousel-content"
      className={cn('relative w-full', className)}
      {...props}
    >
      {indexedChildren}
    </div>
  )
}

export function useCarouselItemState(index: number | undefined) {
  const { currentIndex, prevIndex } = useCarousel()
  const contextIndex = React.useContext(CarouselItemIndexContext)
  const resolvedIndex = index ?? contextIndex
  const isActive = currentIndex === resolvedIndex
  const wasActive = prevIndex === resolvedIndex
  const isLeft = resolvedIndex !== undefined ? resolvedIndex < currentIndex : false
  const isRight = resolvedIndex !== undefined ? resolvedIndex > currentIndex : false
  const offset = resolvedIndex !== undefined ? resolvedIndex - currentIndex : 0
  return { isActive, wasActive, isLeft, isRight, offset, currentIndex, index: resolvedIndex }
}

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-index'?: number
}

export function CarouselItem({
  ref,
  className,
  children,
  'data-index': index,
  ...props
}: CarouselItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { isActive, offset, index: resolvedIndex } = useCarouselItemState(index)

  return (
    <div
      ref={ref}
      data-slot="carousel-item"
      data-index={resolvedIndex}
      className={cn('relative', className)}
      style={
        {
          '--active': isActive ? '1' : '0',
          '--index-offset': String(offset),
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

export interface FadeCarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-index'?: number
  rotateAmount?: number
}

export function FadeCarouselItem({
  ref,
  className,
  children,
  'data-index': index,
  rotateAmount,
  ...props
}: FadeCarouselItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { isActive, isLeft, offset, index: resolvedIndex } = useCarouselItemState(index)

  const randomValues = React.useMemo(() => {
    const seed = ((resolvedIndex ?? 0) * 2654435761) >>> 0
    const direction = (seed & 1) === 0 ? -1 : 1
    const fraction = ((seed >> 8) & 0xff) / 255
    return {
      rotateDirection: direction,
      rotateAmount: (rotateAmount ?? 3) + 0.3 * fraction,
    }
  }, [rotateAmount, resolvedIndex])

  const photoOffset = isActive ? 0 : isLeft ? -1 : 1

  return (
    <div
      ref={ref}
      data-slot="carousel-item"
      data-index={resolvedIndex}
      className={className}
      style={
        {
          '--active': isActive ? '1' : '0',
          '--index-offset': String(offset),
          '--photo-offset': String(photoOffset),
          '--rotateDirection': String(randomValues.rotateDirection),
          '--rotateAmount': `${randomValues.rotateAmount}deg`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

export function SwipeableGallery({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { goToNext, goToPrev } = useCarousel()
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const state = React.useRef({ startX: 0, startY: 0, dx: 0, offsetting: false, scrolling: true })

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    state.current.startX = e.touches[0].clientX
    state.current.startY = e.touches[0].clientY
    state.current.dx = 0
    state.current.offsetting = false
    state.current.scrolling = true
  }, [])

  const onTouchMove = React.useCallback((e: React.TouchEvent) => {
    const s = state.current
    const dx = e.touches[0].clientX - s.startX
    const dy = Math.abs(e.touches[0].clientY - s.startY)

    if (!s.offsetting) {
      if (dy > 20) return
      if (Math.abs(dx) > 10) {
        s.offsetting = true
        s.scrolling = false
      }
    }

    if (s.offsetting) {
      e.preventDefault()
      s.dx = dx
      wrapperRef.current?.style.setProperty('--touch-offset', String(dx))
    }
  }, [])

  const onTouchEnd = React.useCallback(() => {
    const s = state.current
    wrapperRef.current?.style.removeProperty('--touch-offset')

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

export interface CarouselPaginationProps extends React.HTMLAttributes<HTMLUListElement> {
  labels?: string[]
  /** Accessible label template for unlabeled pagination buttons. Receives the 1-based slide number. */
  getSlideLabel?: (index: number) => string
}

export function CarouselPagination({
  ref,
  className,
  labels,
  getSlideLabel = (i) => `Go to slide ${i}`,
  ...props
}: CarouselPaginationProps & { ref?: React.Ref<HTMLUListElement> }) {
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
          <button
            onClick={() => goToIndex(index)}
            aria-label={labels?.[index] ?? getSlideLabel(index + 1)}
          >
            <span className={paginationStyles.iconContainer}>
              <span
                aria-hidden="true"
                className={cn(
                  paginationStyles.paginationIcon,
                  currentIndex === index && paginationStyles.paginationActive
                )}
              />
              {labels?.[index] && <span className="sr-only">{labels[index]}</span>}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export interface CarouselImagePaginationItem {
  src: string
  alt?: string
  rotate?: number
}

export interface CarouselImagePaginationProps extends React.HTMLAttributes<HTMLUListElement> {
  images: CarouselImagePaginationItem[]
  /** Accessible label for a button when the image has an alt text. */
  getImageLabel?: (alt: string) => string
  /** Accessible label for a button when the image has no alt text. Receives the 1-based slide number. */
  getSlideLabel?: (index: number) => string
}

export function CarouselImagePagination({
  ref,
  className,
  images,
  getImageLabel = (alt) => `Go to ${alt}`,
  getSlideLabel = (i) => `Go to slide ${i}`,
  ...props
}: CarouselImagePaginationProps & { ref?: React.Ref<HTMLUListElement> }) {
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
          <button
            onClick={() => goToIndex(index)}
            aria-label={img.alt ? getImageLabel(img.alt) : getSlideLabel(index + 1)}
          >
            <div
              style={{ '--rotate': `${img.rotate ?? 0}deg` } as React.CSSProperties}
              className={cn(
                paginationStyles.imagePaginationButton,
                currentIndex === index && paginationStyles.imagePaginationActive
              )}
            >
              <div className={paginationStyles.imagePaginationImage}>
                {/* eslint-disable-next-line @next/next/no-img-element -- small data/static thumbnails inside reusable pagination controls */}
                <img src={img.src} alt={img.alt || ''} decoding="async" loading="lazy" />
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
