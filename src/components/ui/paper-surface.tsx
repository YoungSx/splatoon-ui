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
          className={cn('pointer-events-none relative z-10 mb-[-2px] w-full select-none', topEdgeClassName)}
        />
      ) : null}
      <div className={cn('relative z-10', contentClassName)}>{children}</div>
      {showBottomEdge ? (
        <PaperTearEdge
          edge="bottom"
          color={fill}
          className={cn('pointer-events-none relative z-10 mt-[-2px] w-full select-none', bottomEdgeClassName)}
        />
      ) : null}
    </div>
  )
}
