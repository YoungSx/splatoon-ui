/* ──────────────────────────────────────────────
   Navigation — generic types
   ────────────────────────────────────────────── */

import type * as React from 'react'

export interface NavLink {
  label: string
  href: string
  selectedKey?: string
  textClassName?: string
}

export type LinkRenderProps = {
  isHighlighted: boolean
  isActive: boolean
  onMouseEnter: React.MouseEventHandler<HTMLAnchorElement>
  onMouseLeave: React.MouseEventHandler<HTMLAnchorElement>
  onFocus: React.FocusEventHandler<HTMLAnchorElement>
  onBlur: React.FocusEventHandler<HTMLAnchorElement>
  onClick: React.MouseEventHandler<HTMLAnchorElement>
}
