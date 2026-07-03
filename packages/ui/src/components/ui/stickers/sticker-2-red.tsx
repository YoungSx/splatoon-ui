import * as React from 'react'

import { StickerImage } from './sticker-image'

export type Sticker2RedProps = Omit<
  React.ComponentProps<'img'>,
  'height' | 'src' | 'srcSet' | 'width'
>

export function Sticker2Red({ className, ...props }: Sticker2RedProps) {
  return <StickerImage asset="sticker-2-red" className={className} {...props} />
}

Sticker2Red.displayName = 'Sticker2Red'
