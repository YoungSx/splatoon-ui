'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Progress, type ProgressProps } from 'splatoon-ui/progress'

type ProgressExampleProps = {
  value: number
  variant: ProgressProps['variant']
}

export function ProgressExample({ value, variant }: ProgressExampleProps) {
  return (
    <div className="w-full max-w-md">
      <Progress value={value} variant={variant} />
    </div>
  )
}
// docs-source-end

export const progressExample: DocsExampleDefinitionInput<ProgressExampleProps> = {
  id: 'progress',
  title: 'Progress',
  description: 'Adjust value and color while preserving the same API shape.',
  controls: [
    {
      type: 'number',
      prop: 'value',
      label: 'Value',
      defaultValue: 64,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['yellow', 'blue', 'green', 'purple', 'orange', 'red'],
      defaultValue: 'green',
    },
  ],
  initialProps: { value: 64, variant: 'green' },
  Component: ProgressExample,
}
