'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Switch, type SwitchProps } from 'splatoon-ui/switch'

type SwitchExampleProps = {
  color: SwitchProps['color']
  checked: boolean
}

export function SwitchExample({ color, checked }: SwitchExampleProps) {
  return <Switch checked={checked} color={color} aria-label="Enable turf mode" />
}
// docs-source-end

export const switchExample: DocsExampleDefinitionInput<SwitchExampleProps> = {
  id: 'switch',
  title: 'Switch',
  description: 'Preview the image-backed switch track.',
  controls: [
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: ['yellow', 'blue', 'green', 'orange', 'red', 'black', 'white'],
      defaultValue: 'yellow',
    },
    { type: 'boolean', prop: 'checked', label: 'Checked', defaultValue: true },
  ],
  initialProps: { color: 'yellow', checked: true },
  Component: SwitchExample,
}
