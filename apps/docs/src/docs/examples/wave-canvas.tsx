'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { WaveCanvas, type WaveCanvasProps } from 'splatoon-ui/wave-canvas'

type WaveCanvasExampleProps = {
  color: NonNullable<WaveCanvasProps['color']>
  height: number
  interactive: boolean
}

export function WaveCanvasExample({ color, height, interactive }: WaveCanvasExampleProps) {
  return (
    <div className="grid min-h-80 w-full max-w-xl place-items-end px-4 pt-44 pb-10">
      <div className="relative h-28 w-full border-3 border-black bg-white">
        <WaveCanvas color={color} height={height} interactive={interactive} />
        <div className="bg-chaos-black grid h-full place-items-center text-center font-black text-white">
          Wave boundary
        </div>
      </div>
    </div>
  )
}
// docs-source-end

export const waveCanvasExample: DocsExampleDefinitionInput<WaveCanvasExampleProps> = {
  id: 'wave-canvas',
  title: 'WaveCanvas',
  description: 'Render an animated wave strip above a positioned section boundary.',
  controls: [
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: [
        'var(--color-blue)',
        'var(--color-green)',
        'var(--color-purple)',
        'var(--color-yellow)',
      ],
      defaultValue: 'var(--color-blue)',
    },
    {
      type: 'number',
      prop: 'height',
      label: 'Height',
      min: 80,
      max: 160,
      step: 8,
      defaultValue: 112,
    },
    { type: 'boolean', prop: 'interactive', label: 'Interactive', defaultValue: true },
  ],
  initialProps: { color: 'var(--color-blue)', height: 112, interactive: true },
  Component: WaveCanvasExample,
}
