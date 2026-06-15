'use client'

import * as React from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import styles from '@/components/ui/navigation.module.css'

interface NavigationProps {
  /** Decorative element at the bottom-left of the header — receives isCollapsed for responsive positioning */
  headerDecoration?: (isCollapsed: boolean) => React.ReactNode
  /** Navigation menu content (e.g. NavigationDialog) */
  children: React.ReactNode
  /** Header className — defaults to 'bg-black text-white' */
  headerClassName?: string
  /** Whether to show the skip-to-content link — defaults to true */
  showSkipLink?: boolean
  /** Skip-to-content href — defaults to '#main-content' */
  skipToContentHref?: string
  /** Whether to show the reduced motion toggle — defaults to true */
  showReducedMotionToggle?: boolean
}

export function Navigation({
  headerDecoration,
  children,
  headerClassName,
  showSkipLink = true,
  skipToContentHref = '#main-content',
  showReducedMotionToggle = true,
}: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isReducedMotion, toggleReducedMotion] = useReducedMotion()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsCollapsed(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Pass isReducedMotion to NavigationDialog children
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && 'isReducedMotion' in (child.props as Record<string, unknown>)) {
      return React.cloneElement(child, { isReducedMotion } as { isReducedMotion: boolean })
    }
    return child
  })

  return (
    <>
      {showSkipLink && (
        <a
          href={skipToContentHref}
          className="font-alt focus:border-chaos-black focus:bg-primary focus:text-primary-foreground focus:shadow-solid-sm sr-only text-sm font-black tracking-wider uppercase transition-all focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:border-2 focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>
      )}

      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-[var(--z-nav)] w-full transition-all duration-300 select-none',
          headerClassName ?? 'bg-black text-white',
          isCollapsed ? 'h-[36px]' : 'h-[40px]'
        )}
      >
        {headerDecoration?.(isCollapsed)}

        {showReducedMotionToggle && (
          <div className="relative flex h-full w-full flex-col items-center justify-center">
            <button
              onClick={toggleReducedMotion}
              aria-pressed={isReducedMotion}
              className={styles.reducedMotion}
              title="Toggle Reduced Motion"
            >
              <span aria-hidden="true" className={styles.reducedMotionIcon}>
                {isReducedMotion ? <span className={styles.reducedMotionIconInner} /> : null}
              </span>
              <span className={styles.reducedMotionLabel}>Reduced motion</span>
            </button>
          </div>
        )}

        <div
          className={cn(
            'absolute left-0 z-10 transition-all duration-300',
            isCollapsed ? 'top-[35px]' : 'top-[39px]'
          )}
        >
          {enhancedChildren}
        </div>
      </header>
    </>
  )
}
