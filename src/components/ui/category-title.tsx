import * as React from 'react'
import { cn } from '@/lib/utils'
import styles from './category-title.module.css'

export interface CategoryTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  stickerLeft?: React.ReactNode
  /** Optional "ポイント" (points) badge content */
  points?: React.ReactNode
}

export function CategoryTitle({
  children,
  className,
  stickerLeft,
  points,
  ...props
}: CategoryTitleProps) {
  return (
    <div className={cn(styles.container, className)} {...props}>
      {stickerLeft && (
        <div className={styles.stickers}>
          <div className={styles.sticker1}>{stickerLeft}</div>
        </div>
      )}
      <div className={styles.text}>
        {children}
        {points && <span className={styles.points}>{points}</span>}
      </div>
    </div>
  )
}
