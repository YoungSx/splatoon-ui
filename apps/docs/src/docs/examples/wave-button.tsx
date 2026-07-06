'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  WaveButton,
  type WaveButtonAnimation,
  type WaveButtonSize,
  type WaveButtonVariant,
} from 'splatoon-ui/wave-button'

type WaveButtonExampleProps = {
  variant: WaveButtonVariant
  size: WaveButtonSize
  animation: WaveButtonAnimation
}

export function WaveButtonExample({ variant, size, animation }: WaveButtonExampleProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <WaveButton aria-label="Close panel" variant={variant} size={size} animation={animation} />
    </div>
  )
}
// docs-source-end

export const waveButtonExample: DocsExampleDefinitionInput<WaveButtonExampleProps> = {
  id: 'wave-button',
  title: 'WaveButton',
  description: 'Tune the blob-shaped graphical trigger while keeping the native line glyph.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['yellow', 'white', 'ghost'],
      defaultValue: 'yellow',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['md', 'lg'],
      defaultValue: 'md',
    },
    {
      type: 'select',
      prop: 'animation',
      label: 'Animation',
      options: ['morph', 'none'],
      defaultValue: 'morph',
    },
  ],
  initialProps: {
    variant: 'yellow',
    size: 'md',
    animation: 'morph',
  },
  Component: WaveButtonExample,
}
