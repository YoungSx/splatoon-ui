'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
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
   *  official splatoon.nintendo.com implementation. */
  contentRef: React.RefObject<HTMLElement | null>
}

/** Eased lerp for smooth scroll animation */
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function scrollTo(
  targetY: number,
  prefersReducedMotion: boolean,
) {
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY)
    return
  }

  const scrollY = window.scrollY
  const distance = Math.abs(targetY - scrollY)
  const duration = Math.min(distance / 5000 * 1000, 2000)
  let startTime: number | null = null

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutQuad(progress)
    window.scrollTo(0, lerp(scrollY, targetY, eased))

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export function SectionSideNav({
  ref,
  sections,
  contentRef,
  className,
  ...props
}: SectionSideNavProps & { ref?: React.Ref<HTMLElement> }) {
  const internalRef = React.useRef<HTMLElement>(null)
  const sidebarRef = (ref as React.RefObject<HTMLElement>) ?? internalRef
  const sectionObserverRef = React.useRef<IntersectionObserver | null>(null)
  const visibilityObserverRef = React.useRef<IntersectionObserver | null>(null)

  const prefersReducedMotion = React.useCallback(
    () =>
      document.documentElement.classList.contains('reduced-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
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
    [prefersReducedMotion],
  )

  // Track active section via IntersectionObserver on section anchors
  React.useEffect(() => {
    if (sectionObserverRef.current) return
    if (!sidebarRef.current) return

    const sectionIds = sections.map((s) => s.id)
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (targets.length === 0) return

    sectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const navItem = document.querySelector(
            `[data-section-id="${entry.target.id}"]`,
          )
          if (!navItem) return

          if (entry.isIntersecting) {
            navItem.classList.add(styles.itemActive)
            navItem.setAttribute('aria-current', 'true')
          } else if (navItem.classList.contains(styles.itemActive)) {
            navItem.classList.remove(styles.itemActive)
            navItem.removeAttribute('aria-current')
          }
        })
      },
      { root: null, rootMargin: '-50% 0px -50%', threshold: 0 },
    )

    targets.forEach((el) => sectionObserverRef.current!.observe(el))

    return () => {
      sectionObserverRef.current?.disconnect()
      sectionObserverRef.current = null
    }
  }, [sections, sidebarRef])

  // Toggle sidebar visibility based on the content container's intersection
  // with the viewport center zone — matches official splatoon.nintendo.com:
  // the container starts below the hero, so natural hysteresis prevents jitter.
  React.useEffect(() => {
    if (visibilityObserverRef.current) return
    if (!sidebarRef.current) return

    const container = contentRef.current
    if (!container) return

    visibilityObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sidebarRef.current?.classList.add(styles.sidebarShow)
        } else {
          sidebarRef.current?.classList.remove(styles.sidebarShow)
        }
      },
      { root: null, rootMargin: '-50% 0px -50%', threshold: 0 },
    )

    visibilityObserverRef.current.observe(container)

    return () => {
      visibilityObserverRef.current?.disconnect()
      visibilityObserverRef.current = null
    }
  }, [contentRef, sidebarRef])

  return (
    <nav
      ref={sidebarRef}
      data-slot="section-side-nav"
      className={cn(styles.sidebar, className)}
      aria-label="Section navigation"
      {...props}
    >
      <ul className={styles.menu}>
        <li>
          <button
            onClick={scrollToTop}
            className={cn(styles.item, styles.itemBackToTop)}
            aria-label="Back to top"
          >
            <NavArrowDown className={styles.backToTopArrow} />
          </button>
        </li>
        {sections.map(({ id, number }) => (
          <li key={id}>
            <a
              className={styles.item}
              data-section-id={id}
              onClick={scrollToSection}
              href={`#${id}`}
            >
              <NavSplat className={styles.itemSplat} />
              <span className={styles.itemText}>{number}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
