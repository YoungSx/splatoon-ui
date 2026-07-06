'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlProps,
} from 'splatoon-ui/segmented-control'

type SegmentedControlExampleProps = {
  appearance: SegmentedControlProps['appearance']
  color: SegmentedControlProps['color']
  density: SegmentedControlProps['density']
}

export function SegmentedControlExample({
  appearance,
  color,
  density,
}: SegmentedControlExampleProps) {
  return (
    <SegmentedControl
      key={`${appearance}-${color}-${density}`}
      defaultValue="turf"
      appearance={appearance}
      color={color}
      density={density}
    >
      <SegmentedControlItem value="turf">Turf</SegmentedControlItem>
      <SegmentedControlItem value="ranked">Ranked</SegmentedControlItem>
      <SegmentedControlItem value="salmon">Salmon</SegmentedControlItem>
    </SegmentedControl>
  )
}
// docs-source-end

export const segmentedControlExample: DocsExampleDefinitionInput<SegmentedControlExampleProps> = {
  id: 'segmented-control',
  title: 'SegmentedControl',
  description: 'Switch between button and track appearances for mutually exclusive choices.',
  controls: [
    {
      type: 'select',
      prop: 'appearance',
      label: 'Appearance',
      options: ['buttons', 'track'],
      defaultValue: 'buttons',
    },
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: ['yellow', 'blue', 'green', 'orange', 'purple'],
      defaultValue: 'yellow',
    },
    {
      type: 'select',
      prop: 'density',
      label: 'Density',
      options: ['compact', 'default', 'spacious'],
      defaultValue: 'default',
    },
  ],
  initialProps: { appearance: 'buttons', color: 'yellow', density: 'default' },
  Component: SegmentedControlExample,
}
