'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Label } from 'splatoon-ui/label'

type LabelExampleProps = {
  label: string
  disabled: boolean
}

export function LabelExample({ label, disabled }: LabelExampleProps) {
  return (
    <div data-disabled={disabled ? 'true' : undefined} className="grid w-full max-w-sm gap-2">
      <Label htmlFor="docs-public-label">{label}</Label>
      <input
        id="docs-public-label"
        className="border-chaos-black h-10 border-2 px-3 font-bold"
        disabled={disabled}
        readOnly
        value="Agent 3"
      />
    </div>
  )
}
// docs-source-end

export const labelExample: DocsExampleDefinitionInput<LabelExampleProps> = {
  id: 'label',
  title: 'Label',
  description: 'Pair compact form labels with native controls or Splatoon UI inputs.',
  controls: [
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Player name' },
    { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  ],
  initialProps: { label: 'Player name', disabled: false },
  Component: LabelExample,
}
