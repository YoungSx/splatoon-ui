import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./gallery.module.css"

export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidthControls?: boolean
  dragging?: boolean
}

export function Gallery({ fullWidthControls = false, dragging = false, className, ...props }: GalleryProps) {
  return (
    <div
      className={cn(styles.galleryWrapper, fullWidthControls && styles.fullWidthControls, dragging && styles.dragging, className)}
      {...props}
    />
  )
}

export type GalleryViewportProps = React.HTMLAttributes<HTMLDivElement>

export function GalleryViewport({ className, ...props }: GalleryViewportProps) {
  return <div className={cn(styles.gallery, className)} {...props} />
}

export type GalleryControlsProps = React.HTMLAttributes<HTMLDivElement>

export function GalleryControls({ className, ...props }: GalleryControlsProps) {
  return <div className={cn(styles.controls, className)} {...props} />
}

export type GalleryControlButtonProps = React.HTMLAttributes<HTMLDivElement>

export function GalleryControlButton({ className, ...props }: GalleryControlButtonProps) {
  return <div className={cn(styles.controlButton, className)} {...props} />
}

export interface GalleryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: number
  selected?: number
  i?: number
  total?: number
  positionOffset?: string
  gap?: string
  activeGap?: string
}

export function GalleryItem({
  side = 0,
  selected = 0,
  i = 0,
  total = 0,
  positionOffset = "0px",
  gap = "25vw",
  activeGap = "1px",
  className,
  style,
  ...props
}: GalleryItemProps) {
  return (
    <div
      className={cn(styles.item, className)}
      style={
        {
          "--side": side,
          "--selected": selected,
          "--i": i,
          "--total": total,
          "--position-offset": positionOffset,
          "--gap": gap,
          "--active-gap": activeGap,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
