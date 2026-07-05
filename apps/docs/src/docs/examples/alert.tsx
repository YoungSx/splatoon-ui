'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Alert, AlertDescription, AlertTitle, type AlertProps } from 'splatoon-ui/alert'

type AlertExampleProps = {
  variant: AlertProps['variant']
}

export function AlertExample({ variant }: AlertExampleProps) {
  return (
    <Alert className="max-w-md" variant={variant}>
      <AlertTitle>Fresh update</AlertTitle>
      <AlertDescription>Use alerts for compact status updates.</AlertDescription>
    </Alert>
  )
}
// docs-source-end

export const alertExample: DocsExampleDefinitionInput<AlertExampleProps> = {
  id: 'alert',
  title: 'Alert',
  description: 'Preview default and destructive alert surfaces.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['default', 'destructive'],
      defaultValue: 'default',
    },
  ],
  initialProps: { variant: 'default' },
  Component: AlertExample,
}
