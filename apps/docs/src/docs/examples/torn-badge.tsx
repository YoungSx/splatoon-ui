'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { TornBadge, type TornBadgeColor } from 'splatoon-ui/torn-badge'

type TornBadgeExampleProps = {
  color: TornBadgeColor
  label: string
}

export function TornBadgeExample({ color, label }: TornBadgeExampleProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <TornBadge color={color}>{label}</TornBadge>
    </div>
  )
}
// docs-source-end

export const tornBadgeExample: DocsExampleDefinitionInput<TornBadgeExampleProps> = {
  id: 'torn-badge',
  title: 'TornBadge',
  description: 'Use the torn-paper badge primitive directly when Badge is too opinionated.',
  controls: [
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: ['yellow', 'blue', 'green', 'red', 'purple', 'monochrome'],
      defaultValue: 'yellow',
    },
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Fresh' },
  ],
  initialProps: { color: 'yellow', label: 'Fresh' },
  Component: TornBadgeExample,
}
