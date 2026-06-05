"use client"

import * as React from "react"

import { Carousel, CarouselContent, CarouselIndicators, CarouselItem, CarouselNext, CarouselPrevious, type CarouselProps } from "@/components/ui/carousel"
import { type CardProps } from "@/components/ui/card"
import { NewsCard, type NewsCardProps } from "@/components/ui/news-card"

const newsCarouselItemShellClassName = "w-[min(88vw,22rem)] md:w-[min(42vw,22rem)] lg:w-[22rem]"

export interface NewsCarouselItem extends Pick<NewsCardProps, "action" | "bodyClassName" | "media" | "mediaClassName" | "paperFasteners" | "paperLabel" | "surface" | "title" | "titleClassName"> {
  id: React.Key
  cardClassName?: string
  cardProps?: Omit<CardProps, "children" | "variant">
}

export interface NewsCarouselProps extends Omit<CarouselProps, "children"> {
  items: NewsCarouselItem[]
}

export function NewsCarousel({ items, ...props }: NewsCarouselProps) {
  return (
    <Carousel {...props}>
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id} shellClassName={newsCarouselItemShellClassName}>
            <NewsCard
              className={item.cardClassName}
              media={item.media}
              mediaClassName={item.mediaClassName}
              bodyClassName={item.bodyClassName}
              paperFasteners={item.paperFasteners}
              paperLabel={item.paperLabel}
              surface={item.surface}
              title={item.title}
              titleClassName={item.titleClassName}
              action={item.action}
              {...item.cardProps}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselIndicators />
    </Carousel>
  )
}
