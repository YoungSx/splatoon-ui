'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './tabs.module.css'

const TRAPEZOID_TABS_TEXTURE_SCALE = 1.2

type TabsListVariant = 'default' | 'line' | 'trapezoid'
type TabsListColor = 'yellow' | 'blue' | 'green' | 'orange' | 'purple' | 'red'
type TabsValue = TabsPrimitive.Tab.Props['value']
type TabsRootProps = TabsPrimitive.Root.Props
type TabsChangeDetails = Parameters<NonNullable<TabsRootProps['onValueChange']>>[1]
type TabsActivationDirection = TabsChangeDetails['activationDirection']
type TabsSwipeMode = boolean | 'coarse' | 'always'

type TrapezoidTabsStyle = React.CSSProperties & {
  '--trapezoid-tabs-bg-size-x'?: string
  '--trapezoid-tabs-bg-x'?: string
  '--trapezoid-tabs-count'?: number
  '--trapezoid-tabs-index'?: number
}

type TabsListStyle = React.CSSProperties & {
  '--tabs-decoration-color'?: string
}

const tabsDecorationColorByColor = {
  yellow: 'var(--color-blue)',
  blue: 'var(--color-yellow)',
  green: 'var(--color-red)',
  orange: 'var(--color-purple)',
  purple: 'var(--color-blue)',
  red: 'var(--color-green)',
} satisfies Record<TabsListColor, string>

function getTabsDecorationColor(variant: TabsListVariant, color: TabsListColor) {
  if (variant === 'trapezoid') {
    return 'var(--color-blue)'
  }

  return tabsDecorationColorByColor[color]
}

type TabsInteractionContextValue = {
  currentValue: TabsValue | undefined
  orientation: NonNullable<TabsRootProps['orientation']>
  setPanelValues: (values: TabsValue[]) => void
  setValue: (value: TabsValue, event?: Event) => void
}

const TabsListVariantContext = React.createContext<TabsListVariant>('default')
const TabsInteractionContext = React.createContext<TabsInteractionContextValue | null>(null)

function isStyleableElement(
  child: React.ReactNode
): child is React.ReactElement<{ style?: React.CSSProperties }> {
  return React.isValidElement(child) && child.type !== React.Fragment
}

function useTabsInteraction() {
  const context = React.useContext(TabsInteractionContext)

  if (!context) {
    throw new Error('TabsPanels must be used within Tabs')
  }

  return context
}

function createTabsChangeDetails(
  event: Event | undefined,
  activationDirection: TabsActivationDirection
): TabsChangeDetails {
  let canceled = false
  let propagationAllowed = false

  return {
    reason: 'none',
    event: event ?? new Event('base-ui'),
    cancel() {
      canceled = true
    },
    allowPropagation() {
      propagationAllowed = true
    },
    get isCanceled() {
      return canceled
    },
    get isPropagationAllowed() {
      return propagationAllowed
    },
    trigger: undefined,
    activationDirection,
  } as TabsChangeDetails
}

function resolveActivationDirection(
  previousValue: TabsValue | undefined,
  nextValue: TabsValue,
  values: TabsValue[],
  orientation: NonNullable<TabsRootProps['orientation']>
): TabsActivationDirection {
  const previousIndex = values.findIndex((value) => Object.is(value, previousValue))
  const nextIndex = values.findIndex((value) => Object.is(value, nextValue))

  if (previousIndex < 0 || nextIndex < 0 || previousIndex === nextIndex) {
    return 'none'
  }

  if (orientation === 'vertical') {
    return nextIndex > previousIndex ? 'down' : 'up'
  }

  return nextIndex > previousIndex ? 'right' : 'left'
}

