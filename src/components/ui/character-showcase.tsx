"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CharacterShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  boardClassName?: string
}

export const CharacterShowcase = React.forwardRef<HTMLDivElement, CharacterShowcaseProps>(
  ({ className, boardClassName, children, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Declare normalized motion variables dx and dy
    const dx = useMotionValue(0)
    const dy = useMotionValue(0)

    // Apply useSpring with requested config: stiffness: 180, damping: 20, mass: 0.6
    const springConfig = { stiffness: 180, damping: 20, mass: 0.6 }
    const dxSpring = useSpring(dx, springConfig)
    const dySpring = useSpring(dy, springConfig)

    // Map spring outputs to rotateX (-dySpring * 20) and rotateY (dxSpring * 20)
    const rotateX = useTransform(dySpring, (val) => -val * 20)
    const rotateY = useTransform(dxSpring, (val) => val * 20)

    // Track normalized mouse position in range [-0.5, 0.5]
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      // Calculate relative scale [-0.5, 0.5]
      const normalizedX = (mouseX / width) - 0.5
      const normalizedY = (mouseY / height) - 0.5

      dx.set(normalizedX)
      dy.set(normalizedY)
    }

    // Reset motion variables to 0 when mouse leaves
    const handleMouseLeave = () => {
      dx.set(0)
      dy.set(0)
    }

    // Enable forwarding ref to the container motion.div or allow access
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    return (
      <div
        className={cn("relative w-full h-full", className)}
        style={{ perspective: "1000px" }}
        {...props}
      >
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative w-full h-full transition-shadow duration-300 ease-out",
            "cursor-pointer select-none"
          )}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card background board */}
          <div
            className={cn(
              "absolute inset-0 w-full h-full bg-gradient-to-br from-[#eaff3d] to-[#603bff] border-3 border-chaos-black dark:border-white shadow-solid-lg rounded-2xl",
              boardClassName
            )}
            style={{
              transform: "translateZ(-10px)",
              transformStyle: "preserve-3d",
            }}
          />

          {/* Card content layers container */}
          <div
            className="relative w-full h-full"
            style={{
              transform: "translateZ(10px)",
              transformStyle: "preserve-3d",
            }}
          >
            {children}
          </div>
        </motion.div>
      </div>
    )
  }
)

CharacterShowcase.displayName = "CharacterShowcase"
