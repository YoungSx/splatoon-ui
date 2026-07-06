'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { Button } from 'splatoon-ui/button'
import {
  RuggedCard,
  RuggedCardContent,
  RuggedCardDescription,
  RuggedCardFooter,
  RuggedCardHeader,
  RuggedCardImage,
  RuggedCardTitle,
  type RuggedCardTheme,
} from 'splatoon-ui/rugged-card'

type RuggedCardExampleProps = {
  theme: RuggedCardTheme
  rotation: string
}

export function RuggedCardExample({ theme, rotation }: RuggedCardExampleProps) {
  return (
    <RuggedCard className="w-full max-w-sm" theme={theme} rotation={rotation}>
      <RuggedCardHeader>
        <RuggedCardTitle>Gear tag</RuggedCardTitle>
      </RuggedCardHeader>
      <RuggedCardImage
        src="/_images/weapons/shops-gallery/weapons-express-naut-couture-3.jpg"
        alt="Naut Couture gear showcase"
      />
      <RuggedCardContent>
        <RuggedCardDescription>
          Apparel-style product card with a hanger silhouette and framed media.
        </RuggedCardDescription>
      </RuggedCardContent>
      <RuggedCardFooter showDivider={false}>
        <Button size="sm" variant={theme === 'yellow' || theme === 'green' ? 'blue' : 'yellow'}>
          Open
        </Button>
      </RuggedCardFooter>
    </RuggedCard>
  )
}
// docs-source-end

export const ruggedCardExample: DocsExampleDefinitionInput<RuggedCardExampleProps> = {
  id: 'rugged-card',
  title: 'RuggedCard',
  description: 'Preview the published apparel tag card with theme and rotation controls.',
  controls: [
    {
      type: 'select',
      prop: 'theme',
      label: 'Theme',
      options: ['yellow', 'blue', 'purple', 'orange', 'green'],
      defaultValue: 'yellow',
    },
    { type: 'text', prop: 'rotation', label: 'Rotation', defaultValue: '-2deg' },
  ],
  initialProps: { theme: 'yellow', rotation: '-2deg' },
  Component: RuggedCardExample,
}
