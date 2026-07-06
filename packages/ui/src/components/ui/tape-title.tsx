import * as React from 'react'
import { cn } from '@/lib/utils'
import { splatoonAssetUrl, type SplatoonAssetBasePath } from './assets'
import styles from './tape-title.module.css'

type TapeTitleStyle = React.CSSProperties & {
  '--tape-title-left-url'?: string
  '--tape-title-right-url'?: string
}

export interface TapeTitleProps extends Omit<React.ComponentProps<'div'>, 'color' | 'ref'> {
  color?: 'black' | 'red' | 'yellow'
  children: React.ReactNode
  /** Base URL for packaged Splatoon UI image assets. Defaults to "/_images". */
  assetBasePath?: SplatoonAssetBasePath
  ref?: React.Ref<HTMLDivElement>
}

export function TapeTitle({
  ref,
  color = 'black',
  className,
  children,
  assetBasePath,
  style,
  ...props
}: TapeTitleProps) {
  return (
    <div
      ref={ref}
      className={cn(
        styles.container,
        color === 'red' && styles.red,
        color === 'yellow' && styles.yellow,
        className
      )}
      style={
        {
          '--tape-title-left-url': splatoonAssetUrl('svg/left-tape.svg', assetBasePath),
          '--tape-title-right-url': splatoonAssetUrl('svg/right-tape.svg', assetBasePath),
          ...style,
        } as TapeTitleStyle
      }
      {...props}
    >
      <h2 className={styles.title}>{children}</h2>
    </div>
  )
}
