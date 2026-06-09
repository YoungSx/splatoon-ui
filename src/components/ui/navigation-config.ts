/* ──────────────────────────────────────────────
   Navigation Menu — static data & configuration
   ────────────────────────────────────────────── */

export interface NavLink {
  label: string
  href: string
  isBuyNow?: boolean
  selectedKey?: string
  hoverSplatId?: number
  hoverSplatColor?: string
  hoverSplatClassName?: string
  textClassName?: string
}

export const navLinks: NavLink[] = [
  { label: 'Buy now', href: '#buy', isBuyNow: true },
  {
    label: 'Home',
    href: '#',
    selectedKey: 'home',
    hoverSplatId: 5,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName: '-left-[2.5em] top-1/2 h-[4em] w-[4em] -translate-y-[46%] rotate-[-18deg]',
  },
  {
    label: 'Welcome to Splatsville',
    href: '#world',
    selectedKey: 'world',
    hoverSplatId: 9,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.35em] top-1/2 h-[4.2em] w-[4.2em] -translate-y-[44%] rotate-[12deg]',
  },
  {
    label: 'How to play',
    href: '#gameplay',
    selectedKey: 'gameplay',
    hoverSplatId: 8,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName:
      '-left-[2.45em] top-1/2 h-[4.05em] w-[4.05em] -translate-y-[45%] rotate-[14deg]',
  },
  {
    label: 'Weapons & gear',
    href: '#weapons',
    selectedKey: 'weapons',
    hoverSplatId: 11,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.5em] top-1/2 h-[4.25em] w-[4.25em] -translate-y-[45%] rotate-[-10deg]',
  },
  {
    label: 'News',
    href: '#news',
    selectedKey: 'news',
    hoverSplatId: 10,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.65em] top-1/2 h-[4.35em] w-[4.35em] -translate-y-[44%] -rotate-[18deg]',
  },
  {
    label: 'Events',
    href: '#events',
    selectedKey: 'events',
    hoverSplatId: 6,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName:
      '-left-[2.3em] top-1/2 h-[3.95em] w-[3.95em] -translate-y-[44%] rotate-[8deg]',
  },
  {
    label: 'Expansion Pass',
    href: '#expansion-pass',
    selectedKey: 'expansion-pass',
    hoverSplatId: 12,
    hoverSplatColor: '#603bff',
    hoverSplatClassName:
      '-left-[2.55em] top-1/2 h-[4.3em] w-[4.3em] -translate-y-[44%] rotate-[16deg]',
  },
  {
    label: 'Go to Splatoon Base',
    href: 'https://splatoon.nintendo.com/base/',
    selectedKey: 'splatoon-base',
    hoverSplatId: 4,
    hoverSplatColor: '#f2ff27',
    hoverSplatClassName:
      '-left-[2.45em] top-1/2 h-[4.15em] w-[4.15em] -translate-y-[45%] -rotate-[12deg]',
  },
]

export const logoSplatDecorations = [
  {
    id: 'logo-splat-yellow-left',
    splatId: 4,
    color: '#f2ff27',
    className: 'absolute left-[3.5%] top-[-13%] h-[13.5rem] w-[13.5rem] rotate-[-12deg]',
  },
  {
    id: 'logo-splat-purple-mid',
    splatId: 7,
    color: '#603bff',
    className: 'absolute left-[30%] top-[-28%] h-[14rem] w-[14rem] rotate-[7deg]',
  },
  {
    id: 'logo-splat-yellow-right',
    splatId: 2,
    color: '#f2ff27',
    className: 'absolute right-[1%] top-[-9%] h-[13.75rem] w-[13.75rem] rotate-[10deg]',
  },
] as const

export const overlayDecorations = [
  {
    id: 'overlay-splat-left',
    splatId: 7,
    color: '#603bff',
    className: 'absolute left-[-7.5%] top-[17%] h-[30rem] w-[30rem] rotate-[-21deg]',
  },
  {
    id: 'overlay-splat-left-yellow',
    splatId: 8,
    color: '#f2ff27',
    className: 'absolute left-[16%] top-[51%] h-[16rem] w-[16rem] rotate-[14deg]',
  },
  {
    id: 'overlay-splat-right-yellow',
    splatId: 6,
    color: '#f2ff27',
    className: 'absolute right-[4%] top-[56%] h-[27rem] w-[27rem] rotate-[18deg]',
  },
  {
    id: 'overlay-splat-right-purple',
    splatId: 7,
    color: '#603bff',
    className: 'absolute right-[19%] top-[79%] h-[13rem] w-[13rem] rotate-[14deg]',
  },
] as const
