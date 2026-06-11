"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CardContext } from "./card"

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

    if (variant === "tag") {
      return (
        <div
          ref={ref}
          data-slot="card-image-tag-wrapper"
          className="relative w-full py-4 flex justify-center"
        >
          {/* Tape 2 decoration */}
          <picture className="absolute -top-1.5 left-0 right-0 mx-auto z-30 select-none pointer-events-none rotate-[-3deg] w-[clamp(80px,40%,140px)]">
            <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-2-medium-up.webp 1x, /_images/tape-assets/tape-2-medium-up-2x.webp 2x" />
            <source srcSet="/_images/tape-assets/tape-2.webp 1x, /_images/tape-assets/tape-2-2x.webp 2x" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/_images/tape-assets/tape-2.png" alt="" draggable={false} className="block w-full" />
          </picture>

          {/* Photo Polaroid Frame */}
          <div
            className={cn(
              "shadow-soft-splat-sm relative z-10 w-full bg-white p-3 pb-8 text-chaos-black border-2 border-chaos-black [transform:rotate(2deg)] transition-transform duration-300 hover:rotate-0",
              className
            )}
            {...props}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="w-full h-auto object-contain border-2 border-chaos-black"
              />
            ) : (
              children
            )}
          </div>
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
