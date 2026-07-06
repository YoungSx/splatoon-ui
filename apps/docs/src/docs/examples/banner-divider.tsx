'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  BannerDivider,
  type BannerDividerProps,
  type BannerDividerVariant,
} from 'splatoon-ui/banner-divider'

type BannerDividerExampleProps = {
  pattern: BannerDividerVariant
  color: BannerDividerVariant
  animate: boolean
  layout: NonNullable<BannerDividerProps['layout']>
}

function createTapes(
  pattern: BannerDividerVariant,
  color: BannerDividerVariant
): BannerDividerProps['tapes'] {
  return [
    { variant: pattern, rotate: -2, enterFrom: 'left' },
    { variant: color, rotate: 2, offsetY: { base: 16, medium: 22 }, enterFrom: 'right' },
  ]
}

export function BannerDividerExample({
  pattern,
  color,
  animate,
  layout,
}: BannerDividerExampleProps) {
  return (
    <div className="border-chaos-black grid w-full max-w-2xl overflow-hidden border-3 bg-white">
      <div className="grid min-h-28 place-items-center p-5 text-center font-black">
        Section above
      </div>
      <BannerDivider tapes={createTapes(pattern, color)} animate={animate} layout={layout} />
      <div className="bg-chaos-black grid min-h-28 place-items-center p-5 text-center font-black text-white">
        Section below
      </div>
    </div>
  )
}
// docs-source-end

export const bannerDividerExample: DocsExampleDefinitionInput<BannerDividerExampleProps> = {
  id: 'banner-divider',
  title: 'BannerDivider',
  description: 'Compose two or three banner tape layers across section boundaries.',
  controls: [
    {
      type: 'select',
      prop: 'pattern',
      label: 'Pattern',
      options: ['design1', 'design2', 'design3'],
      defaultValue: 'design1',
    },
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: ['yellow', 'blue', 'green', 'purple', 'orange', 'red'],
      defaultValue: 'yellow',
    },
    {
      type: 'select',
      prop: 'layout',
      label: 'Layout',
      options: ['overlay', 'spacer'],
      defaultValue: 'overlay',
    },
    { type: 'boolean', prop: 'animate', label: 'Animate', defaultValue: false },
  ],
  initialProps: { pattern: 'design1', color: 'yellow', animate: false, layout: 'overlay' },
  Component: BannerDividerExample,
}