function Tabs({
  className,
  orientation = 'horizontal',
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: TabsRootProps) {
  const isControlled = valueProp !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<TabsValue | undefined>(
    defaultValue !== undefined ? defaultValue : 0
  )
  const currentValue = isControlled ? valueProp : uncontrolledValue
  const currentValueRef = React.useRef(currentValue)
  const panelValuesRef = React.useRef<TabsValue[]>([])

  React.useEffect(() => {
    currentValueRef.current = currentValue
  }, [currentValue])

  const commitValue = React.useCallback(
    (nextValue: TabsValue, eventDetails?: TabsChangeDetails) => {
      if (Object.is(currentValueRef.current, nextValue)) return

      const details =
        eventDetails ??
        createTabsChangeDetails(
          undefined,
          resolveActivationDirection(
            currentValueRef.current,
            nextValue,
            panelValuesRef.current,
            orientation
          )
        )

      onValueChange?.(nextValue, details)
      if (details.isCanceled) return

      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }
      currentValueRef.current = nextValue
    },
    [isControlled, onValueChange, orientation]
  )

  const setValue = React.useCallback(
    (nextValue: TabsValue, event?: Event) => {
      if (Object.is(currentValueRef.current, nextValue)) return

      commitValue(
        nextValue,
        createTabsChangeDetails(
          event,
          resolveActivationDirection(
            currentValueRef.current,
            nextValue,
            panelValuesRef.current,
            orientation
          )
        )
      )
    },
    [commitValue, orientation]
  )

  const setPanelValues = React.useCallback((values: TabsValue[]) => {
    panelValuesRef.current = values
  }, [])

  const contextValue = React.useMemo<TabsInteractionContextValue>(
    () => ({
      currentValue,
      orientation,
      setPanelValues,
      setValue,
    }),
    [currentValue, orientation, setPanelValues, setValue]
  )

  return (
    <TabsInteractionContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        value={currentValue}
        onValueChange={commitValue}
        orientation={orientation}
        className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
        {...props}
      />
    </TabsInteractionContext.Provider>
  )
}

