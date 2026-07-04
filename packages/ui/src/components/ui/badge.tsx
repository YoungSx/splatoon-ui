/**
 * Badge
 *
 * Currently the only shipped variant is `torn` — a torn-paper shaped badge
 * using authentic switch-track SVG edges.
 */

import type * as React from 'react'

import { TornBadge, type TornBadgeColor } from './torn-badge'

// Re-export so consumers can import TornBadgeColor from the badge barrel.
export type { TornBadgeColor }

export interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'> {
  /** Fill color of the badge. Defaults to `"yellow"`. */
  color?: TornBadgeColor
  ref?: React.Ref<HTMLSpanElement>
}

function Badge({ ref, color = 'yellow', ...props }: BadgeProps) {
  return <TornBadge ref={ref} color={color} {...props} />
}

export { Badge }
