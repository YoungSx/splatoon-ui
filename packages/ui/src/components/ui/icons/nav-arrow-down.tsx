import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Arrow-down icon for the back-to-top button.
 * ViewBox: 0 0 16 9.45
 */
export interface NavArrowDownProps extends Omit<React.SVGProps<SVGSVGElement>, 'children' | 'ref'> {
  ref?: React.Ref<SVGSVGElement>
}

export function NavArrowDown({ ref, className, ...props }: NavArrowDownProps) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 16 9.45"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      aria-hidden="true"
      className={cn(className)}
      {...props}
    >
      <path d="m1.5 1.5 6.45 6.45L14.5 1.5" />
    </svg>
  )
}
