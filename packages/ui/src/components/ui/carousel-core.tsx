'use client'

import * as React from 'react'

import { composeRefs } from '@/lib/react-refs'
import { cn } from '@/lib/utils'
import { splatoonAssetUrl, type SplatoonAssetBasePath } from './assets'
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
  itemCount?: number
  onIndexChange?: (index: number) => void
  ref?: React.Ref<HTMLDivElement>
}

export interface CarouselViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

export interface CarouselBleedBoundaryProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

export function Carousel({
  ref,
  children,
  className,
  index,
  defaultIndex,
  itemCount: itemCountProp,
  onIndexChange,
  onKeyDown,
  role = 'region',
  tabIndex = 0,
  ...props
}: CarouselProps) {
  const resolvedDefaultIndex = defaultIndex ?? 0
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

export function CarouselViewport({ ref, className, ...props }: CarouselViewportProps) {
  return (
    <div
      ref={ref}
      data-slot="carousel-viewport"
      className={cn('relative w-full overflow-x-clip', className)}
      {...props}
    />
  )
}

export function CarouselBleedBoundary({ ref, className, ...props }: CarouselBleedBoundaryProps) {
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

export function CarouselContent({ ref, className, children, ...props }: CarouselContentProps) {
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
  ref?: React.Ref<HTMLDivElement>
}

export function CarouselItem({
  ref,
  className,
  children,
  'data-index': index,
  style,
  ...props
}: CarouselItemProps) {
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
          ...style,
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
  ref?: React.Ref<HTMLDivElement>
}

export function FadeCarouselItem({
  ref,
  className,
  children,
  'data-index': index,
  rotateAmount,
  style,
  ...props
}: FadeCarouselItemProps) {
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
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

export interface CarouselSwipeAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export function CarouselSwipeArea({
  ref,
  children,
  className,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  ...props
}: CarouselSwipeAreaProps) {
  const { goToNext, goToPrev } = useCarousel()
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const state = React.useRef({ startX: 0, startY: 0, dx: 0, offsetting: false, scrolling: true })
  const setWrapperRef = React.useMemo(() => composeRefs(wrapperRef, ref), [ref])

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      onTouchStart?.(event)
      if (event.defaultPrevented) return

      state.current.startX = event.touches[0].clientX
      state.current.startY = event.touches[0].clientY
      state.current.dx = 0
      state.current.offsetting = false
      state.current.scrolling = true
    },
    [onTouchStart]
  )

  const handleTouchMove = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      onTouchMove?.(event)
      if (event.defaultPrevented) return

      const s = state.current
      const dx = event.touches[0].clientX - s.startX
      const dy = Math.abs(event.touches[0].clientY - s.startY)

      if (!s.offsetting) {
        if (dy > 20) return
        if (Math.abs(dx) > 10) {
          s.offsetting = true
          s.scrolling = false
        }
      }

      if (s.offsetting) {
        event.preventDefault()
        s.dx = dx
        wrapperRef.current?.style.setProperty('--touch-offset', String(dx))
      }
    },
    [onTouchMove]
  )

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      onTouchEnd?.(event)
      const shouldNavigate = !event.defaultPrevented
      const s = state.current
      wrapperRef.current?.style.removeProperty('--touch-offset')

      if (shouldNavigate && s.offsetting && Math.abs(s.dx) > 50) {
        if (s.dx < 0) goToNext()
        else goToPrev()
      }

      s.startX = 0
      s.dx = 0
      s.offsetting = false
      s.scrolling = true
    },
    [goToNext, goToPrev, onTouchEnd]
  )

  return (
    <div
      ref={setWrapperRef}
      data-slot="carousel-swipe-area"
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CarouselPaginationProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  'children'
> {
  labels?: string[]
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  /** Accessible label template for unlabeled pagination buttons. Receives the 1-based slide number. */
  getSlideLabel?: (index: number) => string
  ref?: React.Ref<HTMLUListElement>
}

export function CarouselPagination({
  ref,
  className,
  labels,
  assetBasePath,
  getSlideLabel = (i) => `Go to slide ${i}`,
  style,
  ...props
}: CarouselPaginationProps) {
  const { currentIndex, itemCount, goToIndex } = useCarousel()

  return (
    <ul
      ref={ref}
      data-slot="carousel-pagination"
      className={cn(paginationStyles.pagination, className)}
      style={
        {
          '--carousel-pagination-icon-url': splatoonAssetUrl(
            'svg/icon-pagination.svg',
            assetBasePath
          ),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {Array.from({ length: itemCount }, (_, index) => (
        <li key={index} data-slot="carousel-pagination-item" className={paginationStyles.item}>
          <button
            type="button"
            onClick={() => goToIndex(index)}
            aria-label={labels?.[index] ?? getSlideLabel(index + 1)}
            data-slot="carousel-pagination-button"
            className={paginationStyles.button}
          >
            <span
              data-slot="carousel-pagination-icon-container"
              className={paginationStyles.iconContainer}
            >
              <span
                aria-hidden="true"
                data-active={currentIndex === index ? 'true' : undefined}
                data-slot="carousel-pagination-icon"
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

export interface CarouselImagePaginationProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  'children'
> {
  images: CarouselImagePaginationItem[]
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  /** Accessible label for a button when the image has an alt text. */
  getImageLabel?: (alt: string) => string
  /** Accessible label for a button when the image has no alt text. Receives the 1-based slide number. */
  getSlideLabel?: (index: number) => string
  ref?: React.Ref<HTMLUListElement>
}

export function CarouselImagePagination({
  ref,
  className,
  images,
  assetBasePath,
  getImageLabel = (alt) => `Go to ${alt}`,
  getSlideLabel = (i) => `Go to slide ${i}`,
  style,
  ...props
}: CarouselImagePaginationProps) {
  const { currentIndex, goToIndex } = useCarousel()

  return (
    <ul
      ref={ref}
      data-slot="carousel-image-pagination"
      className={cn(paginationStyles.pagination, className)}
      style={
        {
          '--carousel-pagination-icon-url': splatoonAssetUrl(
            'svg/icon-pagination.svg',
            assetBasePath
          ),
          '--carousel-pagination-splat-url': splatoonAssetUrl(
            'svg/pagination-splat.svg',
            assetBasePath
          ),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {images.map((img, index) => (
        <li key={index} data-slot="carousel-pagination-item" className={paginationStyles.item}>
          <button
            type="button"
            onClick={() => goToIndex(index)}
            aria-label={img.alt ? getImageLabel(img.alt) : getSlideLabel(index + 1)}
            data-slot="carousel-pagination-button"
            className={paginationStyles.button}
          >
            <div
              style={{ '--rotate': `${img.rotate ?? 0}deg` } as React.CSSProperties}
              data-active={currentIndex === index ? 'true' : undefined}
              data-slot="carousel-image-pagination-button"
              className={cn(
                paginationStyles.imagePaginationButton,
                currentIndex === index && paginationStyles.imagePaginationActive
              )}
            >
              <div
                data-slot="carousel-image-pagination-image"
                className={paginationStyles.imagePaginationImage}
              >
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
