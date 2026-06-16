import * as React from "react"

import { cn } from "@/lib/utils"
import { WideTornPaper } from "./wide-torn-paper"
import styles from "./torn-card.module.css"

type TornCardVariant = "a" | "b" | "c"
type SlotPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

const SLOT_POSITION: Record<SlotPosition, string> = {
  "top-left":      styles.slotTopLeft,
  "top-center":    styles.slotTopCenter,
  "top-right":     styles.slotTopRight,
  "bottom-left":   styles.slotBottomLeft,
  "bottom-center": styles.slotBottomCenter,
  "bottom-right":  styles.slotBottomRight,
}

export interface TornCardSlotProps extends React.ComponentProps<"div"> {
  position: SlotPosition
}

export function TornCardSlot({ position, className, ...props }: TornCardSlotProps) {
  return (
    <div
      data-slot={`slot-${position}`}
      className={cn(styles.cardSlot, SLOT_POSITION[position], className)}
      {...props}
    />
  )
}

export interface TornCardProps extends React.ComponentProps<"div"> {
  variant?: TornCardVariant
  rotation?: string
  background?: string
  /** Show decorative tape at the top edge (default: true) */
  showTape?: boolean
  /** Show decorative sticker (default: false) */
  showSticker?: boolean
  /** Tape position at card edge */
  tapePosition?: "top-right" | "bottom-center"
}

const VARIANT_CONFIG = {
  a: {
    rotation: "2deg",
    tapePosition: "top-right" as const,
    showSticker: false,
    tapeSrc: { mobile: "/official/save-data-bonus/tape-3.png", desktop: "/official/save-data-bonus/tape-3-medium-up.png" },
    tapeSize: { mobile: { width: 97, height: 38 }, desktop: { width: 202, height: 78 } },
  },
  b: {
    rotation: "-1.5deg",
    tapePosition: "top-right" as const,
    showSticker: false,
    tapeSrc: { mobile: "/official/tape-assets/tape-2.png", desktop: "/official/tape-assets/tape-2-medium-up.png" },
    tapeSize: { mobile: { width: 82, height: 36 }, desktop: { width: 166, height: 74 } },
  },
  c: {
    rotation: "3deg",
    tapePosition: "bottom-center" as const,
    showSticker: true,
    tapeSrc: { mobile: "/official/tape-assets/tape-2.png", desktop: "/official/tape-assets/tape-2-medium-up.png" },
    tapeSize: { mobile: { width: 82, height: 36 }, desktop: { width: 166, height: 74 } },
  },
} as const

export function TornCard({
  ref,
  className,
  variant = "a",
  rotation,
  background = "#efefef",
  showTape = true,
  showSticker,
  tapePosition,
  children,
  ...props
}: TornCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const config = VARIANT_CONFIG[variant]
  const resolvedRotation = rotation ?? config.rotation
  const resolvedTapePosition = tapePosition ?? config.tapePosition
  const resolvedShowSticker = showSticker ?? config.showSticker

  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant={variant}
      style={{
        transform: `rotate(${resolvedRotation})`,
        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,.3))",
      } as React.CSSProperties}
      className={cn(
        "group/card relative w-full text-center z-10 text-chaos-black",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        <WideTornPaper bgColor={background} />
      </div>

      <div className="@container w-full">
        {showTape && (
          <TornCardSlot position={resolvedTapePosition}>
            <picture className={styles.tape}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.imgMobile}
                alt=""
                src={config.tapeSrc.mobile}
                width={config.tapeSize.mobile.width}
                height={config.tapeSize.mobile.height}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.imgDesktop}
                alt=""
                src={config.tapeSrc.desktop}
                width={config.tapeSize.desktop.width}
                height={config.tapeSize.desktop.height}
              />
            </picture>
          </TornCardSlot>
        )}

        {resolvedShowSticker && (
          <TornCardSlot position="top-right">
            <picture>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.imgMobile}
                alt=""
                src="/official/tape-assets/sticker-10.png"
                width={113}
                height={26}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.imgDesktop}
                alt=""
                src="/official/tape-assets/sticker-10-medium-up.png"
                width={225}
                height={51}
              />
            </picture>
          </TornCardSlot>
        )}

        <div
          className={cn(styles.alertContent, "relative z-10 flex flex-col gap-4")}
        >
          <div className="flex flex-col gap-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function isCssColor(value: string) {
  return value.startsWith("#") || value.startsWith("rgb") || value.startsWith("var(") || value.startsWith("hsl")
}

function TornCardTitle({ className, textColor = "text-blue", style, ...props }: React.ComponentProps<"h2"> & { textColor?: string }) {
  const colorStyle = textColor && isCssColor(textColor) ? { color: textColor } : undefined
  const twClass = textColor && !isCssColor(textColor) ? textColor : ""
  return (
    <h2
      data-slot="card-title"
      className={cn("splat-heading text-2xl", twClass, className)}
      style={colorStyle ? { ...colorStyle, ...style } : style}
      {...props}
    />
  )
}

function TornCardDescription({ className, textColor, style, ...props }: React.ComponentProps<"p"> & { textColor?: string }) {
  const colorStyle = textColor && isCssColor(textColor) ? { color: textColor } : undefined
  const twClass = textColor && !isCssColor(textColor) ? textColor : ""
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm opacity-90", twClass, className)}
      style={colorStyle ? { ...colorStyle, ...style } : style}
      {...props}
    />
  )
}

export { TornCardTitle, TornCardDescription }
