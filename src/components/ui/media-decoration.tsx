import * as React from 'react'

import { cn } from '@/lib/utils'
import { CardSlot, type CardSlotProps } from './card-slot'
import { type TapeImageVariant } from './tape-assets'
import { TapePicture, TapeResponsivePictures } from './tape-picture'

export interface MediaDecorationProps extends Omit<CardSlotProps, 'children'> {
  asset: TapeImageVariant
  responsive?: boolean
  media?: string
  imageClassName?: string
  mobilePictureClassName?: string
  desktopPictureClassName?: string
}

export function MediaDecoration({
  asset,
  responsive = true,
  media,
  imageClassName,
  mobilePictureClassName,
  desktopPictureClassName,
  className,
  ...props
}: MediaDecorationProps) {
  return (
    <CardSlot className={cn(className)} {...props}>
      {responsive ? (
        <TapeResponsivePictures
          asset={asset}
          mobilePictureClassName={mobilePictureClassName}
          desktopPictureClassName={desktopPictureClassName}
          imageClassName={imageClassName}
        />
      ) : (
        <TapePicture asset={asset} className={imageClassName} media={media} />
      )}
    </CardSlot>
  )
}
