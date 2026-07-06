'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Badge, type BadgeProps } from 'splatoon-ui/badge'

type BadgeExampleProps = {
  color: BadgeProps['color']
  label: string
}

export function BadgeExample({ color, label }: BadgeExampleProps) {
  return <Badge color={color}>{label}</Badge>
}
// docs-source-end

export const badgeExample: DocsExampleDefinitionInput<BadgeExampleProps> = {
  id: 'badge',
  title: 'Badge',
  description: 'Preview the torn badge color palette.',
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
  Component: BadgeExample,
}
