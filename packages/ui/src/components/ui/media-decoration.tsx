import * as React from 'react'

import { cn } from '@/lib/utils'
import { CardSlot } from './card-slot'
import { type TapeImageVariant } from './tape-assets'
import { TapePicture, TapeResponsivePictures } from './tape-picture'
import type { SplatoonAssetBasePath } from './assets'

export type MediaDecorationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface MediaDecorationProps extends Omit<
  React.ComponentProps<'div'>,
  'children' | 'ref'
> {
  asset: TapeImageVariant
  assetBasePath?: SplatoonAssetBasePath
  media?: string
  position?: MediaDecorationPosition
  responsive?: boolean
  imageClassName?: string
  mobilePictureClassName?: string
  desktopPictureClassName?: string
  ref?: React.Ref<HTMLDivElement>
}

export function MediaDecoration({
  ref,
  asset,
  assetBasePath,
  responsive = true,
  media,
  imageClassName,
  mobilePictureClassName,
  desktopPictureClassName,
  className,
  ...props
}: MediaDecorationProps) {
  return (
    <CardSlot ref={ref} className={cn(className)} {...props}>
      {responsive ? (
        <TapeResponsivePictures
          asset={asset}
          assetBasePath={assetBasePath}
          mobilePictureClassName={mobilePictureClassName}
          desktopPictureClassName={desktopPictureClassName}
          imageClassName={imageClassName}
        />
      ) : (
        <TapePicture
          asset={asset}
          assetBasePath={assetBasePath}
          className={imageClassName}
          media={media}
        />
      )}
    </CardSlot>
  )
}