const tabsListVariants = cva(
  'group/tabs-list flex items-center justify-center text-current group-data-horizontal/tabs:h-auto group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
  {
    variants: {
      variant: {
        default:
          '-mt-6 flex-row justify-start overflow-x-auto overflow-y-hidden pt-6 pb-8 snap-x snap-mandatory sm:snap-none scrollbar-hide',
        line: 'gap-1 bg-transparent border-b-2 border-current/10 w-full justify-start rounded-none',
        trapezoid: styles.trapezoidList,
      },
      color: {
        yellow: '',
        blue: '',
        green: '',
        orange: '',
        purple: '',
        red: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      color: 'blue',
    },
  }
)

function withTrapezoidTabsTriggerVars(children: React.ReactNode) {
  const childArray = React.Children.toArray(children)
  const triggerCount = childArray.filter(isStyleableElement).length
  let triggerIndex = 0

  return childArray.map((child) => {
    if (!isStyleableElement(child)) {
      return child
    }

    const index = triggerIndex
    triggerIndex += 1

    const textureSpan = triggerCount * TRAPEZOID_TABS_TEXTURE_SCALE - 1
    const backgroundX =
      triggerCount > 1 && textureSpan > 0 ? `${(index / textureSpan) * 100}%` : '50%'
    const style: TrapezoidTabsStyle = {
      ...child.props.style,
      '--trapezoid-tabs-bg-size-x': `${triggerCount * TRAPEZOID_TABS_TEXTURE_SCALE * 100}%`,
      '--trapezoid-tabs-bg-x': backgroundX,
      '--trapezoid-tabs-count': triggerCount,
      '--trapezoid-tabs-index': index,
    }

    return React.cloneElement(child, { style })
  })
}

export interface TabsListProps
  extends Omit<TabsPrimitive.List.Props, 'color'>,
    Omit<VariantProps<typeof tabsListVariants>, 'color'> {
  /** Primary active color token. The default decoration color is inferred from the matching Splatoon theme pair. */
  color?: TabsListColor
  /** Override the inferred hover/active decoration color with any CSS color value. */
  decorationColor?: string
}

function TabsList({
  className,
  children,
  decorationColor,
  variant = 'default',
  color = 'blue',
  style,
  ...props
}: TabsListProps) {
  const resolvedVariant = variant ?? 'default'
  const resolvedColor = color ?? 'blue'
  const resolvedChildren =
    resolvedVariant === 'trapezoid' ? withTrapezoidTabsTriggerVars(children) : children
  const resolvedDecorationColor =
    decorationColor ?? getTabsDecorationColor(resolvedVariant, resolvedColor)
  const resolvedStyle = {
    ...style,
    '--tabs-decoration-color': resolvedDecorationColor,
  } satisfies TabsListStyle

  return (
    <TabsListVariantContext.Provider value={resolvedVariant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={resolvedVariant}
        data-color={resolvedColor}
        className={cn(tabsListVariants({ variant: resolvedVariant, color: resolvedColor }), className)}
        style={resolvedStyle}
        {...props}
      >
        {resolvedChildren}
      </TabsPrimitive.List>
    </TabsListVariantContext.Provider>
  )
}

function TabsTrigger({ className, children, nativeButton = true, ...props }: TabsPrimitive.Tab.Props) {
  const listVariant = React.useContext(TabsListVariantContext)
  const isTrapezoid = listVariant === 'trapezoid'

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        'relative shrink-0 cursor-pointer snap-start outline-none select-none',
        'font-alt text-lg leading-none font-bold sm:text-[2.3125rem]',
        'transition-colors',
        // Default variant touch target and scroll sizing.
        'group-data-[variant=default]/tabs-list:min-h-11 group-data-[variant=default]/tabs-list:min-w-16 group-data-[variant=default]/tabs-list:px-3 group-data-[variant=default]/tabs-list:py-2',
        // Active color — resolved by parent TabsList data-color
        'group-data-[color=yellow]/tabs-list:data-active:text-yellow',
        'group-data-[color=blue]/tabs-list:data-active:text-blue',
        'group-data-[color=green]/tabs-list:data-active:text-green',
        'group-data-[color=orange]/tabs-list:data-active:text-orange',
        'group-data-[color=purple]/tabs-list:data-active:text-purple',
        'group-data-[color=red]/tabs-list:data-active:text-red',
        // Underline
        'before:pointer-events-none before:absolute before:inset-x-0 before:bottom-[-2px] before:h-[3px] before:opacity-0 before:transition-all',
        'group-data-[color=yellow]/tabs-list:before:bg-yellow',
        'group-data-[color=blue]/tabs-list:before:bg-blue',
        'group-data-[color=green]/tabs-list:before:bg-green',
        'group-data-[color=orange]/tabs-list:before:bg-orange',
        'group-data-[color=purple]/tabs-list:before:bg-purple',
        'group-data-[color=red]/tabs-list:before:bg-red',
        // Line variant overrides
        'group-data-[variant=line]/tabs-list:font-heading group-data-[variant=line]/tabs-list:text-base group-data-[variant=line]/tabs-list:tracking-wider',
        'group-data-[variant=line]/tabs-list:text-current/60',
        'group-data-[variant=line]/tabs-list:data-active:text-blue group-data-[variant=line]/tabs-list:hover:text-blue',
        'group-data-[variant=line]/tabs-list:data-active:before:opacity-100',
        // Vertical line variant
        'group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:inset-x-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:inset-y-0 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:-right-[2px] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:h-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:w-[3px]',
        styles.trigger,
        className
      )}
      nativeButton={nativeButton}
      {...props}
    >
      {isTrapezoid ? (
        <>
          <span aria-hidden="true" className={styles.trapezoidFill} />
          <svg
            aria-hidden="true"
            className={styles.trapezoidSurface}
            viewBox="0 0 360 104"
            preserveAspectRatio="none"
          >
            <path
              className={styles.trapezoidShape}
              d="M31 1H329C343 1 350 9 352 23L360 104H0L8 23C10 9 17 1 31 1Z"
            />
            <path className={styles.trapezoidHighlight} d="M2 101L8 23C10 9 17 1 31 1H314" />
          </svg>
          <svg
            aria-hidden="true"
            className={styles.trapezoidPin}
            viewBox="0 0 64 80"
            focusable="false"
          >
            <path
              className={styles.trapezoidPinOutline}
              d="M32 73C19.5 61.5 8.5 50 7.5 34.5C6.5 17.5 17.5 5.5 32.5 5.5C47.5 5.5 58.5 17.5 56.5 34.5C54.7 50.2 44.5 62.2 32 73Z"
            />
            <circle className={styles.trapezoidPinDot} cx="32" cy="28" r="9" />
          </svg>
        </>
      ) : null}
      <span className={cn('relative z-[var(--z-deco-fg)]', styles.label)}>{children}</span>
    </TabsPrimitive.Tab>
  )
}

