'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from './button'
import styles from './button-group.module.css'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'
export type ButtonGroupDensity = 'compact' | 'default' | 'spacious'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: ButtonGroupDensity
  fullWidth?: boolean
  orientation?: ButtonGroupOrientation
  ref?: React.Ref<HTMLDivElement>
}

function ButtonGroup({
  ref,
  className,
  density = 'default',
  fullWidth = false,
  orientation = 'horizontal',
  role = 'group',
  ...props
}: ButtonGroupProps) {
  return (
    <div
      ref={ref}
      role={role}
      data-slot="button-group"
      data-density={density}
      data-full-width={fullWidth ? 'true' : undefined}
      data-orientation={orientation}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export type ButtonGroupItemProps = ButtonProps

function ButtonGroupItem({ ref, className, hasChevron = false, ...props }: ButtonGroupItemProps) {
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
