"use client"

import * as React from "react"

import { Carousel, CarouselBleedBoundary, CarouselPagination } from "@/components/ui/carousel"
import {
  CardStackCarouselContent,
  CardStackCarouselItem,
  CardStackCarouselNext,
  CardStackCarouselPrevious,
  CardStackCarouselScene,
} from "@/components/ui/card-stack-carousel"
import { StapleCard, type StapleCardProps } from "@/components/ui/staple-card"
import { cn } from "@/lib/utils"

const feedCarouselItemShellStyle = {
  width: "clamp(16.5rem, 19vw, 23rem)",
} satisfies React.CSSProperties

export interface FeedCarouselItem
  extends Pick<
    StapleCardProps,
    "image" | "title" | "subtitle" | "action" | "surface" | "showTape" | "hoverTilt"
  > {
  id: React.Key
  cardClassName?: string
}

export interface FeedCarouselProps extends Omit<React.ComponentPropsWithoutRef<typeof Carousel>, "children"> {
  items: FeedCarouselItem[]
}

export function FeedCarousel({ items, className, ...props }: FeedCarouselProps) {
  return (
    <CarouselBleedBoundary>
      <Carousel itemCount={items.length} className={cn("max-w-none", className)} {...props}>
        <CardStackCarouselScene>
          <CardStackCarouselContent>
            {items.map((item, index) => (
              <CardStackCarouselItem
                key={item.id}
                data-index={index}
                shellStyle={feedCarouselItemShellStyle}
              >
                <StapleCard
                  className={item.cardClassName}
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  action={item.action}
                  surface={item.surface}
                  showTape={item.showTape}
                  hoverTilt={item.hoverTilt}
                />
              </CardStackCarouselItem>
            ))}
          </CardStackCarouselContent>
          <CardStackCarouselPrevious />
          <CardStackCarouselNext />
          <CarouselPagination />
        </CardStackCarouselScene>
      </Carousel>
    </CarouselBleedBoundary>
  )
}
