'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Label } from 'splatoon-ui/label'
import { RadioGroup, RadioGroupItem } from 'splatoon-ui/radio-group'

type RadioGroupExampleProps = {
  value: string
  disabled: boolean
}

export function RadioGroupExample({ value, disabled }: RadioGroupExampleProps) {
  return (
    <RadioGroup key={value} defaultValue={value} disabled={disabled} className="max-w-sm">
      {[
        ['turf', 'Turf War'],
        ['ranked', 'Anarchy'],
        ['salmon', 'Salmon Run'],
      ].map(([itemValue, label]) => (
        <Label key={itemValue} className="gap-3">
          <RadioGroupItem value={itemValue} />
          {label}
        </Label>
      ))}
    </RadioGroup>
  )
}
// docs-source-end

export const radioGroupExample: DocsExampleDefinitionInput<RadioGroupExampleProps> = {
  id: 'radio-group',
  title: 'RadioGroup',
  description: 'Preview single-choice state with the Splatoon radio indicator.',
  controls: [
    {
      type: 'select',
      prop: 'value',
      label: 'Value',
      options: ['turf', 'ranked', 'salmon'],
      defaultValue: 'turf',
    },
    { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  ],
  initialProps: { value: 'turf', disabled: false },
  Component: RadioGroupExample,
}
