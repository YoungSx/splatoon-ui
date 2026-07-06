import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  splatoonAssetImageSet,
  splatoonAssetUrl,
  type SplatoonAssetBasePath,
  type SplatoonAssetImageCandidate,
} from './assets'
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

interface PatternAssetSet {
  fallback: string
  candidates: readonly SplatoonAssetImageCandidate[]
  mediumFallback?: string
  mediumCandidates?: readonly SplatoonAssetImageCandidate[]
}

type SectionBackgroundStyle = React.CSSProperties & {
  '--section-pattern-image'?: string
  '--section-pattern-image-set'?: string
  '--section-pattern-image-medium'?: string
  '--section-pattern-image-set-medium'?: string
}

function imageSet(name: string, extension: 'jpg' | 'png') {
  return {
    fallback: `backgrounds/${name}.${extension}`,
    candidates: [
      { path: `backgrounds/${name}.${extension}` },
      { path: `backgrounds/${name}-2x.${extension}`, descriptor: '2x' },
    ],
  } satisfies PatternAssetSet
}

function responsiveImageSet(name: string, extension: 'jpg' | 'png') {
  return {
    ...imageSet(name, extension),
    mediumFallback: `backgrounds/${name}-medium-up.${extension}`,
    mediumCandidates: [
      { path: `backgrounds/${name}-medium-up.${extension}` },
      { path: `backgrounds/${name}-medium-up-2x.${extension}`, descriptor: '2x' },
    ],
  } satisfies PatternAssetSet
}

function webpImageSet(name: string) {
  return {
    fallback: `backgrounds/${name}.jpg`,
    candidates: [
      { path: `backgrounds/${name}.webp`, type: 'image/webp' },
      { path: `backgrounds/${name}.jpg` },
      { path: `backgrounds/${name}-2x.webp`, descriptor: '2x', type: 'image/webp' },
      { path: `backgrounds/${name}-2x.jpg`, descriptor: '2x' },
    ],
  } satisfies PatternAssetSet
}

const PATTERN_ASSETS: Record<Pattern, PatternAssetSet> = {
  'base-bg-pattern': imageSet('base-bg-pattern', 'jpg'),
  'camo-black': imageSet('camo-black', 'png'),
  'camo-green': imageSet('camo-green', 'png'),
  'camo-purple': imageSet('camo-purple', 'png'),
  'camo-purple-revised': imageSet('camo-purple-revised', 'png'),
  'camo-orange': imageSet('camo-orange', 'png'),
  'camo-red': imageSet('camo-red', 'png'),
  'camo-white': imageSet('camo-white', 'png'),
  'camo-white-outline': imageSet('camo-white-outline', 'png'),
  'hardware-background': responsiveImageSet('hardware-background', 'png'),
  'octo-black': imageSet('octo-black', 'png'),
  'octo-red': imageSet('octo-red', 'png'),
  'octoarrow-green': imageSet('octoarrow-green', 'png'),
  'octoarrow-orange': imageSet('octoarrow-orange', 'png'),
  'squid-black': imageSet('squid-black', 'png'),
  'circles-green': imageSet('circles-green', 'png'),
  'chip-white': imageSet('chip-white', 'png'),
  'monsters-black': imageSet('monsters-black', 'png'),
  graffiti: responsiveImageSet('graffiti', 'jpg'),
  'tapes-black': webpImageSet('tapes-black'),
  'tapes-green': webpImageSet('tapes-green'),
  'tapes-pattern': imageSet('tapes-pattern', 'jpg'),
  'tapes-purple': webpImageSet('tapes-purple'),
}

function getPatternAssetStyle(pattern: Pattern | undefined, assetBasePath?: SplatoonAssetBasePath) {
  if (!pattern) return undefined

  const asset = PATTERN_ASSETS[pattern]

  return {
    '--section-pattern-image': splatoonAssetUrl(asset.fallback, assetBasePath),
    '--section-pattern-image-set': splatoonAssetImageSet(asset.candidates, assetBasePath),
    ...(asset.mediumFallback && asset.mediumCandidates
      ? {
          '--section-pattern-image-medium': splatoonAssetUrl(asset.mediumFallback, assetBasePath),
          '--section-pattern-image-set-medium': splatoonAssetImageSet(
            asset.mediumCandidates,
            assetBasePath
          ),
        }
      : {}),
  } satisfies SectionBackgroundStyle
}

export interface SectionBackgroundProps extends React.HTMLAttributes<HTMLElement> {
  /** Solid background utility class (e.g. "bg-white", "bg-black"). */
  backgroundClassName?: string
  /** Dark-mode background utility class. */
  darkBackgroundClassName?: string
  /** Optional pattern texture overlay */
  pattern?: Pattern
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  as?: 'div' | 'section'
  ref?: React.Ref<HTMLElement>
}

export function SectionBackground({
  ref,
  backgroundClassName,
  darkBackgroundClassName,
  pattern,
  assetBasePath,
  as: Tag = 'div',
  className,
  children,
  style,
  ...props
}: SectionBackgroundProps) {
  const patternStyle = getPatternAssetStyle(pattern, assetBasePath)
  const resolvedClassName = cn(
    styles.sectionBackground,
    backgroundClassName,
    darkBackgroundClassName,
    pattern && PATTERN_MAP[pattern],
    className
  )

  if (Tag === 'section') {
    return (
      <section
        ref={ref}
        className={resolvedClassName}
        style={{ ...patternStyle, ...style } as SectionBackgroundStyle}
        {...props}
      >
        {children}
      </section>
    )
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={resolvedClassName}
      style={{ ...patternStyle, ...style } as SectionBackgroundStyle}
      {...props}
    >
      {children}
    </div>
  )
}
