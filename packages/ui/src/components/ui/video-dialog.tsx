'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { BlobPlayButton } from './blob-play-button'
import { MediaDecoration } from './media-decoration'
import photoStyles from './photo-frame.module.css'
import tapeStyles from './video-dialog.module.css'

// ── VideoDialog Root (thin wrapper around Dialog) ──

export interface VideoDialogProps extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {
  children?: React.ReactNode
}

export function VideoDialog({ children, ...props }: VideoDialogProps) {
  return <Dialog {...props}>{children}</Dialog>
}

// ── Thumbnail Trigger ──

export interface VideoDialogThumbnailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string
  alt?: string
  width?: number
  height?: number
  srcSet?: string
  sizes?: string
  blobColor?: string
  blobSize?: number
  imageClassName?: string
  loading?: React.ComponentProps<'img'>['loading']
}

export function VideoDialogThumbnail({
  ref,
  src,
  alt = 'Video thumbnail',
  width,
  height,
  srcSet,
  sizes,
  className,
  blobColor = 'var(--color-true-black)',
  blobSize = 160,
  imageClassName,
  loading = 'lazy',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: VideoDialogThumbnailProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const resolvedAriaLabel = ariaLabel ?? (ariaLabelledBy ? undefined : `Open video: ${alt}`)

  return (
    <DialogTrigger
      render={(triggerProps) => {
        const { ref: triggerRefCb, ...rest } = triggerProps as {
          ref?: React.Ref<HTMLButtonElement>
          [key: string]: unknown
        }
        return (
          <button
            type="button"
            ref={(node) => {
              if (typeof triggerRefCb === 'function') triggerRefCb(node)
              else if (triggerRefCb) triggerRefCb.current = node
              if (typeof ref === 'function') ref(node)
              else if (ref) ref.current = node
            }}
            className={cn(
              tapeStyles.thumbnailTrigger,
              'group relative block w-full cursor-pointer overflow-visible p-0',
              className
            )}
            {...rest}
            {...props}
            aria-label={resolvedAriaLabel}
            aria-labelledby={ariaLabelledBy}
          >
            <div
              className="pointer-events-none absolute top-0 left-1/2 z-10 sm:!mt-0 lg:!mt-[10%]"
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
              className={cn(
                photoStyles.photoFrame,
                photoStyles.noContainer,
                photoStyles.fillWidth,
                'relative border-0',
                imageClassName
              )}
              style={
                {
                  '--end-rotate': '2deg',
                  '--margin-offset': '0',
                  marginTop: 0,
                } as React.CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- component accepts arbitrary thumbnail sources */}
              <img
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                decoding="async"
                loading={loading}
                className={photoStyles.photo}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <MediaDecoration
              asset="tape-2"
              className={tapeStyles.tape1}
              mobilePictureClassName={tapeStyles.tapeMobile}
              desktopPictureClassName={tapeStyles.tapeDesktop}
              imageClassName={tapeStyles.tapeImage}
            />
            <MediaDecoration
              asset="tape-3"
              className={tapeStyles.tape2}
              mobilePictureClassName={tapeStyles.tapeMobile}
              desktopPictureClassName={tapeStyles.tapeDesktop}
              imageClassName={tapeStyles.tapeImage}
            />
          </button>
        )
      }}
    />
  )
}

// ── Video Content (thin wrapper around DialogContent fullScreen) ──

export type VideoDialogContentMode = 'iframe' | 'video'

export interface VideoDialogVideoSource {
  src: string
  type?: string
}

export interface VideoDialogTrack {
  src: string
  kind?: React.ComponentProps<'track'>['kind']
  srcLang?: string
  label?: string
  default?: boolean
}

export interface VideoDialogContentProps {
  src: string
  title?: string
  className?: string
  mode?: VideoDialogContentMode
  sources?: VideoDialogVideoSource[]
  tracks?: VideoDialogTrack[]
  poster?: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  preload?: React.ComponentProps<'video'>['preload']
}

export function VideoDialogContent({
  src,
  title = 'Video player',
  className,
  mode = 'iframe',
  sources,
  tracks,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  playsInline = true,
  preload = 'none',
}: VideoDialogContentProps) {
  const resolvedSources = sources?.length ? sources : [{ src }]

  return (
    <DialogContent fullScreen className={className}>
      <div
        className="relative w-full overflow-hidden border-4 border-white bg-black"
        style={{ paddingBottom: '56.25%' }}
      >
        {mode === 'video' ? (
          <video
            className="absolute top-0 left-0 h-full w-full"
            poster={poster}
            title={title}
            autoPlay={autoPlay}
            controls={controls}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            preload={preload}
          >
            {resolvedSources.map((source) => (
              <source
                key={`${source.src}-${source.type ?? 'auto'}`}
                src={source.src}
                type={source.type}
              />
            ))}
            {tracks?.map((track) => (
              <track
                key={`${track.src}-${track.srcLang ?? 'und'}-${track.label ?? 'track'}`}
                src={track.src}
                kind={track.kind}
                srcLang={track.srcLang}
                label={track.label}
                default={track.default}
              />
            ))}
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={src}
            title={title}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </div>
    </DialogContent>
  )
}
