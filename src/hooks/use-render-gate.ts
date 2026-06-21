'use client'

import * as React from 'react'

export interface UseRenderGateOptions {
  /** Extra margin around the viewport for the visibility check. */
  rootMargin?: string
}

/**
 * Returns a stable ref whose `.current` reflects whether a continuous canvas
 * animation is worth rendering right now: the target is intersecting the
 * viewport AND the document/tab is visible.
 *
 * Animation loops should read `activeRef.current` at the top of each frame and
 * skip their expensive draw work (while still scheduling the next frame) when
 * it is `false`. This keeps visuals identical whenever the element is on-screen
 * while letting the GPU/CPU idle when it is scrolled away or the tab is hidden.
 *
 * The ref starts as `true` so the very first frame always paints, avoiding a
 * blank flash before the observers report their initial state.
 */
export function useRenderGate<T extends Element = Element>(
  targetRef: React.RefObject<T | null>,
  { rootMargin = '0px' }: UseRenderGateOptions = {}
): React.RefObject<boolean> {
  const activeRef = React.useRef<boolean>(true)

  React.useEffect(() => {
    const el = targetRef.current
    if (!el) return

    let inViewport = true
    let documentVisible =
      typeof document === 'undefined' ? true : document.visibilityState !== 'hidden'

    const sync = () => {
      activeRef.current = inViewport && documentVisible
    }

    const handleVisibility = () => {
      documentVisible = document.visibilityState !== 'hidden'
      sync()
    }

    let observer: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          inViewport = entry.isIntersecting
          sync()
        },
        { rootMargin }
      )
      observer.observe(el)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    sync()

    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      activeRef.current = true
    }
  }, [targetRef, rootMargin])

  return activeRef
}
