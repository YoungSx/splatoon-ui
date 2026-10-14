'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectFocusColor,
} from 'splatoon-ui/select'

type SelectExampleProps = {
  value: string
  disabled: boolean
  focusColor: SelectFocusColor
  size: 'default' | 'sm'
}

export function SelectExample({ value, disabled, focusColor, size }: SelectExampleProps) {
  return (
    <div className="w-full max-w-sm">
      <Select key={`${value}-${focusColor}-${size}`} defaultValue={value} disabled={disabled}>
        <SelectTrigger aria-label="Battle mode" focusColor={focusColor} size={size}>
          <SelectValue placeholder="Choose battle mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>ANARCHY BATTLE</SelectLabel>
            <SelectItem value="turf-war">Regular Battle (Turf War)</SelectItem>
            <SelectItem value="anarchy-series">Anarchy Battle (Series)</SelectItem>
            <SelectItem value="anarchy-open">Anarchy Battle (Open)</SelectItem>
            <SelectItem value="x-battle">X Battle</SelectItem>
            <SelectSeparator />
            <SelectLabel>GRIZZCO</SelectLabel>
            <SelectItem value="salmon-run">Salmon Run (Next Wave)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
// docs-source-end

export const selectExample: DocsExampleDefinitionInput<SelectExampleProps> = {
  id: 'select',
  title: 'Select',
  description:
    'Lobby Terminal authentic select with cut-edge frame, tactile shadow, Splatoon chevron, and ink splat indicators.',
  controls: [
    {
      type: 'select',
      prop: 'value',
      label: 'Value',
      options: ['turf-war', 'anarchy-series', 'anarchy-open', 'x-battle', 'salmon-run'],
      defaultValue: 'turf-war',
    },
    {
      type: 'select',
      prop: 'focusColor',
      label: 'Focus Color',
      options: ['yellow', 'blue', 'purple', 'pink', 'green', 'orange'],
      defaultValue: 'yellow',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['default', 'sm'],
      defaultValue: 'default',
    },
    { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  ],
  initialProps: { value: 'turf-war', disabled: false, focusColor: 'yellow', size: 'default' },
  Component: SelectExample,
}
