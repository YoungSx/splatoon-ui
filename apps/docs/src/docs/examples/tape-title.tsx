'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { TapeTitle, type TapeTitleProps } from 'splatoon-ui/tape-title'

type TapeTitleExampleProps = {
  color: NonNullable<TapeTitleProps['color']>
  label: string
}

export function TapeTitleExample({ color, label }: TapeTitleExampleProps) {
  return (
    <div className="grid min-h-40 place-items-center">
      <TapeTitle color={color}>{label}</TapeTitle>
    </div>
  )
}
// docs-source-end

export const tapeTitleExample: DocsExampleDefinitionInput<TapeTitleExampleProps> = {
  id: 'tape-title',
  title: 'TapeTitle',
  description: 'Render a short heading on a torn tape label.',
  controls: [
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: ['black', 'red', 'yellow'],
      defaultValue: 'black',
    },
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Fresh Feed' },
  ],
  initialProps: { color: 'black', label: 'Fresh Feed' },
  Component: TapeTitleExample,
}
