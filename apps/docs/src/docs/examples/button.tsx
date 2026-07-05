'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Button, type ButtonProps } from 'splatoon-ui/button'

type ButtonExampleProps = {
  variant: ButtonProps['variant']
  size: ButtonProps['size']
  label: string
  hasChevron: boolean
}

export function ButtonExample({ variant, size, label, hasChevron }: ButtonExampleProps) {
  return (
    <Button variant={variant} size={size} hasChevron={hasChevron}>
      {label}
    </Button>
  )
}
// docs-source-end

export const buttonExample: DocsExampleDefinitionInput<ButtonExampleProps> = {
  id: 'button',
  title: 'Button',
  description: 'Tune the primary action button without changing the example source.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['yellow', 'blue', 'green', 'orange', 'purple', 'destructive', 'ghost'],
      defaultValue: 'yellow',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['sm', 'default', 'lg'],
      defaultValue: 'default',
    },
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Start match' },
    { type: 'boolean', prop: 'hasChevron', label: 'Chevron', defaultValue: true },
  ],
  initialProps: {
    variant: 'yellow',
    size: 'default',
    label: 'Start match',
    hasChevron: true,
  },
  Component: ButtonExample,
}
