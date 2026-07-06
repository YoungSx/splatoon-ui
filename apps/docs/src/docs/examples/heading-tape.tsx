'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { HeadingTape, type HeadingTapeProps } from 'splatoon-ui/heading-tape'

type HeadingTapeExampleProps = {
  size: HeadingTapeProps['size']
  decorationSet: NonNullable<HeadingTapeProps['decorationSet']>
  overlapTop: boolean
  label: string
}

export function HeadingTapeExample({
  size,
  decorationSet,
  overlapTop,
  label,
}: HeadingTapeExampleProps) {
  return (
    <div className="grid min-h-40 place-items-center">
      <HeadingTape size={size} decorationSet={decorationSet} overlapTop={overlapTop}>
        {label}
      </HeadingTape>
    </div>
  )
}
// docs-source-end

export const headingTapeExample: DocsExampleDefinitionInput<HeadingTapeExampleProps> = {
  id: 'heading-tape',
  title: 'HeadingTape',
  description: 'Decorate section headings with tape art and optional sticker safe areas.',
  controls: [
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['default', 'compact'],
      defaultValue: 'default',
    },
    {
      type: 'select',
      prop: 'decorationSet',
      label: 'Decorations',
      options: ['stickers', 'none'],
      defaultValue: 'stickers',
    },
    { type: 'boolean', prop: 'overlapTop', label: 'Overlap top', defaultValue: false },
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Gear Shop' },
  ],
  initialProps: {
    size: 'default',
    decorationSet: 'stickers',
    overlapTop: false,
    label: 'Gear Shop',
  },
  Component: HeadingTapeExample,
}
