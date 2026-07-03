'use client'

import * as React from 'react'

export type CardVariant = 'paper' | 'staple' | 'rugged' | 'torn'
export type CardSurface = 'white' | 'dark'

export const CardContext = React.createContext<{
  variant?: CardVariant
  surface?: CardSurface
}>({
  variant: 'paper',
  surface: 'white',
})
