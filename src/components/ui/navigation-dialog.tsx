'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InkSplashCanvas } from '@/components/ui/ink-splash-canvas'
import { NavMenuButton } from '@/components/ui/nav-menu-button'
import { Splat } from '@/components/ui/splats'
import { Sticker2Red, Sticker10, Sticker5 } from '@/components/ui/stickers'

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

// Animation timing constants (verified against official splatoon.nintendo.com)
const MENU_CONTENT_ENTER_MS = 700
const MENU_CONTENT_EXIT_MS = 400
const MENU_CONTENT_TRANSITION_IN_EASING = 'cubic-bezier(0.51, 0, 0.9, 0.43)'
const MENU_CONTENT_TRANSITION_OUT_EASING = 'cubic-bezier(0.25, 0.12, 0.4, 1)'
const NAV_SPLAT_START_POSITION: [number, number] = [-0.5, 0.5]

// Animation phases
type CoverPhase = 'closed' | 'opening' | 'open' | 'closing'
type ContentPhase = 'hidden' | 'entering' | 'visible' | 'exiting'
type CanvasState = 'in' | 'out' | 'idle'

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
  const [openCount, setOpenCount] = React.useState(0)

  const animationTimersRef = React.useRef<number[]>([])

  const isMenuMounted = coverPhase !== 'closed'
  const isMenuPressed = coverPhase === 'opening' || coverPhase === 'open'
  const isContentInteractive = contentPhase === 'visible'

  // Keep the completed opening frame mounted while the menu is open, matching
  // the official nav transition before it switches to the closing tween.
  const canvasState: CanvasState =
    coverPhase === 'opening' || coverPhase === 'open' ? 'in' :
    coverPhase === 'closing' ? 'out' :
    'idle'

  const clearAnimationTimers = React.useCallback(() => {
    animationTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    animationTimersRef.current = []
  }, [])

  React.useEffect(() => {
    return () => {
      clearAnimationTimers()
    }
  }, [clearAnimationTimers])

  // Sync selected nav key with URL changes
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

  // Open menu handler
  const openMenu = React.useCallback(() => {
    setActiveNavLabel(null)

    if (isReducedMotion) {
      setCoverPhase('open')
      setContentPhase('visible')
      return
    }

    setOpenCount(Math.round(10000 * Math.random()))
    setCoverPhase('opening')
    setContentPhase('hidden')
  }, [isReducedMotion])

  // Close menu handler
  const closeMenu = React.useCallback(() => {
    clearAnimationTimers()
    setActiveNavLabel(null)

    if (isReducedMotion) {
      setContentPhase('hidden')
      setCoverPhase('closed')
      return
    }

    // Official nav generates a fresh transition count for closing as well.
    // The shader still starts from progress=1, but the closing wave uses its
    // own noise seed instead of reusing the opening one.
    setOpenCount(Math.round(10000 * Math.random()))
    setCoverPhase('closing')

    if (contentPhase === 'entering' || contentPhase === 'visible') {
      setContentPhase('exiting')
      const timer = window.setTimeout(() => {
        setContentPhase('hidden')
      }, MENU_CONTENT_EXIT_MS)
      animationTimersRef.current.push(timer)
      return
    }
  }, [clearAnimationTimers, contentPhase, isReducedMotion])

  // Handle open state changes from DialogPrimitive
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

  // Navigate and close
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

  // Canvas animation complete handler
  const handleCanvasComplete = React.useCallback(() => {
    if (coverPhase === 'opening') {
      clearAnimationTimers()
      setCoverPhase('open')
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
    }
  }, [clearAnimationTimers, coverPhase])

  // Content transition classes.
  // Official: content hidden until ink splash covers screen, then instantly visible.
  // No fade-in on container — ink splash canvas handles the visual reveal.
  // Only on exit: content fades out (200ms) before ink retracts.
  const contentTransitionClass = React.useMemo(() => {
    if (contentPhase === 'hidden') {
      return 'opacity-0 pointer-events-none'
    }
    if (contentPhase === 'exiting') {
      return 'transition-opacity duration-200 opacity-0 pointer-events-none'
    }
    // entering / visible: instantly visible, ink splash has covered the screen
    return 'opacity-100 pointer-events-auto'
  }, [contentPhase])

  return (
    <DialogPrimitive.Root
      open={isMenuMounted}
      onOpenChange={handleOpenChange}
      triggerId="site-navigation-trigger"
      modal
    >
      <NavMenuButton
        id="site-navigation-trigger"
        pressed={isMenuPressed}
        aria-haspopup="dialog"
        onClick={() => handleOpenChange(!isMenuMounted)}
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

            {/* WebGL ink splash canvas (replaces SVG path animation) */}
            <InkSplashCanvas
              state={canvasState}
              durationIn={700}
              durationOut={1000}
              color="#000000"
              count={openCount}
              startPosition={NAV_SPLAT_START_POSITION}
              onComplete={handleCanvasComplete}
              className="pointer-events-none absolute inset-0 z-[80]"
            />

            <div
              data-menu-content=""
              data-phase={contentPhase}
              className={cn(
                'absolute inset-0 z-[81] flex flex-col items-center justify-center p-6 text-white',
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

              {/* Vector Sticker 2 Red */}
              <div className="pointer-events-none absolute top-[23.2%] left-[10.25%] z-[2] w-[13.5rem] -rotate-[27deg] select-none">
                <Sticker2Red />
              </div>

              {/* Vector Sticker 10 */}
              <div className="pointer-events-none absolute top-[52.1%] right-[10.8%] z-[2] w-[14.35rem] rotate-[-7deg] select-none">
                <Sticker10 />
              </div>

              {/* Vector Sticker 5 */}
              <div className="pointer-events-none absolute bottom-[-0.4%] left-[10.7%] z-[2] w-[29.5rem] -rotate-[9deg] select-none">
                <Sticker5 />
              </div>

              <nav
                aria-label="Main site navigation"
                className={cn(
                  'relative z-10 flex w-full max-w-[44rem] flex-col items-center pt-4 text-center md:pt-5',
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                            theme="dark-yellow"
                          >
                            Buy now
                          </Button>
                        </li>
                      )
                    }

                    const isHighlighted = activeNavLabel
                      ? activeNavLabel === link.label
                      : selectedNavKey === link.selectedKey

                    // Official stagger: each li starts at opacity:0, scale(0.5),
                    // then transitions to visible with per-item delay (0.1s increments)
                    const itemDelay = contentPhase === 'entering'
                      ? `${(index + 1) * 100}ms`
                      : '0s'
                    const isItemVisible = contentPhase === 'entering' || contentPhase === 'visible'

                    return (
                      <li
                        key={link.label}
                        className="relative"
                        style={{
                          opacity: isItemVisible ? 1 : 0,
                          transform: isItemVisible ? 'scale(1)' : 'scale(0.5)',
                          transitionProperty: 'opacity, transform',
                          transitionDuration: '700ms',
                          transitionTimingFunction: 'cubic-bezier(0.51, 0, 0.9, 0.43)',
                          transitionDelay: itemDelay,
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
