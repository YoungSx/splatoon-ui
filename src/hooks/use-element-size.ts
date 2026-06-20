'use client'

import * as React from 'react'

export interface ElementSize {
  width: number
  height: number
}

const EMPTY_SIZE: ElementSize = { width: 0, height: 0 }

export function useElementSize<T extends HTMLElement = HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [size, setSize] = React.useState<ElementSize>(EMPTY_SIZE)

  React.useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') return

    const update = () => {
      const rect = element.getBoundingClientRect()
      setSize((current) => {
        const next = {
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2)),
        }
        return current.width === next.width && current.height === next.height ? current : next
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}
