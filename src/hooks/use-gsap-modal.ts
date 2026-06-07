import * as React from 'react'
import { power3In, power3Out, lerp, getSplatRandomRotation } from '@/lib/wobble-math'

interface UseGsapModalProps {
  isOpen: boolean
  durationIn?: number
  durationOut?: number
  onCloseComplete?: () => void
}

export function useGsapModal({
  isOpen,
  durationIn = 700, // Official is ~0.7s
  durationOut = 700,
  onCloseComplete,
}: UseGsapModalProps) {
  const [el, setEl] = React.useState<HTMLDivElement | null>(null)
  const animationRef = React.useRef<number>(0)
  
  // Store the randomized parameters for the current close animation
  const closeParamsRef = React.useRef({ rotate: 0 })

  React.useEffect(() => {
    if (!el) return

    let startTime: number | null = null
    const duration = isOpen ? durationIn : durationOut

    if (!isOpen) {
      // Calculate random rotation once per close action
      closeParamsRef.current.rotate = getSplatRandomRotation()
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const rawT = Math.min(elapsed / duration, 1)

      if (isOpen) {
        // Open Animation: Slam into place
        const t = power3Out(rawT)
        // From scale 0.7, opacity 0, to scale 1, opacity 1. No rotation on entrance usually, 
        // or starting from random rotation to 0. Official starts unrotated and just fades/scales.
        // Wait, the GSAP tween: `to({ scale: .7, rotate: random, opacity: 0, yPercent: 100 })` is the CLOSE animation.
        // The entrance is likely the reverse, but let's implement the pop-in.
        
        const scale = lerp(0.7, 1.0, t)
        const opacity = lerp(0, 1, t)
        const yPercent = lerp(20, 0, t) // slight slide up
        
        el.style.transform = `translateY(${yPercent}%) scale(${scale}) rotate(0deg)`
        el.style.opacity = opacity.toString()
      } else {
        // Close Animation: Drop down, scale down, rotate, fade out
        const t = power3In(rawT)
        
        const scale = lerp(1.0, 0.7, t)
        const opacity = lerp(1, 0, t)
        const yPercent = lerp(0, 100, t)
        const rotate = lerp(0, closeParamsRef.current.rotate, t)

        el.style.transform = `translateY(${yPercent}%) scale(${scale}) rotate(${rotate}deg)`
        el.style.opacity = opacity.toString()
      }

      if (rawT < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else if (!isOpen) {
        onCloseComplete?.()
      }
    }

    // Cancel any running animation and start the new one
    cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [isOpen, durationIn, durationOut, onCloseComplete, el])

  return { contentRef: setEl }
}
