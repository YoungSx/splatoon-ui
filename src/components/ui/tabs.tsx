"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

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
        default: "flex-row pb-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory sm:snap-none sm:justify-center sm:overflow-visible scrollbar-hide",
        line: "gap-1 bg-transparent border-b-2 border-current/10 w-full justify-start rounded-none",
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

function TabsList({
  className,
  variant = "default",
  color = "blue",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-color={color}
      className={cn(tabsListVariants({ variant, color }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative cursor-pointer select-none outline-none snap-start shrink-0",
        "font-alt text-lg sm:text-[2.3125rem] font-bold uppercase leading-none",
        "transition-colors",
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
        className
      )}
      {...props}
    >
      <span className="relative z-[var(--z-deco-fg)]">{children}</span>
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
