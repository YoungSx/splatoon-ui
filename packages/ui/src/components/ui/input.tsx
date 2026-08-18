import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'children' | 'ref'> {
  ref?: React.Ref<HTMLInputElement>
}

function Input({ ref, className, type, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'field-cut border-foreground/30 bg-card file:text-foreground placeholder:text-muted-foreground focus-visible:border-foreground aria-invalid:border-destructive h-10 w-full min-w-0 border-2 px-3 py-2 text-base font-medium transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-xs placeholder:tracking-wider disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      {...props}
    />
  )
}

export { Input }
