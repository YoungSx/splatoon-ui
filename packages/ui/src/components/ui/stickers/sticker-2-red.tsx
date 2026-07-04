import * as React from 'react'

import { StickerImage } from './sticker-image'

export interface Sticker2RedProps extends Omit<
  React.ComponentProps<'img'>,
  'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'
> {
  ref?: React.Ref<HTMLImageElement>
}

export function Sticker2Red({ ref, className, ...props }: Sticker2RedProps) {
  return <StickerImage ref={ref} asset="sticker-2-red" className={className} {...props} />
}

Sticker2Red.displayName = 'Sticker2Red'
