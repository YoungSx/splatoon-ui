'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTriggerButton,
  type PopoverContentProps,
} from 'splatoon-ui/popover'

type PopoverExampleProps = {
  title: string
  side: PopoverContentProps['side']
}

export function PopoverExample({ title, side }: PopoverExampleProps) {
  return (
    <Popover>
      <PopoverTriggerButton variant="outline" theme="yellow">
        Open popover
      </PopoverTriggerButton>
      <PopoverContent side={side}>
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          <PopoverDescription>Contextual information without leaving the current task.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
// docs-source-end

export const popoverExample: DocsExampleDefinitionInput<PopoverExampleProps> = {
  id: 'popover',
  title: 'Popover',
  description: 'Open contextual content from a trigger button.',
  controls: [
    { type: 'text', prop: 'title', label: 'Title', defaultValue: 'Loadout notes' },
    {
      type: 'select',
      prop: 'side',
      label: 'Side',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'bottom',
    },
  ],
  initialProps: { title: 'Loadout notes', side: 'bottom' },
  Component: PopoverExample,
}
