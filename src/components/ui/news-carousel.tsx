"use client"

import * as React from "react"

import { Carousel, CarouselPagination } from "@/components/ui/carousel"
import {
  CardStackCarouselContent,
  CardStackCarouselItem,
  CardStackCarouselNext,
  CardStackCarouselPrevious,
  CardStackCarouselScene,
} from "@/components/ui/card-stack-carousel"
import { GridNewsCard, type GridNewsCardProps } from "@/components/ui/grid-news-card"

const newsCarouselItemShellStyle = {
  width: "clamp(16.5rem, 19vw, 23rem)",
} satisfies React.CSSProperties

export interface NewsCarouselItem
  extends Pick<
    GridNewsCardProps,
    "image" | "title" | "subtitle" | "action" | "surface" | "showTape"
  > {
  id: React.Key
  cardClassName?: string
}

export interface NewsCarouselProps extends Omit<React.ComponentPropsWithoutRef<typeof Carousel>, "children"> {
  items: NewsCarouselItem[]
}

export function NewsCarousel({ items, ...props }: NewsCarouselProps) {
  return (
    <Carousel itemCount={items.length} {...props}>
      <CardStackCarouselScene>
        <CardStackCarouselContent>
          {items.map((item, index) => (
            <CardStackCarouselItem
              key={item.id}
              data-index={index}
              shellStyle={newsCarouselItemShellStyle}
            >
              <GridNewsCard
                className={item.cardClassName}
                image={item.image}
                title={item.title}
                subtitle={item.subtitle}
                action={item.action}
                surface={item.surface}
                showTape={item.showTape}
              />
            </CardStackCarouselItem>
          ))}
        </CardStackCarouselContent>
        <CardStackCarouselPrevious />
        <CardStackCarouselNext />
        <CarouselPagination />
      </CardStackCarouselScene>
    </Carousel>
  )
}
