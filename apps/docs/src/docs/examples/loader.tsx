'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Loader, type LoaderAnimation, type LoaderProps } from 'splatoon-ui/loader'

type LoaderExampleProps = {
  variant: LoaderProps['variant']
  animation: LoaderAnimation
  size: string
  label: string
}

export function LoaderExample({ variant, animation, size, label }: LoaderExampleProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Loader variant={variant} animation={animation} size={size} label={label} />
      <span className="font-alt text-2xl font-black">{label}</span>
    </div>
  )
}
// docs-source-end

export const loaderExample: DocsExampleDefinitionInput<LoaderExampleProps> = {
  id: 'loader',
  title: 'Loader',
  description: 'Switch between the image-backed squid glyph and sprite animations.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['default', 'blue', 'red'],
      defaultValue: 'default',
    },
    {
      type: 'select',
      prop: 'animation',
      label: 'Animation',
      options: ['glyph', 'morph', 'swim'],
      defaultValue: 'glyph',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['2rem', '3rem', '4rem'],
      defaultValue: '3rem',
    },
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Loading gear' },
  ],
  initialProps: {
    variant: 'default',
    animation: 'glyph',
    size: '3rem',
    label: 'Loading gear',
  },
  Component: LoaderExample,
}
