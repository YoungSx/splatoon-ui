"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Splat } from "@/components/ui/splats"

const REDUCED_MOTION_KEY = "splat-reduced-motion"

interface NavLink {
  label: string
  href: string
  isBuyNow?: boolean
  hoverSplatId?: number
  hoverSplatColor?: string
  hoverSplatClassName?: string
  textClassName?: string
}

const navLinks: NavLink[] = [
  { label: "Buy now", href: "#buy", isBuyNow: true },
  {
    label: "Home",
    href: "#",
    textClassName: "text-[#eaff3d]",
    hoverSplatId: 5,
    hoverSplatColor: "#f2ff27",
    hoverSplatClassName: "-left-[2.5em] top-1/2 h-[4em] w-[4em] -translate-y-[46%] rotate-[-18deg]",
  },
  {
    label: "Welcome to Splatsville",
    href: "#world",
    hoverSplatId: 9,
    hoverSplatColor: "#603bff",
    hoverSplatClassName: "-left-[2.35em] top-1/2 h-[4.2em] w-[4.2em] -translate-y-[44%] rotate-[12deg]",
  },
  {
    label: "How to play",
    href: "#gameplay",
    hoverSplatId: 8,
    hoverSplatColor: "#f2ff27",
    hoverSplatClassName: "-left-[2.45em] top-1/2 h-[4.05em] w-[4.05em] -translate-y-[45%] rotate-[14deg]",
  },
  {
    label: "Weapons & gear",
    href: "#weapons",
    hoverSplatId: 11,
    hoverSplatColor: "#603bff",
    hoverSplatClassName: "-left-[2.5em] top-1/2 h-[4.25em] w-[4.25em] -translate-y-[45%] rotate-[-10deg]",
  },
  {
    label: "News",
    href: "#news",
    hoverSplatId: 10,
    hoverSplatColor: "#603bff",
    hoverSplatClassName: "-left-[2.65em] top-1/2 h-[4.35em] w-[4.35em] -translate-y-[44%] -rotate-[18deg]",
  },
  {
    label: "Events",
    href: "#events",
    hoverSplatId: 6,
    hoverSplatColor: "#f2ff27",
    hoverSplatClassName: "-left-[2.3em] top-1/2 h-[3.95em] w-[3.95em] -translate-y-[44%] rotate-[8deg]",
  },
  {
    label: "Expansion Pass",
    href: "#expansion-pass",
    hoverSplatId: 12,
    hoverSplatColor: "#603bff",
    hoverSplatClassName: "-left-[2.55em] top-1/2 h-[4.3em] w-[4.3em] -translate-y-[44%] rotate-[16deg]",
  },
  {
    label: "Go to Splatoon Base",
    href: "https://splatoon.nintendo.com/base/",
    hoverSplatId: 4,
    hoverSplatColor: "#f2ff27",
    hoverSplatClassName: "-left-[2.45em] top-1/2 h-[4.15em] w-[4.15em] -translate-y-[45%] -rotate-[12deg]",
  },
]

const logoSplatDecorations = [
  {
    id: "logo-splat-yellow-left",
    splatId: 4,
    color: "#f2ff27",
    className: "absolute left-[3.5%] top-[-13%] h-[13.5rem] w-[13.5rem] rotate-[-12deg]",
  },
  {
    id: "logo-splat-purple-mid",
    splatId: 7,
    color: "#603bff",
    className: "absolute left-[30%] top-[-28%] h-[14rem] w-[14rem] rotate-[7deg]",
  },
  {
    id: "logo-splat-yellow-right",
    splatId: 2,
    color: "#f2ff27",
    className: "absolute right-[1%] top-[-9%] h-[13.75rem] w-[13.75rem] rotate-[10deg]",
  },
] as const

const overlayDecorations = [
  {
    id: "overlay-splat-left",
    splatId: 7,
    color: "#603bff",
    className: "absolute left-[-7.5%] top-[17%] h-[30rem] w-[30rem] rotate-[-21deg]",
  },
  {
    id: "overlay-splat-left-yellow",
    splatId: 8,
    color: "#f2ff27",
    className: "absolute left-[16%] top-[51%] h-[16rem] w-[16rem] rotate-[14deg]",
  },
  {
    id: "overlay-splat-right-yellow",
    splatId: 6,
    color: "#f2ff27",
    className: "absolute right-[4%] top-[56%] h-[27rem] w-[27rem] rotate-[18deg]",
  },
  {
    id: "overlay-splat-right-purple",
    splatId: 7,
    color: "#603bff",
    className: "absolute right-[19%] top-[79%] h-[13rem] w-[13rem] rotate-[14deg]",
  },
] as const

