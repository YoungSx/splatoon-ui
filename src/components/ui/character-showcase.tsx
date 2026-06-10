"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { Splat3 } from "./splats"

export interface CharacterShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  boardClassName?: string
  reducedMotion?: boolean
}

export const CharacterShowcase = React.forwardRef<HTMLDivElement, CharacterShowcaseProps>(
  ({ className, boardClassName, children, reducedMotion: propReducedMotion = false, ...props }, ref) => {
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

    // Implement motion transformations for the midground, foreground, and shadows
    const midX = useTransform(dxSpring, [-0.5, 0.5], [10, -10])
    const midY = useTransform(dySpring, [-0.5, 0.5], [10, -10])
    const foreX = useTransform(dxSpring, [-0.5, 0.5], [20, -20])
    const foreY = useTransform(dySpring, [-0.5, 0.5], [20, -20])
    const shadowX = useTransform(dxSpring, [-0.5, 0.5], [15, -15])
    const shadowY = useTransform(dySpring, [-0.5, 0.5], [15, -15])

    // Track reduced motion and focus states
    const [systemReducedMotion, setSystemReducedMotion] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    // Ref for tracking active arrow keys
    const activeKeys = React.useRef<{ [key: string]: boolean }>({})

    React.useEffect(() => {
      if (typeof window === "undefined") return

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      
      const checkReducedMotion = () => {
        const prefersReduced = mediaQuery.matches
        const bodyHasClass = document.body.classList.contains("reduced-motion")
        const htmlHasClass = document.documentElement.classList.contains("reduced-motion")
        setSystemReducedMotion(prefersReduced || bodyHasClass || htmlHasClass)
      }

      // Initial check
      checkReducedMotion()

      // Listen for system preference changes
      mediaQuery.addEventListener("change", checkReducedMotion)

      // Observe class changes on html/body for manual overrides (e.g. toggles)
      const observer = new MutationObserver(checkReducedMotion)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      })

      return () => {
        mediaQuery.removeEventListener("change", checkReducedMotion)
        observer.disconnect()
      }
    }, [])

    const isReducedMotionActive = propReducedMotion || systemReducedMotion

    // Track normalized mouse position in range [-0.5, 0.5]
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (isReducedMotionActive) return
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
      if (isReducedMotionActive) return
      dx.set(0)
      dy.set(0)
    }

    // Update motion values based on active arrow keys
    const updateTiltFromKeys = () => {
      let targetDx = 0
      let targetDy = 0

      if (activeKeys.current["ArrowRight"]) targetDx += 0.3
      if (activeKeys.current["ArrowLeft"]) targetDx -= 0.3
      if (activeKeys.current["ArrowDown"]) targetDy += 0.3
      if (activeKeys.current["ArrowUp"]) targetDy -= 0.3

      dx.set(targetDx)
      dy.set(targetDy)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isReducedMotionActive) return
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault()
        activeKeys.current[event.key] = true
        updateTiltFromKeys()
      }
    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isReducedMotionActive) return
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault()
        activeKeys.current[event.key] = false
        updateTiltFromKeys()
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
      dx.set(0)
      dy.set(0)
      activeKeys.current = {}
    }

    // Enable forwarding ref to the container motion.div or allow access
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    return (
      <div
        className={cn("relative w-full h-full overflow-visible", className)}
        style={{ perspective: "1000px" }}
        tabIndex={isReducedMotionActive ? undefined : 0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative w-full h-full transition-shadow duration-300 ease-out",
            "cursor-pointer select-none overflow-visible rounded-2xl",
            isFocused && "ring-3 ring-[#eaff3d] ring-offset-2 outline-none"
          )}
          style={{
            rotateX: isReducedMotionActive ? 0 : rotateX,
            rotateY: isReducedMotionActive ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card base shadow (anti-tilt dynamic shadow offset) */}
          <motion.div
            className="absolute inset-0 w-full h-full bg-chaos-black/25 rounded-2xl blur-[5px]"
            style={{
              x: isReducedMotionActive ? 0 : shadowX,
              y: isReducedMotionActive ? 0 : shadowY,
              transform: isReducedMotionActive ? "translateZ(0px)" : "translateZ(-15px)",
            }}
          />

          {/* Card background board (tweaked to remove static shadow class) */}
          <div
            className={cn(
              "absolute inset-0 w-full h-full bg-gradient-to-br from-[#eaff3d] to-[#603bff] border-3 border-chaos-black rounded-2xl",
              boardClassName
            )}
            style={{
              transform: isReducedMotionActive ? "translateZ(0px)" : "translateZ(-5px)",
              transformStyle: "preserve-3d",
            }}
          />

          {/* Background Layer: Diagonal Watermark Text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            style={{
              transform: isReducedMotionActive ? "translateZ(0px)" : "translateZ(5px)",
              transformStyle: "preserve-3d",
            }}
          >
            <span
              className="text-7xl md:text-8xl font-black text-white/20 font-display tracking-widest uppercase select-none"
              style={{
                transform: "rotate(-12deg) skewX(-12deg)",
              }}
            >
              SPLAT 3
            </span>
          </div>

          {/* Midground Layer: Ink Splat SVGs */}
          <motion.div
            className="absolute inset-0 pointer-events-none select-none overflow-visible"
            style={{
              x: isReducedMotionActive ? 0 : midX,
              y: isReducedMotionActive ? 0 : midY,
              transform: isReducedMotionActive ? "translateZ(0px)" : "translateZ(15px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Official Yellow Ink Splat (#ffeb3b) */}
            <Splat3
              color="#ffeb3b"
              className="absolute -top-[5%] -left-[5%] w-48 h-48 opacity-95 drop-shadow-[2px_4px_6px_rgba(0,0,0,0.2)]"
            />

            {/* Official Blue Ink Splat (#603bff) - Rotated for variety */}
            <Splat3
              color="#603bff"
              className="absolute -bottom-[8%] -right-[5%] w-52 h-52 opacity-95 rotate-[135deg] drop-shadow-[2px_4px_6px_rgba(0,0,0,0.2)]"
            />
          </motion.div>

          {/* Foreground Layer: Inkling Character Wrapper (breaking bounds) */}
          <motion.div
            className="absolute -top-12 -left-6 -right-6 bottom-0 pointer-events-none select-none overflow-visible"
            style={{
              x: isReducedMotionActive ? 0 : foreX,
              y: isReducedMotionActive ? 0 : foreY,
              transform: isReducedMotionActive ? "translateZ(0px)" : "translateZ(35px)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/splatoon_inkling.png"
                alt="Splatoon Inkling Character"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)]"
              />
            </div>
          </motion.div>

          {/* Card content layers container */}
          <div
            className="relative w-full h-full overflow-visible"
            style={{
              transform: isReducedMotionActive ? "translateZ(0px)" : "translateZ(20px)",
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
