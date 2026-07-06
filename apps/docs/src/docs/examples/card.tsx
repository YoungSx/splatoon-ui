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
} from 'splatoon-ui/card'

type CardExampleProps = Record<string, never>

export function CardExample() {
  return (
    <Card className="max-w-sm">
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
  description: 'Compose a neutral content card with header, description, body, and actions.',
  controls: [],
  initialProps: {},
  Component: CardExample,
}
