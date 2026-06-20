"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"
import styles from "./switch.module.css"
import { SwitchTrack } from "./switch-track"

type SwitchSize = "sm" | "default" | "lg"
type SwitchColor = "yellow" | "green" | "blue" | "orange"

export interface SwitchProps extends SwitchPrimitive.Root.Props {
  color?: SwitchColor
  fillImageHref?: string
  offLabel?: React.ReactNode
  onLabel?: React.ReactNode
  size?: SwitchSize
}

function Switch({
  ref,
  className,
  color = "yellow",
  fillImageHref = "/_images/backgrounds/camo-green.png",
  offLabel = "OFF",
  onLabel = "ON",
  size = "default",
  ...props
}: SwitchProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      data-color={color}
      data-size={size}
      className={cn(styles.root, className)}
      {...props}
    >
      <span className={styles.track} aria-hidden="true">
        <SwitchTrack
          className={styles.trackSvg}
          fillImageHref={fillImageHref}
          leftActiveClassName={cn(styles.trackFillImage, styles.leftActiveImage)}
          leftInactiveClassName={cn(styles.trackFillImage, styles.leftInactiveImage)}
          rightActiveClassName={cn(styles.trackFillImage, styles.rightActiveImage)}
          rightInactiveClassName={cn(styles.trackFillImage, styles.rightInactiveImage)}
        />
        <span className={cn(styles.stateLabel, styles.onLabel)}>{onLabel}</span>
        <span className={cn(styles.stateLabel, styles.offLabel)}>{offLabel}</span>
      </span>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
