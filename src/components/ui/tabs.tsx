"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./tabs.module.css"

const TRAPEZOID_TABS_TEXTURE_SCALE = 1.2

type TabsListVariant = "default" | "line" | "trapezoid"

type TrapezoidTabsStyle = React.CSSProperties & {
  "--trapezoid-tabs-bg-size-x"?: string
  "--trapezoid-tabs-bg-x"?: string
  "--trapezoid-tabs-count"?: number
  "--trapezoid-tabs-index"?: number
}

const TabsListVariantContext = React.createContext<TabsListVariant>("default")

function isStyleableElement(
  child: React.ReactNode
): child is React.ReactElement<{ style?: React.CSSProperties }> {
  return React.isValidElement(child) && child.type !== React.Fragment
}

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list flex items-center justify-center text-current group-data-horizontal/tabs:h-auto group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "flex-row justify-start pb-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory sm:snap-none sm:justify-center sm:overflow-visible scrollbar-hide",
        line: "gap-1 bg-transparent border-b-2 border-current/10 w-full justify-start rounded-none",
        trapezoid: styles.trapezoidList,
      },
      color: {
        yellow: "",
        blue: "",
        green: "",
        orange: "",
        red: "",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "blue",
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
      triggerCount > 1 && textureSpan > 0
        ? `${(index / textureSpan) * 100}%`
        : "50%"
    const style: TrapezoidTabsStyle = {
      ...child.props.style,
      "--trapezoid-tabs-bg-size-x": `${triggerCount * TRAPEZOID_TABS_TEXTURE_SCALE * 100}%`,
      "--trapezoid-tabs-bg-x": backgroundX,
      "--trapezoid-tabs-count": triggerCount,
      "--trapezoid-tabs-index": index,
    }

    return React.cloneElement(child, { style })
  })
}

function TabsList({
  className,
  children,
  variant = "default",
  color = "blue",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const resolvedVariant = variant ?? "default"
  const resolvedChildren =
    resolvedVariant === "trapezoid" ? withTrapezoidTabsTriggerVars(children) : children

  return (
    <TabsListVariantContext.Provider value={resolvedVariant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={resolvedVariant}
        data-color={color}
        className={cn(tabsListVariants({ variant: resolvedVariant, color }), className)}
        {...props}
      >
        {resolvedChildren}
      </TabsPrimitive.List>
    </TabsListVariantContext.Provider>
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  const listVariant = React.useContext(TabsListVariantContext)
  const isTrapezoid = listVariant === "trapezoid"

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative cursor-pointer select-none outline-none snap-start shrink-0",
        "font-alt text-lg sm:text-[2.3125rem] font-bold uppercase leading-none",
        "transition-colors",
        // Default variant touch target and scroll sizing.
        "group-data-[variant=default]/tabs-list:min-h-11 group-data-[variant=default]/tabs-list:min-w-16 group-data-[variant=default]/tabs-list:px-3 group-data-[variant=default]/tabs-list:py-2",
        // Active color — resolved by parent TabsList data-color
        "group-data-[color=yellow]/tabs-list:data-active:text-yellow",
        "group-data-[color=blue]/tabs-list:data-active:text-blue",
        "group-data-[color=green]/tabs-list:data-active:text-green",
        "group-data-[color=orange]/tabs-list:data-active:text-orange",
        "group-data-[color=red]/tabs-list:data-active:text-red",
        "tab-splat",
        // Underline
        "before:absolute before:inset-x-0 before:bottom-[-2px] before:h-[3px] before:opacity-0 before:transition-all before:pointer-events-none",
        "group-data-[color=yellow]/tabs-list:before:bg-yellow",
        "group-data-[color=blue]/tabs-list:before:bg-blue",
        "group-data-[color=green]/tabs-list:before:bg-green",
        "group-data-[color=orange]/tabs-list:before:bg-orange",
        "group-data-[color=red]/tabs-list:before:bg-red",
        // Line variant overrides
        "group-data-[variant=line]/tabs-list:font-heading group-data-[variant=line]/tabs-list:text-base group-data-[variant=line]/tabs-list:tracking-wider",
        "group-data-[variant=line]/tabs-list:text-current/60",
        "group-data-[variant=line]/tabs-list:data-active:text-blue group-data-[variant=line]/tabs-list:hover:text-blue",
        "group-data-[variant=line]/tabs-list:data-active:before:opacity-100",
        // Vertical line variant
        "group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:inset-x-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:-right-[2px] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:w-[3px] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:h-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:inset-y-0",
        styles.trigger,
        className
      )}
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
            <path
              className={styles.trapezoidHighlight}
              d="M2 101L8 23C10 9 17 1 31 1H314"
            />
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
      <span className={cn("relative z-[var(--z-deco-fg)]", styles.label)}>{children}</span>
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
