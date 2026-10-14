'use client'

import * as React from 'react'
import { Search, Sparkles } from 'lucide-react'
import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Input, type InputColor, type InputSize, type InputVariant } from 'splatoon-ui/input'

type InputExampleProps = {
  value: string
  variant: string
  size: string
  focusColor: string
  withPrefix: boolean
  withSuffix: boolean
  clearable: boolean
  invalid: boolean
  showPasswordToggle: boolean
}

export function InputExample({
  value: initialValue,
  variant,
  size,
  focusColor,
  withPrefix,
  withSuffix,
  clearable,
  invalid,
  showPasswordToggle,
}: InputExampleProps) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-black tracking-wider" htmlFor="docs-input-example">
        {showPasswordToggle ? 'Room Password' : 'Pool / Player Keyword'}
      </label>
      <Input
        id="docs-input-example"
        variant={variant as InputVariant}
        size={size as InputSize}
        focusColor={focusColor as InputColor}
        prefixIcon={withPrefix ? <Search className="size-full" /> : undefined}
        suffixIcon={withSuffix ? <Sparkles className="size-full text-chaos-yellow" /> : undefined}
        clearable={clearable}
        showPasswordToggle={showPasswordToggle}
        type={showPasswordToggle ? 'password' : 'text'}
        invalid={invalid}
        errorMessage={invalid ? 'Invalid keyword: special characters are not allowed!' : undefined}
        helperText={!invalid ? 'Supports Japanese, English, and alphanumeric characters.' : undefined}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={showPasswordToggle ? 'Enter 4-digit code' : 'Enter search term...'}
      />
    </div>
  )
}
// docs-source-end

export const inputExample: DocsExampleDefinitionInput<InputExampleProps> = {
  id: 'input',
  title: 'Input',
  description: 'Production-ready text field with authentic Splatoon 3 Lobby Terminal field-cut styling.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant (形态)',
      options: ['field-cut'],
      defaultValue: 'field-cut',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size (尺寸)',
      options: ['default', 'sm', 'lg'],
      defaultValue: 'default',
    },
    {
      type: 'select',
      prop: 'focusColor',
      label: 'Focus Color (聚焦色)',
      options: ['yellow', 'blue', 'green', 'purple', 'orange', 'red'],
      defaultValue: 'yellow',
    },
    {
      type: 'boolean',
      prop: 'withPrefix',
      label: 'Prefix Icon (左侧图标)',
      defaultValue: true,
    },
    {
      type: 'boolean',
      prop: 'withSuffix',
      label: 'Suffix Icon (右侧图标)',
      defaultValue: false,
    },
    {
      type: 'boolean',
      prop: 'clearable',
      label: 'Clearable (一键清空)',
      defaultValue: true,
    },
    {
      type: 'boolean',
      prop: 'showPasswordToggle',
      label: 'Password Toggle (密码显隐)',
      defaultValue: false,
    },
    {
      type: 'boolean',
      prop: 'invalid',
      label: 'Invalid / Error (错误态)',
      defaultValue: false,
    },
  ],
  initialProps: {
    value: 'Splatfest2026',
    variant: 'field-cut',
    size: 'default',
    focusColor: 'yellow',
    withPrefix: true,
    withSuffix: false,
    clearable: true,
    showPasswordToggle: false,
    invalid: false,
  },
  Component: InputExample,
}
