import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './black-tape-container.module.css'

export interface BlackTapeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  tapeVariant?: 'yellow'
  noVerticalPadding?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export function BlackTapeContainer({
  ref,
  className,
  children,
  tapeVariant,
  noVerticalPadding = false,
  ...props
}: BlackTapeContainerProps) {
  return (
    <div
      ref={ref}
      className={cn(
        styles.blackTapeContainer,
        tapeVariant === 'yellow' && styles.tapeYellow,
        noVerticalPadding && styles.noVerticalPadding,
        className
      )}
      {...props}
    >
      <div className={styles.blackTapeContainerInner}>{children}</div>
    </div>
  )
}
