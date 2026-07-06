import * as React from 'react'

import { cn } from '@/lib/utils'
import { splatoonAssetUrl, type SplatoonAssetBasePath } from './assets'
import styles from './black-tape-container.module.css'

type BlackTapeContainerStyle = React.CSSProperties & {
  '--black-tape-container-left-url'?: string
  '--black-tape-container-right-url'?: string
  '--yellow-tape-container-left-url'?: string
  '--yellow-tape-container-right-url'?: string
}

export interface BlackTapeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  tapeVariant?: 'yellow'
  noVerticalPadding?: boolean
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  ref?: React.Ref<HTMLDivElement>
}

export function BlackTapeContainer({
  ref,
  className,
  children,
  tapeVariant,
  noVerticalPadding = false,
  assetBasePath,
  style,
  ...props
}: BlackTapeContainerProps) {
  return (
    <div
      ref={ref}
      className={cn(
        styles.blackTapeContainer,
        tapeVariant === 'yellow' && styles.tapeYellow,
        noVerticalPadding && styles.noVerticalPadding,
        className
      )}
      style={
        {
          '--black-tape-container-left-url': splatoonAssetUrl(
            'svg/left-black-tape-container.svg',
            assetBasePath
          ),
          '--black-tape-container-right-url': splatoonAssetUrl(
            'svg/right-black-tape-container.svg',
            assetBasePath
          ),
          '--yellow-tape-container-left-url': splatoonAssetUrl(
            'svg/left-yellow-tape-container.svg',
            assetBasePath
          ),
          '--yellow-tape-container-right-url': splatoonAssetUrl(
            'svg/right-yellow-tape-container.svg',
            assetBasePath
          ),
          ...style,
        } as BlackTapeContainerStyle
      }
      {...props}
    >
      <div className={styles.blackTapeContainerInner}>{children}</div>
    </div>
  )
}
