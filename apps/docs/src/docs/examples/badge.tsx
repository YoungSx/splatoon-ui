'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Badge,
  type BadgeColor,
  type BadgePin,
  type BadgeRank,
  type BadgeSize,
  type BadgeVariant,
} from 'splatoon-ui/badge'
import { Button } from 'splatoon-ui/button'

type BadgeExampleProps = {
  variant: BadgeVariant
  pin: BadgePin
  rank: BadgeRank
  color: BadgeColor
  size: BadgeSize
  label: string
  anchor: boolean
}

export function BadgeExample({
  variant,
  pin,
  rank,
  color,
  size,
  label,
  anchor,
}: BadgeExampleProps) {
  if (anchor) {
    if (variant === 'dot') {
      return (
        <Badge dot color={color} size={size}>
          <Button variant="arrow">Notifications</Button>
        </Badge>
      )
    }

    return (
      <Badge color={color} size={size}>
        {label}
      </Badge>
    )
  }

  if (variant === 'pin') {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Selected Badge ({pin} · {rank})
          </span>
          <Badge variant="pin" pin={pin} rank={rank} size={size} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Official Splashtag Collection
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="pin" pin="judd" rank="gold" size={size} />
            <Badge variant="pin" pin="judd" rank="silver" size={size} />
            <Badge variant="pin" pin="judd" rank="bronze" size={size} />
            <Badge variant="pin" pin="cohozuna" rank={rank} size={size} />
            <Badge variant="pin" pin="steelhead" rank={rank} size={size} />
            <Badge variant="pin" pin="big-run" rank={rank} size={size} />
            <Badge variant="pin" pin="splattershot" rank="gold" size={size} />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'dot') {
    return (
      <div className="flex items-center gap-4">
        <Badge variant="dot" color={color} size={size} />
        <span className="text-foreground text-sm font-bold">
          Official Lobby Alert / Exclamation Notice
        </span>
      </div>
    )
  }

  return (
    <Badge color={color} size={size}>
      {label}
    </Badge>
  )
}
// docs-source-end

export const badgeExample: DocsExampleDefinitionInput<BadgeExampleProps> = {
  id: 'badge',
  title: 'Badge',
  description:
    'Preview the torn badge color palette, official Splashtag pin badges with preset selection, and in-game alert exclamation bubble badges.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['torn', 'pin', 'dot'],
      defaultValue: 'torn',
    },
    {
      type: 'select',
      prop: 'pin',
      label: 'Pin Preset',
      options: ['judd', 'steelhead', 'cohozuna', 'big-run', 'splattershot'],
      defaultValue: 'judd',
    },
    {
      type: 'select',
      prop: 'rank',
      label: 'Pin Rank',
      options: ['gold', 'silver', 'bronze'],
      defaultValue: 'gold',
    },
    {
      type: 'select',
      prop: 'color',
      label: 'Color',
      options: ['yellow', 'blue', 'green', 'red', 'purple', 'monochrome'],
      defaultValue: 'yellow',
    },
    {
      type: 'select',
      prop: 'size',
      label: 'Size',
      options: ['sm', 'default', 'lg'],
      defaultValue: 'default',
    },
    { type: 'boolean', prop: 'anchor', label: 'Anchor wrapper', defaultValue: false },
    { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Fresh' },
  ],
  initialProps: {
    variant: 'torn',
    pin: 'judd',
    rank: 'gold',
    color: 'yellow',
    size: 'default',
    anchor: false,
    label: 'Fresh',
  },
  Component: BadgeExample,
}
