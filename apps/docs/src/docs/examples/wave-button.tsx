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

function WaveGlyph() {
  return (
    <span aria-hidden="true" className="relative block h-7 w-7">
      <span className="absolute top-1.5 left-0.5 h-3 w-6 rounded-full bg-[var(--color-blue)]" />
      <span className="absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full bg-[var(--color-blue)]" />
    </span>
  )
}

export function WaveButtonExample({ variant, size, animation }: WaveButtonExampleProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <WaveButton aria-label="Close panel" variant={variant} size={size} animation={animation} />
      <WaveButton
        aria-label="Wave action"
        variant={variant}
        size={size}
        animation={animation}
        icon={<WaveGlyph />}
      />
    </div>
  )
}
// docs-source-end

export const waveButtonExample: DocsExampleDefinitionInput<WaveButtonExampleProps> = {
  id: 'wave-button',
  title: 'WaveButton',
  description: 'Tune the blob-shaped graphical trigger without turning it into a text button.',
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
