'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useElementSize } from '@/hooks/use-element-size'
import { NavSplat } from './splats/nav-splat'
import { NavArrowDown } from './icons/nav-arrow-down'
import styles from './section-side-nav.module.css'

export interface SectionNavItem {
  /** Unique section identifier — must match the `id` of the target anchor element */
  id: string
  /** Display number (e.g. "01", "02") */
  number: string
}

export interface SectionSideNavProps extends React.ComponentProps<'nav'> {
  /** Sections to display in the navigation */
  sections: SectionNavItem[]
  /** Ref to the content container wrapping all sections. Sidebar visibility
   *  is tied to this element's viewport intersection — exactly matching the
   *  Splatoon UI section navigation implementation. */
  contentRef: React.RefObject<HTMLElement | null>
  /** Height, in CSS pixels, reserved for fixed chrome above the nav. */
  topInset?: number
  /** Minimum distance, in CSS pixels, between the nav and usable viewport edges. */
  viewportMargin?: number
  /** Accessible label for the nav landmark. */
  navLabel?: string
  /** Accessible label for the "back to top" button. */
  backToTopLabel?: string
}

/* ── Smooth scroll ────────────────────────────────────────────────────── */

let activeScrollFrame: number | null = null
const SIDE_NAV_VIEWPORT_MARGIN = 24
const SIDE_NAV_MIN_SCALE = 0.58

interface SideNavFitState {
  centerY: number | null
  scale: number
  maxBlockSize: number
  needsScroll: boolean
}

const defaultSideNavFitState: SideNavFitState = {
  centerY: null,
  scale: 1,
  maxBlockSize: 0,
  needsScroll: false,
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function scrollTo(targetY: number, prefersReducedMotion: boolean) {
  // Cancel any in-flight scroll animation
  if (activeScrollFrame !== null) {
    cancelAnimationFrame(activeScrollFrame)
    activeScrollFrame = null
  }

  if (prefersReducedMotion) {
    window.scrollTo(0, targetY)
    return
  }

  const scrollY = window.scrollY
  const distance = Math.abs(targetY - scrollY)
  const duration = Math.min((distance / 5000) * 1000, 2000)
  let startTime: number | null = null

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutQuad(progress)
    window.scrollTo(0, lerp(scrollY, targetY, eased))

    if (progress < 1) {
      activeScrollFrame = requestAnimationFrame(step)
    } else {
      activeScrollFrame = null
    }
  }

  activeScrollFrame = requestAnimationFrame(step)
}

/* ── Component ────────────────────────────────────────────────────────── */

