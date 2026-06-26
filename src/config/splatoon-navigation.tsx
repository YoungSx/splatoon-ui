/* ──────────────────────────────────────────────
   Splatoon Navigation — brand-specific config & renderers
   ────────────────────────────────────────────── */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Splat } from '@/components/ui/splats'
import { Sticker2Red, Sticker10, Sticker5 } from '@/components/ui/stickers'
import { NavChevron } from '@/components/ui/nav-chevron'
import type { NavLink, LinkRenderProps } from '@/components/ui/navigation-types'
import type { ContentPhase, CanvasState } from '@/hooks/use-navigation-menu-animation'
import { InkSplashCanvas } from '@/components/ui/ink-splash-canvas'

/* ── Splatoon link type ── */

export interface SplatoonNavLink extends NavLink {
  hoverSplatId?: number
  hoverSplatColor?: string
  hoverSplatClassName?: string
}

/* ── Link data ── */

export const navLinks: SplatoonNavLink[] = [
  {
    label: 'Home',
    href: '#',
    selectedKey: 'home',
    hoverSplatId: 5,
    hoverSplatColor: 'var(--color-yellow)',
    hoverSplatClassName: '-left-[2.5em] top-1/2 h-[4em] w-[4em] -translate-y-[46%] rotate-[-18deg]',
  },
  {
    label: 'Demo reel',
    href: '#trailer',
    selectedKey: 'trailer',
    hoverSplatId: 9,
    hoverSplatColor: 'var(--color-blue)',
    hoverSplatClassName:
      '-left-[2.35em] top-1/2 h-[4.2em] w-[4.2em] -translate-y-[44%] rotate-[12deg]',
  },
  {
    label: 'Titles',
    href: '#titles',
    selectedKey: 'titles',
    hoverSplatId: 8,
    hoverSplatColor: 'var(--color-yellow)',
    hoverSplatClassName:
      '-left-[2.45em] top-1/2 h-[4.05em] w-[4.05em] -translate-y-[45%] rotate-[14deg]',
  },
  {
    label: 'Buttons & badges',
    href: '#buttons-badges',
    selectedKey: 'buttons-badges',
    hoverSplatId: 11,
    hoverSplatColor: 'var(--color-blue)',
    hoverSplatClassName:
      '-left-[2.5em] top-1/2 h-[4.25em] w-[4.25em] -translate-y-[45%] rotate-[-10deg]',
  },
  {
    label: 'Overlays',
    href: '#overlays',
    selectedKey: 'overlays',
    hoverSplatId: 10,
    hoverSplatColor: 'var(--color-blue)',
    hoverSplatClassName:
      '-left-[2.65em] top-1/2 h-[4.35em] w-[4.35em] -translate-y-[44%] -rotate-[18deg]',
  },
  {
    label: 'Card grid',
    href: '#card-grid',
    selectedKey: 'card-grid',
    hoverSplatId: 6,
    hoverSplatColor: 'var(--color-yellow)',
    hoverSplatClassName:
      '-left-[2.3em] top-1/2 h-[3.95em] w-[3.95em] -translate-y-[44%] rotate-[8deg]',
  },
  {
    label: 'Carousels',
    href: '#carousels',
    selectedKey: 'carousels',
    hoverSplatId: 3,
    hoverSplatColor: 'var(--color-blue)',
    hoverSplatClassName:
      '-left-[2.45em] top-1/2 h-[4.1em] w-[4.1em] -translate-y-[44%] -rotate-[12deg]',
  },
  {
    label: 'Forms & feedback',
    href: '#progress',
    selectedKey: 'progress',
    hoverSplatId: 12,
    hoverSplatColor: 'var(--color-blue)',
    hoverSplatClassName:
      '-left-[2.55em] top-1/2 h-[4.3em] w-[4.3em] -translate-y-[44%] rotate-[16deg]',
  },
]

/* ── Decoration data ── */

const logoSplatDecorations = [
  {
    id: 'logo-splat-yellow-left',
    splatId: 4,
    color: 'var(--color-yellow)',
    className: 'absolute left-[3.5%] top-[-13%] h-[13.5rem] w-[13.5rem] rotate-[-12deg]',
  },
  {
    id: 'logo-splat-purple-mid',
    splatId: 7,
    color: 'var(--color-blue)',
    className: 'absolute left-[30%] top-[-28%] h-[14rem] w-[14rem] rotate-[7deg]',
  },
  {
    id: 'logo-splat-yellow-right',
    splatId: 2,
    color: 'var(--color-yellow)',
    className: 'absolute right-[1%] top-[-9%] h-[13.75rem] w-[13.75rem] rotate-[10deg]',
  },
] as const

