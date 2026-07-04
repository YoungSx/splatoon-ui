import * as React from 'react'

import { cn } from '@/lib/utils'
import { TagHanger } from './tag-hanger'

export type RuggedTheme = 'yellow' | 'blue' | 'purple' | 'orange' | 'green'

const ruggedThemeMap: Record<RuggedTheme, { bg: string; fg: string }> = {
  yellow: { bg: 'text-yellow', fg: 'text-black' },
  blue: { bg: 'text-blue', fg: 'text-white' },
  purple: { bg: 'text-purple', fg: 'text-white' },
  orange: { bg: 'text-orange', fg: 'text-white' },
  green: { bg: 'text-green', fg: 'text-black' },
}

export interface RuggedCardProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  ruggedTheme?: RuggedTheme
  ruggedRotation?: string
  ruggedBackground?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export function RuggedCard({
  ref,
  className,
  ruggedTheme = 'yellow',
  ruggedRotation = '2deg',
  ruggedBackground,
  children,
  style,
  ...props
}: RuggedCardProps) {
  const theme = ruggedThemeMap[ruggedTheme] ?? ruggedThemeMap.yellow
  const defaultBackground = <TagHanger />

  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant="rugged"
      style={{ transform: `rotate(${ruggedRotation})`, ...style } as React.CSSProperties}
      className={cn(
        'group/card relative z-10 flex w-full flex-col justify-between gap-4 px-[6%] pt-[12%] pb-[8%] text-center select-none',
        theme.fg,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-0 h-full w-full select-none',
          theme.bg
        )}
      >
        {ruggedBackground ?? defaultBackground}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between gap-4 text-center">
        {children}
      </div>
    </div>
  )
}
