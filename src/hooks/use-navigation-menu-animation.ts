'use client'

import * as React from 'react'

// Animation timing constants for the navigation overlay.
const MENU_CONTENT_ENTER_MS = 700
const MENU_CONTENT_EXIT_MS = 400

// Animation phases
export type CoverPhase = 'closed' | 'opening' | 'open' | 'closing'
export type ContentPhase = 'hidden' | 'entering' | 'visible' | 'exiting'
export type CanvasState = 'in' | 'out' | 'idle'

interface UseNavigationMenuAnimationOptions {
  isReducedMotion: boolean
}

export function useNavigationMenuAnimation({ isReducedMotion }: UseNavigationMenuAnimationOptions) {
  const [coverPhase, setCoverPhase] = React.useState<CoverPhase>('closed')
  const [contentPhase, setContentPhase] = React.useState<ContentPhase>('hidden')
  const [openCount, setOpenCount] = React.useState(0)

  const animationTimersRef = React.useRef<number[]>([])

  const clearAnimationTimers = React.useCallback(() => {
    animationTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    animationTimersRef.current = []
  }, [])

  React.useEffect(() => {
    return () => {
      clearAnimationTimers()
    }
  }, [clearAnimationTimers])

  const isMenuMounted = coverPhase !== 'closed'
  const isMenuPressed = coverPhase === 'opening' || coverPhase === 'open'
  const isContentInteractive = contentPhase === 'visible'

  const canvasState: CanvasState =
    coverPhase === 'opening' || coverPhase === 'open'
      ? 'in'
      : coverPhase === 'closing'
        ? 'out'
        : 'idle'

  const openMenu = React.useCallback(() => {
    if (isReducedMotion) {
      setCoverPhase('open')
      setContentPhase('visible')
      return
    }

    setOpenCount(Math.round(10000 * Math.random()))
    setCoverPhase('opening')
    setContentPhase('hidden')
  }, [isReducedMotion])

  const closeMenu = React.useCallback(() => {
    clearAnimationTimers()

    if (isReducedMotion) {
      setContentPhase('hidden')
      setCoverPhase('closed')
      return
    }

    setOpenCount(Math.round(10000 * Math.random()))
    setCoverPhase('closing')

    if (contentPhase === 'entering' || contentPhase === 'visible') {
      setContentPhase('exiting')
      const timer = window.setTimeout(() => {
        setContentPhase('hidden')
      }, MENU_CONTENT_EXIT_MS)
      animationTimersRef.current.push(timer)
      return
    }
  }, [clearAnimationTimers, contentPhase, isReducedMotion])

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        if (coverPhase === 'closed' || coverPhase === 'closing') {
          openMenu()
        }
        return
      }

      if (coverPhase === 'opening' || coverPhase === 'open') {
        closeMenu()
      }
    },
    [closeMenu, coverPhase, openMenu]
  )

  const handleCanvasComplete = React.useCallback(() => {
    if (coverPhase === 'opening') {
      clearAnimationTimers()
      setCoverPhase('open')
      setContentPhase('entering')
      const timer = window.setTimeout(() => {
        setContentPhase('visible')
      }, MENU_CONTENT_ENTER_MS)
      animationTimersRef.current.push(timer)
      return
    }

    if (coverPhase === 'closing') {
      setCoverPhase('closed')
      setContentPhase('hidden')
    }
  }, [clearAnimationTimers, coverPhase])

  const contentTransitionClass = React.useMemo(() => {
    if (contentPhase === 'hidden') {
      return 'opacity-0 pointer-events-none'
    }
    if (contentPhase === 'exiting') {
      return 'transition-opacity duration-200 opacity-0 pointer-events-none'
    }
    return 'opacity-100 pointer-events-auto'
  }, [contentPhase])

  return {
    coverPhase,
    contentPhase,
    openCount,
    isMenuMounted,
    isMenuPressed,
    isContentInteractive,
    canvasState,
    contentTransitionClass,
    openMenu,
    closeMenu,
    handleOpenChange,
    handleCanvasComplete,
  }
}