const overlayDecorations = [
  {
    id: 'overlay-splat-left',
    splatId: 7,
    color: 'var(--color-blue)',
    frameClassName:
      'absolute left-[-70%] top-[26%] h-[30rem] w-[30rem] lg:left-[-7.5%] lg:top-[17%]',
    splatClassName: 'rotate-[30deg] lg:rotate-[-21deg]',
  },
  {
    id: 'overlay-splat-left-yellow',
    splatId: 8,
    color: 'var(--color-yellow)',
    frameClassName:
      'absolute bottom-[-24%] left-[-58%] h-[20rem] w-[20rem] lg:bottom-auto lg:left-[16%] lg:top-[51%] lg:h-[16rem] lg:w-[16rem]',
    splatClassName: 'rotate-[0deg] lg:rotate-[14deg]',
  },
  {
    id: 'overlay-splat-right-yellow',
    splatId: 6,
    color: 'var(--color-yellow)',
    frameClassName:
      'absolute right-[-62%] bottom-[-30%] h-[27rem] w-[27rem] lg:right-[4%] lg:bottom-auto lg:top-[56%]',
    splatClassName: 'rotate-[0deg] lg:rotate-[18deg]',
  },
  {
    id: 'overlay-splat-right-purple',
    splatId: 7,
    color: 'var(--color-blue)',
    frameClassName: 'absolute right-[19%] top-[79%] hidden h-[13rem] w-[13rem] lg:block',
    splatClassName: 'rotate-[14deg]',
  },
] as const

/* ── Link renderer ── */

export function renderSplatoonLink(link: SplatoonNavLink, props: LinkRenderProps) {
  return (
    <>
      {link.hoverSplatId ? (
        <Splat
          id={link.hoverSplatId}
          data-nav-hover-splat={link.label}
          color={link.hoverSplatColor}
          className={cn(
            'pointer-events-none absolute z-[var(--z-deco)] opacity-0 transition-all duration-150 ease-out',
            props.isHighlighted ? 'scale-100 opacity-100' : 'scale-[1.32] opacity-0',
            link.hoverSplatClassName
          )}
        />
      ) : null}

      <a
        href={link.href}
        data-nav-link="true"
        data-nav-label={link.label}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        className={cn(
          'group/nav-link font-alt relative z-[var(--z-deco-fg)] inline-flex items-center gap-3 px-8 py-3 text-[1.625rem] leading-none font-medium text-white transition-colors duration-150 lg:text-[2.5rem]',
          (props.isHighlighted || props.isActive) && 'text-yellow',
          props.isActive && '-rotate-2deg',
          link.textClassName
        )}
      >
        <span className="relative inline-block">{link.label}</span>
        <NavChevron isHighlighted={props.isHighlighted} />
      </a>
    </>
  )
}

/* ── Logo renderer ── */

export function SplatoonMenuLogo({ contentPhase }: { contentPhase: ContentPhase }) {
  const isVisible = contentPhase !== 'hidden' && contentPhase !== 'exiting'

  return (
    <div
      className="relative mb-4 aspect-[643/243] w-full max-w-[22rem] md:mb-7 lg:h-[12.9rem] lg:w-[40rem] lg:max-w-[92vw]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.85)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'cubic-bezier(0.21, 0.12, 0.35, 1.43)',
        transitionDelay: contentPhase === 'exiting' ? '0s' : '0.1s',
      }}
    >
      {logoSplatDecorations.map((splat) => (
        <Splat
          key={splat.id}
          id={splat.splatId}
          color={splat.color}
          className={cn('pointer-events-none absolute z-[var(--z-deco)]', splat.className)}
        />
      ))}
      <div className="pointer-events-none absolute top-[0.7rem] left-1/2 z-[var(--z-deco-fg)] flex -translate-x-1/2 -rotate-2 flex-col items-center text-center select-none lg:top-[1.2rem]">
        <span className="font-heading text-[clamp(3rem,11vw,6.5rem)] leading-none text-white drop-shadow-[5px_5px_0_var(--color-black)] lg:text-[clamp(3rem,11vw,6.5rem)]">
          Splatoon UI
        </span>
        <span className="bg-yellow font-alt text-chaos-black -mt-1 inline-block px-3 py-1 text-[0.7rem] font-black tracking-wider uppercase md:text-sm lg:px-4 lg:text-base">
          Fan-made component kit
        </span>
      </div>
    </div>
  )
}

/* ── Menu decorations (stickers) ── */

