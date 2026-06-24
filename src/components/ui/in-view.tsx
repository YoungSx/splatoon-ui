'use client'

/**
 * InView — scroll-triggered animation helper.
 *
 * Uses IntersectionObserver to add `.in-view` class to the wrapper,
 * triggering CSS transitions on child `.anim` elements.
 *
 * CSS modules provide `.anim`, `.stagger`, and directional transition classes.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import styles from './in-view.module.css'

// ─── Types ──────────────────────────────────────────────────────────────────

export type InViewDirection = 'left' | 'right' | 'up' | 'up-min' | 'down' | 'pop'
export type InViewDelay =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20

export interface InViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation direction */
  direction?: InViewDirection
  /** Delay level (1-20, each = 0.1s) */
  delay?: InViewDelay
  /** Root margin for IntersectionObserver (e.g. "-100px", "0%") */
  rootMargin?: string
  /** Only trigger once */
  once?: boolean
  /** Use drop animation (start-scale: 1.1) instead of direction */
  drop?: boolean | 'slow'
  /** Content to animate */
  children?: React.ReactNode
}

// ─── Direction-to-CSS map ──────────────────────────────────────────────────

const DIRECTION_CLASS: Record<InViewDirection, string> = {
  left: styles.left,
  right: styles.right,
  up: styles.up,
  'up-min': styles.upMin,
  down: styles.down,
  pop: styles.pop,
}

// ─── Component ──────────────────────────────────────────────────────────────

export function InView({
  direction,
  delay,
  rootMargin = '0px',
  once = true,
  drop,
  className,
  children,
  ...props
}: InViewProps) {
  const [isInView, ref] = useInView<HTMLDivElement>({ rootMargin, once })

  // Build anim class list
  const animClasses = React.useMemo(() => {
    const classes = [styles.anim]

    // Direction or drop
    if (direction && DIRECTION_CLASS[direction]) {
      classes.push(DIRECTION_CLASS[direction])
    }
    if (drop === true) {
      classes.push(styles.drop)
    } else if (drop === 'slow') {
      classes.push(styles.dropSlow)
    }

    // Delay
    if (delay && delay >= 1 && delay <= 20) {
      classes.push(styles[`delay${delay}` as keyof typeof styles])
    }

    return classes
  }, [direction, drop, delay])

  return (
    <div ref={ref} className={cn(styles.root, isInView && styles.inView, className)} {...props}>
      <div className={cn(animClasses)}>{children}</div>
    </div>
  )
}

// ─── Stagger sub-component ──────────────────────────────────────────────────

export interface InViewStaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger direction variant */
  variant?: 'up-min' | 'pop'
  /** Root margin for IntersectionObserver */
  rootMargin?: string
  /** Only trigger once */
  once?: boolean
  /** Override IntersectionObserver — when provided, controls active state directly */
  active?: boolean
  children?: React.ReactNode
}

export function InViewStagger({
  variant,
  rootMargin = '0px',
  once = true,
  active,
  className,
  children,
  ...props
}: InViewStaggerProps) {
  const [isInViewFromObserver, ref] = useInView<HTMLDivElement>({ rootMargin, once })
  const isInView = active !== undefined ? active : isInViewFromObserver

  return (
    <div ref={ref} className={cn(styles.root, isInView && styles.inView, className)} {...props}>
      <div
        className={cn(
          styles.stagger,
          variant === 'up-min' && styles.staggerUpMin,
          variant === 'pop' && styles.staggerPop
        )}
      >
        {children}
      </div>
    </div>
  )
}
