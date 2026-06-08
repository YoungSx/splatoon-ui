"use client"

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlobPlayButton } from './blob-play-button'
import { InkSplashCanvas } from './ink-splash-canvas'
import { power3In, getSplatRandomRotation } from '@/lib/wobble-math'
import photoStyles from './styled-photo.module.css'

// ─────────────────────────────────────────────────────────────
// TrailerVideo Context
// ─────────────────────────────────────────────────────────────

interface TrailerVideoContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const TrailerVideoContext = React.createContext<TrailerVideoContextValue | null>(null)

function useTrailerVideoContext() {
  const context = React.useContext(TrailerVideoContext)
  if (!context) {
    throw new Error('useTrailerVideoContext must be used within a TrailerVideo')
  }
  return context
}

// ─────────────────────────────────────────────────────────────
// TrailerVideo Root Component
// ─────────────────────────────────────────────────────────────

interface TrailerVideoProps extends Omit<DialogPrimitive.Root.Props, 'open' | 'onOpenChange'> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TrailerVideo({ children, open: controlledOpen, onOpenChange, ...props }: TrailerVideoProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (newOpen: boolean, event?: any) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({
      open: isOpen,
      setOpen: (val: boolean) => handleOpenChange(val),
      triggerRef,
    }),
    [isOpen, handleOpenChange, triggerRef]
  )

  return (
    <TrailerVideoContext.Provider value={contextValue}>
      <DialogPrimitive.Root
        open={isOpen}
        onOpenChange={(newOpen, event) => handleOpenChange(newOpen, event)}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </TrailerVideoContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────
// Thumbnail Trigger
// ─────────────────────────────────────────────────────────────

interface TrailerVideoThumbnailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string
  alt?: string
  /** Blob color — official default is #6af7ce (green) */
  blobColor?: string
  /** Blob display size in px (official renders at ~40% of container) */
  blobSize?: number
}

