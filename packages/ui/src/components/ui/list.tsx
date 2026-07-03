import * as React from 'react'

import { splatoonColorVars } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import { DottedDivider } from './dotted-divider'
import styles from './list.module.css'

export type ListVariant = 'ordered'

export interface ListProps extends Omit<React.ComponentProps<'ol'>, 'start'> {
  variant?: ListVariant
  start?: number
  markerColor?: string
  markerTextColor?: string
  markerHoverColor?: string
  markerHoverTextColor?: string
  dividerColor?: string
}

type ListStyle = React.CSSProperties & {
  '--list-marker-color'?: string
  '--list-marker-text-color'?: string
  '--list-marker-hover-color'?: string
  '--list-marker-hover-text-color'?: string
  '--list-divider-color'?: string
}

type ListItemElement = React.ReactElement<ListItemProps, typeof ListItem>

function isListItemElement(child: React.ReactNode): child is ListItemElement {
  return React.isValidElement(child) && child.type === ListItem
}

function formatListMarker(value: number, digits: number) {
  const sign = value < 0 ? '-' : ''
  return `${sign}${String(Math.abs(value)).padStart(digits, '0')}`
}

function List({
  variant = 'ordered',
  start = 1,
  markerColor = splatoonColorVars.black,
  markerTextColor = splatoonColorVars.white,
  markerHoverColor = splatoonColorVars.green,
  markerHoverTextColor = splatoonColorVars.black,
  dividerColor,
  className,
  children: childrenProp,
  style,
  ...props
}: ListProps) {
  const resolvedStart = Number.isFinite(start) ? Math.trunc(start) : 1
  const childrenArray = React.Children.toArray(childrenProp)
  const itemCount = childrenArray.filter(isListItemElement).length
  const maxMarkerValue = resolvedStart + Math.max(0, itemCount - 1)
  const markerDigits = Math.max(
    2,
    String(Math.abs(maxMarkerValue)).length,
    String(Math.abs(resolvedStart)).length
  )

  const children = childrenArray.reduce<{
    nodes: React.ReactNode[]
    listItemIndex: number
  }>(
    (acc, child) => {
      if (!isListItemElement(child)) {
        return {
          nodes: [...acc.nodes, child],
          listItemIndex: acc.listItemIndex,
        }
      }

      const markerValue = resolvedStart + acc.listItemIndex

      return {
        nodes: [
          ...acc.nodes,
          React.cloneElement(child, {
            'data-list-marker': formatListMarker(markerValue, markerDigits),
          } as Partial<React.ComponentProps<'li'>>),
        ],
        listItemIndex: acc.listItemIndex + 1,
      }
    },
    { nodes: [], listItemIndex: 0 }
  ).nodes

  const resolvedStyle: ListStyle = {
    '--list-marker-color': markerColor,
    '--list-marker-text-color': markerTextColor,
    '--list-marker-hover-color': markerHoverColor,
    '--list-marker-hover-text-color': markerHoverTextColor,
    ...(dividerColor ? { '--list-divider-color': dividerColor } : null),
    ...style,
  }

  return (
    <ol
      data-slot="list"
      data-variant={variant}
      start={resolvedStart}
      className={cn(styles.root, className)}
      style={resolvedStyle}
      {...props}
    >
      {children}
    </ol>
  )
}

export interface ListItemProps extends React.ComponentProps<'li'> {
  showDivider?: boolean
}

function ListItem({ className, children, showDivider = true, ...props }: ListItemProps) {
  const markerLabel = (props as { 'data-list-marker'?: string })['data-list-marker']

  return (
    <li data-slot="list-item" className={cn(styles.item, className)} {...props}>
      <span aria-hidden="true" className={styles.marker}>
        {markerLabel}
      </span>
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>
        {showDivider ? (
          <DottedDivider
            aria-hidden="true"
            className={styles.divider}
            color="var(--list-divider-color)"
          />
        ) : null}
      </div>
    </li>
  )
}

export { List, ListItem }
