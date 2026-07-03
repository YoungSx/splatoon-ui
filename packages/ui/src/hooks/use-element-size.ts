'use client'

import * as React from 'react'

import { observeElementResize } from '@/lib/observe-element-resize'

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
    if (!element) return

    const update = () => {
      setSize((current) => {
        const next = {
          width: element.clientWidth,
          height: element.clientHeight,
        }
        return current.width === next.width && current.height === next.height ? current : next
      })
    }

    update()
    return observeElementResize(element, update)
  }, [])

  return [ref, size] as const
}
