'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTriggerButton,
  type SheetSide,
} from 'splatoon-ui/sheet'

type SheetExampleProps = {
  title: string
  side: SheetSide
}

export function SheetExample({ title, side }: SheetExampleProps) {
  return (
    <Sheet>
      <SheetTriggerButton variant="yellow" theme="dark-yellow">
        Open sheet
      </SheetTriggerButton>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Drawer-style content for secondary workflows.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
// docs-source-end

export const sheetExample: DocsExampleDefinitionInput<SheetExampleProps> = {
  id: 'sheet',
  title: 'Sheet',
  description: 'Preview drawer placement and the built-in overlay treatment.',
  controls: [
    { type: 'text', prop: 'title', label: 'Title', defaultValue: 'Match settings' },
    {
      type: 'select',
      prop: 'side',
      label: 'Side',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'right',
    },
  ],
  initialProps: { title: 'Match settings', side: 'right' },
  Component: SheetExample,
}