export function SectionSideNav({
  ref,
  sections,
  contentRef,
  className,
  style,
  topInset = 0,
  viewportMargin = SIDE_NAV_VIEWPORT_MARGIN,
  navLabel = 'Section navigation',
  backToTopLabel = 'Back to top',
  ...props
}: SectionSideNavProps & { ref?: React.Ref<HTMLElement> }) {
  const internalRef = React.useRef<HTMLElement>(null)
  const [menuRef, menuSize] = useElementSize<HTMLUListElement>()
  const [fitState, setFitState] = React.useState<SideNavFitState>(defaultSideNavFitState)
  const [activeSectionIds, setActiveSectionIds] = React.useState<string[]>([])
  const [isVisible, setIsVisible] = React.useState(true)

  // Callback ref — merges forwarded ref with internal ref
  const sidebarCallbackRef = React.useCallback(
    (node: HTMLElement | null) => {
      ;(internalRef as React.MutableRefObject<HTMLElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
    },
    [ref]
  )

  // Cancel in-flight scroll animation on unmount
  React.useEffect(() => {
    return () => {
      if (activeScrollFrame !== null) {
        cancelAnimationFrame(activeScrollFrame)
        activeScrollFrame = null
      }
    }
  }, [])

  const prefersReducedMotion = React.useCallback(
    () =>
      document.documentElement.classList.contains('reduced-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const scrollToTop = React.useCallback(() => {
    scrollTo(0, prefersReducedMotion())
  }, [prefersReducedMotion])

  const scrollToSection = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const sectionId = e.currentTarget.dataset.sectionId
      if (!sectionId) return

      const anchor = document.getElementById(sectionId)
      if (!anchor) return

      e.preventDefault()

      const previousTabIndex = anchor.getAttribute('tabindex')
      anchor.tabIndex = -1
      anchor.focus({ preventScroll: true })
      if (previousTabIndex === null) {
        anchor.removeAttribute('tabindex')
      } else {
        anchor.tabIndex = Number(previousTabIndex)
      }

      const targetY = anchor.getBoundingClientRect().top + window.scrollY
      scrollTo(targetY, prefersReducedMotion())
    },
    [prefersReducedMotion]
  )

  const updateSidebarFit = React.useCallback(() => {
    const menu = menuRef.current
    if (!menu) return

    const naturalHeight = menu.scrollHeight
    if (naturalHeight <= 0) return

    const safeTopInset = Math.max(0, topInset)
    const safeViewportMargin = Math.max(0, viewportMargin)
    const topBoundary = safeTopInset + safeViewportMargin
    const bottomBoundary = Math.max(window.innerHeight - safeViewportMargin, topBoundary)
    const availableHeight = Math.max(bottomBoundary - topBoundary, 0)
    const centerY = topBoundary + availableHeight / 2
    const rawScale = availableHeight / naturalHeight
    const scale = Math.min(1, Math.max(SIDE_NAV_MIN_SCALE, rawScale))
    const nextFitState = {
      centerY: Number(centerY.toFixed(2)),
      scale: Number(scale.toFixed(4)),
      maxBlockSize: Math.round(availableHeight / scale),
      needsScroll: rawScale < SIDE_NAV_MIN_SCALE,
    }

    setFitState((current) =>
      current.centerY === nextFitState.centerY &&
      current.scale === nextFitState.scale &&
      current.maxBlockSize === nextFitState.maxBlockSize &&
      current.needsScroll === nextFitState.needsScroll
        ? current
        : nextFitState
    )
  }, [menuRef, topInset, viewportMargin])

  React.useEffect(() => {
    updateSidebarFit()

    // Coalesce resize bursts into a single rAF so the synchronous layout read
    // (menu.scrollHeight) runs at most once per frame instead of per event.
    let frame = 0
    const scheduleFit = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        updateSidebarFit()
      })
    }

    window.addEventListener('resize', scheduleFit)
    window.visualViewport?.addEventListener('resize', scheduleFit)

    return () => {
      window.removeEventListener('resize', scheduleFit)
      window.visualViewport?.removeEventListener('resize', scheduleFit)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [menuSize.height, sections.length, updateSidebarFit])

  // Track active section via IntersectionObserver on section anchors
  React.useEffect(() => {
    const sectionIds = sections.map((s) => s.id)
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveSectionIds((current) => {
          const next = new Set(current)
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              next.add(entry.target.id)
            } else {
              next.delete(entry.target.id)
            }
          })

          const orderedNext = sectionIds.filter((id) => next.has(id))
          if (
            orderedNext.length === current.length &&
            orderedNext.every((id, index) => id === current[index])
          ) {
            return current
          }
          return orderedNext
        })
      },
      { root: null, rootMargin: '-50% 0px -50%', threshold: 0 }
    )

    targets.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [sections])

  // Toggle sidebar visibility based on the content container's viewport bounds.
  // IntersectionObserver can deliver its initial callback late under heavy
  // hydration, so scroll/resize events also schedule the same geometry check.
  React.useEffect(() => {
    const container = contentRef.current
    if (!container) return

    let frame = 0
    const updateVisibility = () => {
      frame = 0
      const rect = container.getBoundingClientRect()
      setIsVisible(rect.bottom > 0 && rect.top < window.innerHeight)
    }
    const scheduleVisibility = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateVisibility)
    }

    const observer = new IntersectionObserver(() => scheduleVisibility(), {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    })

    observer.observe(container)
    scheduleVisibility()
    window.addEventListener('scroll', scheduleVisibility, { passive: true })
    window.addEventListener('resize', scheduleVisibility)
    window.visualViewport?.addEventListener('resize', scheduleVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scheduleVisibility)
      window.removeEventListener('resize', scheduleVisibility)
      window.visualViewport?.removeEventListener('resize', scheduleVisibility)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [contentRef])

  const sidebarStyle = React.useMemo(
    () =>
      ({
        '--section-side-nav-fit-scale': fitState.scale,
        ...(fitState.centerY === null
          ? {}
          : { '--section-side-nav-center-y': `${fitState.centerY}px` }),
        '--section-side-nav-max-block-size': `${fitState.maxBlockSize}px`,
        ...style,
      }) as React.CSSProperties,
    [fitState.centerY, fitState.maxBlockSize, fitState.scale, style]
  )

  return (
    <nav
      ref={sidebarCallbackRef}
      data-slot="section-side-nav"
      data-overflow={fitState.needsScroll ? 'scroll' : undefined}
      className={cn(styles.sidebar, isVisible && styles.sidebarShow, className)}
      aria-label={navLabel}
      style={sidebarStyle}
      {...props}
    >
      <ul ref={menuRef} className={styles.menu}>
        <li>
          <button
            type="button"
            onClick={scrollToTop}
            className={cn(styles.item, styles.itemBackToTop)}
            aria-label={backToTopLabel}
          >
            <NavArrowDown className={styles.backToTopArrow} />
          </button>
        </li>
        {sections.map(({ id, number }) => {
          const isActive = activeSectionIds.includes(id)
          return (
            <li key={id}>
              <a
                className={cn(styles.item, isActive && styles.itemActive)}
                data-section-id={id}
                onClick={scrollToSection}
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <NavSplat className={styles.itemSplat} />
                <span className={styles.itemText}>{number}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
