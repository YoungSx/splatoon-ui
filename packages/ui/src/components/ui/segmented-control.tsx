'use client'

import * as React from 'react'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import {
  type SplatoonControlTrackColor,
  splatoonControlTrackColorConfig,
} from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import { ButtonGroupItem, type ButtonGroupItemProps } from './button-group'
import buttonGroupStyles from './button-group.module.css'
import styles from './segmented-control.module.css'
import {
  SWITCH_TRACK_FILL_HEIGHT,
  SWITCH_TRACK_FILL_WIDTH,
  SWITCH_TRACK_FILL_X,
  SWITCH_TRACK_FILL_Y,
  SWITCH_TRACK_LEFT_PATH,
  SWITCH_TRACK_LEFT_VIEW_BOX,
  SWITCH_TRACK_RIGHT_PATH,
  SWITCH_TRACK_RIGHT_VIEW_BOX,
  SWITCH_TRACK_SEGMENT_OVERLAP_RATIO,
  SwitchTrackPatternDefs,
} from './switch-track'

export type SegmentedControlAppearance = 'buttons' | 'track'
export type SegmentedControlColor = SplatoonControlTrackColor
export type SegmentedControlDensity = 'compact' | 'default' | 'spacious'
export type SegmentedControlOrientation = 'horizontal' | 'vertical'
export type { SplatoonControlTrackColor }
type SegmentedControlStyle = React.CSSProperties & {
  '--segmented-control-active-bg'?: string
  '--segmented-control-active-text'?: string
  '--segmented-control-track-overlap-ratio'?: number
}
type SegmentedTrackShapeKind = 'left' | 'middle' | 'right'

const SEGMENTED_TRACK_MIDDLE_RIGHT_EDGE_TRANSLATE_X = '8019'

const SEGMENTED_TRACK_SHAPES: Record<
  SegmentedTrackShapeKind,
  {
    className: string
    constrainPath?: {
      d: string
      transform: string
    }
    path: string
    rect: {
      height: string
      width: string
      x: string
      y: string
    }
    viewBox: string
  }
> = {
  left: {
    className: styles.trackShapeLeft,
    path: SWITCH_TRACK_LEFT_PATH,
    rect: {
      x: SWITCH_TRACK_FILL_X,
      y: SWITCH_TRACK_FILL_Y,
      width: SWITCH_TRACK_FILL_WIDTH,
      height: SWITCH_TRACK_FILL_HEIGHT,
    },
    viewBox: SWITCH_TRACK_LEFT_VIEW_BOX,
  },
  middle: {
    className: styles.trackShapeMiddle,
    constrainPath: {
      d: SWITCH_TRACK_LEFT_PATH,
      transform: `translate(${SEGMENTED_TRACK_MIDDLE_RIGHT_EDGE_TRANSLATE_X} 0)`,
    },
    path: SWITCH_TRACK_RIGHT_PATH,
    rect: {
      x: SWITCH_TRACK_FILL_X,
      y: SWITCH_TRACK_FILL_Y,
      width: SWITCH_TRACK_FILL_WIDTH,
      height: SWITCH_TRACK_FILL_HEIGHT,
    },
    viewBox: SWITCH_TRACK_RIGHT_VIEW_BOX,
  },
  right: {
    className: styles.trackShapeRight,
    path: SWITCH_TRACK_RIGHT_PATH,
    rect: {
      x: SWITCH_TRACK_FILL_X,
      y: SWITCH_TRACK_FILL_Y,
      width: SWITCH_TRACK_FILL_WIDTH,
      height: SWITCH_TRACK_FILL_HEIGHT,
    },
    viewBox: SWITCH_TRACK_RIGHT_VIEW_BOX,
  },
}

export interface SegmentedControlProps extends Omit<RadioGroupPrimitive.Props<string>, 'style'> {
  appearance?: SegmentedControlAppearance
  color?: SegmentedControlColor
  density?: SegmentedControlDensity
  fillImageHref?: string
  fullWidth?: boolean
  orientation?: SegmentedControlOrientation
  style?: React.CSSProperties
}

interface SegmentedControlContextValue {
  appearance: SegmentedControlAppearance
  color: SegmentedControlColor
  fillImageHref: string
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null)

function SegmentedControl({
  ref,
  appearance = 'buttons',
  className,
  color = 'yellow',
  density = 'default',
  fillImageHref = '/_images/backgrounds/camo-green.png',
  fullWidth = false,
  orientation = 'horizontal',
  style,
  children,
  ...props
}: SegmentedControlProps & { ref?: React.Ref<HTMLDivElement> }) {
  const contextValue = React.useMemo(
    () => ({ appearance, color, fillImageHref }),
    [appearance, color, fillImageHref]
  )
  const colorConfig = splatoonControlTrackColorConfig[color]
  const rootStyle = {
    '--segmented-control-active-bg': colorConfig.accentColor,
    '--segmented-control-active-text': colorConfig.activeTextColor,
    ...(appearance === 'track'
      ? { '--segmented-control-track-overlap-ratio': SWITCH_TRACK_SEGMENT_OVERLAP_RATIO }
      : {}),
    ...style,
  } satisfies SegmentedControlStyle

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <RadioGroupPrimitive
        ref={ref}
        data-slot="segmented-control"
        data-appearance={appearance}
        data-color={color}
        data-density={density}
        data-full-width={fullWidth ? 'true' : undefined}
        data-orientation={orientation}
        aria-orientation={orientation}
        className={cn(
          styles.root,
          appearance === 'buttons' ? buttonGroupStyles.root : undefined,
          className
        )}
        style={rootStyle}
        {...props}
      >
        {children}
      </RadioGroupPrimitive>
    </SegmentedControlContext.Provider>
  )
}

