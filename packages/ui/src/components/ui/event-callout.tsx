import * as React from 'react'

import { cn } from '@/lib/utils'
import type { SplatoonAssetBasePath } from './assets'
import { AssetImage } from './asset-image'
import { Badge } from './badge'
import { createEventImageAssets, type EventImageAsset } from './event-assets'
import styles from './event-callout.module.css'

export interface EventCalloutProps extends Omit<
  React.ComponentProps<'article'>,
  'children' | 'ref' | 'title'
> {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  media?: EventImageAsset
  background?: EventImageAsset
  icon?: EventImageAsset
  action?: React.ReactNode
  mediaPriority?: boolean
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  ref?: React.Ref<HTMLElement>
}

export function EventCallout({
  ref,
  className,
  eyebrow,
  title,
  description,
  media,
  background,
  icon,
  action,
  mediaPriority = false,
  assetBasePath,
  ...props
}: EventCalloutProps) {
  const eventAssets = createEventImageAssets(assetBasePath)
  const resolvedMedia = media ?? eventAssets.bigRunCallout
  const resolvedBackground = background ?? eventAssets.splatnetNextPage
  const resolvedIcon = icon ?? eventAssets.goldenEgg

  return (
    <article ref={ref} className={cn(styles.callout, className)} {...props}>
      <AssetImage
        asset={resolvedBackground}
        className={styles.background}
        loading="lazy"
        decorative
      />
      <div className={styles.content}>
        <div className={styles.mediaFrame}>
          <AssetImage
            asset={resolvedMedia}
            className={styles.media}
            loading={mediaPriority ? 'eager' : 'lazy'}
          />
          <span className={styles.iconBadge} aria-hidden="true">
            <AssetImage asset={resolvedIcon} loading="lazy" decorative />
          </span>
        </div>

        <div className={styles.body}>
          {eyebrow && (
            <Badge color="yellow" className={styles.eyebrow}>
              {eyebrow}
            </Badge>
          )}
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      </div>
    </article>
  )
}
