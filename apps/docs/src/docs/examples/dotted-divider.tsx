'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  DottedDivider,
  type DottedDividerProps,
  type SplatoonColorValue,
} from 'splatoon-ui/dotted-divider'

type DottedDividerExampleProps = {
  orientation: DottedDividerProps['orientation']
  color: SplatoonColorValue
}

export function DottedDividerExample({ orientation, color }: DottedDividerExampleProps) {
  return (
    <div
      className={
        orientation === 'vertical'
          ? 'flex h-48 items-stretch justify-center'
          : 'grid w-full max-w-md gap-4'
      }
    >
      <DottedDivider orientation={orientation} color={color} />
    </div>
  )
}
// docs-source-end

export const dottedDividerExample: DocsExampleDefinitionInput<DottedDividerExampleProps> = {
  id: 'dotted-divider',
  title: 'DottedDivider',
  description: 'Render decorative separators with horizontal or vertical orientation.',
  controls: [
    {
      type: 'select',
      prop: 'orientation',
      label: 'Orientation',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: ['black', 'blue', 'green', 'orange', 'purple', 'red', 'yellow'],
      defaultValue: 'black',
    },
  ],
  initialProps: { orientation: 'horizontal', color: 'black' },
  Component: DottedDividerExample,
}
