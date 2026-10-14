'use client'

import * as React from 'react'
import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Input, type InputFocusColor, type InputVariant } from 'splatoon-ui/input'

type InputExampleProps = {
  value: string
  placeholder: string
  variant: string
  focusColor: string
  disabled: boolean
  invalid: boolean
}

export function InputExample({
  value: initialValue,
  placeholder,
  variant,
  focusColor,
  disabled,
  invalid,
}: InputExampleProps) {
  const [value, setValue] = React.useState(initialValue)
  const [prevInitialValue, setPrevInitialValue] = React.useState(initialValue)

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue)
    setValue(initialValue)
  }

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-black tracking-wider" htmlFor="docs-input-example">
        Pool / Player Keyword
      </label>
      <Input
        id="docs-input-example"
        variant={variant as InputVariant}
        focusColor={focusColor as InputFocusColor}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
// docs-source-end

export const inputExample: DocsExampleDefinitionInput<InputExampleProps> = {
  id: 'input',
  title: 'Input',
  description:
    'Splatoon 3 Lobby Terminal keyword input with authentic 4-corner asymmetric cut, tactile displacement, and solid black shadow.',
  controls: [
    {
      type: 'text',
      prop: 'value',
      label: 'Value',
      defaultValue: 'SPLAT-2026',
    },
    {
      type: 'text',
      prop: 'placeholder',
      label: 'Placeholder',
      defaultValue: 'Enter pool keyword...',
    },
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['field-cut'],
      defaultValue: 'field-cut',
    },
    {
      type: 'select',
      prop: 'focusColor',
      label: 'Focus Color',
      options: ['yellow', 'blue', 'purple', 'pink', 'green', 'orange'],
      defaultValue: 'yellow',
    },
    {
      type: 'boolean',
      prop: 'disabled',
      label: 'Disabled',
      defaultValue: false,
    },
    {
      type: 'boolean',
      prop: 'invalid',
      label: 'Invalid',
      defaultValue: false,
    },
  ],
  initialProps: {
    value: 'SPLAT-2026',
    placeholder: 'Enter pool keyword...',
    variant: 'field-cut',
    focusColor: 'yellow',
    disabled: false,
    invalid: false,
  },
  Component: InputExample,
}
