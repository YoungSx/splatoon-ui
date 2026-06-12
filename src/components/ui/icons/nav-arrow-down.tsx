'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Arrow-down icon for the back-to-top button.
 * Ported from official splatoon.nintendo.com `icon-arrow-down` symbol.
 * ViewBox: 0 0 16 9.45
 */
export function NavArrowDown({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
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
