'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type NavMenuButtonProps = React.ComponentProps<'button'> & {
  pressed?: boolean
}

const NavMenuButton = React.forwardRef<HTMLButtonElement, NavMenuButtonProps>(
  ({ className, pressed = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('nav-trigger group/menu-btn', pressed && 'nav-trigger-pressed', className)}
        aria-expanded={pressed}
        aria-controls="full-page-menu"
        aria-live="polite"
        {...props}
      >
        <div data-menu-trigger-icon="" className="nav-trigger__icon-wrap anim--morph">
          <span data-menu-trigger-line="" className="nav-trigger__icon" />
        </div>
        <span className="sr-only absolute">
          {pressed ? 'Close navigation menu' : 'Open navigation menu'}
        </span>
        <span aria-hidden="true" className="nav-trigger__label">
          {pressed ? 'Close' : 'Menu'}
        </span>
      </button>
    )
  }
)

NavMenuButton.displayName = 'NavMenuButton'

export { NavMenuButton }
