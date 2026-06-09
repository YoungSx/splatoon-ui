"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "@/lib/utils"
import { CardContext } from "./card"

export interface CardImageProps extends React.ComponentProps<"div"> {
  src?: string
  alt?: string
  asChild?: boolean
}

export const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, asChild = false, children, ...props }, ref) => {
    const { variant } = React.useContext(CardContext)
    const Comp = asChild ? Slot : "div"

    if (variant === "tag") {
      return (
        <div
          ref={ref}
          data-slot="card-image-tag-wrapper"
          className="relative w-full py-4 flex justify-center"
        >
          {/* Scotch tape on top center */}
          <svg
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 z-30 select-none pointer-events-none rotate-[-3deg] opacity-90"
            width="100"
            height="28"
            viewBox="0 0 100 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 6 L95 2 L93 24 L3 28 Z"
              fill="#0d0d0d"
              opacity="0.15"
            />
            <path
              d="M3 4 L93 0 L91 22 L1 26 Z"
              fill="#f4f4f4"
              fillOpacity="0.65"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M3 4 L1.5 8 L2.5 12 L0.5 16 L2 20 L0.5 24 L1 26 Z"
              fill="#d1d1d6"
              fillOpacity="0.5"
            />
            <path
              d="M93 0 L94.5 4 L92.5 8 L95 12 L93 16 L94.5 20 L91 22 Z"
              fill="#d1d1d6"
              fillOpacity="0.5"
            />
          </svg>

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
      <Comp
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
      </Comp>
    )
  }
)
CardImage.displayName = "CardImage"
