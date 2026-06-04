'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NavMenuButton } from '@/components/ui/nav-menu-button'
import { Splat } from '@/components/ui/splats'

interface NavLink {
  label: string
  href: string
  isBuyNow?: boolean
  selectedKey?: string
  hoverSplatId?: number
  hoverSplatColor?: string
  hoverSplatClassName?: string
  textClassName?: string
}

const navLinks: NavLink[] = [
  { label: 'Buy now', href: '#buy', isBuyNow: true },
  {
    label: 'Home',
    href: '#',
    selectedKey: 'home',
    hoverSplatId: 5,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName: '-left-[2.5em] top-1/2 h-[4em] w-[4em] -translate-y-[46%] rotate-[-18deg]',
  },
  {
    label: 'Welcome to Splatsville',
    href: '#world',
    selectedKey: 'world',
    hoverSplatId: 9,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.35em] top-1/2 h-[4.2em] w-[4.2em] -translate-y-[44%] rotate-[12deg]',
  },
  {
    label: 'How to play',
    href: '#gameplay',
    selectedKey: 'gameplay',
    hoverSplatId: 8,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName:
      '-left-[2.45em] top-1/2 h-[4.05em] w-[4.05em] -translate-y-[45%] rotate-[14deg]',
  },
  {
    label: 'Weapons & gear',
    href: '#weapons',
    selectedKey: 'weapons',
    hoverSplatId: 11,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.5em] top-1/2 h-[4.25em] w-[4.25em] -translate-y-[45%] rotate-[-10deg]',
  },
  {
    label: 'News',
    href: '#news',
    selectedKey: 'news',
    hoverSplatId: 10,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.65em] top-1/2 h-[4.35em] w-[4.35em] -translate-y-[44%] -rotate-[18deg]',
  },
  {
    label: 'Events',
    href: '#events',
    selectedKey: 'events',
    hoverSplatId: 6,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName:
      '-left-[2.3em] top-1/2 h-[3.95em] w-[3.95em] -translate-y-[44%] rotate-[8deg]',
  },
  {
    label: 'Expansion Pass',
    href: '#expansion-pass',
    selectedKey: 'expansion-pass',
    hoverSplatId: 12,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.55em] top-1/2 h-[4.3em] w-[4.3em] -translate-y-[44%] rotate-[16deg]',
  },
  {
    label: 'Go to Splatoon Base',
    href: 'https://splatoon.nintendo.com/base/',
    selectedKey: 'splatoon-base',
    hoverSplatId: 4,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName:
      '-left-[2.45em] top-1/2 h-[4.15em] w-[4.15em] -translate-y-[45%] -rotate-[12deg]',
  },
]

const logoSplatDecorations = [
  {
    id: 'logo-splat-yellow-left',
    splatId: 4,
    color: '#f2ff27',
    className: 'absolute left-[3.5%] top-[-13%] h-[13.5rem] w-[13.5rem] rotate-[-12deg]',
  },
  {
    id: 'logo-splat-purple-mid',
    splatId: 7,
    color: '#603bff',
    className: 'absolute left-[30%] top-[-28%] h-[14rem] w-[14rem] rotate-[7deg]',
  },
  {
    id: 'logo-splat-yellow-right',
    splatId: 2,
    color: '#f2ff27',
    className: 'absolute right-[1%] top-[-9%] h-[13.75rem] w-[13.75rem] rotate-[10deg]',
  },
] as const

const overlayDecorations = [
  {
    id: 'overlay-splat-left',
    splatId: 7,
    color: '#603bff',
    className: 'absolute left-[-7.5%] top-[17%] h-[30rem] w-[30rem] rotate-[-21deg]',
  },
  {
    id: 'overlay-splat-left-yellow',
    splatId: 8,
    color: '#f2ff27',
    className: 'absolute left-[16%] top-[51%] h-[16rem] w-[16rem] rotate-[14deg]',
  },
  {
    id: 'overlay-splat-right-yellow',
    splatId: 6,
    color: '#f2ff27',
    className: 'absolute right-[4%] top-[56%] h-[27rem] w-[27rem] rotate-[18deg]',
  },
  {
    id: 'overlay-splat-right-purple',
    splatId: 7,
    color: '#603bff',
    className: 'absolute right-[19%] top-[79%] h-[13rem] w-[13rem] rotate-[14deg]',
  },
] as const

