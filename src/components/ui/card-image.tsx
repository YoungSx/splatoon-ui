"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CardContext } from "./card"
import { StyledPhoto } from "./styled-photo"

export interface CardImageProps extends React.ComponentProps<"div"> {
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

    if (variant === "rugged") {
      return (
        <div className="relative w-full py-4 flex justify-center">
          <StyledPhoto
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
          </StyledPhoto>
        </div>
      )
    }

    // Default: news variant rotated photo
    return (
      <div
        ref={ref}
        data-slot="card-image"
        className={cn(
          "grid-news-card_image relative w-full flex items-center justify-center [transform:rotate(-1deg)] overflow-hidden",
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-auto object-contain" />
        ) : (
          children
        )}
      </div>
    )
  }
