import * as React from 'react'
import { power3In, power3Out, power4InOut, lerp, getSplatRandomRotation } from '@/lib/wobble-math'

interface UseGsapModalProps {
  isOpen: boolean
  durationIn?: number
  durationOut?: number
  onOpenStart?: () => void
  onOpenComplete?: () => void
  onCloseStart?: () => void
  onCloseComplete?: () => void
  /** Optional ref to the trigger element for FLIP-style open animation */
  triggerRef?: React.RefObject<HTMLElement | null>
}

export function useGsapModal({
  isOpen,
  durationIn = 700,
  durationOut = 700,
  onOpenStart,
  onOpenComplete,
  onCloseStart,
  onCloseComplete,
  triggerRef,
}: UseGsapModalProps) {
  const [el, setEl] = React.useState<HTMLDivElement | null>(null)
  const animationRef = React.useRef<number>(0)
  const closeParamsRef = React.useRef({ rotate: 0 })

  React.useEffect(() => {
    if (!el) return

    let startTime: number | null = null
    const duration = isOpen ? durationIn : durationOut

    if (isOpen) {
      onOpenStart?.()
    } else {
      onCloseStart?.()
      closeParamsRef.current.rotate = getSplatRandomRotation()
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const rawT = Math.min(elapsed / duration, 1)

      if (isOpen) {
        // Open: FLIP-style slam from trigger position
        // Uses power4.inOut for bouncy overshoot (matches official)
        const t = power4InOut(rawT)

        // Try to get trigger position for FLIP origin
        const triggerEl = triggerRef?.current
        let originY = 20
        let originScale = 0.7

        if (triggerEl) {
          const triggerRect = triggerEl.getBoundingClientRect()
          const modalRect = el.getBoundingClientRect()
          if (modalRect.height > 0) {
            // Calculate relative Y offset from trigger center to modal center
            const triggerCenter = triggerRect.top + triggerRect.height / 2
            const modalCenter = modalRect.top + modalRect.height / 2
            originY = ((triggerCenter - modalCenter) / modalRect.height) * 100
            originScale = Math.min(triggerRect.width / modalRect.width, 0.7)
          }
        }

        const scale = lerp(originScale, 1.0, t)
        const opacity = lerp(0, 1, t)
        const yPercent = lerp(originY, 0, t)

        el.style.transform = `translateY(${yPercent}%) scale(${scale})`
        el.style.opacity = opacity.toString()

        if (rawT >= 1) {
          onOpenComplete?.()
        }
      } else {
        // Close: drop down with random rotation (matches official power3.in)
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

    cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [isOpen, durationIn, durationOut, onOpenStart, onOpenComplete, onCloseStart, onCloseComplete, triggerRef, el])

  return { contentRef: setEl }
}