const MENU_ANIMATION_MS = 1125
const MENU_CONTENT_ENTER_MS = 300
const MENU_CONTENT_EXIT_MS = 240
const MENU_CONTENT_TRANSITION_IN_EASING = 'cubic-bezier(0.15, 0.9, 0.25, 1)'
const MENU_CONTENT_TRANSITION_OUT_EASING = 'cubic-bezier(0.25, 0.12, 0.4, 1)'
const CLOSE_WAVE_LOBES = [
  { center: 0.12, width: 0.06, height: 78, ragged: 34 },
  { center: 0.28, width: 0.075, height: 118, ragged: 36 },
  { center: 0.47, width: 0.09, height: 168, ragged: 42 },
  { center: 0.68, width: 0.08, height: 132, ragged: 38 },
  { center: 0.86, width: 0.055, height: 88, ragged: 30 },
] as const

type CoverPhase = 'closed' | 'opening' | 'open' | 'closing'
type ContentPhase = 'hidden' | 'entering' | 'visible' | 'exiting'
type MenuOrigin = { x: number; y: number }
type MenuSpike = {
  offset: number
  height: number
  sigma: number
  pulseCenterA: number
  pulseCenterB: number
  pulseWidthA: number
  pulseWidthB: number
  pulseGainA: number
  pulseGainB: number
  wobblePhase: number
  wobbleSpeed: number
  wobbleDepth: number
  sigmaPhase: number
  sigmaDepth: number
  driftPhase: number
  driftAmount: number
}
type MenuNoise = {
  grid4: number[]
  grid8: number[]
  grid16: number[]
  detailGrid: number[]
  spikes: MenuSpike[]
}

type NavigationDialogProps = {
  isReducedMotion: boolean
}

