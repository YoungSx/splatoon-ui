"use client"

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { BlobPlayButton } from './blob-play-button'
import photoStyles from './styled-photo.module.css'
import tapeStyles from './video-dialog.module.css'

// ── VideoDialog Root (thin wrapper around Dialog) ──

interface VideoDialogProps extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {
  children?: React.ReactNode
}

export function VideoDialog({ children, ...props }: VideoDialogProps) {
  return <Dialog {...props}>{children}</Dialog>
}

// ── Thumbnail Trigger ──

interface VideoDialogThumbnailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string
  alt?: string
  blobColor?: string
  blobSize?: number
  imageClassName?: string
}

export function VideoDialogThumbnail({
  ref,
  src,
  alt = "Video thumbnail",
  className,
  blobColor = "#000000",
  blobSize = 160,
  imageClassName,
  ...props
}: VideoDialogThumbnailProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={(triggerProps) => {
        const { ref: triggerRefCb, ...rest } = triggerProps as { ref?: React.Ref<HTMLButtonElement>; [key: string]: unknown }
        return (
          <button
            ref={(node) => {
              if (typeof triggerRefCb === 'function') triggerRefCb(node)
              else if (triggerRefCb) triggerRefCb.current = node
              if (typeof ref === 'function') ref(node)
              else if (ref) ref.current = node
            }}
            className={cn(
              'group relative inline-block overflow-visible p-0 cursor-pointer',
              className
            )}
            {...rest}
            {...props}
          >
            <div
              className="absolute left-1/2 top-0 z-10 pointer-events-none sm:!mt-0 lg:!mt-[10%]"
              style={{
                width: '40%',
                margin: '10% 0 auto',
                transform: 'translate(-50%, -10%)',
              }}
            >
              <BlobPlayButton
                hexColor={blobColor}
                blobSize={blobSize}
                className="pointer-events-auto shadow-none"
                tabIndex={-1}
              />
            </div>

            <div
              className={cn(photoStyles.photoContainer, 'border-0 relative', imageClassName)}
              style={{
                '--end-rotate': '2deg',
                '--margin-offset': '0',
                marginTop: 0,
              } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className={photoStyles.photo}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <picture>
              <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-2-medium-up.webp 1x, /_images/tape-assets/tape-2-medium-up-2x.webp 2x" type="image/webp" />
              <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-2-medium-up.png 1x, /_images/tape-assets/tape-2-medium-up-2x.png 2x" type="image/png" />
              <source srcSet="/_images/tape-assets/tape-2.webp 1x, /_images/tape-assets/tape-2-2x.webp 2x" type="image/webp" />
              <source srcSet="/_images/tape-assets/tape-2.png 1x, /_images/tape-assets/tape-2-2x.png 2x" type="image/png" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/_images/tape-assets/tape-2.png" alt="" className={tapeStyles.tape1} />
            </picture>

            <picture>
              <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-3-medium-up.webp 1x, /_images/tape-assets/tape-3-medium-up-2x.webp 2x" type="image/webp" />
              <source media="(min-width: 640px)" srcSet="/_images/tape-assets/tape-3-medium-up.png 1x, /_images/tape-assets/tape-3-medium-up-2x.png 2x" type="image/png" />
              <source srcSet="/_images/tape-assets/tape-3.webp 1x, /_images/tape-assets/tape-3-2x.webp 2x" type="image/webp" />
              <source srcSet="/_images/tape-assets/tape-3.png 1x, /_images/tape-assets/tape-3-2x.png 2x" type="image/png" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/_images/tape-assets/tape-3.png" alt="" className={tapeStyles.tape2} />
            </picture>
          </button>
        )
      }}
    />
  )
}

// ── Video Content (thin wrapper around DialogContent fullScreen) ──

interface VideoDialogContentProps {
  src: string
  title?: string
  className?: string
}

export function VideoDialogContent({
  src,
  title = "Video player",
  className,
}: VideoDialogContentProps) {
  return (
    <DialogContent fullScreen className={className}>
      <div
        className="relative w-full overflow-hidden bg-black border-4 border-white"
        style={{ paddingBottom: '56.25%' }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={src}
          title={title}
          scrolling="no"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </DialogContent>
  )
}
