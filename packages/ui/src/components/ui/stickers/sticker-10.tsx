import * as React from 'react'

import { StickerImage } from './sticker-image'

export interface Sticker10Props extends Omit<
  React.ComponentProps<'img'>,
  'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'
> {
  ref?: React.Ref<HTMLImageElement>
}

export function Sticker10({ ref, className, ...props }: Sticker10Props) {
  return <StickerImage ref={ref} asset="sticker-10" className={className} {...props} />
}

Sticker10.displayName = 'Sticker10'
