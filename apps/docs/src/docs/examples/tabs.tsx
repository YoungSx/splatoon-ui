'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsPanels,
  TabsTrigger,
  type TabsListProps,
} from 'splatoon-ui/tabs'

type TabsExampleProps = {
  variant: TabsListProps['variant']
}

export function TabsExample({ variant }: TabsExampleProps) {
  return (
    <Tabs defaultValue="weapons" className="w-full max-w-md">
      <TabsList variant={variant}>
        <TabsTrigger value="weapons">Weapons</TabsTrigger>
        <TabsTrigger value="maps">Maps</TabsTrigger>
      </TabsList>
      <TabsPanels className="mt-4">
        <TabsContent value="weapons">Blasters, rollers, and chargers.</TabsContent>
        <TabsContent value="maps">Compact map rotation details.</TabsContent>
      </TabsPanels>
    </Tabs>
  )
}
// docs-source-end

export const tabsExample: DocsExampleDefinitionInput<TabsExampleProps> = {
  id: 'tabs',
  title: 'Tabs',
  description: 'Preview tab variants and panel behavior.',
  controls: [
    {
      type: 'select',
      prop: 'variant',
      label: 'Variant',
      options: ['default', 'line', 'trapezoid'],
      defaultValue: 'default',
    },
  ],
  initialProps: { variant: 'default' },
  Component: TabsExample,
}
