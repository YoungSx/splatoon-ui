/**
 * Badge
 *
 * Currently the only shipped variant is `torn` — a torn-paper shaped badge
 * using authentic switch-track SVG edges.
 */

import type * as React from 'react'

import { TornBadge } from './torn-badge'

export type BadgeColor = 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'monochrome'

export interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'> {
  /** Fill color of the badge. Defaults to `"yellow"`. */
  color?: BadgeColor
  ref?: React.Ref<HTMLSpanElement>
}

function Badge({ ref, color = 'yellow', ...props }: BadgeProps) {
  return <TornBadge ref={ref} color={color} {...props} />
}

export { Badge }
