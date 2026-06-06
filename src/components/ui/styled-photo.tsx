import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./styled-photo.module.css"

export interface StyledPhotoProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  border?: "default" | "thin" | "medium"
  nested?: boolean
  className?: string
  children?: React.ReactNode
}

export function StyledPhoto({
  src,
  alt,
  border = "default",
  nested = false,
  className,
  children,
  ...props
}: StyledPhotoProps) {
  return (
    <div
      className={cn(
        styles.photoContainer,
        nested && styles.photoContainerNested,
        border === "thin" && styles.thinBorder,
        border === "medium" && styles.mediumBorder,
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? "Styled photo"} className={styles.photo} />
      ) : (
        children
      )}
      {src && children}
    </div>
  )
}

export interface StyledPhotoTapeProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "center" | "left" | "right"
}

export function StyledPhotoTape({ position = "center", className, ...props }: StyledPhotoTapeProps) {
  const positionClass =
    position === "left"
      ? styles.photoTapeLeft
      : position === "right"
      ? styles.photoTapeRight
      : styles.photoTapeCenter

  return <div className={cn(styles.photoTape, positionClass, className)} {...props} />
}

export interface StyledPhotoDecorationProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "bottomLeft" | "topRight" | "bottomRight"
}

export function StyledPhotoDecoration({ position = "bottomLeft", className, ...props }: StyledPhotoDecorationProps) {
  const positionClass =
    position === "topRight"
      ? styles.photoDecorationTopRight
      : position === "bottomRight"
      ? styles.photoDecorationBottomRight
      : styles.photoDecorationBottomLeft

  return <div className={cn(styles.photoDecoration, positionClass, className)} {...props} />
}
