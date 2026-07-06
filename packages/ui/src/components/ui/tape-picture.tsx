import * as React from 'react'

import { cn } from '@/lib/utils'
import {
  getTapeImageAsset,
  tapeImageAssets,
  type TapeAsset,
  type TapeAssetSource,
  type TapeImageVariant,
} from './tape-assets'
import type { SplatoonAssetBasePath } from './assets'

/* eslint-disable @next/next/no-img-element -- decorative assets are served through curated <picture> srcSets. */

type ImageProps = Omit<
  React.ComponentProps<'img'>,
  'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'
>

export interface TapePictureProps extends ImageProps {
  asset: TapeAsset | TapeImageVariant
  assetBasePath?: SplatoonAssetBasePath
  pictureClassName?: string
  media?: string
  fill?: boolean
  ref?: React.Ref<HTMLImageElement>
}

export interface TapeResponsivePicturesProps extends ImageProps {
  asset: TapeImageVariant
  assetBasePath?: SplatoonAssetBasePath
  mobilePictureClassName?: string
  desktopPictureClassName?: string
  imageClassName?: string
}

function resolveTapeAsset(asset: TapeAsset | TapeImageVariant, assetBasePath?: SplatoonAssetBasePath) {
  return typeof asset === 'string' ? getTapeImageAsset(asset, assetBasePath) : asset
}

function TapeImage({
  ref,
  source,
  alt,
  className,
  draggable,
  fill,
  ...props
}: ImageProps & {
  source: TapeAssetSource
  fill: boolean
  ref?: React.Ref<HTMLImageElement>
}) {
  return (
    <img
      ref={ref}
      {...props}
      alt={alt}
      className={cn(fill && 'block h-auto w-full', className)}
      draggable={draggable}
      height={source.height}
      decoding="async"
      loading="lazy"
      src={source.src}
      srcSet={source.pngSrcSet}
      width={source.width}
    />
  )
}

export function TapePicture({
  ref,
  asset,
  assetBasePath,
  alt = '',
  className,
  draggable = false,
  media = '(min-width: 640px)',
  pictureClassName,
  fill = true,
  ...props
}: TapePictureProps) {
  const image = resolveTapeAsset(asset, assetBasePath)

  return (
    <picture className={pictureClassName}>
      {image.desktop?.webpSrcSet ? (
        <source media={media} type="image/webp" srcSet={image.desktop.webpSrcSet} />
      ) : null}
      {image.desktop?.pngSrcSet ? <source media={media} srcSet={image.desktop.pngSrcSet} /> : null}
      {image.webpSrcSet ? <source type="image/webp" srcSet={image.webpSrcSet} /> : null}
      <TapeImage
        ref={ref}
        {...props}
        alt={alt}
        className={className}
        draggable={draggable}
        fill={fill}
        source={image}
      />
    </picture>
  )
}

export function TapeResponsivePictures({
  asset,
  assetBasePath,
  alt = '',
  className,
  draggable = false,
  mobilePictureClassName,
  desktopPictureClassName,
  imageClassName,
  ...props
}: TapeResponsivePicturesProps) {
  const image = assetBasePath ? getTapeImageAsset(asset, assetBasePath) : tapeImageAssets[asset]
  const desktopImage = image.desktop

  return (
    <>
      <picture className={mobilePictureClassName}>
        {image.webpSrcSet ? <source type="image/webp" srcSet={image.webpSrcSet} /> : null}
        <TapeImage
          {...props}
          alt={alt}
          className={cn(imageClassName, className)}
          draggable={draggable}
          fill
          source={image}
        />
      </picture>
      {desktopImage ? (
        <picture className={desktopPictureClassName}>
          {desktopImage.webpSrcSet ? (
            <source type="image/webp" srcSet={desktopImage.webpSrcSet} />
          ) : null}
          <TapeImage
            {...props}
            alt={alt}
            className={cn(imageClassName, className)}
            draggable={draggable}
            fill
            source={desktopImage}
          />
        </picture>
      ) : null}
    </>
  )
}
