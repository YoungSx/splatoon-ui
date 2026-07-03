import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from '@/components/ui/nav-menu-button.module.css'
import shared from '@/components/ui/wave-button.module.css'

export interface NavMenuButtonProps extends React.ComponentProps<'button'> {
  pressed?: boolean
}

function NavMenuButton({
  ref,
  className,
  pressed = false,
  type = 'button',
  ...props
}: NavMenuButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'nav-trigger',
        styles.trigger,
        'group/menu-btn',
        pressed && shared.pressed,
        className
      )}
      aria-expanded={pressed}
      aria-controls="full-page-menu"
      aria-live="polite"
      {...props}
    >
      <div data-menu-trigger-icon="" className={cn(shared.iconWrap, shared.morph)}>
        <span data-menu-trigger-line="" className={shared.icon} />
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

export { NavMenuButton }