const DETERMINISTIC_NOISE = {
  grid3: [0.15, -0.65, 0.82, -0.3, 0.54, -0.71],
  grid6: [-0.42, 0.88, -0.15, 0.63, -0.74, 0.29, -0.81, 0.45, -0.12, 0.68, -0.35, 0.72],
  grid12: [
    0.35, -0.58, 0.71, -0.22, 0.84, -0.47, 0.12, -0.89, 0.53, -0.31, 0.64, -0.18,
    0.77, -0.52, 0.28, -0.73, 0.49, -0.61, 0.81, -0.36, 0.15, -0.85, 0.69, -0.41
  ],
  grid24: [
    -0.12, 0.45, -0.68, 0.29, -0.81, 0.53, -0.22, 0.71, -0.35, 0.64, -0.73, 0.18,
    -0.85, 0.39, -0.52, 0.61, -0.28, 0.77, -0.41, 0.84, -0.63, 0.15, -0.89, 0.49,
    -0.31, 0.68, -0.74, 0.12, -0.82, 0.58, -0.15, 0.72, -0.47, 0.81, -0.58, 0.28,
    -0.88, 0.35, -0.61, 0.52, -0.26, 0.79, -0.39, 0.69, -0.71, 0.19, -0.84, 0.42
  ],
  spikes: [
    { angle: Math.PI * 0.9, height: 1.1, sigma: 0.22 },
    { angle: Math.PI * 0.6, height: 0.95, sigma: 0.18 },
    { angle: Math.PI * 1.25, height: 1.35, sigma: 0.26 },
    { angle: Math.PI * 0.15, height: 0.65, sigma: 0.15 }
  ]
}

const menuNoise = DETERMINISTIC_NOISE
const MENU_ANIMATION_MS = 1125
const CLOSE_WAVE_LOBES = [
  { center: 0.12, width: 0.06, height: 78, ragged: 34 },
  { center: 0.28, width: 0.075, height: 118, ragged: 36 },
  { center: 0.47, width: 0.09, height: 168, ragged: 42 },
  { center: 0.68, width: 0.08, height: 132, ragged: 38 },
  { center: 0.86, width: 0.055, height: 88, ragged: 30 },
] as const
const CLOSE_WAVE_SPRAYS = [
  {
    id: "close-spray-left",
    ratio: 0.16,
    left: "11%",
    offset: -18,
    width: 170,
    height: 118,
    rotate: -18,
    path: "M39 44 C50 10 108 6 126 34 C143 14 174 30 166 60 C182 87 150 118 118 107 C96 128 50 121 43 89 C13 85 8 56 39 44 Z",
  },
  {
    id: "close-spray-mid",
    ratio: 0.48,
    left: "44%",
    offset: 10,
    width: 224,
    height: 154,
    rotate: 7,
    path: "M54 56 C56 18 126 8 152 38 C188 16 232 46 215 83 C240 120 188 154 146 137 C116 164 50 160 39 118 C8 102 17 64 54 56 Z",
  },
  {
    id: "close-spray-right",
    ratio: 0.82,
    left: "74%",
    offset: -6,
    width: 190,
    height: 128,
    rotate: 14,
    path: "M42 45 C46 16 110 8 132 34 C162 14 197 33 191 64 C212 92 171 127 132 114 C105 139 49 132 41 96 C16 89 10 57 42 45 Z",
  },
] as const

type MenuPhase = "closed" | "opening" | "open" | "closing"
type MenuOrigin = { x: number; y: number }

