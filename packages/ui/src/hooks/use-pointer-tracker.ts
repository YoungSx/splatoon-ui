import * as React from 'react'

import { getLocalPoint } from '@/lib/dom-geometry'

interface PointerState {
  x: number
  y: number
  active: boolean
}

export function usePointerTracker(containerRef: React.RefObject<HTMLDivElement | null>) {
  const pointerRef = React.useRef<PointerState>({ x: 0, y: 0, active: false })
  const lastSpawnRef = React.useRef<number>(0)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handlePointerMove = (e: PointerEvent) => {
      const position = getLocalPoint(container, e)
      pointerRef.current.x = position.x
      pointerRef.current.y = position.y
      pointerRef.current.active = true
    }

    const handlePointerLeave = () => {
      pointerRef.current.active = false
    }

    const handlePointerDown = (e: PointerEvent) => {
      const position = getLocalPoint(container, e)
      pointerRef.current.x = position.x
      pointerRef.current.y = position.y
      pointerRef.current.active = true
      lastSpawnRef.current = 0 // Force spawn on next frame
    }

    container.addEventListener('pointermove', handlePointerMove, { passive: true })
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    container.addEventListener('pointerdown', handlePointerDown, { passive: true })

    return () => {
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      container.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [containerRef])

  return { pointerRef, lastSpawnRef }
}
