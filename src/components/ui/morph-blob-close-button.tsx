'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from '@/components/ui/nav-menu-button.module.css'

/**
 * MorphBlobCloseButton — reuses NavMenuButton's morph blob styling.
 * Same visual as the nav trigger: yellow morph-blob with purple X icon.
 */
type MorphBlobCloseButtonProps = React.ComponentProps<'button'>

const MorphBlobCloseButton = React.forwardRef<HTMLButtonElement, MorphBlobCloseButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(styles.iconWrap, styles.morph, className)}
        {...props}
      >
        <span data-menu-trigger-line="" className={styles.icon} />
      </button>
    )
  }
)

MorphBlobCloseButton.displayName = 'MorphBlobCloseButton'

export { MorphBlobCloseButton }
export type { MorphBlobCloseButtonProps }
