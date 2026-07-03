import * as React from 'react'

import { cn } from '@/lib/utils'
import styles from './button-arrow.module.css'

type ButtonArrowOwnProps = {
  icon?: React.ReactNode
}

export type ButtonArrowAnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> &
  ButtonArrowOwnProps & {
    href: string
  }

export type ButtonArrowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonArrowOwnProps & {
    href?: undefined
  }

export type ButtonArrowProps = ButtonArrowAnchorProps | ButtonArrowButtonProps

function isButtonArrowAnchorProps(props: ButtonArrowProps): props is ButtonArrowAnchorProps {
  return typeof props.href === 'string'
}

function omitIconProp<T extends ButtonArrowOwnProps>(props: T): Omit<T, 'icon'> {
  const next = { ...props }
  delete next.icon

  return next
}

function omitButtonOnlyProps(
  props: ButtonArrowButtonProps
): Omit<ButtonArrowButtonProps, 'href' | 'icon'> {
  const next = omitIconProp(props)
  delete next.href

  return next
}

export function ButtonArrow(props: ButtonArrowProps) {
  const { icon } = props
  const iconNode = icon ?? (
    <svg viewBox="0 0 10 16" className={styles.icon} aria-hidden="true" focusable="false">
      <path
        d="M1 1 L9 8 L1 15"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  if (isButtonArrowAnchorProps(props)) {
    const { href, className, children, ...anchorProps } = omitIconProp(props)

    return (
      <a className={cn(styles.buttonArrow, className)} href={href} {...anchorProps}>
        {children}
        <span className={styles.iconWrap}>{iconNode}</span>
      </a>
    )
  }

  const { className, children, type = 'button', ...buttonProps } = omitButtonOnlyProps(props)

  return (
    <button className={cn(styles.buttonArrow, className)} type={type} {...buttonProps}>
      {children}
      <span className={styles.iconWrap}>{iconNode}</span>
    </button>
  )
}
