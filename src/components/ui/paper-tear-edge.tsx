import * as React from 'react'

import { cn } from '@/lib/utils'

const PAPER_TEAR_EDGE_ASSETS = {
  top: {
    src: '/_images/svg/paper-tear-up.svg',
    width: 448,
    height: 60,
  },
  bottom: {
    src: '/_images/svg/paper-tear-down.svg',
    width: 448,
    height: 24,
  },
} as const

export interface PaperTearEdgeProps extends React.ComponentProps<'div'> {
  edge?: keyof typeof PAPER_TEAR_EDGE_ASSETS
  color?: string
}

export function PaperTearEdge({
  edge = 'top',
  color = 'currentColor',
  className,
  style,
  ...props
}: PaperTearEdgeProps) {
  const asset = PAPER_TEAR_EDGE_ASSETS[edge]
  const maskUrl = `url("${asset.src}")`

  return (
    <div
      aria-hidden="true"
      data-slot="paper-tear-edge"
      data-edge={edge}
      className={cn('block shrink-0', className)}
      style={{
        aspectRatio: `${asset.width} / ${asset.height}`,
        backgroundColor: color,
        maskImage: maskUrl,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: '100% 100%',
        WebkitMaskImage: maskUrl,
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: '100% 100%',
        ...style,
      }}
      {...props}
    />
  )
}
