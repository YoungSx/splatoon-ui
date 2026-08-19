'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { SplatoonTitle, type SplatoonTitleProps } from 'splatoon-ui/splatoon-title'

type SplatoonTitleExampleProps = {
  variant: SplatoonTitleProps['variant']
  size: SplatoonTitleProps['size']
  label: string
  animate: boolean
}

export function SplatoonTitleExample({ variant, size, label, animate }: SplatoonTitleExampleProps) {
  return (
    <SplatoonTitle key={`${label}-${animate}`} variant={variant} size={size} animate={animate}>
      {label}
    </SplatoonTitle>
  )
}
// docs-source-end

export const splatoonTitleExample: DocsExampleDefinitionInput<SplatoonTitleExampleProps> = {
  id: 'splatoon-title',
  title: 'SplatoonTitle',
  description: 'Render Splatoon-style text headings with optional mount animation.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['logo', 'section'],
      defaultValue: 'section',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      defaultValue: 'lg',
    },
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Fresh Finds' },
    { type: 'boolean', prop: 'animate', label: 'Animate', defaultValue: false },
  ],
  initialProps: { variant: 'section', size: 'lg', label: 'Fresh Finds', animate: false },
  Component: SplatoonTitleExample,
}
