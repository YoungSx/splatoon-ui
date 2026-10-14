'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Badge,
  type BadgeColor,
  type BadgeRank,
  type BadgeSize,
  type BadgeVariant,
} from 'splatoon-ui/badge'
import { Button } from 'splatoon-ui/button'

type BadgeExampleProps = {
  variant: BadgeVariant
  rank: BadgeRank
  color: BadgeColor
  size: BadgeSize
  label: string
  anchor: boolean
}

export function BadgeExample({ variant, rank, color, size, label, anchor }: BadgeExampleProps) {
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
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="pin" rank="gold" size={size} src="/_images/badges/judd-gold.png" />
          <Badge variant="pin" rank="silver" size={size} src="/_images/badges/judd-silver.png" />
          <Badge variant="pin" rank="bronze" size={size} src="/_images/badges/judd-bronze.png" />
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="pin" rank={rank} size={size} src="/_images/badges/steelhead-gold.png" />
          <Badge variant="pin" rank={rank} size={size} src="/_images/badges/cohozuna-gold.png" />
          <Badge variant="pin" rank={rank} size={size} src="/_images/badges/big-run-gold.png" />
          <Badge variant="pin" size={size} src="/_images/badges/splattershot-5star-gold.png" />
        </div>
      </div>
    )
  }

  if (variant === 'dot') {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="dot" color={color} size={size} />
        <span className="text-muted-foreground text-sm font-bold">Notification Alert</span>
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
    'Preview the torn badge color palette, official Splashtag pin badges, and alert dot badges.',
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
    rank: 'gold',
    color: 'yellow',
    size: 'default',
    anchor: false,
    label: 'Fresh',
  },
  Component: BadgeExample,
}
