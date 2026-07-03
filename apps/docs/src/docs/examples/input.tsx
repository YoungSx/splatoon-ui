'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type InputExampleProps = {
  value: string
}

export function InputExample({ value }: InputExampleProps) {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="docs-input-example">Player name</Label>
      <Input id="docs-input-example" value={value} readOnly />
    </div>
  )
}
// docs-source-end

export const inputExample: DocsExampleDefinitionInput<InputExampleProps> = {
  id: 'input',
  title: 'Input',
  description: 'Check sizing and text rendering inside form fields.',
  controls: [{ type: 'text', prop: 'value', label: 'Value', defaultValue: 'Inkling' }],
  initialProps: { value: 'Inkling' },
  Component: InputExample,
}
