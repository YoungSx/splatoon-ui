import * as React from 'react'
import { layoutTokens } from '@/lib/ui-tokens'
import { cn } from '@/lib/utils'
import { type Pattern as SectionPattern, SectionBackground } from './section-background'

export type { SectionPattern }

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Base size — controls vertical padding. `md` = 64px, `lg` = 80px */
  size?: 'md' | 'lg'
  /** Pass a HeadingTape element to auto-increase padding for sticker overflow */
  headingTape?: React.ReactNode
  /** Optional pattern texture overlay */
  pattern?: SectionPattern
  /** Background utility class (e.g. "bg-white") */
  backgroundClassName?: string
  /** Text color utility class (e.g. "text-chaos-black") */
  textClassName?: string
  /** Render as "section" or "div" */
  as?: 'section' | 'div'
  /** Reserve content-safe space for decorative overlays painted across the section edge. */
  bottomOverlayClearance?: 'none' | 'banner-divider'
  ref?: React.Ref<HTMLElement>
  style?: React.CSSProperties
}

export function Section({
  ref,
  size = 'md',
  headingTape,
  pattern,
  backgroundClassName,
  textClassName,
  as = 'section',
  bottomOverlayClearance = 'none',
  className,
  children,
  style,
  ...props
}: SectionProps) {
  const paddingY = headingTape
    ? size === 'lg'
      ? 'py-28'
      : 'py-24'
    : size === 'lg'
      ? 'py-20'
      : 'py-16'

  return (
    <SectionBackground
      ref={ref}
      as={as}
      pattern={pattern}
      className={cn(
        paddingY,
        'relative z-[var(--z-deco)] pr-[calc(1.5rem+var(--section-side-nav-safe-area,0px))] pl-6',
        backgroundClassName,
        textClassName,
        className,
        bottomOverlayClearance === 'banner-divider' && 'pb-[var(--section-overlay-clearance)]'
      )}
      style={
        {
          ...(bottomOverlayClearance === 'banner-divider'
            ? { '--section-overlay-clearance': layoutTokens.bannerDividerClearance }
            : {}),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {headingTape}
      {children}
    </SectionBackground>
  )
}