function isTabsPanelElement(
  child: React.ReactNode
): child is React.ReactElement<{ value: TabsValue }> {
  if (!React.isValidElement(child) || child.type === React.Fragment) return false

  const props = child.props as { value?: unknown }
  return 'value' in props
}

function collectTabsPanelValues(children: React.ReactNode): TabsValue[] {
  const values: TabsValue[] = []

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      values.push(...collectTabsPanelValues((child.props as { children?: React.ReactNode }).children))
      return
    }

    if (isTabsPanelElement(child)) {
      values.push(child.props.value)
    }
  })

  return values
}

function isInteractiveSwipeTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false

  return Boolean(
    target.closest(
      'a[href], button, input, select, textarea, label, [contenteditable="true"], [data-tabs-swipe-ignore]'
    )
  )
}

function isSwipeEnabledForPointer(swipeable: TabsSwipeMode, event: React.PointerEvent) {
  if (!swipeable) return false
  if (swipeable === 'always') return true

  return (
    event.pointerType === 'touch' ||
    event.pointerType === 'pen' ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export interface TabsPanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  swipeable?: TabsSwipeMode
  swipeThreshold?: number
  swipeAxisLockRatio?: number
}

function TabsPanels({
  ref,
  className,
  children,
  swipeable = false,
  swipeThreshold = 48,
  swipeAxisLockRatio = 1.25,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  style,
  ...props
}: TabsPanelsProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { currentValue, orientation, setPanelValues, setValue } = useTabsInteraction()
  const values = React.useMemo(() => collectTabsPanelValues(children), [children])
  const valuesRef = React.useRef(values)
  const pointerStartRef = React.useRef<{ pointerId: number; x: number; y: number } | null>(null)
  const canSwipe = Boolean(swipeable) && orientation === 'horizontal' && values.length > 1

  React.useEffect(() => {
    valuesRef.current = values
    setPanelValues(values)
  }, [setPanelValues, values])

  const navigateByDelta = React.useCallback(
    (delta: 1 | -1, event: Event) => {
      const currentIndex = valuesRef.current.findIndex((value) => Object.is(value, currentValue))
      const nextValue = valuesRef.current[currentIndex + delta]

      if (currentIndex < 0 || nextValue === undefined) return

      setValue(nextValue, event)
    },
    [currentValue, setValue]
  )

  return (
    <div
      ref={ref}
      data-slot="tabs-panels"
      data-swipeable={canSwipe ? 'true' : undefined}
      className={cn('relative', className)}
      style={{
        touchAction: canSwipe ? 'pan-y' : undefined,
        ...style,
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (event.defaultPrevented || !canSwipe) return
        if (!event.isPrimary || isInteractiveSwipeTarget(event.target)) return
        if (!isSwipeEnabledForPointer(swipeable, event)) return

        pointerStartRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
        }
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        const start = pointerStartRef.current
        pointerStartRef.current = null

        if (!start || start.pointerId !== event.pointerId || event.defaultPrevented) return

        const dx = event.clientX - start.x
        const dy = event.clientY - start.y
        const absX = Math.abs(dx)
        const absY = Math.abs(dy)

        if (absX < swipeThreshold || absX < absY * swipeAxisLockRatio) return

        navigateByDelta(dx < 0 ? 1 : -1, event.nativeEvent)
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        if (pointerStartRef.current?.pointerId === event.pointerId) {
          pointerStartRef.current = null
        }
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsPanels, TabsContent, tabsListVariants }
