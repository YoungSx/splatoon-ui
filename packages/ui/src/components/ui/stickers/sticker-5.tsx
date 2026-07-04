import * as React from 'react'

import { StickerImage } from './sticker-image'

export interface Sticker5Props extends Omit<
  React.ComponentProps<'img'>,
  'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'
> {
  ref?: React.Ref<HTMLImageElement>
}

export function Sticker5({ ref, className, ...props }: Sticker5Props) {
  return <StickerImage ref={ref} asset="sticker-5" className={className} {...props} />
}

Sticker5.displayName = 'Sticker5'
