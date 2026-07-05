'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Button } from 'splatoon-ui/button'
import {
  StapleCard,
  StapleCardDescription,
  StapleCardTitle,
  type StapleCardProps,
} from 'splatoon-ui/staple-card'

type StapleCardExampleProps = {
  variant: NonNullable<StapleCardProps['variant']>
  surface: NonNullable<StapleCardProps['surface']>
  showTape: boolean
  hoverTilt: boolean
}

export function StapleCardExample({
  variant,
  surface,
  showTape,
  hoverTilt,
}: StapleCardExampleProps) {
  return (
    <StapleCard
      className="w-full max-w-md"
      variant={variant}
      surface={surface}
      showTape={showTape}
      hoverTilt={hoverTilt}
      image={
        <img
          className="h-44 w-full object-cover"
          src="/_images/events/big-run-callout.jpg"
          alt="Big Run event"
        />
      }
    >
      <StapleCardTitle>Big Run bulletin</StapleCardTitle>
      <StapleCardDescription>Event status pinned into a paper feed card.</StapleCardDescription>
      <div className="mt-4 flex justify-center">
        <Button size="sm" variant={surface === 'dark' ? 'yellow' : 'blue'}>
          Read
        </Button>
      </div>
    </StapleCard>
  )
}
// docs-source-end

export const stapleCardExample: DocsExampleDefinitionInput<StapleCardExampleProps> = {
  id: 'staple-card',
  title: 'StapleCard',
  description: 'Preview the published staple card surface with media, text, and tape controls.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['a', 'b', 'c', 'd'],
      defaultValue: 'b',
    },
    {
      type: 'select',
      prop: 'surface',
      label: 'Surface',
      options: ['white', 'dark'],
      defaultValue: 'white',
    },
    { type: 'boolean', prop: 'showTape', label: 'Tape', defaultValue: true },
    { type: 'boolean', prop: 'hoverTilt', label: 'Hover tilt', defaultValue: true },
  ],
  initialProps: { variant: 'b', surface: 'white', showTape: true, hoverTilt: true },
  Component: StapleCardExample,
}
