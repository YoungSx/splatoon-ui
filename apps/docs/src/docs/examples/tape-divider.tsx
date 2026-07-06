'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { TapeDivider, type TapeDividerProps } from 'splatoon-ui/tape-divider'

type TapeDividerExampleProps = {
  variant: TapeDividerProps['variant']
  rotate: TapeDividerProps['rotate']
  overlap: boolean
}

export function TapeDividerExample({ variant, rotate, overlap }: TapeDividerExampleProps) {
  return (
    <div className="grid w-full max-w-xl gap-3">
      <div className="border-chaos-black bg-white p-4 font-bold">Section above</div>
      <TapeDivider variant={variant} rotate={rotate} overlap={overlap} />
      <div className="border-chaos-black bg-white p-4 font-bold">Section below</div>
    </div>
  )
}
// docs-source-end

export const tapeDividerExample: DocsExampleDefinitionInput<TapeDividerExampleProps> = {
  id: 'tape-divider',
  title: 'TapeDivider',
  description: 'Use tape strips as section separators with controlled rotation.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['primary', 'double'],
      defaultValue: 'primary',
    },
    {
      type: 'select',
      prop: 'rotate',
      label: 'Rotate',
      options: ['none', 'left', 'right', 'strong'],
      defaultValue: 'none',
    },
    { type: 'boolean', prop: 'overlap', label: 'Overlap', defaultValue: false },
  ],
  initialProps: { variant: 'primary', rotate: 'none', overlap: false },
  Component: TapeDividerExample,
}
