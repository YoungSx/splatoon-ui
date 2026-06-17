import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./photo-frame.module.css"

/* ── PhotoFrame — unified styled-photo with tape decoration ── */

type PhotoFrameVariant = "a" | "b" | "c" | "d"

interface TapeConfig {
  /** Responsive image sources */
  src: {
    mobile: string
    desktop: string
  }
  /** Image dimensions */
  size: {
    mobile: { width: number; height: number }
    desktop: { width: number; height: number }
  }
  /** Tape rotation */
  rotation: string
}

interface DecorationConfig {
  /** Responsive image sources */
  src: {
    mobile: string
    desktop: string
  }
  /** Image dimensions */
  size: {
    mobile: { width: number; height: number }
    desktop: { width: number; height: number }
  }
}

export interface PhotoFrameProps extends React.ComponentProps<"div"> {
  /** Image source */
  src?: string
  /** Image alt text */
  alt?: string
  /** Border style variant */
  border?: "default" | "thin" | "medium"
  /** Component variant preset */
  variant?: PhotoFrameVariant
  /** Show decorative tape (default: from variant config) */
  showTape?: boolean
  /** Show decorative sticker (default: from variant config) */
  showSticker?: boolean
  /** Tape position at photo edge */
  tapePosition?: "center" | "left" | "right"
  /** CSS custom property for rotation */
  rotation?: string
  /** CSS custom property for margin offset */
  marginOffset?: number
  /** Nested mode (smaller, scaled tape) */
  nested?: boolean
  /** Fill width (block display) */
  fillWidth?: boolean
}

/* ── Variant presets ── */

const TAPE_CONFIG: Record<string, TapeConfig> = {
  "tape-2": {
    src: { mobile: "/_images/tape-assets/tape-2.png", desktop: "/_images/tape-assets/tape-2-medium-up.png" },
    size: { mobile: { width: 82, height: 36 }, desktop: { width: 166, height: 74 } },
    rotation: "6deg",
  },
  "tape-5": {
    src: { mobile: "/_images/tape-assets/tape-5.png", desktop: "/_images/tape-assets/tape-5-medium-up.png" },
    size: { mobile: { width: 140, height: 35.5 }, desktop: { width: 276, height: 70 } },
    rotation: "0deg",
  },
  "sticker-10": {
    src: { mobile: "/_images/tape-assets/sticker-10.png", desktop: "/_images/tape-assets/sticker-10-medium-up.png" },
    size: { mobile: { width: 113, height: 25.5 }, desktop: { width: 225, height: 50.5 } },
    rotation: "0deg",
  },
}

const DECORATION_CONFIG: Record<string, DecorationConfig> = {
  "sticker-9": {
    src: { mobile: "/_images/tape-assets/sticker-9.png", desktop: "/_images/tape-assets/sticker-9-medium-up.png" },
    size: { mobile: { width: 96, height: 31 }, desktop: { width: 146, height: 47.5 } },
  },
  "sticker-10": {
    src: { mobile: "/_images/tape-assets/sticker-10.png", desktop: "/_images/tape-assets/sticker-10-medium-up.png" },
    size: { mobile: { width: 113, height: 25.5 }, desktop: { width: 225, height: 50.5 } },
  },
}

const VARIANT_CONFIG = {
  /** No tape, no decoration */
  a: {
    rotation: "1deg",
    border: "default" as const,
    showTape: false,
    showSticker: false,
    tapeType: "tape-2",
    tapePosition: "center" as const,
    decorationType: "sticker-9",
    decorationPosition: "bottomLeft" as const,
  },
  /** Top-center tape-2 */
  b: {
    rotation: "0deg",
    border: "default" as const,
    showTape: true,
    showSticker: false,
    tapeType: "tape-2",
    tapePosition: "center" as const,
    decorationType: "sticker-9",
    decorationPosition: "bottomLeft" as const,
  },
  /** Top-center tape-5 + bottom-left sticker-9 */
  c: {
    rotation: "-2deg",
    border: "medium" as const,
    showTape: true,
    showSticker: true,
    tapeType: "tape-5",
    tapePosition: "center" as const,
    decorationType: "sticker-9",
    decorationPosition: "bottomLeft" as const,
  },
  /** Top-right sticker-10 */
  d: {
    rotation: "1deg",
    border: "thin" as const,
    showTape: false,
    showSticker: true,
    tapeType: "tape-2",
    tapePosition: "center" as const,
    decorationType: "sticker-10",
    decorationPosition: "topRight" as const,
  },
  /** Top-center tape-5 only (no sticker) */
  e: {
    rotation: "-2deg",
    border: "medium" as const,
    showTape: true,
    showSticker: false,
    tapeType: "tape-5",
    tapePosition: "center" as const,
    decorationType: "sticker-9",
    decorationPosition: "bottomLeft" as const,
  },
} as const

