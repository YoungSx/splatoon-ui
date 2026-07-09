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
import { composeRefs } from '@/lib/react-refs'
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

export type InViewElement = React.ReactElement<{
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
  ref?: React.Ref<HTMLElement>
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

function composeEventHandlers<TEvent extends React.SyntheticEvent<HTMLElement>>(
  childHandler: ((event: TEvent) => void) | undefined,
  ownerHandler: ((event: TEvent) => void) | undefined
) {
  if (!childHandler || !ownerHandler) return undefined

  return (event: TEvent) => {
    childHandler(event)
    ownerHandler(event)
  }
}

function mergeChildEventHandlers(
  childProps: React.HTMLAttributes<HTMLElement>,
  ownerProps: React.HTMLAttributes<HTMLElement>
) {
  const onBlur = composeEventHandlers(childProps.onBlur, ownerProps.onBlur)
  const onClick = composeEventHandlers(childProps.onClick, ownerProps.onClick)
  const onFocus = composeEventHandlers(childProps.onFocus, ownerProps.onFocus)
  const onKeyDown = composeEventHandlers(childProps.onKeyDown, ownerProps.onKeyDown)
  const onKeyUp = composeEventHandlers(childProps.onKeyUp, ownerProps.onKeyUp)
  const onMouseDown = composeEventHandlers(childProps.onMouseDown, ownerProps.onMouseDown)
  const onMouseEnter = composeEventHandlers(childProps.onMouseEnter, ownerProps.onMouseEnter)
  const onMouseLeave = composeEventHandlers(childProps.onMouseLeave, ownerProps.onMouseLeave)
  const onMouseUp = composeEventHandlers(childProps.onMouseUp, ownerProps.onMouseUp)
  const onPointerCancel = composeEventHandlers(
    childProps.onPointerCancel,
    ownerProps.onPointerCancel
  )
  const onPointerDown = composeEventHandlers(childProps.onPointerDown, ownerProps.onPointerDown)
  const onPointerEnter = composeEventHandlers(childProps.onPointerEnter, ownerProps.onPointerEnter)
  const onPointerLeave = composeEventHandlers(childProps.onPointerLeave, ownerProps.onPointerLeave)
  const onPointerUp = composeEventHandlers(childProps.onPointerUp, ownerProps.onPointerUp)
  const onTouchCancel = composeEventHandlers(childProps.onTouchCancel, ownerProps.onTouchCancel)
  const onTouchEnd = composeEventHandlers(childProps.onTouchEnd, ownerProps.onTouchEnd)
  const onTouchMove = composeEventHandlers(childProps.onTouchMove, ownerProps.onTouchMove)
  const onTouchStart = composeEventHandlers(childProps.onTouchStart, ownerProps.onTouchStart)

  return {
    ...(onBlur ? { onBlur } : null),
    ...(onClick ? { onClick } : null),
    ...(onFocus ? { onFocus } : null),
    ...(onKeyDown ? { onKeyDown } : null),
    ...(onKeyUp ? { onKeyUp } : null),
    ...(onMouseDown ? { onMouseDown } : null),
    ...(onMouseEnter ? { onMouseEnter } : null),
    ...(onMouseLeave ? { onMouseLeave } : null),
    ...(onMouseUp ? { onMouseUp } : null),
    ...(onPointerCancel ? { onPointerCancel } : null),
    ...(onPointerDown ? { onPointerDown } : null),
    ...(onPointerEnter ? { onPointerEnter } : null),
    ...(onPointerLeave ? { onPointerLeave } : null),
    ...(onPointerUp ? { onPointerUp } : null),
    ...(onTouchCancel ? { onTouchCancel } : null),
    ...(onTouchEnd ? { onTouchEnd } : null),
    ...(onTouchMove ? { onTouchMove } : null),
    ...(onTouchStart ? { onTouchStart } : null),
  } satisfies React.HTMLAttributes<HTMLElement>
}

// ─── Component ──────────────────────────────────────────────────────────────

export function InView({
  ref: forwardedRef,
  direction,
  delay,
  rootMargin = '0px',
  once = true,
  drop,
  className,
  children,
  style,
  ...props
}: InViewProps): React.ReactElement {
  const [isInView, observerRef] = useInView<HTMLElement>({ rootMargin, once })
  const child = React.Children.only(children)
  const childRef = getChildRef(child)
  const childEventProps = child.props as React.HTMLAttributes<HTMLElement>
  const composedEventProps = mergeChildEventHandlers(childEventProps, props)
  const mergedStyle = mergeChildStyle(child.props.style, style)
  const mergedRef = React.useMemo(
    () => composeRefs(observerRef, childRef, forwardedRef),
    [observerRef, childRef, forwardedRef]
  )

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
    ...composedEventProps,
    ref: mergedRef,
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
  ref?: React.Ref<HTMLElement>
}

export function InViewStagger({
  ref: forwardedRef,
  variant,
  rootMargin = '0px',
  once = true,
  active,
  className,
  children,
  style,
  ...props
}: InViewStaggerProps): React.ReactElement {
  const [isInViewFromObserver, observerRef] = useInView<HTMLElement>({ rootMargin, once })
  const isInView = active !== undefined ? active : isInViewFromObserver
  const child = React.Children.only(children)
  const childRef = getChildRef(child)
  const childEventProps = child.props as React.HTMLAttributes<HTMLElement>
  const composedEventProps = mergeChildEventHandlers(childEventProps, props)
  const mergedStyle = mergeChildStyle(child.props.style, style)
  const mergedRef = React.useMemo(
    () => composeRefs(observerRef, childRef, forwardedRef),
    [observerRef, childRef, forwardedRef]
  )

  return React.cloneElement(child, {
    ...props,
    ...composedEventProps,
    ref: mergedRef,
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