export function Navigation() {
  const [menuPhase, setMenuPhase] = React.useState<MenuPhase>("closed")
  const [isMenuMounted, setIsMenuMounted] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isReducedMotion, setIsReducedMotion] = React.useState(false)
  const [activeNavLabel, setActiveNavLabel] = React.useState<string | null>(null)

  // Dimension tracking for full screen viewport sizes
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })
  const [phaseProgress, setPhaseProgress] = React.useState(0)
  const [menuOrigin, setMenuOrigin] = React.useState<MenuOrigin | null>(null)
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null)

  const numPoints = 80 // Radial resolution for drawing smooth detailed bezier segments
  const isMenuPressed = menuPhase !== "closed"
  const isContentVisible =
    menuPhase === "open" || (menuPhase === "opening" && phaseProgress >= 0.32)
  const isContentInteractive =
    menuPhase === "open" || (menuPhase === "opening" && phaseProgress >= 0.42)
  // Scroll handler to collapse header bar
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initialize RM, Theme and resize trackers
  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)
    const frameId = requestAnimationFrame(() => {
      // 1. Reduced Motion init
      const storedRM = localStorage.getItem(REDUCED_MOTION_KEY)
      const mediaRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const forceRM = storedRM === "true" || (storedRM === null && mediaRM)
      setIsReducedMotion(forceRM)
      document.documentElement.classList.toggle("reduced-motion", forceRM)

      // 2. Initialize dimensions
      handleResize()
    })

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const toggleReducedMotion = React.useCallback(() => {
    setIsReducedMotion((prev) => {
      const next = !prev
      localStorage.setItem(REDUCED_MOTION_KEY, String(next))
      document.documentElement.classList.toggle("reduced-motion", next)
      return next
    })
  }, [])

  const getMenuTriggerOrigin = React.useCallback((): MenuOrigin | null => {
    const trigger = menuTriggerRef.current
    if (!trigger) return null

    const rect = trigger.getBoundingClientRect()
    if (!rect.width || !rect.height) return null

    const viewportWidth = window.innerWidth || dimensions.width
    const viewportHeight = window.innerHeight || dimensions.height

    return {
      x: Math.min(Math.max(rect.left + rect.width / 2, 0), viewportWidth),
      y: Math.min(Math.max(rect.top + rect.height / 2, 0), viewportHeight),
    }
  }, [dimensions.height, dimensions.width])

  // Synchronize dynamic clip-path progress via JS animation loop
  React.useEffect(() => {
    if (isReducedMotion || (menuPhase !== "opening" && menuPhase !== "closing")) {
      return
    }

    let startTimestamp: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const progress = Math.min(elapsed / MENU_ANIMATION_MS, 1)

      // Cubic Bezier easeInOut: cubic-bezier(0.77, 0, 0.175, 1) approximation
      const ease = (x: number) => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
      }

      setPhaseProgress(ease(progress))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
        return
      }

      if (menuPhase === "opening") {
        setMenuPhase("open")
        setPhaseProgress(1)
        return
      }

      if (menuPhase === "closing") {
        setIsMenuMounted(false)
        setMenuPhase("closed")
        setPhaseProgress(0)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [menuPhase, isReducedMotion])

  // Split mounted cover from fading content so close can feel like a tide receding.
  const toggleMenu = React.useCallback(() => {
    if (menuPhase === "opening" || menuPhase === "open") {
      setActiveNavLabel(null)
      if (isReducedMotion) {
        setPhaseProgress(0)
        setIsMenuMounted(false)
        setMenuPhase("closed")
        return
      }

      setMenuPhase("closing")
      return
    }

    if (isReducedMotion) {
      setMenuOrigin(getMenuTriggerOrigin())
      setActiveNavLabel(null)
      setIsMenuMounted(true)
      setPhaseProgress(1)
      setMenuPhase("open")
      return
    }

    setMenuOrigin(getMenuTriggerOrigin())
    setActiveNavLabel(null)
    setIsMenuMounted(true)
    setPhaseProgress(0)
    setMenuPhase("opening")
  }, [getMenuTriggerOrigin, isReducedMotion, menuPhase])

  // Harmonic waves sum function representing periodic circular Perlin-like noise
  // Smoothstep interpolation helper
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10) // Quintic smooth interpolator

  const getPeriodicNoiseValue = (angle: number, grid: number[]) => {
    if (!grid || grid.length === 0) return 0
    const N = grid.length
    let normalizedAngle = angle % (2 * Math.PI)
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI
    
    const t = (normalizedAngle / (2 * Math.PI)) * N
    const idx0 = Math.floor(t) % N
    const idx1 = (idx0 + 1) % N
    
    const u = t - Math.floor(t)
    const fadeU = fade(u)
    
    return lerp(grid[idx0], grid[idx1], fadeU)
  }

  const getMenuRadiusOffset = (angle: number, baseRadius: number, t: number) => {
    if (!menuNoise.grid3 || menuNoise.grid3.length === 0) return 0

    // 1. Fractal Brownian Motion Periodic Noise with dynamic phase shift over time 't'
    const n3 = getPeriodicNoiseValue(angle + 1.2 * t, menuNoise.grid3) * 550
    const n6 = getPeriodicNoiseValue(angle - 1.8 * t, menuNoise.grid6) * 350
    const n12 = getPeriodicNoiseValue(angle + 2.8 * t, menuNoise.grid12) * 180
    const n24 = getPeriodicNoiseValue(angle - 4.0 * t, menuNoise.grid24) * 70

    let fbm = n3 + n6 + n12 + n24
    const maxFbm = 1150

    // Apply a non-linear reshaping to make waves more organic/ink-like
    if (fbm > 0) {
      fbm = Math.pow(fbm / maxFbm, 1.1) * maxFbm
    } else {
      fbm = -Math.pow(Math.abs(fbm) / maxFbm, 1.5) * maxFbm
    }

    // 2. Ink Splat Spikes with dynamic angle drift, height growth, and sharpening
    let spikeSum = 0
    if (menuNoise.spikes) {
      menuNoise.spikes.forEach((spike, idx) => {
        // Drift angle smoothly over animation step
        const drift = 0.15 * Math.sin(t * Math.PI)
        const currentAngle = spike.angle + (idx % 2 === 0 ? drift : -drift)

        // Calculate shortest angular distance
        let diff = Math.abs(angle - currentAngle)
        if (diff > Math.PI) {
          diff = 2 * Math.PI - diff
        }

        // Sharpen spikes as they grow longer, and scale height with t^1.2
        const currentSigma = spike.sigma * (1.4 - 0.4 * t)
        const currentHeight = spike.height * 900 * Math.pow(t, 1.2)

        // Gaussian spike
        const spikeVal = currentHeight * Math.exp(-(diff * diff) / (2 * currentSigma * currentSigma))
        spikeSum += spikeVal
      })
    }

    // Combine FBM and spikes
    const totalOffset = fbm + spikeSum

    // Scale noise envelope continuously with time 't' to prevent collapsing at initial frames
    const noiseScale = 0.006 + (1.0 - 0.006) * t
    return totalOffset * noiseScale
  }

  // Radial spline generator utilizing polar coordinates & bezier curves at animation progress 't'
  const getMenuDripPath = (t: number) => {
    if (!dimensions.width || !dimensions.height) return ""

    const liveOrigin = menuOrigin
    const fallbackOrigin = {
      x: dimensions.width * 0.9,
      y: dimensions.height * 0.05,
    }
    const { x: cx, y: cy } = liveOrigin ?? fallbackOrigin

    const deltaTheta = (2 * Math.PI) / numPoints
    const k = (4 / 3) * Math.tan(Math.PI / (2 * numPoints)) // Tangent multiplier for circular bezier segment

    const points: { x: number; y: number; tx: number; ty: number }[] = []
    const baseRadius = 15 + (2400 - 15) * Math.pow(t, 1.5)

    for (let i = 0; i < numPoints; i++) {
      const angle = i * deltaTheta
      const radius = Math.max(5, baseRadius + getMenuRadiusOffset(angle, baseRadius, t))

      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      
      // Unit tangent vector at current circular sector: (-sin, cos)
      const tx = -Math.sin(angle)
      const ty = Math.cos(angle)

      points.push({ x, y, tx, ty })
    }

    // Begin path at the first vertex
    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

    for (let i = 0; i < numPoints; i++) {
      const curr = points[i]
      const next = points[(i + 1) % numPoints]
      
      const angleCurr = i * deltaTheta
      const angleNext = ((i + 1) % numPoints) * deltaTheta

      const baseR = 15 + (2400 - 15) * Math.pow(t, 1.5)
      const rCurr = Math.max(5, baseR + getMenuRadiusOffset(angleCurr, baseR, t))
      const rNext = Math.max(5, baseR + getMenuRadiusOffset(angleNext, baseR, t))

      // Control points extending tangentially to curve the segments smoothly
      const cp1x = curr.x + k * rCurr * curr.tx
      const cp1y = curr.y + k * rCurr * curr.ty

      const cp2x = next.x - k * rNext * next.tx
      const cp2y = next.y - k * rNext * next.ty

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`
    }

    path += " Z"
    return path
  }

  const getMenuCloseWavePoints = (t: number) => {
    if (!dimensions.width || !dimensions.height) return []

    const width = dimensions.width
    const height = dimensions.height
    const points = 22
    const eased = t
    const travel = -112 + (height + 224) * Math.pow(eased, 0.72)
    const waveEnvelope = Math.sin(Math.min(eased, 0.95) * Math.PI)
    const amplitudePrimary = 14 + 22 * waveEnvelope
    const amplitudeSecondary = 6 + 12 * waveEnvelope
    const phaseShift = eased * Math.PI * 0.92

    const wavePoints: Array<{ x: number; y: number }> = []

    for (let i = 0; i <= points; i++) {
      const ratio = i / points
      const x = width * ratio
      const angle = ratio * Math.PI * 2
      const sideBias = (0.44 - ratio) * 46 * (1 - eased * 0.85)
      const harmonic =
        Math.sin(angle + phaseShift) * amplitudePrimary +
        Math.sin(angle * 1.9 - phaseShift * 0.72) * amplitudeSecondary +
        getPeriodicNoiseValue(angle + phaseShift * 0.35, menuNoise.grid12) * 8 * waveEnvelope

      const lobeOffset = CLOSE_WAVE_LOBES.reduce((total, lobe, lobeIndex) => {
        const distance = ratio - lobe.center
        const gaussian = Math.exp(-(distance * distance) / (2 * lobe.width * lobe.width))
        const raggedAngle = ratio * Math.PI * (5.2 + lobeIndex * 1.6) + phaseShift * (0.5 + lobeIndex * 0.12)
        const raggedNoise =
          Math.sin(raggedAngle) * 0.65 +
          getPeriodicNoiseValue(raggedAngle * 0.5, menuNoise.grid24) * 0.35

        return total + gaussian * (lobe.height + raggedNoise * lobe.ragged) * (1.16 - eased * 0.12)
      }, 0)

      const notchOffset =
        -Math.exp(-Math.pow((ratio - 0.57) / 0.13, 2)) * (18 + 24 * waveEnvelope) -
        Math.exp(-Math.pow((ratio - 0.27) / 0.08, 2)) * (10 + 14 * waveEnvelope) -
        Math.exp(-Math.pow((ratio - 0.78) / 0.05, 2)) * (8 + 12 * waveEnvelope)

      wavePoints.push({
        x,
        y: travel + harmonic + lobeOffset + notchOffset + sideBias,
      })
    }

    return wavePoints
  }

  const getMenuCloseWavePath = (t: number) => {
    const wavePoints = getMenuCloseWavePoints(t)
    if (!wavePoints || wavePoints.length === 0) return ""
    const width = dimensions.width
    const height = dimensions.height

    let path = `M 0 ${wavePoints[0].y.toFixed(1)}`

    for (let i = 0; i < wavePoints.length - 1; i++) {
      const current = wavePoints[i]
      const next = wavePoints[i + 1]
      const midX = ((current.x + next.x) / 2).toFixed(1)
      const midY = ((current.y + next.y) / 2).toFixed(1)
      path += ` Q ${current.x.toFixed(1)} ${current.y.toFixed(1)} ${midX} ${midY}`
    }

    const last = wavePoints[wavePoints.length - 1]
    path += ` T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`
    path += ` L ${width.toFixed(1)} ${(height + 120).toFixed(1)}`
    path += ` L 0 ${(height + 120).toFixed(1)} Z`

    return path
  }

  const sampleCloseWaveY = React.useCallback((points: Array<{ x: number; y: number }>, ratio: number) => {
    if (points.length === 0) return 0

    const targetX = dimensions.width * ratio

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]
      const next = points[i + 1]

      if (targetX >= current.x && targetX <= next.x) {
        const segmentRatio = (targetX - current.x) / Math.max(next.x - current.x, 1)
        return lerp(current.y, next.y, segmentRatio)
      }
    }

    return points[points.length - 1].y
  }, [dimensions.width])

  // Inject style with calculated path literal to bypass browser CSS variable interpolation bugs
  const currentClipPath =
    dimensions.width > 0
      ? menuPhase === "closing"
        ? `path("${getMenuCloseWavePath(phaseProgress)}")`
        : `path("${getMenuDripPath(menuPhase === "open" ? 1 : phaseProgress)}")`
      : undefined

  const dripStyle = currentClipPath
    ? {
        clipPath: currentClipPath,
        WebkitClipPath: currentClipPath,
      } as React.CSSProperties
    : undefined
  const closeWavePoints = menuPhase === "closing" ? getMenuCloseWavePoints(phaseProgress) : []

  return (
    <>
      {/* ────────────────────────────────────────────────────────
         Accessibility Skip To Button
         ──────────────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:border-2 focus:border-chaos-black focus:shadow-solid-sm font-heading font-black text-sm uppercase tracking-wider transition-all"
      >
        Skip to main content
      </a>

      {/* ────────────────────────────────────────────────────────
         Sticky NavBar Header
         ──────────────────────────────────────────────────────── */}
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] w-full select-none bg-black text-white transition-all duration-300",
          isCollapsed ? "h-[72px]" : "h-[92px]"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-0 z-[1] overflow-hidden transition-all duration-300",
            isCollapsed ? "top-[30px] h-[122px] w-[194px]" : "top-[39px] h-[138px] w-[206px]"
          )}
        >
          <svg
            className="h-full w-full fill-black"
            viewBox="0 0 226 138"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M0,76.3515281 C4.72248572,74.7212575 12.0010363,76.6320718 14.737896,81.3919634 C21.8013631,93.6673091 6.44938808,110.867755 12.5995295,121.562705 C16.6019531,128.523306 25.585586,128.183536 27.7021324,118.018503 C29.2045998,110.799178 19.3107584,91.7564947 26.2962967,81.4200178 C29.659704,76.4450427 37.2562041,76.7661094 41.3926652,83.390058 C45.4761347,89.9329607 54.3600187,86.460453 52.5458361,77.966213 C51.8382425,74.6651488 53.1318607,71.6726826 55.3855619,69.8086255 C57.3368992,68.3996727 59.4440941,67.7232506 61.4795946,67.8884597 C61.5014146,67.8915768 61.5263519,67.8884597 61.5512891,67.8915768 C67.813648,68.4557814 73.340359,76.9469042 71.3516159,96.1984368 C70.064232,108.682632 63.7270614,115.194363 66.7039418,128.682281 C69.3472869,140.649028 80.0141821,141.487542 84.7460193,128.875544 C88.6237567,118.539067 84.0415428,105.372216 82.8102677,95.6030607 C79.7367555,71.1739382 97.8692304,66.2550719 108.822904,70.1889181 C118.931828,73.8204005 115.686873,82.592067 121.141889,86.1362692 C126.989667,89.9360778 135.212715,83.040937 127.020839,72.9663008 C121.603228,66.3080635 125.870609,55.0582609 134.433427,57.8169406 C146.95191,61.8505357 151.668162,54.0483035 150.879522,46.9661335 C150.165694,40.5666199 154.97546,33.8304538 167.578107,42.2249449 C179.105336,49.902491 186.134515,32.2531747 174.130361,27.4028858 C159.526503,21.5021165 156.746003,5.67633432 180.514289,6.26859325 C186.48987,6.41821656 205.036926,11.3464343 215.326646,9.69122646 C223.219275,8.41942833 226.314608,4.12399248 225.669357,0 L0,0 L0,76.3515281 Z"
            />
          </svg>
        </div>

        <div className="relative flex h-full w-full flex-col items-center justify-start">
          <button
            onClick={toggleReducedMotion}
            aria-pressed={isReducedMotion}
            className="nav-reduced-motion mt-2.5 md:mt-3"
            title="Toggle Reduced Motion"
          >
            <span aria-hidden="true" className="nav-reduced-motion__icon">
              {isReducedMotion ? <span className="nav-reduced-motion__icon-inner" /> : null}
            </span>
            <span className="nav-reduced-motion__label">
              Reduced motion
            </span>
          </button>
        </div>

        <div
          className={cn(
            "absolute left-0 z-10 transition-all duration-300",
            isCollapsed ? "top-[18px]" : "top-[30px]"
          )}
        >
          <button
            ref={menuTriggerRef}
            onClick={toggleMenu}
            className={cn(
              "nav-trigger group/menu-btn",
              isMenuPressed && "nav-trigger-pressed"
            )}
            aria-expanded={isMenuPressed}
            aria-controls="full-page-menu"
            aria-live="polite"
          >
            <div
              data-menu-trigger-icon=""
              className="nav-trigger__icon-wrap"
            >
              <span data-menu-trigger-line="" className="nav-trigger__icon" />
            </div>
            <span className="sr-only">{isMenuPressed ? "Close navigation menu" : "Open navigation menu"}</span>
            <span aria-hidden="true" className="nav-trigger__label">
              {isMenuPressed ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
         Full Page Overlay Menu (Periodic low-frequency morphing)
         ──────────────────────────────────────────────────────── */}
      {isMenuMounted && (
        <div
          id="full-page-menu"
          data-phase={menuPhase}
          className={cn(
            "fixed inset-0 z-[90] w-screen h-screen overflow-hidden select-none",
            menuPhase === "closing" ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          <div
            data-menu-cover=""
            data-phase={menuPhase}
            style={dripStyle}
            className="absolute inset-0 bg-black"
          />

          {menuPhase === "closing" && dimensions.height > 0
            ? CLOSE_WAVE_SPRAYS.map((spray, index) => {
                const anchoredY = sampleCloseWaveY(closeWavePoints, spray.ratio)
                const pulse = Math.sin(phaseProgress * Math.PI * (1.55 + index * 0.18))
                const scale = 0.82 + Math.max(pulse, 0) * 0.22 + (1 - phaseProgress) * 0.06
                const oscillation = pulse * 7
                const sprayTop = anchoredY - spray.height * (0.54 + Math.max(pulse, 0) * 0.06) + spray.offset + oscillation

                return (
                  <svg
                    key={spray.id}
                    data-menu-spray=""
                    viewBox="0 0 240 170"
                    className="absolute z-[1] overflow-visible fill-black"
                    style={{
                      left: spray.left,
                      top: `${sprayTop}px`,
                      width: `${spray.width}px`,
                      height: `${spray.height}px`,
                      transform: `translateX(-50%) rotate(${spray.rotate + pulse * 3.5}deg) scale(${scale})`,
                      transformOrigin: "center",
                    }}
                  >
                    <path d={spray.path} />
                  </svg>
                )
              })
            : null}

          <div
            data-menu-content=""
            data-phase={menuPhase}
            className={cn(
              "absolute inset-0 flex flex-col justify-center items-center text-white p-6",
              isContentInteractive ? "pointer-events-auto" : "pointer-events-none"
            )}
          >
            {overlayDecorations.map((splat) => (
              <Splat
                key={splat.id}
                id={splat.splatId}
                color={splat.color}
                className={cn("pointer-events-none absolute z-[1] opacity-100", splat.className)}
              />
            ))}

            <img
              src="https://splatoon.nintendo.com/_images/tape-assets/sticker-2-red.png"
              alt=""
              className="pointer-events-none absolute left-[15%] top-[27%] z-[2] w-[8.9rem] -rotate-[28deg] select-none"
            />
            <img
              src="https://splatoon.nintendo.com/_images/tape-assets/sticker-9.png"
              alt=""
              className="pointer-events-none absolute right-[17%] top-[58%] z-[2] w-[10rem] rotate-[-7deg] select-none"
            />

            <nav
              aria-label="Main site navigation"
              className={cn(
                "relative z-10 flex w-full max-w-[44rem] flex-col items-center pt-7 text-center transition-all duration-[300ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] md:pt-9",
                isContentVisible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-6 scale-95 opacity-0"
              )}
            >
              <div className="relative mb-7 h-[14rem] w-[40rem] max-w-[92vw] md:mb-9">
                {logoSplatDecorations.map((splat) => (
                  <Splat
                    key={splat.id}
                    id={splat.splatId}
                    color={splat.color}
                    className={cn("pointer-events-none absolute z-[1]", splat.className)}
                  />
                ))}
                <img
                  src="https://splatoon.nintendo.com/_images/logos/splatoon3-logo.png"
                  alt="Splatoon 3"
                  className="pointer-events-none absolute left-1/2 top-[0.4rem] z-[2] w-[20rem] max-w-[75%] -translate-x-1/2 select-none md:w-[21rem]"
                />
              </div>

              <ul className="relative flex w-full flex-col items-center gap-0.5">
                {navLinks.map((link, index) => {
                  if (link.isBuyNow) {
                    return (
                      <li key={link.label} className="mb-4 md:mb-5">
                        <Button
                          onClick={() => {
                            toggleMenu()
                            window.location.hash = "#buy"
                          }}
                          variant="yellow"
                          size="lg"
                          className="min-w-[240px] border-0 shadow-none hover:shadow-none active:shadow-none [&_span]:font-semibold [&_span]:normal-case [&_span]:tracking-normal"
                        >
                          Buy now
                        </Button>
                      </li>
                    )
                  }

                  const isHighlighted = link.label === "Home" || activeNavLabel === link.label

                  return (
                    <li
                      key={link.label}
                      className="relative"
                      style={{
                        transitionDelay: `${Math.max(index - 1, 0) * 80}ms`,
                      }}
                    >
                      {link.hoverSplatId ? (
                        <Splat
                          id={link.hoverSplatId}
                          data-nav-hover-splat={link.label}
                          color={link.hoverSplatColor}
                          className={cn(
                            "pointer-events-none absolute z-[1] opacity-0 transition-all duration-150 ease-out",
                            activeNavLabel === link.label
                              ? "scale-100 opacity-100"
                              : "scale-[1.32] opacity-0",
                            link.hoverSplatClassName
                          )}
                        />
                      ) : null}

                      <a
                        href={link.href}
                        data-nav-link="true"
                        data-nav-label={link.label}
                        onClick={toggleMenu}
                        onMouseEnter={() => setActiveNavLabel(link.label)}
                        onMouseLeave={() => setActiveNavLabel((current) => (current === link.label ? null : current))}
                        onFocus={() => setActiveNavLabel(link.label)}
                        onBlur={() => setActiveNavLabel((current) => (current === link.label ? null : current))}
                        className={cn(
                          "group/nav-link relative z-[2] inline-flex items-center gap-3 py-1 font-heading text-[2.4rem] font-semibold leading-none text-white transition-colors duration-150 md:text-[3.65rem]",
                          isHighlighted && "text-[#eaff3d]",
                          link.textClassName
                        )}
                      >
                        <span className="relative inline-block">
                          {link.label}
                        </span>
                        <svg
                          data-nav-chevron="true"
                          aria-hidden="true"
                          viewBox="0 0 7 12"
                          className={cn(
                            "mt-[0.22em] h-[1.1rem] w-[0.65rem] shrink-0 text-current transition-transform duration-200 ease-out md:h-[1.35rem] md:w-[0.8rem]"
                          )}
                          style={{ transform: isHighlighted ? "translateX(5px)" : "translateX(0px)" }}
                        >
                          <path
                            d="M0,11.23.12,11l.32-.47.3-.12-.16-.35.18-.49.4-.21L1.09,9l.23-.35.26-.21.32-.21L2,7.84l.2-.38v-.3l.47-.47-.05-.38L3,6.08l-.19-.77,0-.26-.26-.3-.1-.31-.42-.25,0-.38-.32-.23L1.5,3.25l0-.32-.05-.26L1,2.37.94,2,.66,1.76.51,1.41.23,1.08.3.66.14.41,0,.13l.7,0L1,.08l.14.14L1.68,0,2,.12,2.21,0l.66.21.26,0h.42l.33.14L4.3.69l0,.38.29.27.14.4L5,2l.07.37,0,.14L5.48,3l.07.09.42.3.1.33L6,4.07l.24.33.42.25,0,.35.1.4.16.47-.11.42-.21.33L6.41,7,6.2,7.2,6,7.6,6,7.93l-.28.31-.3.3,0,.19-.16.37L5,9.43l-.18.14-.23.33-.21.38.09.42-.3.33,0,.18-.66.24-.39.1-.52.09,0-.09-.5-.09-.46.07-.26.09-.4,0-.39-.07-.45.17L0,11.23Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
