import * as React from 'react'

import { cn } from '@/lib/utils'
import { eventImageAssets, type EventImageAsset } from './event-assets'
import styles from './event-callout.module.css'

export interface EventCalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  media?: EventImageAsset
  background?: EventImageAsset
  icon?: EventImageAsset
  action?: React.ReactNode
  mediaPriority?: boolean
}

export function EventCallout({
  className,
  eyebrow,
  title,
  description,
  media = eventImageAssets.bigRunCallout,
  background = eventImageAssets.splatnetNextPage,
  icon = eventImageAssets.goldenEgg,
  action,
  mediaPriority = false,
  ...props
}: EventCalloutProps) {
  return (
    <article className={cn(styles.callout, className)} {...props}>
      {/* eslint-disable-next-line @next/next/no-img-element -- curated public event artwork is rendered at fixed intrinsic dimensions. */}
      <img
        className={styles.background}
        src={background.src}
        alt=""
        width={background.width}
        height={background.height}
        loading="lazy"
        aria-hidden="true"
        draggable={false}
      />
      <div className={styles.content}>
        <div className={styles.mediaFrame}>
          {/* eslint-disable-next-line @next/next/no-img-element -- component accepts curated public event artwork with known dimensions. */}
          <img
            className={styles.media}
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading={mediaPriority ? 'eager' : 'lazy'}
            draggable={false}
          />
          <span className={styles.iconBadge} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative badge uses the original public PNG. */}
            <img
              src={icon.src}
              alt=""
              width={icon.width}
              height={icon.height}
              loading="lazy"
              draggable={false}
            />
          </span>
        </div>

        <div className={styles.body}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      </div>
    </article>
  )
}
