import * as React from 'react'

import { cn } from '@/lib/utils'

export interface LabelProps extends Omit<React.ComponentProps<'label'>, 'ref'> {
  ref?: React.Ref<HTMLLabelElement>
}

function Label({ ref, className, ...props }: LabelProps) {
  return (
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-bold tracking-wider select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Label }
