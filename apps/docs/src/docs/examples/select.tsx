'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'splatoon-ui/select'

type SelectExampleProps = {
  value: string
  disabled: boolean
}

export function SelectExample({ value, disabled }: SelectExampleProps) {
  return (
    <div className="w-full max-w-sm">
      <Select key={value} defaultValue={value} disabled={disabled}>
        <SelectTrigger aria-label="Rotation mode">
          <SelectValue placeholder="Choose a mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gallery">Gallery</SelectItem>
          <SelectItem value="cards">Cards</SelectItem>
          <SelectItem value="forms">Forms</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
// docs-source-end

export const selectExample: DocsExampleDefinitionInput<SelectExampleProps> = {
  id: 'select',
  title: 'Select',
  description: 'Use a typed select root with trigger, value, content, and item parts.',
  controls: [
    {
      type: 'select',
      prop: 'value',
      label: 'Value',
      options: ['gallery', 'cards', 'forms'],
      defaultValue: 'gallery',
    },
    { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  ],
  initialProps: { value: 'gallery', disabled: false },
  Component: SelectExample,
}
