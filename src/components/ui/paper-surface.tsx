import * as React from 'react'

import { cn } from '@/lib/utils'
import { PaperTearEdge } from './paper-tear-edge'

export type PaperSurfaceTone = 'white' | 'black' | 'red'

const PAPER_SURFACE_FILL: Record<PaperSurfaceTone, string> = {
  white: 'var(--color-white)',
  black: 'var(--color-black)',
  red: 'var(--color-red)',
}

export interface PaperSurfaceProps extends React.ComponentProps<'div'> {
  tone?: PaperSurfaceTone
  topEdgeClassName?: string
  bottomEdgeClassName?: string
  /** Extra classes for the middle content layer. The surface guarantees
   *  `w-full min-w-0 overflow-x-clip` as structural invariants — content
   *  will never bleed outside the tear-paper boundary. */
  contentClassName?: string
  showTopEdge?: boolean
  showBottomEdge?: boolean
}

export function PaperSurface({
  tone = 'white',
  className,
  topEdgeClassName,
  bottomEdgeClassName,
  contentClassName,
  showTopEdge = true,
  showBottomEdge = true,
  children,
  ...props
}: PaperSurfaceProps) {
  const fill = PAPER_SURFACE_FILL[tone]

  return (
    <div className={cn('relative flex flex-col', className)} {...props}>
      {showTopEdge ? (
        <PaperTearEdge
          edge="top"
          color={fill}
          className={cn('pointer-events-none relative z-10 mb-[-2px] select-none', topEdgeClassName)}
        />
      ) : null}
      {/*
       * Structural invariants owned by PaperSurface — not overridable by consumers:
       *   w-full      : middle layer is always as wide as the flex column (matches the SVG edges)
       *   min-w-0     : allows shrinking below intrinsic content width inside flex/grid
       *   overflow-x-clip : clips horizontal overflow without creating a new BFC,
       *                     so sticky/absolute children and vertical layout are unaffected
       * Consumers extend layout (flex, padding, bg, etc.) via contentClassName.
       */}
      <div
        className={cn(
          'relative z-10',
          contentClassName,
          'w-full min-w-0 overflow-x-clip',
        )}
      >
        {children}
      </div>
      {showBottomEdge ? (
        <PaperTearEdge
          edge="bottom"
          color={fill}
          className={cn('pointer-events-none relative z-10 mt-[-2px] select-none', bottomEdgeClassName)}
        />
      ) : null}
    </div>
  )
}
