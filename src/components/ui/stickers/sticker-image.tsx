import * as React from 'react'

import { TapePicture } from '@/components/ui/tape-picture'
import type { TapeImageVariant } from '@/components/ui/tape-assets'

interface StickerImageProps extends Omit<
  React.ComponentProps<'img'>,
  'height' | 'src' | 'srcSet' | 'width'
> {
  asset: TapeImageVariant
}

export function StickerImage({
  asset,
  alt = '',
  className,
  draggable = false,
  ...props
}: StickerImageProps) {
  return (
    <TapePicture {...props} asset={asset} alt={alt} className={className} draggable={draggable} />
  )
}
