'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InkSplashCanvas } from '@/components/ui/ink-splash-canvas'
import { NavMenuButton } from '@/components/ui/nav-menu-button'
import { Splat } from '@/components/ui/splats'
import { Sticker2Red, Sticker10, Sticker5 } from '@/components/ui/stickers'
import { NavChevron } from './nav-chevron'
import { navLinks, logoSplatDecorations, overlayDecorations } from './navigation-config'
import { useSyncSelectedNavKey } from '@/hooks/use-sync-selected-nav-key'
import { useNavigationMenuAnimation } from '@/hooks/use-navigation-menu-animation'

const NAV_SPLAT_START_POSITION: [number, number] = [-0.5, 0.5]

type NavigationDialogProps = {
  isReducedMotion: boolean
}

export function NavigationDialog({ isReducedMotion }: NavigationDialogProps) {
  const [activeNavLabel, setActiveNavLabel] = React.useState<string | null>(null)
  const selectedNavKey = useSyncSelectedNavKey()
  const {
    coverPhase,
    contentPhase,
    openCount,
    isMenuMounted,
    isMenuPressed,
    isContentInteractive,
    canvasState,
    contentTransitionClass,
    openMenu: openMenuBase,
    closeMenu: closeMenuBase,
    handleOpenChange: handleOpenChangeBase,
    handleCanvasComplete,
  } = useNavigationMenuAnimation({ isReducedMotion })

  const openMenu = React.useCallback(() => {
    setActiveNavLabel(null)
    openMenuBase()
  }, [openMenuBase])

  const closeMenu = React.useCallback(() => {
    setActiveNavLabel(null)
    closeMenuBase()
  }, [closeMenuBase])

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        openMenu()
      } else {
        closeMenu()
      }
    },
    [openMenu, closeMenu]
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
              'fixed inset-0 z-[var(--z-nav-overlay)] h-screen w-screen overflow-hidden outline-none select-none',
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
              className="pointer-events-none absolute inset-0 z-[var(--z-nav-canvas)]"
            />

            <div
              data-menu-content=""
              data-phase={contentPhase}
              className={cn(
                'absolute inset-0 z-[var(--z-nav-content)] flex flex-col items-center justify-center p-6 text-white',
                contentTransitionClass,
                isContentInteractive ? 'pointer-events-auto' : 'pointer-events-none'
              )}
            >
              {/* Background Splats — official: opacity+transform 0.4s, staggered 0.5s→1.1s */}
              {overlayDecorations.map((splat, i) => (
                <Splat
                  key={splat.id}
                  id={splat.splatId}
                  color={splat.color}
                  className={cn('pointer-events-none absolute z-[var(--z-deco)]', splat.className)}
                  style={{
                    opacity: contentPhase === 'hidden' || contentPhase === 'exiting' ? 0 : 1,
                    transform: contentPhase === 'hidden' || contentPhase === 'exiting'
                      ? 'scale(0.8) translate(0, 10%)'
                      : 'scale(1) translate(0, 0)',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '0.4s',
                    transitionDelay: `${0.5 + i * 0.1}s`,
                  }}
                />
              ))}

              {/* Vector Sticker 2 Red */}
              <div className="pointer-events-none absolute top-[23.2%] left-[10.25%] z-[var(--z-deco-fg)] w-[13.5rem] -rotate-[27deg] select-none">
                <Sticker2Red />
              </div>

              {/* Vector Sticker 10 */}
              <div className="pointer-events-none absolute top-[52.1%] right-[10.8%] z-[var(--z-deco-fg)] w-[14.35rem] rotate-[-7deg] select-none">
                <Sticker10 />
              </div>

              {/* Vector Sticker 5 */}
              <div className="pointer-events-none absolute bottom-[-0.4%] left-[10.7%] z-[var(--z-deco-fg)] w-[29.5rem] -rotate-[9deg] select-none">
                <Sticker5 />
              </div>

              <nav
                aria-label="Main site navigation"
                className={cn(
                  'relative z-10 flex w-full max-w-[44rem] flex-col items-center pt-4 text-center md:pt-5',
                )}
              >
                <div
                  className="relative mb-5 h-[12.9rem] w-[40rem] max-w-[92vw] md:mb-7"
                  style={{
                    opacity: contentPhase === 'hidden' || contentPhase === 'exiting' ? 0 : 1,
                    transform: contentPhase === 'hidden' || contentPhase === 'exiting'
                      ? 'scale(0.85)'
                      : 'scale(1)',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '0.3s',
                    transitionTimingFunction: 'cubic-bezier(0.21, 0.12, 0.35, 1.43)',
                    transitionDelay: contentPhase === 'exiting' ? '0s' : '0.1s',
                  }}
                >
                  {logoSplatDecorations.map((splat) => (
                    <Splat
                      key={splat.id}
                      id={splat.splatId}
                      color={splat.color}
                      className={cn('pointer-events-none absolute z-[var(--z-deco)]', splat.className)}
                    />
                  ))}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://splatoon.nintendo.com/_images/logo/splatoon3-logo-subpage.png"
                    alt="Splatoon 3"
                    className="pointer-events-none absolute top-[0.15rem] left-1/2 z-[var(--z-deco-fg)] w-[22.375rem] max-w-[78%] -translate-x-1/2 select-none"
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
                              'pointer-events-none absolute z-[var(--z-deco)] opacity-0 transition-all duration-150 ease-out',
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
                            'group/nav-link relative z-[var(--z-deco-fg)] inline-flex items-center gap-3 py-[0.18rem] text-[2.18rem] leading-none font-semibold text-white transition-colors duration-150 md:text-[3.25rem]',
                            isHighlighted && 'text-[#eaff3d]',
                            link.textClassName
                          )}
                        >
                          <span className="relative inline-block">{link.label}</span>
                          <NavChevron isHighlighted={isHighlighted} />
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
