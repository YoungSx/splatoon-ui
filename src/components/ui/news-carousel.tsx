"use client"

import * as React from "react"

import { Carousel } from "@/components/ui/carousel"
import {
  CardStackCarouselContent,
  CardStackCarouselIndicators,
  CardStackCarouselItem,
  CardStackCarouselNext,
  CardStackCarouselPrevious,
  CardStackCarouselScene,
} from "@/components/ui/card-stack-carousel"
import { type CardProps } from "@/components/ui/card"
import { NewsCard, type NewsCardProps } from "@/components/ui/news-card"

const newsCarouselItemShellStyle = {
  width: "clamp(16.5rem, 19vw, 23rem)",
} satisfies React.CSSProperties

export interface NewsCarouselItem
  extends Pick<
    NewsCardProps,
    "action" | "bodyClassName" | "media" | "mediaClassName" | "paperFasteners" | "paperLabel" | "surface" | "title" | "titleClassName"
  > {
  id: React.Key
  cardClassName?: string
  cardProps?: Omit<CardProps, "children" | "variant">
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
            </CardStackCarouselItem>
          ))}
        </CardStackCarouselContent>
        <CardStackCarouselPrevious />
        <CardStackCarouselNext />
        <CardStackCarouselIndicators />
      </CardStackCarouselScene>
    </Carousel>
  )
}
