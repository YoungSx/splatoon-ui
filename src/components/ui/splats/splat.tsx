'use client'

import * as React from 'react'
import { Splat1 } from './splat-1'
import { Splat2 } from './splat-2'
import { Splat3 } from './splat-3'
import { Splat4 } from './splat-4'
import { Splat5 } from './splat-5'
import { Splat6 } from './splat-6'
import { Splat7 } from './splat-7'
import { Splat8 } from './splat-8'
import { Splat9 } from './splat-9'
import { Splat10 } from './splat-10'
import { Splat11 } from './splat-11'
import { Splat12 } from './splat-12'

export interface SplatProps extends Omit<React.SVGProps<SVGSVGElement>, 'id'> {
  /** Bundled splat ID (1 to 12) */
  id: number
  /** CSS color value or CSS variable */
  color?: string
}

/**
 * Dynamic Splat Router Component.
 * Routes dynamically to Splat1 through Splat12.
 * Ideal for loops or dynamic particle rendering.
 */
export function Splat({ id, ...props }: SplatProps) {
  switch (id) {
    case 1:
      return <Splat1 {...props} />
    case 2:
      return <Splat2 {...props} />
    case 3:
      return <Splat3 {...props} />
    case 4:
      return <Splat4 {...props} />
    case 5:
      return <Splat5 {...props} />
    case 6:
      return <Splat6 {...props} />
    case 7:
      return <Splat7 {...props} />
    case 8:
      return <Splat8 {...props} />
    case 9:
      return <Splat9 {...props} />
    case 10:
      return <Splat10 {...props} />
    case 11:
      return <Splat11 {...props} />
    case 12:
      return <Splat12 {...props} />
    default:
      return null
  }
}
