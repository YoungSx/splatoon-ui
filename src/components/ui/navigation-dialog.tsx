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

const DETERMINISTIC_NOISE = {
  grid3: [0.15, -0.65, 0.82, -0.3, 0.54, -0.71],
  grid6: [-0.42, 0.88, -0.15, 0.63, -0.74, 0.29, -0.81, 0.45, -0.12, 0.68, -0.35, 0.72],
  grid12: [
    0.35, -0.58, 0.71, -0.22, 0.84, -0.47, 0.12, -0.89, 0.53, -0.31, 0.64, -0.18, 0.77, -0.52, 0.28,
    -0.73, 0.49, -0.61, 0.81, -0.36, 0.15, -0.85, 0.69, -0.41,
  ],
  grid24: [
    -0.12, 0.45, -0.68, 0.29, -0.81, 0.53, -0.22, 0.71, -0.35, 0.64, -0.73, 0.18, -0.85, 0.39,
    -0.52, 0.61, -0.28, 0.77, -0.41, 0.84, -0.63, 0.15, -0.89, 0.49, -0.31, 0.68, -0.74, 0.12,
    -0.82, 0.58, -0.15, 0.72, -0.47, 0.81, -0.58, 0.28, -0.88, 0.35, -0.61, 0.52, -0.26, 0.79,
    -0.39, 0.69, -0.71, 0.19, -0.84, 0.42,
  ],
  spikes: [
    { angle: Math.PI * 0.9, height: 1.1, sigma: 0.22 },
    { angle: Math.PI * 0.6, height: 0.95, sigma: 0.18 },
    { angle: Math.PI * 1.25, height: 1.35, sigma: 0.26 },
    { angle: Math.PI * 0.15, height: 0.65, sigma: 0.15 },
  ],
}

const menuNoise = DETERMINISTIC_NOISE
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

export function NavigationDialog({ isReducedMotion }: NavigationDialogProps) {
  const [coverPhase, setCoverPhase] = React.useState<CoverPhase>('closed')
  const [contentPhase, setContentPhase] = React.useState<ContentPhase>('hidden')
  const [activeNavLabel, setActiveNavLabel] = React.useState<string | null>(null)
  const [selectedNavKey, setSelectedNavKey] = React.useState(getCurrentSelectedNavKey)
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })
  const [phaseProgress, setPhaseProgress] = React.useState(0)
  const [menuOrigin, setMenuOrigin] = React.useState<MenuOrigin | null>(null)

  const menuTriggerRef = React.useRef<HTMLButtonElement>(null)
  const animationTimersRef = React.useRef<number[]>([])
  const numPoints = 80

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

  const getMenuRadiusOffset = (angle: number, t: number) => {
    const n3 = getPeriodicNoiseValue(angle + 1.2 * t, menuNoise.grid3) * 550
    const n6 = getPeriodicNoiseValue(angle - 1.8 * t, menuNoise.grid6) * 350
    const n12 = getPeriodicNoiseValue(angle + 2.8 * t, menuNoise.grid12) * 180
    const n24 = getPeriodicNoiseValue(angle - 4 * t, menuNoise.grid24) * 70

    let fbm = n3 + n6 + n12 + n24
    const maxFbm = 1150

    if (fbm > 0) {
      fbm = Math.pow(fbm / maxFbm, 1.1) * maxFbm
    } else {
      fbm = -Math.pow(Math.abs(fbm) / maxFbm, 1.5) * maxFbm
    }

    let spikeSum = 0
    menuNoise.spikes.forEach((spike, index) => {
      const drift = 0.15 * Math.sin(t * Math.PI)
      const currentAngle = spike.angle + (index % 2 === 0 ? drift : -drift)

      let diff = Math.abs(angle - currentAngle)
      if (diff > Math.PI) {
        diff = 2 * Math.PI - diff
      }

      const currentSigma = spike.sigma * (1.4 - 0.4 * t)
      const currentHeight = spike.height * 900 * Math.pow(t, 1.2)
      const spikeValue =
        currentHeight * Math.exp(-(diff * diff) / (2 * currentSigma * currentSigma))
      spikeSum += spikeValue
    })

    const totalOffset = fbm + spikeSum
    const noiseScale = 0.006 + (1 - 0.006) * t
    return totalOffset * noiseScale
  }

  const getMenuDripPath = (t: number) => {
    if (!dimensions.width || !dimensions.height) return ''

    const fallbackOrigin = {
      x: dimensions.width * 0.9,
      y: dimensions.height * 0.05,
    }
    const { x: cx, y: cy } = menuOrigin ?? fallbackOrigin
    const deltaTheta = (2 * Math.PI) / numPoints
    const k = (4 / 3) * Math.tan(Math.PI / (2 * numPoints))

    const points: Array<{ x: number; y: number; tx: number; ty: number }> = []
    const baseRadius = 15 + (2400 - 15) * Math.pow(t, 1.5)

    for (let index = 0; index < numPoints; index += 1) {
      const angle = index * deltaTheta
      const radius = Math.max(5, baseRadius + getMenuRadiusOffset(angle, t))
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      const tx = -Math.sin(angle)
      const ty = Math.cos(angle)

      points.push({ x, y, tx, ty })
    }

    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

    for (let index = 0; index < numPoints; index += 1) {
      const current = points[index]
      const next = points[(index + 1) % numPoints]
      const angleCurrent = index * deltaTheta
      const angleNext = ((index + 1) % numPoints) * deltaTheta
      const rCurrent = Math.max(5, baseRadius + getMenuRadiusOffset(angleCurrent, t))
      const rNext = Math.max(5, baseRadius + getMenuRadiusOffset(angleNext, t))
      const cp1x = current.x + k * rCurrent * current.tx
      const cp1y = current.y + k * rCurrent * current.ty
      const cp2x = next.x - k * rNext * next.tx
      const cp2y = next.y - k * rNext * next.ty

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`
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
        getPeriodicNoiseValue(angle + phaseShift * 0.35, menuNoise.grid12) * 8 * waveEnvelope

      const lobeOffset = CLOSE_WAVE_LOBES.reduce((total, lobe, lobeIndex) => {
        const distance = ratio - lobe.center
        const gaussian = Math.exp(-(distance * distance) / (2 * lobe.width * lobe.width))
        const raggedAngle =
          ratio * Math.PI * (5.2 + lobeIndex * 1.6) + phaseShift * (0.5 + lobeIndex * 0.12)
        const raggedNoise =
          Math.sin(raggedAngle) * 0.65 +
          getPeriodicNoiseValue(raggedAngle * 0.5, menuNoise.grid24) * 0.35

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

  const currentClipPath =
    dimensions.width > 0
      ? coverPhase === 'closing'
        ? `path("${getMenuCloseWavePath(phaseProgress)}")`
        : `path("${getMenuDripPath(coverPhase === 'open' ? 1 : phaseProgress)}")`
      : undefined

  const dripStyle = currentClipPath
    ? ({
        clipPath: currentClipPath,
        WebkitClipPath: currentClipPath,
      } as React.CSSProperties)
    : undefined

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

            <div
              data-menu-cover=""
              data-phase={coverPhase}
              style={dripStyle}
              className="absolute inset-0 bg-black"
            />

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
