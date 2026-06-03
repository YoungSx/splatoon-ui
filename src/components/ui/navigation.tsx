"use client"

import * as React from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const REDUCED_MOTION_KEY = "splat-reduced-motion"
const THEME_STORAGE_KEY = "splat-theme"

interface NavLink {
  label: string
  href: string
  description?: string
  isBuyNow?: boolean
}

const navLinks: NavLink[] = [
  { label: "Home", href: "#", description: "Back to the lobby" },
  { label: "World", href: "#world", description: "Explore the City of Chaos" },
  { label: "Gameplay", href: "#gameplay", description: "Learn online battle modes" },
  { label: "Weapons & Gear", href: "#weapons", description: "Check your shop loadouts" },
  { label: "News Feed", href: "#news", description: "Peep the ink-formation feed" },
]

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

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMenuRendered, setIsMenuRendered] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isReducedMotion, setIsReducedMotion] = React.useState(false)
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  // Dimension tracking for full screen viewport sizes
  const [mounted, setMounted] = React.useState(false)
  const [dimensions, setDimensions] = React.useState({ width: 1440, height: 900 })
  const [animProgress, setAnimProgress] = React.useState(0)

  const numPoints = 80 // Radial resolution for drawing smooth detailed bezier segments


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
    setMounted(true)

    // 1. Reduced Motion init
    const storedRM = localStorage.getItem(REDUCED_MOTION_KEY)
    const mediaRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const forceRM = storedRM === "true" || (storedRM === null && mediaRM)
    setIsReducedMotion(forceRM)
    document.documentElement.classList.toggle("reduced-motion", forceRM)

    // 2. Theme init
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"
    setTheme(currentTheme)

    // 3. Initialize dimensions
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleReducedMotion = React.useCallback(() => {
    setIsReducedMotion((prev) => {
      const next = !prev
      localStorage.setItem(REDUCED_MOTION_KEY, String(next))
      document.documentElement.classList.toggle("reduced-motion", next)
      return next
    })
  }, [])

  const toggleTheme = React.useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
  }, [theme])

  // Synchronize dynamic clip-path morphing progress via JS animation loop
  React.useEffect(() => {
    if (isReducedMotion) {
      setAnimProgress(isOpen ? 1 : 0)
      return
    }

    let startTimestamp: number | null = null
    const duration = 750
    const startValue = animProgress
    const endValue = isOpen ? 1 : 0
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const progress = Math.min(elapsed / duration, 1)

      // Cubic Bezier easeInOut: cubic-bezier(0.77, 0, 0.175, 1) approximation
      const ease = (x: number) => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
      }

      const currentProgress = startValue + (endValue - startValue) * ease(progress)
      setAnimProgress(currentProgress)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isOpen, isReducedMotion])

  // Custom menu toggle with delayed rendering to let liquid exit animation play out
  // Regenerates harmonics on every opening for fully randomized unique splatters!
  const toggleMenu = React.useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
      setTimeout(() => {
        setIsMenuRendered(false)
      }, isReducedMotion ? 0 : 750)
    } else {
      setIsMenuRendered(true)
      setIsOpen(true)
    }
  }, [isOpen, isReducedMotion])

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

    // Menu button approximate center coordinates (top-right area)
    const cx = dimensions.width * 0.9
    const cy = dimensions.height * 0.05

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

  // Inject style with calculated path literal to bypass browser CSS variable interpolation bugs
  const currentClipPath = mounted && dimensions.width > 0
    ? `path("${getMenuDripPath(animProgress)}")`
    : undefined

  const dripStyle = currentClipPath
    ? {
        clipPath: currentClipPath,
        WebkitClipPath: currentClipPath,
      } as React.CSSProperties
    : undefined

  // Background ink splats inside the menu overlay
  const inkSplats = [
    {
      id: "menu-splat-left",
      color: "var(--neon-yellow)",
      className: "absolute -left-[10%] bottom-[12%] w-[450px] h-[400px] opacity-25 dark:opacity-30 pointer-events-none select-none blur-[1px] z-0",
      path: "M100 200 C80 120 150 50 250 80 C320 60 400 120 380 200 C420 280 320 380 220 350 C120 380 60 300 100 200 Z",
    },
    {
      id: "menu-splat-right",
      color: "var(--ink-blue)",
      className: "absolute -right-[12%] -top-[5%] w-[480px] h-[440px] opacity-25 dark:opacity-20 pointer-events-none select-none blur-[1px] z-0",
      path: "M120 180 C90 100 180 40 280 80 C350 50 430 110 400 200 C440 290 350 390 240 340 C140 370 70 290 120 180 Z",
    },
  ]

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
          "fixed top-0 left-0 right-0 z-[100] w-full flex items-center justify-between border-b-[3px] border-chaos-black dark:border-white transition-all duration-300 select-none bg-white/95 dark:bg-chaos-black/95 backdrop-blur-md",
          isCollapsed ? "h-[50px] px-4" : "h-[70px] md:h-[80px] px-6 md:px-8"
        )}
      >
        {/* Left Accessibility Control (A11y Bar) */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleReducedMotion}
            aria-pressed={isReducedMotion}
            className={cn(
              "group/a11y flex items-center gap-2 px-3 py-1.5 border-2 border-chaos-black dark:border-white rounded-[6px] transition-all hover:scale-[1.02] active:scale-[0.98]",
              isReducedMotion
                ? "bg-chaos-black text-[#eaff3d] dark:bg-white dark:text-chaos-black"
                : "bg-transparent text-chaos-black/60 dark:text-white/60 hover:text-chaos-black dark:hover:text-white"
            )}
            title="Toggle Reduced Motion"
          >
            <span
              className={cn(
                "relative flex h-3 w-3 shrink-0 rounded-full border border-chaos-black dark:border-white transition-all",
                isReducedMotion ? "bg-[#eaff3d] dark:bg-chaos-black scale-110" : "bg-transparent"
              )}
            />
            <span className="font-heading font-black text-[11px] md:text-xs uppercase tracking-widest leading-none">
              {isReducedMotion ? "Motion: Off" : "Reduced Motion"}
            </span>
          </button>
        </div>

        {/* Center: Nintendo Switch Logo Style Visual Lockup */}
        <a
          href="#"
          className="flex items-center gap-2 group/logo hover:scale-[1.03] active:scale-[0.98] transition-transform"
        >
          <div className="bg-[#ff505e] dark:bg-[#eaff3d] text-white dark:text-chaos-black p-1 px-2.5 rounded-[4px] border-2 border-chaos-black dark:border-white rotate-[-3deg] shadow-solid-sm group-hover/logo:rotate-0 transition-transform">
            <span className="font-heading font-black text-sm md:text-base tracking-widest leading-none">SWITCH</span>
          </div>
          <span className="font-heading font-black text-base md:text-xl uppercase tracking-widest text-chaos-black dark:text-white leading-none">
            UI
          </span>
        </a>

        {/* Right Corner Area with Splatoon Splat Corner Backdrop */}
        <div className="relative h-full flex items-center pr-2">
          <div
            className={cn(
              "absolute top-0 right-0 h-full pointer-events-none select-none overflow-hidden transition-all duration-300 z-0",
              isCollapsed ? "w-[120px]" : "w-[160px] md:w-[190px]"
            )}
          >
            <svg
              className="w-full h-full text-[#ff505e] dark:text-[#603bff] fill-current"
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

          {/* Morphing Toggle Menu Button */}
          <button
            onClick={toggleMenu}
            className="relative z-10 flex items-center justify-center gap-1.5 md:gap-2 text-white outline-none group/menu-btn select-none hover:scale-[1.05] active:scale-[0.95] transition-transform py-1 px-3 rounded-[6px]"
            aria-expanded={isOpen}
            aria-controls="full-page-menu"
          >
            <div className="relative w-5 h-4 flex items-center justify-center">
              <span
                className={cn(
                  "absolute h-[3px] w-full bg-white dark:bg-white rounded-full transition-all duration-300",
                  isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
                )}
              />
              <span
                className={cn(
                  "absolute h-[3px] bg-white dark:bg-white rounded-full transition-all duration-200",
                  isOpen ? "w-0 opacity-0" : "w-full"
                )}
              />
              <span
                className={cn(
                  "absolute h-[3px] w-full bg-white dark:bg-white rounded-full transition-all duration-300",
                  isOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
                )}
              />
            </div>
            <span className="font-heading font-black text-xs md:text-sm uppercase tracking-widest leading-none drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.5)]">
              {isOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
         Full Page Overlay Menu (Periodic low-frequency morphing)
         ──────────────────────────────────────────────────────── */}
      {isMenuRendered && (
        <div
          id="full-page-menu"
          style={dripStyle}
          className="fixed inset-0 z-[90] w-screen h-screen flex flex-col justify-center items-center bg-black text-white p-6 overflow-hidden select-none"
        >
          {/* Background Ink Splatters */}
          {inkSplats.map((splat) => (
            <svg
              key={splat.id}
              className={splat.className}
              style={{ fill: splat.color }}
              viewBox="0 0 500 400"
            >
              <path d={splat.path} />
            </svg>
          ))}

          {/* Menu Center Content Column */}
          <nav className="relative z-10 w-full max-w-xl flex flex-col gap-6 md:gap-8 pt-10 text-center">
            <ul className="flex flex-col gap-4 md:gap-6">
              {navLinks.map((link, idx) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={toggleMenu}
                    className="group/link inline-block relative px-4 py-2 font-heading font-black text-3xl md:text-5xl uppercase tracking-wider text-white transition-transform duration-200 hover:scale-[1.05] hover:text-[#eaff3d] active:scale-[0.98]"
                  >
                    <span className="inline-block transition-transform duration-200 group-hover/link:rotate-[-2deg] group-active/link:rotate-0">
                      {link.label}
                    </span>
                    {link.description && (
                      <span className="block text-[11px] md:text-xs font-semibold text-white/50 lowercase tracking-widest mt-0.5 md:mt-1 group-hover/link:text-white/80 transition-colors">
                        {link.description}
                      </span>
                    )}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1.5 bg-[#eaff3d] group-hover/link:w-[80%] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                  </a>
                </li>
              ))}

              <li className="mt-4">
                <Button
                  onClick={() => {
                    toggleMenu()
                    window.location.hash = "#buy"
                  }}
                  variant="yellow"
                  size="lg"
                  className="w-full max-w-sm mx-auto shadow-solid-lg border-[3px] border-white text-chaos-black"
                >
                  Buy Now
                </Button>
              </li>
            </ul>
          </nav>

          {/* Menu Overlay Footer: Options & Versions */}
          <div className="absolute bottom-10 left-6 right-6 z-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-wider text-white/40">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="sm"
                hasChevron={false}
                className="border-white/20 text-white hover:bg-white/10 hover:text-[#eaff3d] dark:[--bg-color:transparent]"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-3.5 w-3.5 mr-1" />
                    Light Battle
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 mr-1" />
                    Night Battle
                  </>
                )}
              </Button>
            </div>

            <span>splatoon-ui v0.1.0</span>
          </div>
        </div>
      )}
    </>
  )
}
