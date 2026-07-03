import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './section-background.module.css'

export type Pattern =
  | 'base-bg-pattern'
  | 'camo-black'
  | 'camo-green'
  | 'camo-purple'
  | 'camo-purple-revised'
  | 'camo-orange'
  | 'camo-red'
  | 'camo-white'
  | 'camo-white-outline'
  | 'hardware-background'
  | 'octo-black'
  | 'octo-red'
  | 'octoarrow-green'
  | 'octoarrow-orange'
  | 'squid-black'
  | 'circles-green'
  | 'chip-white'
  | 'monsters-black'
  | 'graffiti'
  | 'tapes-black'
  | 'tapes-green'
  | 'tapes-pattern'
  | 'tapes-purple'

const PATTERN_MAP: Record<Pattern, string> = {
  'base-bg-pattern': styles.patternBaseBgPattern,
  'camo-black': styles.patternCamoBlack,
  'camo-green': styles.patternCamoGreen,
  'camo-purple': styles.patternCamoPurple,
  'camo-purple-revised': styles.patternCamoPurpleRevised,
  'camo-orange': styles.patternCamoOrange,
  'camo-red': styles.patternCamoRed,
  'camo-white': styles.patternCamoWhite,
  'camo-white-outline': styles.patternCamoWhiteOutline,
  'hardware-background': styles.patternHardwareBackground,
  'octo-black': styles.patternOctoBlack,
  'octo-red': styles.patternOctoRed,
  'octoarrow-green': styles.patternOctoarrowGreen,
  'octoarrow-orange': styles.patternOctoarrowOrange,
  'squid-black': styles.patternSquidBlack,
  'circles-green': styles.patternCirclesGreen,
  'chip-white': styles.patternChipWhite,
  'monsters-black': styles.patternMonstersBlack,
  graffiti: styles.patternGraffiti,
  'tapes-black': styles.patternTapesBlack,
  'tapes-green': styles.patternTapesGreen,
  'tapes-pattern': styles.patternTapesPattern,
  'tapes-purple': styles.patternTapesPurple,
}

export interface SectionBackgroundProps extends React.HTMLAttributes<HTMLElement> {
  /** Solid background color (e.g. "bg-white", "bg-black") */
  bgColor?: string
  /** Dark mode background color */
  darkBgColor?: string
  /** Optional pattern texture overlay */
  pattern?: Pattern
  as?: 'div' | 'section'
}

export function SectionBackground({
  bgColor,
  darkBgColor,
  pattern,
  as: Tag = 'div',
  className,
  children,
  ...props
}: SectionBackgroundProps) {
  return (
    <Tag
      className={cn(
        styles.sectionBackground,
        bgColor,
        darkBgColor,
        pattern && PATTERN_MAP[pattern],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
