'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Section, type SectionPattern, type SectionProps } from 'splatoon-ui/section'

type SectionExampleProps = {
  size: SectionProps['size']
  pattern: SectionPattern
  title: string
}

export function SectionExample({ size, pattern, title }: SectionExampleProps) {
  return (
    <Section
      as="div"
      size={size}
      pattern={pattern}
      backgroundClassName="bg-white"
      className="w-full max-w-xl border-3 border-black"
    >
      <div className="mx-auto max-w-md">
        <p className="font-alt text-3xl font-black">{title}</p>
        <p className="mt-2 text-sm font-semibold">
          Section controls spacing, background texture, and content-safe padding.
        </p>
      </div>
    </Section>
  )
}
// docs-source-end

export const sectionExample: DocsExampleDefinitionInput<SectionExampleProps> = {
  id: 'section',
  title: 'Section',
  description: 'Preview section spacing with published pattern names.',
  controls: [
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['md', 'lg'],
      defaultValue: 'md',
    },
    {
      type: 'select',
      prop: 'pattern',
      label: 'Pattern',
      options: ['chip-white', 'camo-green', 'tapes-pattern', 'squid-black'],
      defaultValue: 'chip-white',
    },
    { type: 'text', prop: 'title', label: 'Title', defaultValue: 'Rotation briefing' },
  ],
  initialProps: { size: 'md', pattern: 'chip-white', title: 'Rotation briefing' },
  Component: SectionExample,
}
