'use client'

import type { DocsExampleDefinitionInput } from '@/docs/types'

// docs-source-start
import { List, ListItem, type SplatoonColorValue } from 'splatoon-ui/list'

type ListExampleProps = {
  start: number
  markerColor: SplatoonColorValue
}

export function ListExample({ start, markerColor }: ListExampleProps) {
  return (
    <List start={start} markerColor={markerColor} className="w-full max-w-md">
      <ListItem>Pick a weapon role.</ListItem>
      <ListItem>Queue with the squad.</ListItem>
      <ListItem showDivider={false}>Review the rotation.</ListItem>
    </List>
  )
}
// docs-source-end

export const listExample: DocsExampleDefinitionInput<ListExampleProps> = {
  id: 'list',
  title: 'List',
  description: 'Render ordered steps with Splatoon marker styling.',
  controls: [
    { type: 'number', prop: 'start', label: 'Start', defaultValue: 1, min: 0, max: 9, step: 1 },
    {
      type: 'select',
      prop: 'markerColor',
      label: 'Marker',
      options: ['black', 'blue', 'green', 'orange', 'purple', 'red', 'yellow'],
      defaultValue: 'black',
    },
  ],
  initialProps: { start: 1, markerColor: 'black' },
  Component: ListExample,
}
