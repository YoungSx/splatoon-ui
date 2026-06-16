import * as React from "react"

import {
  PhotoFrame,
  PhotoTape,
  PhotoDecoration,
  type PhotoFrameProps,
  type PhotoTapeProps,
  type PhotoDecorationProps,
} from "./photo-frame"

/* ── StyledPhoto — backward-compatible wrapper around PhotoFrame ── */

export interface StyledPhotoProps extends Omit<PhotoFrameProps, "gallery"> {
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
    <PhotoFrame
      src={src}
      alt={alt}
      border={border}
      nested={nested}
      className={className}
      {...props}
    >
      {children}
    </PhotoFrame>
  )
}

/* ── StyledPhotoTape — backward-compatible wrapper around PhotoTape ── */

export interface StyledPhotoTapeProps extends Omit<PhotoTapeProps, "type"> {
  className?: string
}

export function StyledPhotoTape({
  position = "center",
  className,
  ...props
}: StyledPhotoTapeProps) {
  return (
    <PhotoTape
      position={position}
      type="tape-2"
      className={className}
      {...props}
    />
  )
}

/* ── StyledPhotoDecoration — backward-compatible wrapper around PhotoDecoration ── */

export interface StyledPhotoDecorationProps extends Omit<PhotoDecorationProps, "type"> {
  className?: string
}

export function StyledPhotoDecoration({
  position = "bottomLeft",
  className,
  ...props
}: StyledPhotoDecorationProps) {
  return (
    <PhotoDecoration
      position={position}
      type="sticker-9"
      className={className}
      {...props}
    />
  )
}
