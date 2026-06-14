import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./card-grid.module.css"

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function CardGrid({ className, children, ...props }: CardGridProps) {
  return (
    <div className={cn(styles.cardGrid, className)} {...props}>
      {children}
    </div>
  )
}

export interface CardGridGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function CardGridGroup({ className, children, ...props }: CardGridGroupProps) {
  return (
    <div className={cn(styles.cardGridGroup, className)} {...props}>
      {children}
    </div>
  )
}
