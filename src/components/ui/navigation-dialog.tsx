'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { InkSplashCanvas } from '@/components/ui/ink-splash-canvas'
import { NavMenuButton } from '@/components/ui/nav-menu-button'
import { NavChevron } from './nav-chevron'
import type { NavLink } from '@/components/ui/navigation-types'
import type { ContentPhase } from '@/hooks/use-navigation-menu-animation'
import { useSyncSelectedNavKey } from '@/hooks/use-sync-selected-nav-key'
import { useNavigationMenuAnimation } from '@/hooks/use-navigation-menu-animation'

const NAV_SPLAT_START_POSITION: [number, number] = [-0.5, 0.5]

type LinkRenderProps = {
  isHighlighted: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onFocus: () => void
  onBlur: () => void
  onClick: () => void
}

type NavigationDialogProps = {
  isReducedMotion?: boolean
  navLinks: NavLink[]
  highlightColor?: string
  logo?: (contentPhase: ContentPhase) => React.ReactNode
  menuDecorations?: React.ReactNode
  overlayDecorations?: (contentPhase: ContentPhase) => React.ReactNode
  renderLink?: (link: NavLink, props: LinkRenderProps) => React.ReactNode
  backgroundTransition?: React.ReactNode
  onNavigate?: (href: string) => void
}

function DefaultNavLink({
  link,
  isHighlighted,
  highlightColor,
  ...eventProps
}: {
  link: NavLink
  isHighlighted: boolean
  highlightColor: string
} & LinkRenderProps) {
  return (
    <a
      href={link.href}
      data-nav-link="true"
      data-nav-label={link.label}
      {...eventProps}
      className={cn(
        'group/nav-link relative z-[var(--z-deco-fg)] inline-flex items-center gap-3 py-[0.18rem] text-[2.18rem] leading-none font-semibold text-white transition-colors duration-150 md:text-[3.25rem]',
        isHighlighted && `text-[${highlightColor}]`,
        link.textClassName
      )}
    >
      <span className="relative inline-block">{link.label}</span>
      <NavChevron isHighlighted={isHighlighted} />
    </a>
  )
}

export function NavigationDialog({
  isReducedMotion = false,
  navLinks,
  highlightColor = '#eaff3d',
  logo,
  menuDecorations,
  overlayDecorations,
  renderLink,
  backgroundTransition,
  onNavigate,
}: NavigationDialogProps) {
  const [activeNavLabel, setActiveNavLabel] = React.useState<string | null>(null)
  const selectedNavKey = useSyncSelectedNavKey(navLinks)
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
  const defaultNavigate = React.useCallback(
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

  const navigate = onNavigate ?? defaultNavigate

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

            {/* Background transition (default: InkSplashCanvas) */}
            {backgroundTransition ?? (
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
            )}

            <div
              data-menu-content=""
              data-phase={contentPhase}
              className={cn(
                'absolute inset-0 z-[var(--z-nav-content)] flex flex-col items-center justify-center p-6 text-white',
                contentTransitionClass,
                isContentInteractive ? 'pointer-events-auto' : 'pointer-events-none'
              )}
            >
              {/* Background decorations (render prop with contentPhase) */}
              {overlayDecorations?.(contentPhase)}

              {/* Menu decorations (stickers, etc.) */}
              {menuDecorations}

              <nav
                aria-label="Main site navigation"
                className={cn(
                  'relative z-10 flex w-full max-w-[44rem] flex-col items-center pt-4 text-center md:pt-5',
                )}
              >
                {/* Logo area (render prop with contentPhase) */}
                {logo?.(contentPhase)}

                <ul className="relative flex w-full flex-col items-center gap-0">
                  {navLinks.map((link, index) => {
                    const isHighlighted = activeNavLabel
                      ? activeNavLabel === link.label
                      : selectedNavKey === link.selectedKey

                    // Stagger: each li starts at opacity:0, scale(0.5),
                    // then transitions to visible with per-item delay (0.1s increments)
                    const itemDelay = contentPhase === 'entering'
                      ? `${(index + 1) * 100}ms`
                      : '0s'
                    const isItemVisible = contentPhase === 'entering' || contentPhase === 'visible'

                    const linkProps: LinkRenderProps = {
                      isHighlighted,
                      onMouseEnter: () => setActiveNavLabel(link.label),
                      onMouseLeave: () =>
                        setActiveNavLabel((current) =>
                          current === link.label ? null : current
                        ),
                      onFocus: () => setActiveNavLabel(link.label),
                      onBlur: () =>
                        setActiveNavLabel((current) =>
                          current === link.label ? null : current
                        ),
                      onClick: () => navigate(link.href),
                    }

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
                        {renderLink
                          ? renderLink(link, linkProps)
                          : <DefaultNavLink link={link} highlightColor={highlightColor} {...linkProps} />}
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
