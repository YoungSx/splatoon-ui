import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './wave-button.module.css'

export type WaveButtonVariant = 'yellow' | 'white' | 'ghost'
export type WaveButtonSize = 'md' | 'lg'
export type WaveButtonAnimation = 'morph' | 'none'

export interface WaveButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /** Visual variant — controls background color */
  variant?: WaveButtonVariant
  /** Button size */
  size?: WaveButtonSize
  /** Custom icon node. Defaults to the hamburger→X line animation. Pass null for no icon. */
  icon?: React.ReactNode
  /** Blob border-radius animation */
  animation?: WaveButtonAnimation
  ref?: React.Ref<HTMLButtonElement>
}

const VARIANT_CLASS: Record<WaveButtonVariant, string> = {
  yellow: styles.yellow,
  white: styles.white,
  ghost: styles.ghost,
}

const SIZE_CLASS: Record<WaveButtonSize, string> = {
  md: styles.md,
  lg: styles.lg,
}

function WaveButton({
  ref,
  variant = 'yellow',
  size = 'md',
  icon,
  animation = 'morph',
  className,
  type = 'button',
  ...props
}: WaveButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        styles.iconWrap,
        animation === 'morph' && styles.morph,
        styles.pressed,
        'grid cursor-pointer place-content-center',
        className
      )}
      {...props}
    >
      {icon !== null && (icon ?? <span data-menu-trigger-line="" className={styles.icon} />)}
    </button>
  )
}

export { WaveButton }
