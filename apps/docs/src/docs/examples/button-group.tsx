'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { ButtonGroup, ButtonGroupItem, type ButtonGroupProps } from 'splatoon-ui/button-group'

type ButtonGroupExampleProps = {
  density: ButtonGroupProps['density']
  orientation: ButtonGroupProps['orientation']
  fullWidth: boolean
}

export function ButtonGroupExample({
  density,
  orientation,
  fullWidth,
}: ButtonGroupExampleProps) {
  return (
    <ButtonGroup
      aria-label="Match actions"
      density={density}
      orientation={orientation}
      fullWidth={fullWidth}
      className={orientation === 'vertical' ? 'max-w-56' : undefined}
    >
      <ButtonGroupItem size="sm" variant="yellow" theme="dark-yellow">
        Ready
      </ButtonGroupItem>
      <ButtonGroupItem size="sm" variant="blue" theme="light-blue">
        Gear
      </ButtonGroupItem>
      <ButtonGroupItem size="sm" variant="purple" theme="dark-purple">
        Lobby
      </ButtonGroupItem>
    </ButtonGroup>
  )
}
// docs-source-end

export const buttonGroupExample: DocsExampleDefinitionInput<ButtonGroupExampleProps> = {
  id: 'button-group',
  title: 'ButtonGroup',
  description: 'Group related button commands with shared density and orientation.',
  controls: [
    {
      type: 'select',
      prop: 'density',
      label: 'Density',
      options: ['compact', 'default', 'spacious'],
      defaultValue: 'default',
    },
    {
      type: 'select',
      prop: 'orientation',
      label: 'Orientation',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    { type: 'boolean', prop: 'fullWidth', label: 'Full width', defaultValue: false },
  ],
  initialProps: { density: 'default', orientation: 'horizontal', fullWidth: false },
  Component: ButtonGroupExample,
}