export function PhotoFrame({
  ref,
  src,
  alt,
  border,
  variant = "a",
  showTape,
  showSticker,
  tapePosition,
  rotation,
  marginOffset,
  nested = false,
  fillWidth = false,
  className,
  children,
  style,
  ...props
}: PhotoFrameProps & { ref?: React.Ref<HTMLDivElement> }) {
  const config = VARIANT_CONFIG[variant]
  const resolvedBorder = border ?? config.border
  const resolvedShowTape = showTape ?? config.showTape
  const resolvedShowSticker = showSticker ?? config.showSticker
  const resolvedTapePosition = tapePosition ?? config.tapePosition
  const resolvedRotation = rotation ?? config.rotation
  const resolvedTapeType = config.tapeType
  const tapeConfig = TAPE_CONFIG[resolvedTapeType]
  const resolvedTapeRotation = tapeConfig.rotation

  return (
    <div
      ref={ref}
      data-slot="photo-frame"
      data-variant={variant}
      className={cn(
        styles.photoFrame,
        fillWidth && styles.fillWidth,
        nested && styles.nested,
        resolvedBorder === "thin" && styles.thinBorder,
        resolvedBorder === "medium" && styles.mediumBorder,
        className
      )}
      style={{
        "--end-rotate": resolvedRotation,
        "--tape-rotation": resolvedTapeRotation,
        "--margin-offset": marginOffset ?? 6,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {resolvedShowTape && (
        <PhotoTape
          position={resolvedTapePosition}
          type={resolvedTapeType}
        />
      )}

      {resolvedShowSticker && (
        <PhotoDecoration
          position={config.decorationPosition}
          type={config.decorationType}
        />
      )}

      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? "Styled photo"} className={styles.photo} />
      ) : (
        children
      )}
    </div>
  )
}

/* ── PhotoTape — tape decoration ── */

const TAPE_POSITION: Record<string, string> = {
  center: styles.tapeCenter,
  left: styles.tapeLeft,
  right: styles.tapeRight,
}

export interface PhotoTapeProps extends React.ComponentProps<"div"> {
  /** Tape position */
  position?: "center" | "left" | "right"
  /** Tape type */
  type?: string
}

export function PhotoTape({
  position = "center",
  type = "tape-2",
  className,
  ...props
}: PhotoTapeProps) {
  const config = TAPE_CONFIG[type]
  if (!config) return null

  return (
    <div
      className={cn(styles.tape, TAPE_POSITION[position], className)}
      {...props}
    >
      <picture className={styles.tapeMobile}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.src.mobile}
          alt=""
          draggable={false}
          width={config.size.mobile.width}
          height={config.size.mobile.height}
        />
      </picture>
      <picture className={styles.tapeDesktop}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.src.desktop}
          alt=""
          draggable={false}
          width={config.size.desktop.width}
          height={config.size.desktop.height}
        />
      </picture>
    </div>
  )
}

/* ── PhotoDecoration — decorative sticker ── */

const DECORATION_POSITION: Record<string, string> = {
  bottomLeft: styles.decorationBottomLeft,
  topRight: styles.decorationTopRight,
  bottomRight: styles.decorationBottomRight,
  center: styles.decorationCenter,
}

export interface PhotoDecorationProps extends React.ComponentProps<"div"> {
  /** Decoration position */
  position?: "bottomLeft" | "topRight" | "bottomRight"
  /** Decoration type */
  type?: string
}

export function PhotoDecoration({
  position = "bottomLeft",
  type = "sticker-9",
  className,
  ...props
}: PhotoDecorationProps) {
  const config = DECORATION_CONFIG[type]
  if (!config) return null

  return (
    <div
      className={cn(styles.decoration, DECORATION_POSITION[position], className)}
      {...props}
    >
      <picture className={styles.decorationMobile}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.src.mobile}
          alt=""
          draggable={false}
          width={config.size.mobile.width}
          height={config.size.mobile.height}
        />
      </picture>
      <picture className={styles.decorationDesktop}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.src.desktop}
          alt=""
          draggable={false}
          width={config.size.desktop.width}
          height={config.size.desktop.height}
        />
      </picture>
    </div>
  )
}
