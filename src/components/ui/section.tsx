import * as React from 'react'
import { cn } from '@/lib/utils'
import { type Pattern, SectionBackground } from './section-background'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Base size — controls vertical padding. `md` = 64px, `lg` = 80px */
  size?: 'md' | 'lg'
  /** Pass a HeadingTape element to auto-increase padding for sticker overflow */
  headingTape?: React.ReactNode
  /** Extra block-end space inside the section for following overlay decorations. */
  bottomSafeArea?: React.CSSProperties['blockSize']
  /** Optional pattern texture overlay */
  pattern?: Pattern
  /** Tailwind background class (e.g. "bg-white") */
  bgColor?: string
  /** Tailwind text color class (e.g. "text-chaos-black") */
  text?: string
  /** Render as "section" or "div" */
  as?: 'section' | 'div'
  style?: React.CSSProperties
}

export function Section({
  size = 'md',
  headingTape,
  bottomSafeArea,
  pattern,
  bgColor,
  text,
  as = 'section',
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
      as={as}
      pattern={pattern}
      className={cn(
        paddingY,
        'relative z-[var(--z-deco)] pr-[calc(1.5rem+var(--section-side-nav-safe-area,0px))] pl-6',
        bgColor,
        text,
        className
      )}
      style={style}
      {...props}
    >
      {headingTape}
      {children}
      {bottomSafeArea ? (
        <div
          aria-hidden="true"
          data-slot="section-bottom-safe-area"
          style={{
            blockSize: typeof bottomSafeArea === 'number' ? `${bottomSafeArea}px` : bottomSafeArea,
            flex: '0 0 auto',
          }}
        />
      ) : null}
    </SectionBackground>
  )
}
