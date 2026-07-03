'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { CardContext } from './card-context'
import { PhotoFrame } from './photo-frame'

export interface CardImageProps extends React.ComponentProps<'div'> {
  src?: string
  alt?: string
}

export function CardImage({
  ref,
  className,
  src,
  alt,
  children,
  ...props
}: CardImageProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { variant } = React.useContext(CardContext)

  if (variant === 'rugged') {
    return (
      <div className="relative flex w-full justify-center py-4">
        <PhotoFrame
          ref={ref}
          src={src}
          alt={alt}
          variant="b"
          rotation="2deg"
          fillWidth
          className={className}
          {...props}
        >
          {children}
        </PhotoFrame>
      </div>
    )
  }

  // Default: news variant rotated photo
  return (
    <div
      ref={ref}
      data-slot="card-image"
      className={cn(
        'grid-news-card_image relative flex w-full [transform:rotate(-1deg)] items-center justify-center overflow-hidden',
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-auto w-full object-contain"
          decoding="async"
          loading="lazy"
        />
      ) : (
        children
      )}
    </div>
  )
}
