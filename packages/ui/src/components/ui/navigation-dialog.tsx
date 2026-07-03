'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { NavMenuButton } from '@/components/ui/nav-menu-button'
import inViewStyles from '@/components/ui/in-view.module.css'
import { NavChevron } from './nav-chevron'
import type { NavLink, LinkRenderProps } from '@/components/ui/navigation-types'
import type { ContentPhase, CanvasState } from '@/hooks/use-navigation-menu-animation'
import { useSyncSelectedNavKey } from '@/hooks/use-sync-selected-nav-key'
import { useNavigationMenuAnimation } from '@/hooks/use-navigation-menu-animation'

type BackgroundTransitionProps = {
  canvasState: CanvasState
  openCount: number
  onComplete: () => void
}

type NavigationDialogProps = {
  isReducedMotion?: boolean
  navLinks: NavLink[]
  highlightColor: string
  cta?: React.ReactNode
  logo?: (contentPhase: ContentPhase) => React.ReactNode
  menuDecorations?: React.ReactNode
  overlayDecorations?: (contentPhase: ContentPhase) => React.ReactNode
  renderLink?: (link: NavLink, props: LinkRenderProps) => React.ReactNode
  backgroundTransition: (props: BackgroundTransitionProps) => React.ReactNode
  onNavigate?: (href: string) => void
  /** Accessible label for the navigation dialog and nav landmark. */
  navLabel?: string
  /** Screen-reader text for the close button. */
  closeLabel?: string
}

function DefaultNavLink({
  link,
  isHighlighted: _isHighlighted,
  isActive,
  highlightColor,
  ...eventProps
}: {
  link: NavLink
  isHighlighted: boolean
  isActive: boolean
  highlightColor: string
} & LinkRenderProps) {
  return (
    <a
      href={link.href}
      data-nav-link="true"
      data-nav-label={link.label}
      {...eventProps}
      className={cn(
        'group/nav-link font-alt relative z-[var(--z-deco-fg)] inline-flex items-center gap-3 px-8 py-3 text-[1.625rem] leading-none font-medium text-white transition-colors duration-150 lg:text-[2.5rem]',
        link.textClassName
      )}
      style={isActive ? { color: highlightColor } : undefined}
    >
      <span className="relative inline-block">{link.label}</span>
      <NavChevron isHighlighted={_isHighlighted || isActive} />
    </a>
  )
}

export function NavigationDialog({
  isReducedMotion = false,
  navLinks,
  highlightColor,
  cta,
  logo,
  menuDecorations,
  overlayDecorations,
  renderLink,
  backgroundTransition,
  onNavigate,
  navLabel = 'Main site navigation',
  closeLabel = 'Close navigation menu',
}: NavigationDialogProps) {
  const [activeNavLabel, setActiveNavLabel] = React.useState<string | null>(null)
  const selectedNavKey = useSyncSelectedNavKey(navLinks)
  const {
    coverPhase,
    contentPhase,
    openCount,
    isMenuMounted,
    isMenuPressed,
    canvasState,
    contentTransitionClass,
    openMenu: openMenuBase,
    closeMenu: closeMenuBase,
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
            aria-label={navLabel}
            initialFocus={false}
            finalFocus={true}
            className={cn(
              'fixed inset-0 z-[var(--z-nav-overlay)] overflow-hidden outline-none select-none',
              coverPhase === 'closing' ? 'pointer-events-none' : 'pointer-events-auto'
            )}
          >
            <DialogPrimitive.Close className="sr-only">{closeLabel}</DialogPrimitive.Close>

            {/* Background transition (render prop from consumer) */}
            {backgroundTransition({ canvasState, openCount, onComplete: handleCanvasComplete })}

            <div
              data-menu-content=""
              data-phase={contentPhase}
              className={cn(
                'absolute inset-0 z-[var(--z-nav-content)] overflow-hidden text-white',
                contentTransitionClass
              )}
            >
              {/* Background decorations (render prop with contentPhase) */}
              {overlayDecorations?.(contentPhase)}

              {/* Menu decorations (stickers, etc.) */}
              {menuDecorations}

              <div className="relative z-10 flex h-full w-full flex-col items-center overflow-y-auto px-6 pt-[5.625rem] pb-[3.75rem] lg:p-6">
                <nav
                  aria-label={navLabel}
                  className={cn(
                    'relative my-auto flex w-full max-w-[44rem] flex-col items-center text-center lg:pt-5'
                  )}
                >
                  {/* Logo area (render prop with contentPhase) */}
                  {logo?.(contentPhase)}

                  <ul
                    className={cn(
                      'relative flex w-full flex-col items-center gap-0',
                      inViewStyles.stagger,
                      inViewStyles.staggerPop,
                      (contentPhase === 'entering' || contentPhase === 'visible') &&
                        inViewStyles.inView
                    )}
                    style={
                      {
                        '--duration-show': '0.3s',
                        '--in-view-stagger-amount': '0.1s',
                      } as React.CSSProperties
                    }
                  >
                    {/* CTA (e.g. Buy now) — first stagger item */}
                    {cta && (
                      <li
                        data-menu-cta=""
                        className="relative z-20 mt-3 mb-5 flex justify-center lg:mt-4 lg:mb-8"
                      >
                        {cta}
                      </li>
                    )}

                    {navLinks.map((link) => {
                      const isHighlighted = activeNavLabel === link.label
                      const isActive = !activeNavLabel && selectedNavKey === link.selectedKey

                      const linkProps: LinkRenderProps = {
                        isHighlighted,
                        isActive,
                        onMouseEnter: () => setActiveNavLabel(link.label),
                        onMouseLeave: () =>
                          setActiveNavLabel((current) => (current === link.label ? null : current)),
                        onFocus: () => setActiveNavLabel(link.label),
                        onBlur: () =>
                          setActiveNavLabel((current) => (current === link.label ? null : current)),
                        onClick: () => navigate(link.href),
                      }

                      return (
                        <li key={link.label} className="relative">
                          {renderLink ? (
                            renderLink(link, linkProps)
                          ) : (
                            <DefaultNavLink
                              link={link}
                              highlightColor={highlightColor}
                              {...linkProps}
                            />
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          </DialogPrimitive.Popup>
        ) : null}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