export interface SegmentedControlItemProps extends RadioPrimitive.Root.Props<string> {
  buttonProps?: Omit<ButtonGroupItemProps, 'children' | 'ref' | 'value'>
}

function getCheckedButtonVariant(color: SegmentedControlColor): ButtonGroupItemProps['variant'] {
  return color
}

function getCheckedButtonTheme(color: SegmentedControlColor): ButtonGroupItemProps['theme'] {
  if (color === 'yellow') {
    return 'dark-yellow'
  }

  if (color === 'blue') {
    return 'light-blue'
  }

  if (color === 'green') {
    return 'light-green'
  }

  if (color === 'purple') {
    return 'dark-purple'
  }

  return 'dark-purpleOrange'
}

function getOutlineButtonTheme(color: SegmentedControlColor): ButtonGroupItemProps['theme'] {
  if (color === 'blue') {
    return 'light-blue'
  }

  if (color === 'green') {
    return 'light-green'
  }

  if (color === 'purple') {
    return 'dark-purple'
  }

  if (color === 'orange') {
    return 'dark-purpleOrange'
  }

  return 'yellow'
}

function SegmentedTrackShape({
  fillImageHref,
  kind,
}: {
  fillImageHref: string
  kind: SegmentedTrackShapeKind
}) {
  const shape = SEGMENTED_TRACK_SHAPES[kind]
  const id = React.useId().replace(/:/g, '')
  const clipId = `segmented-track-${kind}-${id}`
  const constrainClipId = shape.constrainPath ? `segmented-track-${kind}-constraint-${id}` : null
  const fillPatternId = `segmented-track-fill-${kind}-${id}`
  const inactiveFilterId = `segmented-track-inactive-${kind}-${id}`
  const segmentRects = (
    <>
      <rect
        className={styles.trackSegmentActive}
        x={shape.rect.x}
        y={shape.rect.y}
        width={shape.rect.width}
        height={shape.rect.height}
        fill={`url(#${fillPatternId})`}
      />
      <rect
        className={styles.trackSegmentInactive}
        x={shape.rect.x}
        y={shape.rect.y}
        width={shape.rect.width}
        height={shape.rect.height}
        fill={`url(#${fillPatternId})`}
        filter={`url(#${inactiveFilterId})`}
      />
    </>
  )

  return (
    <svg
      className={cn(styles.trackShape, shape.className)}
      viewBox={shape.viewBox}
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={shape.path} />
        </clipPath>
        {shape.constrainPath && constrainClipId ? (
          <clipPath id={constrainClipId}>
            <path d={shape.constrainPath.d} transform={shape.constrainPath.transform} />
          </clipPath>
        ) : null}
        <SwitchTrackPatternDefs
          fillImageHref={fillImageHref}
          fillPatternId={fillPatternId}
          inactiveFilterId={inactiveFilterId}
        />
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {constrainClipId ? (
          <g clipPath={`url(#${constrainClipId})`}>{segmentRects}</g>
        ) : (
          segmentRects
        )}
      </g>
    </svg>
  )
}

function SegmentedTrackSegment({ fillImageHref }: { fillImageHref: string }) {
  return (
    <>
      <SegmentedTrackShape fillImageHref={fillImageHref} kind="left" />
      <SegmentedTrackShape fillImageHref={fillImageHref} kind="middle" />
      <SegmentedTrackShape fillImageHref={fillImageHref} kind="right" />
    </>
  )
}

function SegmentedControlItem({
  ref,
  buttonProps,
  className,
  children,
  ...props
}: SegmentedControlItemProps & { ref?: React.Ref<HTMLElement> }) {
  const context = React.useContext(SegmentedControlContext)
  const appearance = context?.appearance ?? 'buttons'
  const color = context?.color ?? 'yellow'
  const fillImageHref = context?.fillImageHref ?? '/_images/backgrounds/camo-green.png'

  if (appearance === 'buttons') {
    return (
      <RadioPrimitive.Root
        ref={ref}
        data-slot="segmented-control-item"
        className={cn(styles.item, buttonGroupStyles.item, styles.buttonItem, className)}
        render={(renderProps, state) => {
          const { color: omittedDomColor, ...buttonRenderProps } = renderProps
          void omittedDomColor

          return (
            <ButtonGroupItem
              {...buttonProps}
              {...buttonRenderProps}
              hasChevron={buttonProps?.hasChevron ?? false}
              nativeButton={false}
              render={<span />}
              size={buttonProps?.size ?? 'sm'}
              theme={
                buttonProps?.theme ??
                (state.checked ? getCheckedButtonTheme(color) : getOutlineButtonTheme(color))
              }
              variant={
                buttonProps?.variant ?? (state.checked ? getCheckedButtonVariant(color) : 'outline')
              }
              className={cn(renderProps.className, buttonProps?.className)}
            >
              {children}
            </ButtonGroupItem>
          )
        }}
        {...props}
      />
    )
  }

  return (
    <RadioPrimitive.Root
      ref={ref}
      data-slot="segmented-control-item"
      className={cn(styles.item, styles.trackItem, className)}
      {...props}
    >
      <SegmentedTrackSegment fillImageHref={fillImageHref} />
      <span className={styles.label}>{children}</span>
    </RadioPrimitive.Root>
  )
}

export { SegmentedControl, SegmentedControlItem }
