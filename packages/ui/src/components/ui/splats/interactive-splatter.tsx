'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getLocalPoint } from '@/lib/dom-geometry'
import { Splat, type SplatId } from './splat'

interface SplatInstance {
  id: string
  splatId: SplatId
  x: number
  y: number
  size: number
  color: string
  rotation: number
}

export interface InteractiveSplatterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of splats on screen before older ones fade out (default: 15) */
  maxSplats?: number
  /** Minimum diameter of spawned splat in pixels (default: 90) */
  minSize?: number
  /** Maximum diameter of spawned splat in pixels (default: 180) */
  maxSize?: number
  /** List of custom ink colors to cycle/pick randomly (default: Splatoon brand colors) */
  colors?: string[]
  /** Allow clicking parent container to spawn splats (default: true) */
  interactive?: boolean
  /** Specific splat IDs to pick from. Defaults to all bundled splat shapes. */
  splatIds?: readonly SplatId[]
  ref?: React.Ref<HTMLDivElement>
}

const DEFAULT_COLORS = [
  'var(--color-yellow)', // Neon Yellow
  'var(--color-blue)', // Ink Blue
  'var(--color-red)', // Salmon Pink
  'var(--color-green)', // Neon Green
  'var(--color-purple)', // Neon Purple
  'var(--color-orange)', // Neon Orange
]

const DEFAULT_SPLAT_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const satisfies readonly SplatId[]

/**
 * InteractiveSplatter Component.
 * Attach this inside a positioned container. Clicking anywhere in the parent
 * container will spawn dynamic ink splats in the background.
 */
export function InteractiveSplatter({
  ref,
  className,
  maxSplats = 15,
  minSize = 90,
  maxSize = 180,
  colors = DEFAULT_COLORS,
  interactive = true,
  splatIds = DEFAULT_SPLAT_IDS,
  ...props
}: InteractiveSplatterProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [splats, setSplats] = React.useState<SplatInstance[]>([])

  // Expose ref
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

  React.useEffect(() => {
    if (!interactive) return

    const parent = containerRef.current?.parentElement
    if (!parent) return

    const handleParentClick = (e: MouseEvent) => {
      // Prevent splattering if the click was handled by a form, button, or input directly
      const target = e.target as HTMLElement
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'A' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        return
      }

      const { x, y } = getLocalPoint(parent, e)

      // Generate random parameters
      const id = Math.random().toString(36).substring(2, 9)
      const splatId = splatIds[Math.floor(Math.random() * splatIds.length)] ?? DEFAULT_SPLAT_IDS[0]
      const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize
      const color = colors[Math.floor(Math.random() * colors.length)]
      const rotation = Math.floor(Math.random() * 360)

      const newSplat: SplatInstance = {
        id,
        splatId,
        x,
        y,
        size,
        color,
        rotation,
      }

      setSplats((prev) => {
        const next = [...prev, newSplat]
        if (next.length > maxSplats) {
          return next.slice(next.length - maxSplats)
        }
        return next
      })
    }

    parent.addEventListener('click', handleParentClick)
    return () => parent.removeEventListener('click', handleParentClick)
  }, [interactive, maxSplats, minSize, maxSize, colors, splatIds])

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none',
        className
      )}
      {...props}
    >
      <AnimatePresence>
        {splats.map((s) => (
          <motion.div
            key={s.id}
            className="pointer-events-none absolute origin-center select-none"
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              x: '-50%',
              y: '-50%',
              width: `${s.size}px`,
              height: `${s.size}px`,
              rotate: s.rotation,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 14,
              mass: 0.8,
            }}
          >
            <Splat
              id={s.splatId}
              color={s.color}
              className="h-full w-full drop-shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
