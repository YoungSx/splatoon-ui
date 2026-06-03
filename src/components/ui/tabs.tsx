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
  "group/tabs-list inline-flex w-fit items-center justify-center text-foreground group-data-horizontal/tabs:h-auto group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "gap-3 bg-transparent p-1",
        line: "gap-1 bg-transparent border-b-2 border-chaos-black/10 w-full justify-start rounded-none",
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
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 px-6 py-2.5 text-base font-black uppercase tracking-wider whitespace-nowrap transition-all outline-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none",
        // Default Skew Tab Styling (Parallelogram)
        "skew-x-[-12deg] border-2 border-transparent bg-transparent text-chaos-black/60 dark:text-white/60",
        "data-active:bg-[#eaff3d] data-active:text-[#0d0d0d] data-active:border-[#0d0d0d] data-active:shadow-solid-sm",
        "data-active:active:translate-x-[2px] data-active:active:translate-y-[2px] data-active:active:shadow-none",
        "hover:text-chaos-black hover:scale-[1.02] dark:hover:text-white",
        // Override for Line Variant (No Skew, Clean Text with Underline)
        "group-data-[variant=line]/tabs-list:skew-x-0 group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:shadow-none group-data-[variant=line]/tabs-list:data-active:text-[#603bff] group-data-[variant=line]/tabs-list:hover:text-[#603bff] group-data-[variant=line]/tabs-list:active:translate-x-0 group-data-[variant=line]/tabs-list:active:translate-y-0",
        // Underline animation for line variant
        "after:absolute after:bg-[#603bff] after:opacity-0 after:transition-all group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-2px] group-data-horizontal/tabs:after:h-[3px] group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-[2px] group-data-vertical/tabs:after:w-[3px] group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    >
      {/* Counter-skew children so the text stays upright and readable */}
      <span className="skew-x-[12deg] group-data-[variant=line]/tabs-list:skew-x-0 flex items-center justify-center gap-1.5 w-full h-full">
        {children}
      </span>
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
