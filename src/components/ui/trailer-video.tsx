"use client"

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'
import { BlobPlayButton } from './blob-play-button'
import { InkSplashCanvas } from './ink-splash-canvas'
import { power3In } from '@/lib/wobble-math'
import navStyles from '@/components/ui/nav-menu-button.module.css'
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
  /** Blob color — official default is #00c8b4 (green) */
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
    const { open, setOpen, triggerRef } = useTrailerVideoContext()

    // ── State (matches official exactly) ───────────────────────────
    // Official: P(modalActive), M(modalHeadingOut), Y(splatState)
    const [modalActive, setModalActive] = React.useState(false)
    const [modalHeadingOut, setModalHeadingOut] = React.useState(false)
    const [splatState, setSplatState] = React.useState<'ready' | 'in' | 'out'>('ready')
    const [splashStartPos, setSplashStartPos] = React.useState<[number, number]>([0, 0])
    const videoRef = React.useRef<HTMLDivElement>(null)
    const animFrameRef = React.useRef<number>(0)
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
    const splashCountRef = React.useRef(Math.round(10000 * Math.random()))
    const preloadedBgRef = React.useRef<HTMLImageElement | null>(null)

    // ── Preload ink splash background on mount ─────────────────
    // Avoids first-play flash where shader falls back to solid color
    React.useEffect(() => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => { preloadedBgRef.current = img }
      img.src = '/_images/backgrounds/camo-black-2x.webp'
    }, [])

    // ── Constants (matches official defaults) ──────────────────────
    const CLOSE_DELAY = 1200  // official default closeDelay
    const DURATION_IN = 700   // official default durationIn
    const DURATION_OUT = CLOSE_DELAY - 200  // official: durationOut = closeDelay - 200

    const isModalMounted = open || modalActive || modalHeadingOut

    // ── Close handler (matches official W callback) ────────────────
    // Official: onCloseStarted → splatState='out' + modalHeadingOut=true
    //           → setTimeout(closeDelay) → onClose + toggleFunction(false)
    const handleClose = React.useCallback(() => {
      if (!modalActive || modalHeadingOut) return

      setSplatState('out')
      setModalHeadingOut(true)
      splashCountRef.current += 1

      try { triggerRef?.current?.focus() } catch (_) { /* */ }

      // GSAP content exit — matches official:
      // .to(el, { duration: .7, ease: 'power3.in', yPercent: 100,
      //          scale: .7, rotate: random(10-30deg), opacity: 0 })
      const videoEl = videoRef.current
      if (videoEl) {
        const duration = 700
        const rotate = (Math.random() > 0.5 ? 1 : -1) * (20 + 10 * Math.random())
        const startTime = performance.now()
        const animate = (now: number) => {
          const elapsed = now - startTime
          const rawT = Math.min(elapsed / duration, 1)
          const t = power3In(rawT)

          videoEl.style.transform = `translateY(${t * 100}%) scale(${1 + t * (0.7 - 1)}) rotate(${t * rotate}deg)`
          videoEl.style.opacity = String(1 - t)

          if (rawT < 1) {
            animFrameRef.current = requestAnimationFrame(animate)
          }
        }
        animFrameRef.current = requestAnimationFrame(animate)
      }

      closeTimerRef.current = setTimeout(() => {
        cancelAnimationFrame(animFrameRef.current)
        setModalActive(false)
        setModalHeadingOut(false)
        setSplatState('ready')
        setOpen(false)
      }, CLOSE_DELAY)
    }, [modalActive, modalHeadingOut, setOpen, triggerRef])

    // ── Open effect (matches official mount useEffect) ─────────────
    // Official: setTimeout(100) → modalActive=true + splatState='in'
    React.useEffect(() => {
      if (!open) return

      splashCountRef.current += 1

      const btn = triggerRef?.current
      if (btn) {
        const rect = btn.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        setSplashStartPos([(cx / window.innerWidth) - 0.5, 0.5 - (cy / window.innerHeight)])
      }

      const timer = setTimeout(() => {
        setModalActive(true)
        setSplatState('in')
      }, 100)

      return () => clearTimeout(timer)
    }, [open, triggerRef])

    // ── Sync with Dialog open state (handle external close) ────────
    React.useEffect(() => {
      if (!open && modalActive && !modalHeadingOut) {
        handleClose()
      }
    }, [open, modalActive, modalHeadingOut, handleClose])

    // ── Cleanup ────────────────────────────────────────────────────
    React.useEffect(() => () => {
      clearTimeout(closeTimerRef.current)
      cancelAnimationFrame(animFrameRef.current)
    }, [])

    // ── Derived state ──────────────────────────────────────────────
    const canvasState = splatState === 'out' ? 'out' as const
      : splatState === 'ready' ? 'idle' as const
      : 'in' as const

    return (
      <DialogPrimitive.Portal keepMounted>
        {/* ── WebGL Ink Splash Canvas ────────────────────────────────
            Official: canvas inside backdrop, z:100 within backdrop.
        */}
        {isModalMounted && (
          <InkSplashCanvas
            className="fixed inset-0 z-[100] pointer-events-none"
            state={canvasState}
            durationIn={DURATION_IN}
            durationOut={DURATION_OUT}
            color="#00c8b4"
            background="/_images/backgrounds/camo-black-2x.webp"
            preloadedBackground={preloadedBgRef.current}
            count={splashCountRef.current}
            startPosition={splashStartPos}
          />
        )}

        {/* ── Backdrop — transparent; ink splash canvas at z-100 IS the visual overlay */}
        {isModalMounted && (
          <DialogPrimitive.Backdrop
            className="fixed inset-0 z-50"
            onClick={handleClose}
          />
        )}

        {/* ── Video Content — always mounted when modal is in DOM ────
            Official: CSS class modalActive drives visibility.
            No conditional rendering, no shouldPlayVideo.
        */}
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
                // Entry: CSS transition (matches official --duration:0.6s, --content-delay:0.5s)
                // Exit:  GSAP animation via inline styles (overrides CSS transition)
                transform: modalActive
                  ? 'scale(1) translateY(0)'
                  : 'scale(0.7) translateY(20%)',
                opacity: modalActive ? 1 : 0,
                ...(modalHeadingOut ? {} : {
                  transitionProperty: 'transform, opacity',
                  transitionDuration: '0.6s',
                  // Official content uses CSS 'ease' (cubic-bezier(0.25, 0.1, 0.25, 1))
                  transitionTimingFunction: 'ease',
                  transitionDelay: '0.5s',
                }),
              }}
              {...props}
            >
              <div
                className="relative w-full overflow-hidden bg-black border-4 border-white dark:border-[#1a1a1a]"
                style={{ paddingBottom: '56.25%' }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Close Button — morph blob style from nav-menu-button ── */}
        {isModalMounted && (
          <DialogPrimitive.Close
            className={cn(
              navStyles.iconWrap, navStyles.morph, navStyles.pressed,
              'fixed z-[120] cursor-pointer right-4 top-5 sm:right-8 sm:top-8',
            )}
            style={{
              // Official close button: opacity var(--alpha), translateX calc(200%*(1-alpha))
              // Entry: 0.6s, delay 0.5s, ease-back-out
              // Exit:  0.4s, delay 0s,   ease-back-in
              opacity: modalActive && !modalHeadingOut ? 1 : 0,
              transform: `translateX(${modalActive && !modalHeadingOut ? '0' : '200%'})`,
              transitionProperty: 'transform, opacity',
              transitionDuration: modalHeadingOut ? '0.4s' : '0.6s',
              transitionTimingFunction: modalHeadingOut
                // Official --ease-back-in: cubic-bezier(0.38, -0.37, 0.83, 0.23)
                ? 'cubic-bezier(0.38, -0.37, 0.83, 0.23)'
                // Official --ease-back-out: cubic-bezier(0.21, 0.12, 0.35, 1.43)
                : 'cubic-bezier(0.21, 0.12, 0.35, 1.43)',
              transitionDelay: modalHeadingOut ? '0s' : '0.5s',
            }}
            onClick={handleClose}
          >
            <span data-menu-trigger-line="" className={navStyles.icon} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Portal>
    )
  }
)
TrailerVideoContent.displayName = 'TrailerVideoContent'
