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
  "group/tabs-list inline-flex w-fit items-center justify-center text-current group-data-horizontal/tabs:h-auto group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "flex-row justify-center pb-8 w-full",
        line: "gap-1 bg-transparent border-b-2 border-current/10 w-full justify-start rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative cursor-pointer select-none outline-none",
        "font-alt text-[2.3125rem] font-bold uppercase leading-none",
        "text-current/60 transition-colors data-active:text-[#eaff3d]",
        "hover:text-current tab-splat",
        "before:absolute before:inset-x-0 before:bottom-[-2px] before:h-[3px] before:bg-[#603bff] before:opacity-0 before:transition-all before:pointer-events-none",
        "group-data-[variant=line]/tabs-list:font-heading group-data-[variant=line]/tabs-list:text-base group-data-[variant=line]/tabs-list:tracking-wider",
        "group-data-[variant=line]/tabs-list:text-current/60 group-data-[variant=line]/tabs-list:data-active:text-[#603bff] group-data-[variant=line]/tabs-list:hover:text-[#603bff]",
        "group-data-[variant=line]/tabs-list:data-active:before:opacity-100",
        "group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:inset-x-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:-right-[2px] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:w-[3px] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:h-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:before:inset-y-0",
        className
      )}
      {...props}
    >
      <span className="relative z-[2]">{children}</span>
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
