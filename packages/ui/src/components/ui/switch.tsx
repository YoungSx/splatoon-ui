'use client'

import * as React from 'react'
import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { splatoonControlTrackColorConfig } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import styles from './switch.module.css'
import { resolveSplatoonAssetPath, type SplatoonAssetBasePath } from './assets'
import { SWITCH_TRACK_DEFAULT_FILL_IMAGE_PATH, SwitchTrack } from './switch-track'
import type {
  PrimitiveChangeDetails,
  PrimitiveCheckedRenderState,
  PrimitiveRender,
} from './types'
import type { SplatoonControlTrackColor } from './tokens'

export type SwitchSize = 'sm' | 'default' | 'lg'
export type SwitchColor = Exclude<SplatoonControlTrackColor, 'purple'>
export type { SplatoonControlTrackColor } from './tokens'
type SwitchStyle = React.CSSProperties & {
  '--switch-accent'?: string
}

export interface SwitchProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'checked' | 'children' | 'color' | 'defaultChecked' | 'onChange' | 'value'
> {
  checked?: boolean
  color?: SwitchColor
  defaultChecked?: boolean
  disabled?: boolean
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  fillImageHref?: string
  form?: string
  inputRef?: React.Ref<HTMLInputElement>
  name?: string
  nativeButton?: boolean
  offLabel?: React.ReactNode
  onCheckedChange?: (checked: boolean, eventDetails: PrimitiveChangeDetails) => void
  onLabel?: React.ReactNode
  readOnly?: boolean
  ref?: React.Ref<HTMLElement>
  render?: PrimitiveRender<HTMLElement, PrimitiveCheckedRenderState>
  required?: boolean
  size?: SwitchSize
  uncheckedValue?: string
  value?: string
}

function Switch({
  ref,
  className,
  color = 'yellow',
  assetBasePath,
  fillImageHref,
  offLabel = 'OFF',
  onLabel = 'ON',
  size = 'default',
  style,
  ...props
}: SwitchProps) {
  const colorConfig = splatoonControlTrackColorConfig[color]
  const resolvedFillImageHref =
    fillImageHref ?? resolveSplatoonAssetPath(SWITCH_TRACK_DEFAULT_FILL_IMAGE_PATH, assetBasePath)

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      data-color={color}
      data-size={size}
      className={cn(styles.root, className)}
      style={
        {
          '--switch-accent': colorConfig.accentColor,
          ...style,
        } as SwitchStyle
      }
      {...props}
    >
      <span className={styles.track} aria-hidden="true">
        <SwitchTrack
          className={styles.trackSvg}
          assetBasePath={assetBasePath}
          fillImageHref={resolvedFillImageHref}
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
