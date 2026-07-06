import * as React from 'react'

import { cn } from '@/lib/utils'
import type { SplatoonAssetBasePath } from './assets'
import { DottedDivider } from './dotted-divider'
import { PhotoFrame } from './photo-frame'
import { TagHanger } from './tag-hanger'
import styles from './rugged-card.module.css'

export type RuggedCardTheme = 'yellow' | 'blue' | 'purple' | 'orange' | 'green'

const RUGGED_CARD_THEME_MAP: Record<RuggedCardTheme, { bg: string; fg: string }> = {
  yellow: { bg: 'text-yellow', fg: 'text-black' },
  blue: { bg: 'text-blue', fg: 'text-white' },
  purple: { bg: 'text-purple', fg: 'text-white' },
  orange: { bg: 'text-orange', fg: 'text-white' },
  green: { bg: 'text-green', fg: 'text-black' },
}

export interface RuggedCardProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  theme?: RuggedCardTheme
  rotation?: string
  background?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export function RuggedCard({
  ref,
  className,
  theme: themeName = 'yellow',
  rotation = '2deg',
  background,
  children,
  style,
  ...props
}: RuggedCardProps) {
  const theme = RUGGED_CARD_THEME_MAP[themeName] ?? RUGGED_CARD_THEME_MAP.yellow
  const defaultBackground = <TagHanger />

  return (
    <div
      ref={ref}
      data-slot="rugged-card"
      data-variant="rugged"
      data-theme={themeName}
      style={style}
      className={cn('group/card relative z-10 w-full', className)}
      {...props}
    >
      <div
        className={cn(
          styles.visual,
          'relative flex w-full flex-col justify-between gap-4 px-[6%] pt-[12%] pb-[8%] text-center select-none',
          theme.fg
        )}
        style={{ '--rugged-card-rotation': rotation } as React.CSSProperties}
      >
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-0 h-full w-full select-none',
            theme.bg
          )}
        >
          {background ?? defaultBackground}
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between gap-4 text-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export interface RuggedCardHeaderProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  showDivider?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export function RuggedCardHeader({
  ref,
  className,
  children,
  showDivider = true,
  ...props
}: RuggedCardHeaderProps) {
  return (
    <div
      ref={ref}
      data-slot="rugged-card-header"
      className={cn('grid auto-rows-min items-start gap-1.5 pb-4', className)}
      {...props}
    >
      {children}
      {showDivider ? <DottedDivider aria-hidden="true" className="mt-2" /> : null}
    </div>
  )
}

export interface RuggedCardTitleProps extends Omit<React.ComponentProps<'h2'>, 'ref'> {
  ref?: React.Ref<HTMLHeadingElement>
}

export function RuggedCardTitle({ ref, className, ...props }: RuggedCardTitleProps) {
  return (
    <h2
      ref={ref}
      data-slot="rugged-card-title"
      className={cn('splat-skew text-2xl leading-none font-black tracking-wider', className)}
      {...props}
    />
  )
}

export interface RuggedCardDescriptionProps extends Omit<React.ComponentProps<'p'>, 'ref'> {
  ref?: React.Ref<HTMLParagraphElement>
}

export function RuggedCardDescription({ ref, className, ...props }: RuggedCardDescriptionProps) {
  return (
    <p
      ref={ref}
      data-slot="rugged-card-description"
      className={cn('text-[15px] leading-snug font-semibold opacity-90', className)}
      {...props}
    />
  )
}

export interface RuggedCardImageProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  src?: string
  alt?: string
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  ref?: React.Ref<HTMLDivElement>
}

export function RuggedCardImage({
  ref,
  className,
  src,
  alt,
  assetBasePath,
  children,
  ...props
}: RuggedCardImageProps) {
  return (
    <div
      ref={ref}
      data-slot="rugged-card-image"
      className={cn('relative flex w-full justify-center py-4', className)}
      {...props}
    >
      <PhotoFrame
        src={src}
        alt={alt}
        variant="b"
        rotation="2deg"
        fillWidth
        assetBasePath={assetBasePath}
      >
        {children}
      </PhotoFrame>
    </div>
  )
}

export interface RuggedCardContentProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  ref?: React.Ref<HTMLDivElement>
}

export function RuggedCardContent({ ref, className, ...props }: RuggedCardContentProps) {
  return (
    <div
      ref={ref}
      data-slot="rugged-card-content"
      className={cn('relative z-20 flex w-full flex-col text-[16px] leading-relaxed', className)}
      {...props}
    />
  )
}

export interface RuggedCardFooterProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  showDivider?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export function RuggedCardFooter({
  ref,
  className,
  children,
  showDivider = true,
  ...props
}: RuggedCardFooterProps) {
  return (
    <div
      ref={ref}
      data-slot="rugged-card-footer"
      className={cn('relative mt-2 flex items-center justify-center pt-4', className)}
      {...props}
    >
      {showDivider ? (
        <DottedDivider aria-hidden="true" className="absolute top-0 right-0 left-0" />
      ) : null}
      {children}
    </div>
  )
}