export const TrailerVideoThumbnail = React.forwardRef<HTMLButtonElement, TrailerVideoThumbnailProps>(
  ({ src, alt = "Video thumbnail", className, blobColor = "#000000", blobSize = 160, ...props }, ref) => {
    const { triggerRef } = useTrailerVideoContext()

    return (
      <DialogPrimitive.Trigger
        render={(triggerProps) => {
          const { ref: triggerRefCb, ...rest } = triggerProps as { ref?: React.Ref<HTMLButtonElement>; [key: string]: unknown }
          return (
            <button
              ref={(node) => {
                if (typeof triggerRefCb === 'function') triggerRefCb(node)
                else if (triggerRefCb) triggerRefCb.current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
                ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
              }}
              className={cn(
                // Official: inline-block, relative, overflow:visible, padding:0
                'group relative inline-block overflow-visible p-0 cursor-pointer',
                className
              )}
              {...rest}
              {...props}
            >
              {/* ── Play Icon Container ─────────────────────────────
                  Official: pos-absolute, width:var(--blob-size)=40%, z:10,
                  left:50%, margin:10% 0 auto, top:0,
                  transform:translate(-50%, -10%)
              */}
              <div
                className="absolute left-1/2 top-0 z-10 pointer-events-none"
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

              {/* ── Styled Photo Container ──────────────────────────
                  Official uses styled-photo_photoContainer with ::before
                  pseudo-element for torn paper SVG border effect.
                  CSS: --end-rotate:2deg, --margin-offset:6, padding:8px 6px
              */}
              <div
                className={cn(photoStyles.photoContainer, 'border-0')}
                style={{
                  '--end-rotate': '2deg',
                  '--margin-offset': '0',
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

              {/* ── Tape 1 (top-left) ───────────────────────────────
                  Official: absolute, left:-25px, top:-40px, w:133px,
                  transform:rotate(-25deg)
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/_images/tape-assets/tape-2.png"
                alt=""
                className="absolute pointer-events-none"
                style={{
                  left: '-25px',
                  top: '-40px',
                  width: '133px',
                  transform: 'rotate(-25deg)',
                }}
              />

              {/* ── Tape 2 (bottom-right) ───────────────────────────
                  Official: absolute, right:-50px, bottom:10px, w:162px,
                  transform:rotate(-23deg)
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/_images/tape-assets/tape-3.png"
                alt=""
                className="absolute pointer-events-none"
                style={{
                  right: '-50px',
                  bottom: '10px',
                  width: '162px',
                  transform: 'rotate(-23deg)',
                }}
              />
            </button>
          )
        }}
      />
    )
  }
)
TrailerVideoThumbnail.displayName = 'TrailerVideoThumbnail'

// ─────────────────────────────────────────────────────────────
// Animated Content Modal
// ─────────────────────────────────────────────────────────────

interface TrailerVideoContentProps extends Omit<DialogPrimitive.Popup.Props, 'children' | 'style'> {
  videoId: string
  title?: string
}

export const TrailerVideoContent = React.forwardRef<HTMLDivElement, TrailerVideoContentProps>(
  ({ className, videoId, title = "YouTube video player", ...props }, ref) => {
    const { open, triggerRef } = useTrailerVideoContext()

    // ── Animation state machine ─────────────────────────────────────
    // Official modal architecture:
    //   modal_modal__xuQFK (z:10100)
    //   ├─ modal_backdrop__yo7iT (z:1)
    //   │    └─ splat-transition_canvasContainer (z:100)
    //   │         └─ <CANVAS> ← WebGL ink splash shader (SAME as nav overlay)
    //   ├─ modal_close__nC_6v (z:100) — morph blob close button
    //   └─ modal_content__gmrPn (z:2) — video, CSS transition 0.6s 0.5s delay
    //
    // Flow: ink splash "in" → covers screen → video content fades in (delay 0.5s)
    //       close: video fades out → ink splash "out" → unmount
    const [phase, setPhase] = React.useState<'idle' | 'ink-in' | 'open' | 'ink-out'>('idle')
    const [shouldPlayVideo, setShouldPlayVideo] = React.useState(false)
    const [contentVisible, setContentVisible] = React.useState(false)
    const [splashStartPos, setSplashStartPos] = React.useState<[number, number]>([0, 0])
    const videoRef = React.useRef<HTMLDivElement>(null)
    const animFrameRef = React.useRef<number>(0)
    const closeRotateRef = React.useRef(0)
    const splashCountRef = React.useRef(0)

    // ── Phase 1: open → ink-in ──────────────────────────────────────
    React.useEffect(() => {
      if (open && phase === 'idle') {
        splashCountRef.current += 1

        // Calculate ink splash start position from trigger button center
        // Convert viewport coordinates to NDC [-0.5..0.5]
        const btn = triggerRef?.current
        if (btn) {
          const rect = btn.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const ndcX = (cx / window.innerWidth) - 0.5
          const ndcY = 0.5 - (cy / window.innerHeight) // flip Y: screen top=0 → NDC top=+0.5
          setSplashStartPos([ndcX, ndcY])
        }

        setPhase('ink-in')
      }
    }, [open, phase, triggerRef])

    // ── Phase 2: ink-in complete → show video content ───────────────
    const handleInkInComplete = React.useCallback(() => {
      setShouldPlayVideo(true)
      setContentVisible(true)
      setPhase('open')
    }, [])

    // ── Close handler ───────────────────────────────────────────────
    // Official GSAP: scale:0.7, yPercent:100, rotate:random, opacity:0, power3.in, 700ms
    const handleClose = React.useCallback(() => {
      if (phase !== 'open') return
      cancelAnimationFrame(animFrameRef.current)
      closeRotateRef.current = getSplatRandomRotation()
      const videoEl = videoRef.current

      if (videoEl) {
        const duration = 700
        const startTime = performance.now()
        const animate = (now: number) => {
          const elapsed = now - startTime
          const rawT = Math.min(elapsed / duration, 1)
          const t = power3In(rawT)

          const scale = 1 + t * (0.7 - 1)
          const yPercent = t * 100
          const rotate = t * closeRotateRef.current
          const opacity = 1 - t

          videoEl.style.transform = `translateY(${yPercent}%) scale(${scale}) rotate(${rotate}deg)`
          videoEl.style.opacity = String(opacity)

          if (rawT < 1) {
            animFrameRef.current = requestAnimationFrame(animate)
          } else {
            setContentVisible(false)
            setShouldPlayVideo(false)
            splashCountRef.current += 1
            setPhase('ink-out')
          }
        }
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        setContentVisible(false)
        setShouldPlayVideo(false)
        splashCountRef.current += 1
        setPhase('ink-out')
      }
    }, [phase])

    // ── Phase 4: ink-out complete → unmount ─────────────────────────
    const handleInkOutComplete = React.useCallback(() => {
      setPhase('idle')
    }, [])

    // Cleanup
    React.useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

    // Sync with Dialog open state
    React.useEffect(() => {
      if (!open && phase === 'open') {
        handleClose()
      }
    }, [open, phase, handleClose])

    const isInkActive = phase === 'ink-in' || phase === 'ink-out'
    const isModalMounted = phase !== 'idle'
    // Canvas state: 'in' keeps the filled ink after splash completes, 'idle' resets to empty
    const canvasState = phase === 'ink-out' ? 'out' as const : phase === 'idle' ? 'idle' as const : 'in' as const

    return (
      <DialogPrimitive.Portal keepMounted>
        {/* ── WebGL Ink Splash Canvas ────────────────────────────────
            Official: canvas stays visible for the ENTIRE modal lifetime.
            It's the background — ink covers screen, then stays as backdrop.
        */}
        {isModalMounted && (
          <InkSplashCanvas
            className="fixed inset-0 z-[100] pointer-events-none"
            state={canvasState}
            durationIn={700}
            durationOut={700}
            color="#000000"
            background="/_images/backgrounds/camo-black-2x.webp"
            count={splashCountRef.current}
            startPosition={splashStartPos}
            onComplete={phase === 'ink-in' ? handleInkInComplete : handleInkOutComplete}
          />
        )}

        {/* ── Backdrop — official: transparent, canvas IS the background */}
        {isModalMounted && (
          <DialogPrimitive.Backdrop
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'transparent' }}
          />
        )}

        {/* ── Video Content ────────────────────────────────────────── */}
        {isModalMounted && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
            <div
              ref={(node) => {
                videoRef.current = node
                if (typeof ref === 'function') ref(node as HTMLDivElement)
                else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement
              }}
              className={cn(
                "relative w-full max-w-[1000px] overflow-visible outline-none pointer-events-auto",
                className
              )}
              style={{
                transformOrigin: 'center center',
                // Official: CSS transition for content entry
                // transform 0.6s, opacity 0.6s, delay 0.5s
                transform: contentVisible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(20%)',
                opacity: contentVisible ? 1 : 0,
                transitionProperty: 'transform, opacity',
                transitionDuration: '0.6s',
                transitionTimingFunction: 'cubic-bezier(0.21, 0.12, 0.35, 1.43)',
                transitionDelay: contentVisible ? '0.5s' : '0s',
              }}
              {...props}
            >
              <div
                className="relative w-full overflow-hidden bg-black border-4 border-white dark:border-[#1a1a1a]"
                style={{ paddingBottom: '56.25%' }}
              >
                {shouldPlayVideo && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Close Button ───────────────────────────────────────────
            Official: opacity:var(--alpha), transform:translateX(calc(200%*(1-var(--alpha)))) scale(var(--scale))
            transition: 0.3s ease-back-out, delay 0.5s
        */}
        {isModalMounted && (
          <DialogPrimitive.Close
            className="fixed z-[120] p-3 sm:p-5 rounded-full bg-yellow-400 border-2 border-[#603bff] right-4 top-5 sm:right-8 sm:top-8 hover:scale-110"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: `translateX(${contentVisible ? '0' : '200%'}) scale(1)`,
              transitionProperty: 'transform, opacity',
              transitionDuration: '0.3s',
              transitionTimingFunction: 'cubic-bezier(0.21, 0.12, 0.35, 1.43)',
              transitionDelay: contentVisible ? '0.5s' : '0s',
              borderRadius: '40% 60% 70% 30% / 40% 40% 60% 50%',
            }}
            onClick={handleClose}
          >
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] text-[#603bff]" />
            <span className="sr-only">Close video</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Portal>
    )
  }
)
TrailerVideoContent.displayName = 'TrailerVideoContent'
