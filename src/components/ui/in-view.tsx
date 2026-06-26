'use client'

/**
 * InView — scroll-triggered animation helper.
 *
 * Mirrors the official site's class-driven pattern: the observed element
 * receives the in-view state and animation classes directly. This component
 * intentionally does not render wrapper DOM or own layout.
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

type InViewElement = React.ReactElement<{
  className?: string
  style?: React.CSSProperties
  ref?: React.Ref<HTMLElement>
}>

export interface InViewProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
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
  /** The single element to observe and animate */
  children: InViewElement
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

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ;(ref as React.MutableRefObject<T | null>).current = value
}

function getChildRef(child: InViewElement): React.Ref<HTMLElement> | undefined {
  return child.props.ref
}

function mergeChildStyle(
  childStyle: React.CSSProperties | undefined,
  ownerStyle: React.CSSProperties | undefined
) {
  if (!childStyle && !ownerStyle) return undefined
  return { ...childStyle, ...ownerStyle }
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
  style,
  ...props
}: InViewProps) {
  const [isInView, observerRef] = useInView<HTMLElement>({ rootMargin, once })
  const child = React.Children.only(children)
  const childRef = getChildRef(child)
  const mergedStyle = mergeChildStyle(child.props.style, style)
  const ref = (node: HTMLElement | null) => {
    setRef(observerRef, node)
    setRef(childRef, node)
  }

  const animClasses = React.useMemo(() => {
    const classes = [styles.anim]

    if (direction && DIRECTION_CLASS[direction]) {
      classes.push(DIRECTION_CLASS[direction])
    }
    if (drop === true) {
      classes.push(styles.drop)
    } else if (drop === 'slow') {
      classes.push(styles.dropSlow)
    }
    if (delay && delay >= 1 && delay <= 20) {
      classes.push(styles[`delay${delay}` as keyof typeof styles])
    }

    return classes
  }, [direction, drop, delay])

  return React.cloneElement(child, {
    ...props,
    ref,
    ...(mergedStyle ? { style: mergedStyle } : null),
    className: cn(child.props.className, className, animClasses, isInView && styles.inView),
  })
}

// ─── Stagger sub-component ──────────────────────────────────────────────────

export interface InViewStaggerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Stagger direction variant */
  variant?: 'up-min' | 'pop'
  /** Root margin for IntersectionObserver */
  rootMargin?: string
  /** Only trigger once */
  once?: boolean
  /** Override IntersectionObserver — when provided, controls active state directly */
  active?: boolean
  children: InViewElement
}

export function InViewStagger({
  variant,
  rootMargin = '0px',
  once = true,
  active,
  className,
  children,
  style,
  ...props
}: InViewStaggerProps) {
  const [isInViewFromObserver, observerRef] = useInView<HTMLElement>({ rootMargin, once })
  const isInView = active !== undefined ? active : isInViewFromObserver
  const child = React.Children.only(children)
  const childRef = getChildRef(child)
  const mergedStyle = mergeChildStyle(child.props.style, style)
  const ref = (node: HTMLElement | null) => {
    setRef(observerRef, node)
    setRef(childRef, node)
  }

  return React.cloneElement(child, {
    ...props,
    ref,
    ...(mergedStyle ? { style: mergedStyle } : null),
    className: cn(
      child.props.className,
      className,
      styles.stagger,
      variant === 'up-min' && styles.staggerUpMin,
      variant === 'pop' && styles.staggerPop,
      isInView && styles.inView
    ),
  })
}
