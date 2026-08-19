'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Play } from 'lucide-react'
import {
  IconButton,
  type IconButtonAnimation,
  type IconButtonDirection,
  type IconButtonSize,
  type IconButtonVariant,
} from 'splatoon-ui/icon-button'

type IconButtonExampleProps = {
  variant: IconButtonVariant
  size: IconButtonSize
  animation: IconButtonAnimation
  direction: IconButtonDirection
}

export function IconButtonExample({ variant, size, animation, direction }: IconButtonExampleProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <IconButton
        aria-label={`Move ${direction}`}
        variant={variant}
        size={size}
        animation={animation}
        direction={direction}
      />
      <IconButton
        aria-label="Play"
        variant={variant}
        size={size}
        animation={animation}
        icon={<Play className="h-[calc(var(--size)*0.42)] w-[calc(var(--size)*0.42)]" />}
      />
    </div>
  )
}
// docs-source-end

export const iconButtonExample: DocsExampleDefinitionInput<IconButtonExampleProps> = {
  id: 'icon-button',
  title: 'IconButton',
  description: 'Tune the circular control button while keeping the built-in arrow and icon APIs.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['carousel', 'primary', 'ghost', 'yellow', 'outline', 'accent'],
      defaultValue: 'carousel',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'lg',
    },
    {
      type: 'select',
      prop: 'animation',
      label: 'Animation',
      options: ['squish', 'pulse', 'none'],
      defaultValue: 'squish',
    },
    {
      type: 'select',
      prop: 'direction',
      label: 'Direction',
      options: ['left', 'right', 'up', 'down'],
      defaultValue: 'right',
    },
  ],
  initialProps: {
    variant: 'carousel',
    size: 'lg',
    animation: 'squish',
    direction: 'right',
  },
  Component: IconButtonExample,
}
