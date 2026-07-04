import * as React from 'react'

import { cn } from '@/lib/utils'
import { Tape, type TapeVariant } from './tape'

export interface MarqueeProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  variant?: 'default' | 'tape' | 'warning'
  showEdgeTape?: boolean
  tapeVariant?: TapeVariant
  ref?: React.Ref<HTMLDivElement>
}

function Marquee({
  ref,
  className,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  variant = 'default',
  showEdgeTape = false,
  tapeVariant = 'tape-2',
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      ref={ref}
      data-slot="marquee"
      data-variant={variant}
      className={cn(
        'group/marquee relative flex overflow-hidden select-none',
        'data-[variant=tape]:bg-primary data-[variant=tape]:text-primary-foreground data-[variant=tape]:border-foreground data-[variant=tape]:-rotate-[2deg] data-[variant=tape]:border-y-2',
        'data-[variant=warning]:text-chaos-black data-[variant=warning]:border-foreground data-[variant=warning]:border-y-2 data-[variant=warning]:bg-[repeating-linear-gradient(45deg,var(--color-yellow),var(--color-yellow)_12px,var(--color-black)_12px,var(--color-black)_24px)]',
        'data-[variant=default]:bg-foreground data-[variant=default]:text-background data-[variant=default]:border-foreground data-[variant=default]:border-y-2',
        className
      )}
      {...props}
    >
      {showEdgeTape && (
        <>
          <Tape variant={tapeVariant} position="top-left" className="z-30" />
          <Tape variant={tapeVariant} position="top-right" className="z-30" />
        </>
      )}
      <div
        className={cn(
          'splat-heading flex w-max items-center gap-8 px-8 py-2 text-sm text-[24px] font-black tracking-widest whitespace-nowrap',
          '[animation:marquee_linear_infinite]',
          pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
          direction === 'right' && '[animation-direction:reverse]'
        )}
        style={{ '--marquee-duration': `${speed}s` } as React.CSSProperties}
      >
        {children}
        <span aria-hidden="true">{children}</span>
      </div>
    </div>
  )
}

export type MarqueeItemProps = Omit<React.ComponentProps<'span'>, 'ref'> & {
  ref?: React.Ref<HTMLSpanElement>
}

function MarqueeItem({ ref, className, ...props }: MarqueeItemProps) {
  return (
    <span
      ref={ref}
      data-slot="marquee-item"
      className={cn('inline-flex shrink-0 items-center gap-2', className)}
      {...props}
    />
  )
}

export { Marquee, MarqueeItem }
