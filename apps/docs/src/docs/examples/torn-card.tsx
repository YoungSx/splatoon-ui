'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Button } from 'splatoon-ui/button'
import {
  TornCard,
  TornCardDescription,
  TornCardTitle,
  type TornCardProps,
} from 'splatoon-ui/torn-card'

type TornCardExampleProps = {
  variant: NonNullable<TornCardProps['variant']>
  background: string
  showTape: boolean
  showSticker: boolean
  tapePosition: NonNullable<TornCardProps['tapePosition']>
}

export function TornCardExample({
  variant,
  background,
  showTape,
  showSticker,
  tapePosition,
}: TornCardExampleProps) {
  return (
    <TornCard
      className="w-full max-w-md"
      variant={variant}
      background={background}
      showTape={showTape}
      showSticker={showSticker}
      tapePosition={tapePosition}
    >
      <TornCardTitle>Rotation briefing</TornCardTitle>
      <TornCardDescription>
        Torn paper surface for editorial callouts, alerts, and compact feature panels.
      </TornCardDescription>
      <div className="mt-2 flex justify-center">
        <Button size="sm" variant="arrow">
          View
        </Button>
      </div>
    </TornCard>
  )
}
// docs-source-end

export const tornCardExample: DocsExampleDefinitionInput<TornCardExampleProps> = {
  id: 'torn-card',
  title: 'TornCard',
  description: 'Preview the published torn-paper card surface with tape and sticker presets.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['a', 'b', 'c'],
      defaultValue: 'a',
    },
    {
      type: 'text',
      prop: 'background',
      label: 'Background',
      defaultValue: '#efefef',
    },
    {
      type: 'select',
      prop: 'tapePosition',
      label: 'Tape position',
      options: ['top-right', 'bottom-center'],
      defaultValue: 'top-right',
    },
    { type: 'boolean', prop: 'showTape', label: 'Tape', defaultValue: true },
    { type: 'boolean', prop: 'showSticker', label: 'Sticker', defaultValue: false },
  ],
  initialProps: {
    variant: 'a',
    background: '#efefef',
    showTape: true,
    showSticker: false,
    tapePosition: 'top-right',
  },
  Component: TornCardExample,
}
