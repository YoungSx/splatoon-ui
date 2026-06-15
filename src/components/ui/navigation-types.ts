/* ──────────────────────────────────────────────
   Navigation — generic link interface
   ────────────────────────────────────────────── */

export interface NavLink {
  label: string
  href: string
  selectedKey?: string
  textClassName?: string
}
