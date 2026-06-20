"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "./button"
import styles from "./button-group.module.css"

type ButtonGroupOrientation = "horizontal" | "vertical"
type ButtonGroupDensity = "compact" | "default" | "spacious"

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: ButtonGroupDensity
  fullWidth?: boolean
  orientation?: ButtonGroupOrientation
}

function ButtonGroup({
  ref,
  className,
  density = "default",
  fullWidth = false,
  orientation = "horizontal",
  role = "group",
  ...props
}: ButtonGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role={role}
      data-slot="button-group"
      data-density={density}
      data-full-width={fullWidth ? "true" : undefined}
      data-orientation={orientation}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export type ButtonGroupItemProps = ButtonProps

function ButtonGroupItem({
  ref,
  className,
  hasChevron = false,
  ...props
}: ButtonGroupItemProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <Button
      ref={ref}
      data-slot="button-group-item"
      className={cn(styles.item, className)}
      hasChevron={hasChevron}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupItem }
