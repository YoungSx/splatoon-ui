/* ──────────────────────────────────────────────
   Navigation — generic types
   ────────────────────────────────────────────── */

export interface NavLink {
  label: string
  href: string
  selectedKey?: string
  textClassName?: string
}

export type LinkRenderProps = {
  isHighlighted: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onFocus: () => void
  onBlur: () => void
  onClick: () => void
}
