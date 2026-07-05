'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Button } from 'splatoon-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps,
} from 'splatoon-ui/card'

type CardExampleProps = {
  variant: CardProps['variant']
}

export function CardExample({ variant }: CardExampleProps) {
  return (
    <Card className="max-w-sm" variant={variant}>
      <CardHeader>
        <CardTitle>Battle card</CardTitle>
        <CardDescription>Reusable paper surface for focused content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="blue">
          Open
        </Button>
      </CardContent>
    </Card>
  )
}
// docs-source-end

export const cardExample: DocsExampleDefinitionInput<CardExampleProps> = {
  id: 'card',
  title: 'Card',
  description: 'Switch between card surfaces while preserving the same content.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['paper', 'staple', 'torn', 'rugged'],
      defaultValue: 'paper',
    },
  ],
  initialProps: { variant: 'paper' },
  Component: CardExample,
}
