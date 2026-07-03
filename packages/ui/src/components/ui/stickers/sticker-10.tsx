import * as React from 'react'

import { StickerImage } from './sticker-image'

export type Sticker10Props = Omit<
  React.ComponentProps<'img'>,
  'height' | 'src' | 'srcSet' | 'width'
>

export function Sticker10({ className, ...props }: Sticker10Props) {
  return <StickerImage asset="sticker-10" className={className} {...props} />
}

Sticker10.displayName = 'Sticker10'
