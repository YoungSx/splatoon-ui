'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Checkbox } from '@/components/ui/checkbox'

type CheckboxExampleProps = {
  checked: boolean
}

export function CheckboxExample({ checked }: CheckboxExampleProps) {
  return (
    <label className="flex items-center gap-3 font-bold">
      <Checkbox checked={checked} readOnly />
      Ready for ranked
    </label>
  )
}
// docs-source-end

export const checkboxExample: DocsExampleDefinitionInput<CheckboxExampleProps> = {
  id: 'checkbox',
  title: 'Checkbox',
  description: 'Preview binary state styling.',
  controls: [{ type: 'boolean', prop: 'checked', label: 'Checked', defaultValue: true }],
  initialProps: { checked: true },
  Component: CheckboxExample,
}