export function SplatoonMenuDecorations() {
  return (
    <>
      {/* Sticker 2 Red */}
      <div className="pointer-events-none absolute top-[23.2%] left-[10.25%] z-[var(--z-deco-fg)] hidden w-[13.5rem] -rotate-[27deg] select-none lg:block">
        <Sticker2Red />
      </div>

      {/* Sticker 10 */}
      <div className="pointer-events-none absolute top-[52.1%] right-[10.8%] z-[var(--z-deco-fg)] hidden w-[14.35rem] rotate-[-7deg] select-none lg:block">
        <Sticker10 />
      </div>

      {/* Sticker 5 */}
      <div className="pointer-events-none absolute bottom-[-0.4%] left-[10.7%] z-[var(--z-deco-fg)] hidden w-[29.5rem] -rotate-[9deg] select-none lg:block">
        <Sticker5 />
      </div>
    </>
  )
}

/* ── Overlay decorations (background splats with animation) ── */

export function SplatoonOverlayDecorations({ contentPhase }: { contentPhase: ContentPhase }) {
  const isVisible = contentPhase !== 'hidden' && contentPhase !== 'exiting'

  return (
    <>
      {overlayDecorations.map((splat, i) => (
        <div
          key={splat.id}
          aria-hidden="true"
          className={cn('pointer-events-none z-[var(--z-deco)]', splat.frameClassName)}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1) translate(0, 0)' : 'scale(0.8) translate(0, 10%)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '0.4s',
            transitionDelay: isVisible ? `${0.5 + i * 0.1}s` : '0s',
          }}
        >
          <Splat
            id={splat.splatId}
            color={splat.color}
            className={cn('h-full w-full origin-center', splat.splatClassName)}
          />
        </div>
      ))}
    </>
  )
}

/* ── Header drip decoration ── */

export function SplatoonHeaderDrip({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute left-0 z-[var(--z-deco)] overflow-hidden transition-all duration-300',
        isCollapsed ? 'top-[35px] h-[136px] w-[224px]' : 'top-[39px] h-[140px] w-[228px]'
      )}
    >
      <svg
        className="h-full w-full fill-black"
        viewBox="0 0 226 138"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M0,76.3515281 C4.72248572,74.7212575 12.0010363,76.6320718 14.737896,81.3919634 C21.8013631,93.6673091 6.44938808,110.867755 12.5995295,121.562705 C16.6019531,128.523306 25.585586,128.183536 27.7021324,118.018503 C29.2045998,110.799178 19.3107584,91.7564947 26.2962967,81.4200178 C29.659704,76.4450427 37.2562041,76.7661094 41.3926652,83.390058 C45.4761347,89.9329607 54.3600187,86.460453 52.5458361,77.966213 C51.8382425,74.6651488 53.1318607,71.6726826 55.3855619,69.8086255 C57.3368992,68.3996727 59.4440941,67.7232506 61.4795946,67.8884597 C61.5014146,67.8915768 61.5263519,67.8884597 61.5512891,67.8915768 C67.813648,68.4557814 73.340359,76.9469042 71.3516159,96.1984368 C70.064232,108.682632 63.7270614,115.194363 66.7039418,128.682281 C69.3472869,140.649028 80.0141821,141.487542 84.7460193,128.875544 C88.6237567,118.539067 84.0415428,105.372216 82.8102677,95.6030607 C79.7367555,71.1739382 97.8692304,66.2550719 108.822904,70.1889181 C118.931828,73.8204005 115.686873,82.592067 121.141889,86.1362692 C126.989667,89.9360778 135.212715,83.040937 127.020839,72.9663008 C121.603228,66.3080635 125.870609,55.0582609 134.433427,57.8169406 C146.95191,61.8505357 151.668162,54.0483035 150.879522,46.9661335 C150.165694,40.5666199 154.97546,33.8304538 167.578107,42.2249449 C179.105336,49.902491 186.134515,32.2531747 174.130361,27.4028858 C159.526503,21.5021165 156.746003,5.67633432 180.514289,6.26859325 C186.48987,6.41821656 205.036926,11.3464343 215.326646,9.69122646 C223.219275,8.41942833 226.314608,4.12399248 225.669357,0 L0,0 L0,76.3515281 Z"
        />
      </svg>
    </div>
  )
}

/* ── Background transition (ink splash) ── */

const SPLAT_START_POSITION: [number, number] = [-0.5, 0.5]

export function SplatoonBackgroundTransition({
  canvasState,
  openCount,
  onComplete,
}: {
  canvasState: CanvasState
  openCount: number
  onComplete: () => void
}) {
  return (
    <InkSplashCanvas
      state={canvasState}
      durationIn={700}
      durationOut={1000}
      color="var(--color-true-black)"
      count={openCount}
      startPosition={SPLAT_START_POSITION}
      onComplete={onComplete}
      className="pointer-events-none absolute inset-0 z-[var(--z-nav-canvas)]"
    />
  )
}
