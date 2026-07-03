/**
 * Badge
 *
 * Currently the only shipped variant is `torn` — a torn-paper shaped badge
 * using authentic switch-track SVG edges.
 *
 * Architecture note: `variant` prop is intentionally kept for future extension
 * (e.g. `variant="rounded"`, `variant="outline"`). Today every badge is torn.
 */

import { TornBadge, type TornBadgeColor } from './torn-badge'

// Re-export so consumers can import TornBadgeColor from the badge barrel.
export type { TornBadgeColor }

export interface BadgeProps extends React.ComponentProps<'span'> {
  /**
   * Badge shape variant.
   * Only `"torn"` exists for now; more variants may be added later.
   * Defaults to `"torn"`.
   */
  variant?: 'torn'
  /** Fill color of the badge. Defaults to `"yellow"`. */
  color?: TornBadgeColor
}

function Badge({
  variant, // accepted for forward-compatibility; currently only "torn" exists
  color = 'yellow',
  ...props
}: BadgeProps) {
  void variant // future dispatch point
  return <TornBadge color={color} {...props} />
}

export { Badge }
