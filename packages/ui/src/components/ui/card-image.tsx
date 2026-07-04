'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { CardContext } from './card-context'
import { PhotoFrame } from './photo-frame'

export interface CardImageProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  src?: string
  alt?: string
  ref?: React.Ref<HTMLDivElement>
}

export function CardImage({ ref, className, src, alt, children, ...props }: CardImageProps) {
  const { variant } = React.useContext(CardContext)

  if (variant === 'rugged') {
    return (
      <div
        ref={ref}
        data-slot="card-image"
        className={cn('relative flex w-full justify-center py-4', className)}
        {...props}
      >
        <PhotoFrame src={src} alt={alt} variant="b" rotation="2deg" fillWidth>
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
