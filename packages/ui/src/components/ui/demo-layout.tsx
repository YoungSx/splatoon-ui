import * as React from 'react'

import { layoutTokens } from '@/lib/ui-tokens'
import { cn } from '@/lib/utils'

export interface DemoContentProps extends React.ComponentProps<'div'> {
  width?: 'default' | 'narrow'
}

export function DemoContent({ width = 'default', className, style, ...props }: DemoContentProps) {
  return (
    <div
      className={cn('relative z-20 w-full space-y-16', className)}
      style={{
        maxWidth:
          width === 'narrow'
            ? layoutTokens.demoNarrowContentMaxWidth
            : layoutTokens.demoContentMaxWidth,
        ...style,
      }}
      {...props}
    />
  )
}

export function DemoExampleGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('space-y-6', className)} {...props} />
}
