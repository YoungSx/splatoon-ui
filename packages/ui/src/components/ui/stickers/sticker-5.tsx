import * as React from 'react'

import { StickerImage } from './sticker-image'

export type Sticker5Props = Omit<React.ComponentProps<'img'>, 'height' | 'src' | 'srcSet' | 'width'>

export function Sticker5({ className, ...props }: Sticker5Props) {
  return <StickerImage asset="sticker-5" className={className} {...props} />
}

Sticker5.displayName = 'Sticker5'
