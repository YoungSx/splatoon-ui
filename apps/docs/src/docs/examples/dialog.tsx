'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTriggerButton,
} from '@/components/ui/dialog'

type DialogExampleProps = {
  title: string
}

export function DialogExample({ title }: DialogExampleProps) {
  return (
    <Dialog>
      <DialogTriggerButton>{title}</DialogTriggerButton>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Use dialogs for focused decisions.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
// docs-source-end

export const dialogExample: DocsExampleDefinitionInput<DialogExampleProps> = {
  id: 'dialog',
  title: 'Dialog',
  description: 'Open the dialog to inspect focus handling and overlay styling.',
  controls: [{ type: 'text', prop: 'title', label: 'Title', defaultValue: 'Lobby notice' }],
  initialProps: { title: 'Lobby notice' },
  Component: DialogExample,
}
