'use client'

import * as React from 'react'
import type { SplatoonAssetBasePath } from './assets'

export type CardVariant = 'paper' | 'staple' | 'rugged' | 'torn'
export type CardSurface = 'white' | 'dark'

export const CardContext = React.createContext<{
  variant?: CardVariant
  surface?: CardSurface
  assetBasePath?: SplatoonAssetBasePath
}>({
  variant: 'paper',
  surface: 'white',
})
