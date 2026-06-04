'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from '@/components/ui/nav-menu-button.module.css'

type NavMenuButtonProps = React.ComponentProps<'button'> & {
  pressed?: boolean
}

const NavMenuButton = React.forwardRef<HTMLButtonElement, NavMenuButtonProps>(
  ({ className, pressed = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('nav-trigger', styles.trigger, 'group/menu-btn', pressed && styles.pressed, className)}
        aria-expanded={pressed}
        aria-controls="full-page-menu"
        aria-live="polite"
        {...props}
      >
        <div data-menu-trigger-icon="" className={cn(styles.iconWrap, styles.morph)}>
          <span data-menu-trigger-line="" className={styles.icon} />
        </div>
        <span className="sr-only absolute">
          {pressed ? 'Close navigation menu' : 'Open navigation menu'}
        </span>
        <span aria-hidden="true" className={styles.label}>
          {pressed ? 'Close' : 'Menu'}
        </span>
      </button>
    )
  }
)

NavMenuButton.displayName = 'NavMenuButton'

export { NavMenuButton }
