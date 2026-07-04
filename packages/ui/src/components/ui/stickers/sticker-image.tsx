import * as React from 'react'

import { TapePicture } from '@/components/ui/tape-picture'
import type { TapeImageVariant } from '@/components/ui/tape-assets'

interface StickerImageProps extends Omit<
  React.ComponentProps<'img'>,
  'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'
> {
  asset: TapeImageVariant
  ref?: React.Ref<HTMLImageElement>
}

export function StickerImage({
  ref,
  asset,
  alt = '',
  className,
  draggable = false,
  ...props
}: StickerImageProps) {
  return (
    <TapePicture
      ref={ref}
      {...props}
      asset={asset}
      alt={alt}
      className={className}
      draggable={draggable}
    />
  )
}
