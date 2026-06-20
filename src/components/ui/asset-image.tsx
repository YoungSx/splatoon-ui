import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ImageAsset {
  src: string
  alt: string
  width: number
  height: number
}

export interface AssetImageProps extends Omit<
  React.ComponentProps<'img'>,
  'alt' | 'height' | 'src' | 'width'
> {
  asset: ImageAsset
  alt?: string
  decorative?: boolean
  fit?: React.CSSProperties['objectFit']
  aspectRatio?: React.CSSProperties['aspectRatio']
  fill?: boolean
}

export function AssetImage({
  asset,
  alt,
  className,
  decorative = false,
  draggable = false,
  fit,
  aspectRatio,
  fill = false,
  style,
  ...props
}: AssetImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- component library assets use known public dimensions and caller-controlled layout.
    <img
      {...props}
      alt={decorative ? '' : (alt ?? asset.alt)}
      aria-hidden={decorative ? true : props['aria-hidden']}
      className={cn(fill && 'block h-full w-full', className)}
      draggable={draggable}
      height={asset.height}
      src={asset.src}
      style={{
        ...(fit ? { objectFit: fit } : {}),
        ...(aspectRatio ? { aspectRatio } : {}),
        ...style,
      }}
      width={asset.width}
    />
  )
}
