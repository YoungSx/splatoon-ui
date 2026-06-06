/**
 * @deprecated Use `GridNewsCard` from `@/components/ui/grid-news-card` instead.
 * This component is retained for reference only — it is no longer imported anywhere.
 * GridNewsCard is the single source of truth for news card UI, matching the official Splatoon DOM structure.
 */

"use client"

import * as React from "react"

import { Card, CardImage, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface NewsCardProps extends Omit<CardProps, "children" | "variant" | "title"> {
  media: React.ReactNode
  mediaClassName?: string
  bodyClassName?: string
  title: React.ReactNode
  titleClassName?: string
  action?: React.ReactNode
}

export function NewsCard({
  media,
  mediaClassName,
  bodyClassName,
  title,
  titleClassName,
  action,
  paperFasteners = true,
  paperLabel,
  surface = "paper",
  className,
  style,
  ...props
}: NewsCardProps) {
  return (
    <Card
      className={cn("w-full", className)}
      paperFasteners={paperFasteners}
      paperLabel={paperLabel}
      surface={surface}
      style={
        {
          "--card-hanger-y": "1.25rem",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <CardImage className={cn("aspect-[8/5] w-full p-4 flex items-center justify-center", mediaClassName)}>{media}</CardImage>
      <div className={cn("flex h-full min-h-[10.5rem] flex-col items-center justify-between gap-3 py-5 text-center", bodyClassName)}>
        <p className={cn("max-w-[18ch] text-balance text-[1.25rem] font-medium leading-[1.6]", titleClassName)}>{title}</p>
        {action}
      </div>
    </Card>
  )
}
