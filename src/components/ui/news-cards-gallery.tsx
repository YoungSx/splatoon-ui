import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./news-cards-gallery.module.css"

export interface NewsCardsGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function NewsCardsGallery({ className, children, ...props }: NewsCardsGalleryProps) {
  return (
    <div className={cn(styles.newsCardsGallery, className)} {...props}>
      {children}
    </div>
  )
}

export interface NewsCardsGalleryGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function NewsCardsGalleryGroup({ className, children, ...props }: NewsCardsGalleryGroupProps) {
  return (
    <div className={cn(styles.newsCardGroup, className)} {...props}>
      {children}
    </div>
  )
}
