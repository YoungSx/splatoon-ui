import * as React from 'react'

import { resolveSplatoonColorValue } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import type { SplatoonColorValue } from './theme-tokens'

const PAPER_TEAR_PATHS = {
  top: {
    viewBox: '0 0 448 60',
    d: 'M253.96 23.774a4.711 4.711 0 0 1-4.693 4.328h-49.535c-.131 0-.255-.027-.384-.038-2.431-.198-4.348-2.205-4.348-4.68a4.724 4.724 0 0 1 4.732-4.716h18.204c-.006-.106-.017-.21-.017-.315 0-3.452 2.808-6.25 6.27-6.25h.62a6.26 6.26 0 0 1 5.038 2.54 6.194 6.194 0 0 1 1.233 3.71c0 .106-.01.21-.016.315H249.267c2.614 0 4.733 2.111 4.733 4.717 0 .133-.029.258-.04.389M53.446.102H9.693C4.34.102 0 4.437 0 9.782v50.044h448V9.783c0-5.346-4.338-9.68-9.693-9.68H53.445Z',
  },
  bottom: {
    viewBox: '0 0 448 24',
    d: 'M0 .826c0 9.527 5.976 17.64 14.378 20.862 2.49.955 5.184 1.5 8.01 1.5h403.223c4.635 0 8.94-1.407 12.514-3.816C444.082 15.354 448 8.548 448 .826H0Z',
  },
} as const

export type { SplatoonColorValue } from './theme-tokens'
export type PaperTearEdgeSide = keyof typeof PAPER_TEAR_PATHS

export interface PaperTearEdgeProps extends Omit<
  React.ComponentProps<'svg'>,
  'children' | 'color' | 'ref'
> {
  edge?: PaperTearEdgeSide
  color?: SplatoonColorValue
  ref?: React.Ref<SVGSVGElement>
}

export function PaperTearEdge({
  ref,
  edge = 'top',
  color,
  className,
  style,
  ...props
}: PaperTearEdgeProps) {
  const path = PAPER_TEAR_PATHS[edge]

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      data-slot="paper-tear-edge"
      data-edge={edge}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={path.viewBox}
      preserveAspectRatio="none"
      className={cn('block w-full shrink-0', className)}
      style={style}
      {...props}
    >
      <path
        fill={color ? resolveSplatoonColorValue(color) : 'currentColor'}
        fillRule="evenodd"
        d={path.d}
      />
    </svg>
  )
}
