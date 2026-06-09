"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Splat } from "./splat"

interface SplatInstance {
  id: string
  splatId: number
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
  /** Specific splat IDs to pick from. Defaults to all 12 official shapes. */
  splatIds?: number[]
}

const DEFAULT_COLORS = [
  "#eaff3d", // Neon Yellow
  "#603bff", // Ink Blue
  "#ff585e", // Salmon Pink
  "#00c8b4", // Neon Green
  "#a51ee1", // Neon Purple
  "#fa5a00", // Neon Orange
]

/**
 * InteractiveSplatter Component.
 * Attach this inside any relative container. Clicking anywhere in the parent
 * container will spawn dynamic, high-fidelity Splatoon ink splats in the background.
 */
export const InteractiveSplatter = React.forwardRef<HTMLDivElement, InteractiveSplatterProps>(
  (
    {
      className,
      maxSplats = 15,
      minSize = 90,
      maxSize = 180,
      colors = DEFAULT_COLORS,
      interactive = true,
      splatIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [splats, setSplats] = React.useState<SplatInstance[]>([])

    // Expose ref
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (!interactive) return

      const parent = containerRef.current?.parentElement
      if (!parent) return

      // Ensure parent has relative/absolute positioning so absolute splats align
      const parentStyle = window.getComputedStyle(parent)
      if (parentStyle.position === "static") {
        parent.style.position = "relative"
      }

      const handleParentClick = (e: MouseEvent) => {
        // Prevent splattering if the click was handled by a form, button, or input directly
        const target = e.target as HTMLElement
        if (
          target.tagName === "BUTTON" ||
          target.tagName === "INPUT" ||
          target.tagName === "A" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a")
        ) {
          return
        }

        const rect = parent.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Generate random parameters
        const id = Math.random().toString(36).substring(2, 9)
        const splatId = splatIds[Math.floor(Math.random() * splatIds.length)]
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

      parent.addEventListener("click", handleParentClick)
      return () => parent.removeEventListener("click", handleParentClick)
    }, [interactive, maxSplats, minSize, maxSize, colors, splatIds])

    return (
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0",
          className
        )}
        {...props}
      >
        <AnimatePresence>
          {splats.map((s) => (
            <motion.div
              key={s.id}
              className="absolute pointer-events-none select-none origin-center"
              style={{
                left: `${s.x}px`,
                top: `${s.y}px`,
                x: "-50%",
                y: "-50%",
                width: `${s.size}px`,
                height: `${s.size}px`,
                rotate: s.rotation,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.95 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 14,
                mass: 0.8,
              }}
            >
              <Splat id={s.splatId} color={s.color} className="w-full h-full drop-shadow-[1px_2px_3px_rgba(0,0,0,0.15)]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

InteractiveSplatter.displayName = "InteractiveSplatter"
