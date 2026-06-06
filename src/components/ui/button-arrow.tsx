import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./button-arrow.module.css"

type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>

export interface ButtonArrowProps extends Omit<AnchorButtonProps, "type"> {
  icon?: React.ReactNode
  href?: string
}

export function ButtonArrow({ icon, href, className, children, ...props }: ButtonArrowProps) {
  const iconNode = icon ?? (
    <svg viewBox="0 0 10 16" className={styles.icon} aria-hidden="true" focusable="false">
      <path d="M1 1 L9 8 L1 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  if (href) {
    return (
      <a className={cn(styles.buttonArrow, className)} href={href} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
        <span className={styles.iconWrap}>{iconNode}</span>
      </a>
    )
  }

  return (
    <button className={cn(styles.buttonArrow, className)} type="button" {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      <span className={styles.iconWrap}>{iconNode}</span>
    </button>
  )
}
