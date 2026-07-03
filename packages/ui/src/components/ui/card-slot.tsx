import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './card-slot.module.css'

export type SlotPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

const SLOT_STYLE: Record<SlotPosition, React.CSSProperties> = {
  'top-left': { top: 0, left: '15%', transform: 'translateY(-50%)' },
  'top-center': { top: 0, left: '50%', transform: 'translate(-50%, -50%)' },
  'top-right': { top: 0, right: '15%', transform: 'translateY(-50%)' },
  'bottom-left': { bottom: 0, left: '15%', transform: 'translateY(50%)' },
  'bottom-center': { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' },
  'bottom-right': { bottom: 0, right: '15%', transform: 'translateY(50%)' },
}

export interface CardSlotProps extends React.ComponentProps<'div'> {
  /** Preset position. Omit for fully custom positioning via style. */
  position?: SlotPosition
}

export function CardSlot({ position, className, style, ...props }: CardSlotProps) {
  return (
    <div
      data-slot={position ? `slot-${position}` : 'slot'}
      className={cn(styles.cardSlot, className)}
      style={{ ...(position && SLOT_STYLE[position]), ...style }}
      {...props}
    />
  )
}
