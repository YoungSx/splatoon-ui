import * as React from 'react'

import { resolveSplatoonColorValue, splatoonColorVars } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import { DottedDivider } from './dotted-divider'
import styles from './list.module.css'
import type { SplatoonColorValue } from './tokens'

export type ListVariant = 'ordered'
export type { SplatoonColorValue } from './tokens'

export interface ListProps extends Omit<React.ComponentProps<'ol'>, 'start' | 'ref'> {
  variant?: ListVariant
  start?: number
  markerColor?: SplatoonColorValue
  markerTextColor?: SplatoonColorValue
  markerHoverColor?: SplatoonColorValue
  markerHoverTextColor?: SplatoonColorValue
  dividerColor?: SplatoonColorValue
  ref?: React.Ref<HTMLOListElement>
}

type ListStyle = React.CSSProperties & {
  '--list-marker-color'?: string
  '--list-marker-text-color'?: string
  '--list-marker-hover-color'?: string
  '--list-marker-hover-text-color'?: string
  '--list-divider-color'?: string
}

type ListItemElement = React.ReactElement<ListItemProps, typeof ListItem>
const ListMarkerContext = React.createContext<string | undefined>(undefined)

function isListItemElement(child: React.ReactNode): child is ListItemElement {
  return React.isValidElement(child) && child.type === ListItem
}

function formatListMarker(value: number, digits: number) {
  const sign = value < 0 ? '-' : ''
  return `${sign}${String(Math.abs(value)).padStart(digits, '0')}`
}

function List({
  ref,
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

  let listItemIndex = 0
  const children = childrenArray.map((child) => {
    if (!isListItemElement(child)) return child

    const markerValue = resolvedStart + listItemIndex
    listItemIndex += 1

    return (
      <ListMarkerContext.Provider
        key={child.key}
        value={formatListMarker(markerValue, markerDigits)}
      >
        {child}
      </ListMarkerContext.Provider>
    )
  })

  const resolvedStyle: ListStyle = {
    '--list-marker-color': resolveSplatoonColorValue(markerColor),
    '--list-marker-text-color': resolveSplatoonColorValue(markerTextColor),
    '--list-marker-hover-color': resolveSplatoonColorValue(markerHoverColor),
    '--list-marker-hover-text-color': resolveSplatoonColorValue(markerHoverTextColor),
    ...(dividerColor ? { '--list-divider-color': resolveSplatoonColorValue(dividerColor) } : null),
    ...style,
  }

  return (
    <ol
      ref={ref}
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

export interface ListItemProps extends Omit<React.ComponentProps<'li'>, 'ref'> {
  showDivider?: boolean
  ref?: React.Ref<HTMLLIElement>
}

function ListItem({ ref, className, children, showDivider = true, ...props }: ListItemProps) {
  const markerLabel = React.useContext(ListMarkerContext)

  return (
    <li
      ref={ref}
      data-slot="list-item"
      className={cn(styles.item, className)}
      {...props}
      data-list-marker={markerLabel}
    >
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