function getCurrentSelectedNavKey() {
  if (typeof window === 'undefined') {
    return 'home'
  }

  const currentPath = window.location.pathname.toLowerCase()
  const currentHash = window.location.hash.replace(/^#/, '').toLowerCase()
  const matchedLink = navLinks.find((link) => {
    if (!link.selectedKey) return false
    if (currentHash) {
      return currentHash === link.selectedKey
    }
    if (link.selectedKey === 'home') {
      return currentPath === '/' || currentPath === ''
    }
    return currentPath.includes(link.selectedKey)
  })

  return matchedLink?.selectedKey ?? 'home'
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createCircularNoiseGrid(count: number, min = -1, max = 1) {
  return Array.from({ length: count }, () => randomBetween(min, max))
}

function createMenuNoise(): MenuNoise {
  const spikeCount = 4
  const angularOffsets = [
    randomBetween(-1.02, -0.7),
    randomBetween(-0.28, 0.04),
    randomBetween(0.26, 0.62),
    randomBetween(0.92, 1.28),
  ]
  return {
    grid4: createCircularNoiseGrid(4, -0.95, 0.95),
    grid8: createCircularNoiseGrid(8, -0.28, 0.28),
    grid16: createCircularNoiseGrid(16, -0.03, 0.03),
    detailGrid: createCircularNoiseGrid(24, -0.006, 0.006),
    spikes: Array.from({ length: spikeCount }, (_, index) => ({
      offset: angularOffsets[index],
      height:
        index === 0
          ? randomBetween(3.2, 4.1)
          : index === 1
            ? randomBetween(1.15, 1.6)
            : index === 2
              ? randomBetween(0.45, 0.7)
              : randomBetween(0.16, 0.3),
      sigma:
        index === 0
          ? randomBetween(0.24, 0.34)
          : index === 1
            ? randomBetween(0.18, 0.26)
            : index === 2
              ? randomBetween(0.12, 0.18)
              : randomBetween(0.08, 0.12),
      pulseCenterA:
        index === 0
          ? randomBetween(0.2, 0.34)
          : index === 1
            ? randomBetween(0.28, 0.44)
            : index === 2
              ? randomBetween(0.4, 0.58)
              : randomBetween(0.5, 0.72),
      pulseCenterB:
        index === 0
          ? randomBetween(0.52, 0.68)
          : index === 1
            ? randomBetween(0.56, 0.78)
            : index === 2
              ? randomBetween(0.62, 0.84)
              : randomBetween(0.68, 0.9),
      pulseWidthA:
        index === 0 ? randomBetween(0.055, 0.085) : randomBetween(0.05, 0.08),
      pulseWidthB:
        index === 0 ? randomBetween(0.065, 0.11) : randomBetween(0.055, 0.095),
      pulseGainA:
        index === 0
          ? randomBetween(1.35, 1.8)
          : index === 1
            ? randomBetween(0.95, 1.4)
            : index === 2
              ? randomBetween(0.6, 0.95)
              : randomBetween(0.38, 0.62),
      pulseGainB:
        index === 0
          ? randomBetween(2.15, 2.9)
          : index === 1
            ? randomBetween(1.05, 1.55)
            : index === 2
              ? randomBetween(0.58, 0.92)
              : randomBetween(0.3, 0.5),
      wobblePhase: randomBetween(0, Math.PI * 2),
      wobbleSpeed: randomBetween(5.8, 8.9),
      wobbleDepth:
        index === 0
          ? randomBetween(0.16, 0.24)
          : index === 1
            ? randomBetween(0.12, 0.2)
            : randomBetween(0.08, 0.16),
      sigmaPhase: randomBetween(0, Math.PI * 2),
      sigmaDepth:
        index === 0
          ? randomBetween(0.12, 0.18)
          : index === 1
            ? randomBetween(0.1, 0.16)
            : randomBetween(0.08, 0.12),
      driftPhase: randomBetween(0, Math.PI * 2),
      driftAmount:
        index === 0
          ? randomBetween(0.05, 0.09)
          : index === 1
            ? randomBetween(0.04, 0.075)
            : randomBetween(0.02, 0.05),
    })),
  }
}

export function NavigationDialog({ isReducedMotion }: NavigationDialogProps) {
  const [coverPhase, setCoverPhase] = React.useState<CoverPhase>('closed')
  const [contentPhase, setContentPhase] = React.useState<ContentPhase>('hidden')
  const [activeNavLabel, setActiveNavLabel] = React.useState<string | null>(null)
  const [selectedNavKey, setSelectedNavKey] = React.useState(getCurrentSelectedNavKey)
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })
  const [phaseProgress, setPhaseProgress] = React.useState(0)
  const [menuOrigin, setMenuOrigin] = React.useState<MenuOrigin | null>(null)
  const [menuNoise, setMenuNoise] = React.useState<MenuNoise>(createMenuNoise)

  const menuTriggerRef = React.useRef<HTMLButtonElement>(null)
  const animationTimersRef = React.useRef<number[]>([])
  const numPoints = 144

  const isMenuMounted = coverPhase !== 'closed'
  const isMenuPressed = coverPhase !== 'closed'
  const isContentInteractive = contentPhase === 'visible'

  const clearAnimationTimers = React.useCallback(() => {
    animationTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    animationTimersRef.current = []
  }, [])

  React.useEffect(() => {
    return () => {
      clearAnimationTimers()
    }
  }, [clearAnimationTimers])

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  React.useEffect(() => {
    const syncSelectedNavKey = () => {
      setSelectedNavKey(getCurrentSelectedNavKey())
    }

    window.addEventListener('hashchange', syncSelectedNavKey)
    window.addEventListener('popstate', syncSelectedNavKey)

    return () => {
      window.removeEventListener('hashchange', syncSelectedNavKey)
      window.removeEventListener('popstate', syncSelectedNavKey)
    }
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

  React.useEffect(() => {
    if (isReducedMotion || (coverPhase !== 'opening' && coverPhase !== 'closing')) {
      return
    }

    let startTimestamp: number | null = null
    let animationFrameId = 0

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const progress = Math.min(elapsed / MENU_ANIMATION_MS, 1)

      const ease = (value: number) => {
        return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
      }

      setPhaseProgress(ease(progress))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
        return
      }

      if (coverPhase === 'opening') {
        clearAnimationTimers()
        setCoverPhase('open')
        setPhaseProgress(1)
        setContentPhase('entering')
        const timer = window.setTimeout(() => {
          setContentPhase('visible')
        }, MENU_CONTENT_ENTER_MS)
        animationTimersRef.current.push(timer)
        return
      }

      if (coverPhase === 'closing') {
        setCoverPhase('closed')
        setContentPhase('hidden')
        setPhaseProgress(0)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [clearAnimationTimers, coverPhase, isReducedMotion])

  const openMenu = React.useCallback(() => {
    setMenuNoise(createMenuNoise())
    setMenuOrigin(getMenuTriggerOrigin())
    setActiveNavLabel(null)

    if (isReducedMotion) {
      setCoverPhase('open')
      setPhaseProgress(1)
      setContentPhase('visible')
      return
    }

    setCoverPhase('opening')
    setContentPhase('hidden')
    setPhaseProgress(0)
  }, [getMenuTriggerOrigin, isReducedMotion])

  const closeMenu = React.useCallback(() => {
    clearAnimationTimers()
    setActiveNavLabel(null)

    if (isReducedMotion) {
      setPhaseProgress(0)
      setContentPhase('hidden')
      setCoverPhase('closed')
      return
    }

    if (contentPhase === 'entering' || contentPhase === 'visible') {
      setContentPhase('exiting')
      const timer = window.setTimeout(() => {
        setContentPhase('hidden')
        setCoverPhase('closing')
        setPhaseProgress(0)
      }, MENU_CONTENT_EXIT_MS)
      animationTimersRef.current.push(timer)
      return
    }

    setCoverPhase('closing')
    setPhaseProgress(0)
  }, [clearAnimationTimers, contentPhase, isReducedMotion])

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        if (coverPhase === 'closed' || coverPhase === 'closing') {
          openMenu()
        }
        return
      }

      if (coverPhase === 'opening' || coverPhase === 'open') {
        closeMenu()
      }
    },
    [closeMenu, coverPhase, openMenu]
  )

  const closeMenuAndNavigate = React.useCallback(
    (href: string) => {
      closeMenu()
      if (href.startsWith('#')) {
        window.location.hash = href
        return
      }
      window.location.href = href
    },
    [closeMenu]
  )

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

  const getPeriodicNoiseValue = (angle: number, grid: number[]) => {
    if (!grid || grid.length === 0) return 0
    const size = grid.length
    let normalizedAngle = angle % (2 * Math.PI)
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI

    const t = (normalizedAngle / (2 * Math.PI)) * size
    const idx0 = Math.floor(t) % size
    const idx1 = (idx0 + 1) % size
    const u = t - Math.floor(t)

    return lerp(grid[idx0], grid[idx1], fade(u))
  }

  const getAngularDistance = (angleA: number, angleB: number) => {
    let diff = Math.abs(angleA - angleB)
    if (diff > Math.PI) {
      diff = 2 * Math.PI - diff
    }
    return diff
  }

  const getTemporalGaussian = (t: number, center: number, width: number) => {
    const distance = t - center
    return Math.exp(-(distance * distance) / (2 * width * width))
  }

  const getImpulse = (value: number, power = 1.9) => {
    if (value <= 0) return 0
    return Math.pow(value, power)
  }

  const getMenuRadiusOffset = (angle: number, t: number, frontAngle: number) => {
    const n4 = getPeriodicNoiseValue(angle + 0.92 * t, menuNoise.grid4) * 650
    const n8 = getPeriodicNoiseValue(angle - 1.02 * t, menuNoise.grid8) * 68
    const n16 = getPeriodicNoiseValue(angle + 1.34 * t, menuNoise.grid16) * 3
    const detail = getPeriodicNoiseValue(angle - 1.8 * t, menuNoise.detailGrid) * 0.6
    const frontDistance = getAngularDistance(angle, frontAngle)
    const frontWeight = Math.exp(-(frontDistance * frontDistance) / (2 * 0.95 * 0.95))
    const fbmSectorScale = 0.14 + frontWeight * 0.86

    let fbm = (n4 + n8 + n16 + detail) * fbmSectorScale
    const maxFbm = 1280

    if (fbm > 0) {
      fbm = Math.pow(fbm / maxFbm, 1.01) * maxFbm
    } else {
      fbm = -Math.pow(Math.abs(fbm) / maxFbm, 1.04) * maxFbm
    }

    let spikeSum = 0
    menuNoise.spikes.forEach((spike, spikeIndex) => {
      const rawPulseA = getTemporalGaussian(t, spike.pulseCenterA, spike.pulseWidthA)
      const rawPulseB = getTemporalGaussian(t, spike.pulseCenterB, spike.pulseWidthB)
      const pulseA = getImpulse(rawPulseA, spikeIndex === 0 ? 2.6 : 2.25) * spike.pulseGainA
      const pulseB = getImpulse(rawPulseB, spikeIndex === 0 ? 2.9 : 2.35) * spike.pulseGainB
      const openingEnvelope = 0.2 + 0.8 * Math.pow(t, 0.86)
      const wobble =
        1 +
        Math.sin(t * spike.wobbleSpeed + spike.wobblePhase) * spike.wobbleDepth +
        Math.sin(t * (spike.wobbleSpeed * 1.57) + spike.wobblePhase * 0.6) * (spike.wobbleDepth * 0.14)
      const secondaryBurst =
        spikeIndex === 0
          ? getImpulse(
              getTemporalGaussian(
                t,
                Math.min(0.9, spike.pulseCenterB + 0.045),
                Math.max(0.04, spike.pulseWidthB * 0.72)
              ),
              3.2
            ) * 2.35
          : 0
      const surge = 1 + pulseA + pulseB + secondaryBurst
      const liveHeightScale = Math.max(0.18, openingEnvelope * surge * wobble)
      const liveSigmaScale =
        1 +
        Math.sin(t * (spike.wobbleSpeed * 0.94) + spike.sigmaPhase) * spike.sigmaDepth +
        pulseB * 0.05 +
        secondaryBurst * 0.08
      const drift =
        Math.sin(t * (spike.wobbleSpeed * 0.72) + spike.driftPhase) * spike.driftAmount +
        Math.sin(t * (spike.wobbleSpeed * 1.12) + spike.driftPhase * 0.7) * (spike.driftAmount * 0.18)
      const currentAngle = frontAngle + spike.offset + drift

      const currentSigma = spike.sigma * Math.max(0.7, liveSigmaScale)
      const currentHeight = spike.height * 540 * liveHeightScale
      const diff = getAngularDistance(angle, currentAngle)
      const spikeValue =
        currentHeight * Math.exp(-(diff * diff) / (2 * currentSigma * currentSigma))

      spikeSum += spikeValue
    })

    const totalOffset = fbm + spikeSum
    const noiseScale = 0.08 + 0.92 * Math.pow(t, 0.9)
    return totalOffset * noiseScale
  }

  const getMenuDripPath = (t: number) => {
    if (!dimensions.width || !dimensions.height) return ''

    const fallbackOrigin = {
      x: 0,
      y: 0,
    }
    const { x: cx, y: cy } = menuOrigin ?? fallbackOrigin
    const width = dimensions.width
    const height = dimensions.height
    const travelProgress = Math.pow(t, 0.9)
    const frontAngle = Math.atan2(height - cy, width - cx)
    const farthestCornerDistance = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(width - cx, cy),
      Math.hypot(cx, height - cy),
      Math.hypot(width - cx, height - cy)
    )
    const baseRadius = 14 + farthestCornerDistance * 0.94 * travelProgress
    const deltaTheta = (Math.PI * 2) / numPoints

    const radii = Array.from({ length: numPoints }, (_, index) => {
      const angle = index * deltaTheta
      const radius = baseRadius + getMenuRadiusOffset(angle, t, frontAngle)
      return Math.max(14, radius)
    })

    for (let pass = 0; pass < 3; pass += 1) {
      const nextRadii = radii.slice()
      for (let index = 0; index < radii.length; index += 1) {
        const prev = radii[(index - 1 + radii.length) % radii.length]
        const current = radii[index]
        const next = radii[(index + 1) % radii.length]
        nextRadii[index] = prev * 0.11 + current * 0.78 + next * 0.11
      }

      radii.splice(0, radii.length, ...nextRadii)
    }

    const points = radii.map((radius, index) => {
      const angle = index * deltaTheta
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      }
    })

    if (points.length < 2) return ''

    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

    for (let index = 0; index < points.length; index += 1) {
      const p0 = points[(index - 1 + points.length) % points.length]
      const p1 = points[index]
      const p2 = points[(index + 1) % points.length]
      const p3 = points[(index + 2) % points.length]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }

    path += ' Z'
    return path
  }

  const getMenuCloseWavePoints = (t: number) => {
    if (!dimensions.width || !dimensions.height) return []

    const width = dimensions.width
    const height = dimensions.height
    const points = 22
    const travel = -112 + (height + 224) * Math.pow(t, 0.72)
    const waveEnvelope = Math.sin(Math.min(t, 0.95) * Math.PI)
    const amplitudePrimary = 14 + 22 * waveEnvelope
    const amplitudeSecondary = 6 + 12 * waveEnvelope
    const phaseShift = t * Math.PI * 0.92

    const wavePoints: Array<{ x: number; y: number }> = []

    for (let index = 0; index <= points; index += 1) {
      const ratio = index / points
      const x = width * ratio
      const angle = ratio * Math.PI * 2
      const sideBias = (0.44 - ratio) * 46 * (1 - t * 0.85)
      const harmonic =
        Math.sin(angle + phaseShift) * amplitudePrimary +
        Math.sin(angle * 1.9 - phaseShift * 0.72) * amplitudeSecondary +
        getPeriodicNoiseValue(angle + phaseShift * 0.35, menuNoise.grid16) * 8 * waveEnvelope

      const lobeOffset = CLOSE_WAVE_LOBES.reduce((total, lobe, lobeIndex) => {
        const distance = ratio - lobe.center
        const gaussian = Math.exp(-(distance * distance) / (2 * lobe.width * lobe.width))
        const raggedAngle =
          ratio * Math.PI * (5.2 + lobeIndex * 1.6) + phaseShift * (0.5 + lobeIndex * 0.12)
        const raggedNoise =
          Math.sin(raggedAngle) * 0.65 +
          getPeriodicNoiseValue(raggedAngle * 0.5, menuNoise.detailGrid) * 0.28

        return total + gaussian * (lobe.height + raggedNoise * lobe.ragged) * (1.16 - t * 0.12)
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
    if (wavePoints.length === 0) return ''

    const width = dimensions.width
    const height = dimensions.height
    let path = `M 0 ${wavePoints[0].y.toFixed(1)}`

    for (let index = 0; index < wavePoints.length - 1; index += 1) {
      const current = wavePoints[index]
      const next = wavePoints[index + 1]
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

  const currentCoverPath =
    dimensions.width > 0
      ? coverPhase === 'closing'
        ? getMenuCloseWavePath(phaseProgress)
        : getMenuDripPath(coverPhase === 'open' ? 1 : phaseProgress)
      : ''

  const contentTransitionClass = React.useMemo(() => {
    if (contentPhase === 'hidden') {
      return [
        'transition-all',
        'duration-[220ms]',
        `ease-[${MENU_CONTENT_TRANSITION_OUT_EASING}]`,
        '-translate-y-4 scale-95 opacity-0',
      ].join(' ')
    }

    if (contentPhase === 'entering') {
      return [
        'transition-all',
        `duration-[${MENU_CONTENT_ENTER_MS}ms]`,
        `ease-[${MENU_CONTENT_TRANSITION_IN_EASING}]`,
        'translate-y-0 scale-100 opacity-100',
      ].join(' ')
    }

    if (contentPhase === 'visible') {
      return [
        'transition-all',
        'duration-[220ms]',
        'ease-[cubic-bezier(0.16, 0.84, 0.44, 1)]',
        'translate-y-0 scale-100 opacity-100',
      ].join(' ')
    }

    return [
      'transition-all',
      `duration-[${MENU_CONTENT_EXIT_MS}ms]`,
      `ease-[${MENU_CONTENT_TRANSITION_OUT_EASING}]`,
      'translate-y-[-2px] scale-[0.985] opacity-0',
    ].join(' ')
  }, [contentPhase])

  return (
    <DialogPrimitive.Root
      open={isMenuPressed}
      onOpenChange={handleOpenChange}
      triggerId="site-navigation-trigger"
      modal
    >
      <NavMenuButton
        id="site-navigation-trigger"
        ref={menuTriggerRef}
        pressed={isMenuPressed}
        aria-haspopup="dialog"
        onClick={() => handleOpenChange(!isMenuPressed)}
      />

      <DialogPrimitive.Portal keepMounted>
        {isMenuMounted ? (
          <DialogPrimitive.Popup
            id="full-page-menu"
            aria-label="Main site navigation"
            initialFocus={false}
            finalFocus={true}
            className={cn(
              'fixed inset-0 z-[90] h-screen w-screen overflow-hidden outline-none select-none',
              coverPhase === 'closing' ? 'pointer-events-none' : 'pointer-events-auto'
            )}
          >
            <DialogPrimitive.Close className="sr-only">Close navigation menu</DialogPrimitive.Close>

            <svg
              data-menu-cover-svg=""
              data-menu-cover=""
              data-phase={coverPhase}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${Math.max(dimensions.width, 1)} ${Math.max(dimensions.height, 1)}`}
              preserveAspectRatio="none"
            >
              <path d={currentCoverPath} fill="#000" shapeRendering="geometricPrecision" />
            </svg>

            <div
              data-menu-content=""
              data-phase={contentPhase}
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center p-6 text-white',
                contentTransitionClass,
                isContentInteractive ? 'pointer-events-auto' : 'pointer-events-none'
              )}
            >
              {overlayDecorations.map((splat) => (
                <Splat
                  key={splat.id}
                  id={splat.splatId}
                  color={splat.color}
                  className={cn('pointer-events-none absolute z-[1] opacity-100', splat.className)}
                />
              ))}

              <img
                src="https://splatoon.nintendo.com/_images/tape-assets/sticker-2-red.png"
                alt=""
                className="pointer-events-none absolute top-[23.2%] left-[10.25%] z-[2] w-[13.5rem] -rotate-[27deg] select-none"
              />
              <img
                src="https://splatoon.nintendo.com/_images/tape-assets/sticker-10.png"
                alt=""
                className="pointer-events-none absolute top-[52.1%] right-[10.8%] z-[2] w-[14.35rem] rotate-[-7deg] select-none"
              />
              <img
                src="https://splatoon.nintendo.com/_images/tape-assets/sticker-5.png"
                alt=""
                className="pointer-events-none absolute bottom-[-0.4%] left-[10.7%] z-[2] w-[29.5rem] -rotate-[9deg] select-none"
              />

              <nav
                aria-label="Main site navigation"
                className={cn(
                  'relative z-10 flex w-full max-w-[44rem] flex-col items-center pt-4 text-center transition-all duration-[300ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] md:pt-5',
                  contentPhase === 'hidden'
                    ? '-translate-y-2 scale-95 opacity-0'
                    : contentPhase === 'exiting'
                      ? 'translate-y-[2px] scale-[0.985] opacity-0'
                      : 'translate-y-0 scale-100 opacity-100'
                )}
              >
                <div className="relative mb-5 h-[12.9rem] w-[40rem] max-w-[92vw] md:mb-7">
                  {logoSplatDecorations.map((splat) => (
                    <Splat
                      key={splat.id}
                      id={splat.splatId}
                      color={splat.color}
                      className={cn('pointer-events-none absolute z-[1]', splat.className)}
                    />
                  ))}
                  <img
                    src="https://splatoon.nintendo.com/_images/logo/splatoon3-logo-subpage.png"
                    alt="Splatoon 3"
                    className="pointer-events-none absolute top-[0.15rem] left-1/2 z-[2] w-[22.375rem] max-w-[78%] -translate-x-1/2 select-none"
                  />
                </div>

                <ul className="relative flex w-full flex-col items-center gap-0">
                  {navLinks.map((link, index) => {
                    if (link.isBuyNow) {
                      return (
                        <li key={link.label} className="mb-4 md:mb-5">
                          <Button
                            onClick={() => closeMenuAndNavigate('#buy')}
                            variant="yellow"
                            size="lg"
                            className="h-[72px] min-w-[241px] border-0 px-11 shadow-none hover:shadow-none active:shadow-none [&_span]:text-[2.05rem] [&_span]:font-semibold [&_span]:tracking-normal [&_span]:normal-case [&_svg]:mt-[0.18em]"
                          >
                            Buy now
                          </Button>
                        </li>
                      )
                    }

                    const isHighlighted = activeNavLabel
                      ? activeNavLabel === link.label
                      : selectedNavKey === link.selectedKey

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
                              'pointer-events-none absolute z-[1] opacity-0 transition-all duration-150 ease-out',
                              activeNavLabel === link.label
                                ? 'scale-100 opacity-100'
                                : 'scale-[1.32] opacity-0',
                              link.hoverSplatClassName
                            )}
                          />
                        ) : null}

                        <a
                          href={link.href}
                          data-nav-link="true"
                          data-nav-label={link.label}
                          onClick={() => closeMenu()}
                          onMouseEnter={() => setActiveNavLabel(link.label)}
                          onMouseLeave={() =>
                            setActiveNavLabel((current) =>
                              current === link.label ? null : current
                            )
                          }
                          onFocus={() => setActiveNavLabel(link.label)}
                          onBlur={() =>
                            setActiveNavLabel((current) =>
                              current === link.label ? null : current
                            )
                          }
                          className={cn(
                            'group/nav-link font-heading relative z-[2] inline-flex items-center gap-3 py-[0.18rem] text-[2.18rem] leading-none font-semibold text-white transition-colors duration-150 md:text-[3.25rem]',
                            isHighlighted && 'text-[#eaff3d]',
                            link.textClassName
                          )}
                        >
                          <span className="relative inline-block">{link.label}</span>
                          <svg
                            data-nav-chevron="true"
                            aria-hidden="true"
                            viewBox="0 0 7 12"
                            className="mt-[0.22em] h-[1.1rem] w-[0.65rem] shrink-0 text-current transition-transform duration-200 ease-out md:h-[1.35rem] md:w-[0.8rem]"
                            style={{
                              transform: isHighlighted ? 'translateX(5px)' : 'translateX(0px)',
                            }}
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
          </DialogPrimitive.Popup>
        ) : null}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
