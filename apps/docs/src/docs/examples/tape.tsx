'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Staple, Tape, type StapleProps, type TapeProps } from 'splatoon-ui/tape'

type TapeExampleProps = {
  variant: NonNullable<TapeProps['variant']>
  position: NonNullable<TapeProps['position']>
  staplePosition: NonNullable<StapleProps['position']>
}

export function TapeExample({ variant, position, staplePosition }: TapeExampleProps) {
  return (
    <div className="relative min-h-56 w-full max-w-md border-3 border-black bg-white p-8">
      <Tape variant={variant} position={position} />
      <Staple position={staplePosition} />
      <div className="bg-yellow/20 grid min-h-40 place-items-center border-2 border-dashed border-black/40 p-6 text-center font-black">
        Pinned decoration layer
      </div>
    </div>
  )
}
// docs-source-end

export const tapeExample: DocsExampleDefinitionInput<TapeExampleProps> = {
  id: 'tape',
  title: 'Tape',
  description: 'Place curated tape and staple assets over relative containers.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['tape-1', 'tape-2', 'tape-3', 'tape-4', 'tape-5', 'tape-6', 'tape-7'],
      defaultValue: 'tape-1',
    },
    {
      type: 'select',
      prop: 'position',
      label: 'Position',
      options: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right', 'news', 'event'],
      defaultValue: 'top-left',
    },
    {
      type: 'select',
      prop: 'staplePosition',
      label: 'Staple',
      options: ['left', 'right', 'top', 'bottom'],
      defaultValue: 'right',
    },
  ],
  initialProps: { variant: 'tape-1', position: 'top-left', staplePosition: 'right' },
  Component: TapeExample,
}
