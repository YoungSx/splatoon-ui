'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createTriggerButton, mergeRefs } from '@/components/ui/trigger-button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

import { InkSplashCanvas } from './ink-splash-canvas'
import { MediaDecoration } from './media-decoration'
import { PaperSurface, type PaperSurfaceTone } from './paper-surface'
import { power3In } from '@/lib/wobble-math'
import { motionTokens } from '@/lib/ui-tokens'
import { uiZIndex } from '@/lib/ui-z-index'
import { WaveButton } from './wave-button'

const CLOSE_DELAY = motionTokens.dialogCloseDelayMs
const DURATION_IN = motionTokens.dialogDurationInMs
const DURATION_OUT = CLOSE_DELAY - 200
const DANGER_SURFACE_TITLE_COLOR = 'var(--danger-surface-title)'
const DANGER_SURFACE_DESCRIPTION_COLOR = 'var(--danger-surface-description)'
const DIALOG_Z_INDEX = {
  overlay: uiZIndex.dialogOverlay,
  content: uiZIndex.dialog,
  close: uiZIndex.dialogClose,
} as const
type DialogSurface = 'paper' | 'cream' | 'danger'

// ── Dialog Context (for fullScreen lifecycle management) ──

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  registerTrigger: (node: HTMLButtonElement | null) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)
const DialogSurfaceContext = React.createContext<DialogSurface>('paper')

function useDialogContext() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('useDialogContext must be used within a Dialog')
  }
  return context
}

// ── Dialog Root ──

interface DialogProps extends Omit<
  DialogPrimitive.Root.Props,
  'open' | 'onOpenChange' | 'children'
> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

function Dialog({ children, open: controlledOpen, onOpenChange, ...props }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const registerTrigger = React.useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node
  }, [])

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({ open: isOpen, setOpen: handleOpenChange, triggerRef, registerTrigger }),
    [isOpen, handleOpenChange, registerTrigger]
  )

  return (
    <DialogContext.Provider value={contextValue}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  ref,
  ...props
}: DialogPrimitive.Trigger.Props & { ref?: React.Ref<HTMLButtonElement> }) {
  const { registerTrigger } = useDialogContext()

  return (
    <DialogPrimitive.Trigger
      ref={mergeRefs(registerTrigger, ref)}
      data-slot="dialog-trigger"
      {...props}
    />
  )
}

const DialogTriggerButton = createTriggerButton(
  DialogPrimitive.Trigger as unknown as React.ComponentType<Record<string, unknown>>,
  'dialog-trigger',
  {
    useRegisterRef: () => useDialogContext().registerTrigger,
  }
)

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({ className, style, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'bg-overlay data-open:animate-in data-open:fade-in-0 fixed inset-0 isolate supports-backdrop-filter:backdrop-blur-sm',
        className
      )}
      style={{ zIndex: DIALOG_Z_INDEX.overlay, ...style }}
      {...props}
    />
  )
}

interface DialogContentProps extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean
  hasTape?: boolean
  tapePosition?: 'news' | 'event'
  surface?: DialogSurface
  fullScreen?: boolean
}

const surfaceFills: Record<
  NonNullable<DialogContentProps['surface']>,
  { bg: string; tone: PaperSurfaceTone }
> = {
  paper: { bg: 'bg-white text-black', tone: 'white' },
  cream: { bg: 'bg-white text-black', tone: 'white' },
  danger: { bg: 'bg-red text-white', tone: 'red' },
} as const

// ── Full-Screen Dialog Content ──

interface DialogContentFullScreenProps extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean
  isReducedMotion?: boolean
}

function DialogContentFullScreen({
  ref,
  className,
  children,
  showCloseButton = true,
  isReducedMotion = false,
  style,
  ...props
}: DialogContentFullScreenProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { open, setOpen, triggerRef } = useDialogContext()

  const [modalActive, setModalActive] = React.useState(false)
  const [modalHeadingOut, setModalHeadingOut] = React.useState(false)
  const [splatState, setSplatState] = React.useState<'ready' | 'in' | 'out'>('ready')
  const [splashStartPos, setSplashStartPos] = React.useState<[number, number]>([0, 0])
  const [splashCount, setSplashCount] = React.useState(0)
  const [preloadedBg, setPreloadedBg] = React.useState<HTMLImageElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const animFrameRef = React.useRef<number>(0)
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const openFrameRef = React.useRef<number>(0)
  const externalCloseTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setPreloadedBg(img)
    }
    img.src = '/_images/backgrounds/camo-black-2x.webp'
  }, [])

  const isModalMounted = open || modalActive || modalHeadingOut

  const handleClose = React.useCallback(() => {
    if (!modalActive || modalHeadingOut) return

    setSplatState('out')
    setModalHeadingOut(true)
    setSplashCount((count) => count + 1)

    try {
      triggerRef?.current?.focus()
    } catch {
      /* Focus restore is best-effort for transient dialog triggers. */
    }

    if (!isReducedMotion) {
      const contentEl = contentRef.current
      if (contentEl) {
        const duration = 700
        const rotate = (Math.random() > 0.5 ? 1 : -1) * (20 + 10 * Math.random())
        const startTime = performance.now()
        const animate = (now: number) => {
          const elapsed = now - startTime
          const rawT = Math.min(elapsed / duration, 1)
          const t = power3In(rawT)

          contentEl.style.transform = `translateY(${t * 100}%) scale(${1 + t * (0.7 - 1)}) rotate(${t * rotate}deg)`
          contentEl.style.opacity = String(1 - t)

          if (rawT < 1) {
            animFrameRef.current = requestAnimationFrame(animate)
          }
        }
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }

    closeTimerRef.current = setTimeout(
      () => {
        cancelAnimationFrame(animFrameRef.current)
        setModalActive(false)
        setModalHeadingOut(false)
        setSplatState('ready')
        setOpen(false)
      },
      isReducedMotion ? 0 : CLOSE_DELAY
    )
  }, [modalActive, modalHeadingOut, isReducedMotion, setOpen, triggerRef])

  // Open effect — mirrors VideoDialog's open useEffect
  React.useEffect(() => {
    if (!open) return

    // Cancel any in-progress close animation
    clearTimeout(closeTimerRef.current)
    clearTimeout(externalCloseTimerRef.current)
    cancelAnimationFrame(animFrameRef.current)
    cancelAnimationFrame(openFrameRef.current)

    openFrameRef.current = requestAnimationFrame(() => {
      setModalHeadingOut(false)
      setSplashCount((count) => count + 1)

      const btn = triggerRef?.current
      if (btn) {
        const rect = btn.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        setSplashStartPos([cx / window.innerWidth - 0.5, 0.5 - cy / window.innerHeight])
      }
    })

    const timer = setTimeout(
      () => {
        setModalActive(true)
        setSplatState('in')
      },
      isReducedMotion ? 0 : 100
    )

    return () => {
      cancelAnimationFrame(openFrameRef.current)
      clearTimeout(timer)
    }
  }, [open, isReducedMotion, triggerRef])

  // Sync with Dialog open state (handle external close)
  React.useEffect(() => {
    if (!open && modalActive && !modalHeadingOut) {
      externalCloseTimerRef.current = setTimeout(handleClose, 0)
    }
    return () => clearTimeout(externalCloseTimerRef.current)
  }, [open, modalActive, modalHeadingOut, handleClose])

  React.useEffect(
    () => () => {
      clearTimeout(closeTimerRef.current)
      clearTimeout(externalCloseTimerRef.current)
      cancelAnimationFrame(animFrameRef.current)
      cancelAnimationFrame(openFrameRef.current)
    },
    []
  )

  const canvasState =
    splatState === 'out'
      ? ('out' as const)
      : splatState === 'ready'
        ? ('idle' as const)
        : ('in' as const)

  return (
    <DialogPrimitive.Portal keepMounted>
      {isModalMounted && (
        <InkSplashCanvas
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: DIALOG_Z_INDEX.overlay }}
          state={canvasState}
          durationIn={DURATION_IN}
          durationOut={DURATION_OUT}
          color="var(--color-green)"
          background="/_images/backgrounds/camo-black-2x.webp"
          preloadedBackground={preloadedBg}
          count={splashCount}
          startPosition={splashStartPos}
        />
      )}

      {isModalMounted && (
        <DialogPrimitive.Backdrop
          className="fixed inset-0"
          style={{ zIndex: DIALOG_Z_INDEX.overlay }}
          onClick={handleClose}
        />
      )}

      {isModalMounted && (
        <div
          className="pointer-events-none fixed inset-0 flex items-center justify-center p-4 sm:p-8"
          style={{ zIndex: DIALOG_Z_INDEX.content }}
        >
          <div
            ref={(node) => {
              contentRef.current = node
              if (typeof ref === 'function') ref(node as HTMLDivElement)
              else if (ref)
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node as HTMLDivElement
            }}
            className={cn(
              'pointer-events-auto relative w-full max-w-[1000px] overflow-visible outline-none',
              className
            )}
            style={{
              transformOrigin: 'center center',
              transform: modalActive ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(20%)',
              opacity: modalActive ? 1 : 0,
              ...(modalHeadingOut
                ? {}
                : {
                    transitionProperty: 'transform, opacity',
                    transitionDuration: isReducedMotion ? '0s' : '0.6s',
                    transitionTimingFunction: 'ease',
                    transitionDelay: isReducedMotion ? '0s' : '0.5s',
                  }),
              ...style,
            }}
            {...props}
          >
            {children}
          </div>
        </div>
      )}

      {isModalMounted && showCloseButton && (
        <DialogPrimitive.Close
          render={<WaveButton />}
          className="fixed top-5 right-4 sm:top-8 sm:right-8"
          style={{
            zIndex: DIALOG_Z_INDEX.close,
            opacity: modalActive && !modalHeadingOut ? 1 : 0,
            transform: `translateX(${modalActive && !modalHeadingOut ? '0' : '200%'})`,
            transitionProperty: 'transform, opacity',
            transitionDuration: modalHeadingOut ? '0.4s' : '0.6s',
            transitionTimingFunction: modalHeadingOut
              ? 'cubic-bezier(0.38, -0.37, 0.83, 0.23)'
              : 'cubic-bezier(0.21, 0.12, 0.35, 1.43)',
            transitionDelay: modalHeadingOut ? '0s' : '0.5s',
          }}
          onClick={handleClose}
        />
      )}
    </DialogPrimitive.Portal>
  )
}

// ── Default Dialog Content (paper-tear style) ──

function DialogContent({
  className,
  children,
  showCloseButton = true,
  hasTape = true,
  tapePosition = 'news',
  surface = 'paper',
  fullScreen = false,
  style,
  ...props
}: DialogContentProps) {
  const [isReducedMotion] = useReducedMotion()

  const fillInfo = surfaceFills[surface] || surfaceFills.paper

  if (fullScreen) {
    return (
      <DialogContentFullScreen
        className={className}
        showCloseButton={showCloseButton}
        isReducedMotion={isReducedMotion}
        {...props}
      >
        {children}
      </DialogContentFullScreen>
    )
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          'shadow-soft-splat-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 fixed top-1/2 left-1/2 flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-3.5rem)] flex-col outline-none sm:max-w-md',
          isReducedMotion
            ? 'origin-center [transform:translate(-50%,-50%)]'
            : 'origin-center [transform:translate(-50%,-50%)_rotate(-1.5deg)]',
          className
        )}
        style={{ zIndex: DIALOG_Z_INDEX.content, ...style }}
        {...props}
      >
        {hasTape && (
          <MediaDecoration
            asset="sticker-9"
            responsive={false}
            className={cn(
              'pointer-events-none absolute top-0 z-30 inline-grid select-none',
              tapePosition === 'news'
                ? 'left-0 translate-x-[10px] -translate-y-[25px] -rotate-[10deg]'
                : 'right-0 -translate-x-[10px] -translate-y-[15px] rotate-[10deg]'
            )}
            style={{ width: 140 }}
          />
        )}

        <PaperSurface
          tone={fillInfo.tone}
          className="max-h-full min-h-0"
          contentClassName={cn('flex min-h-0 flex-col overflow-hidden', fillInfo.bg)}
        >
          <div
            data-slot="dialog-scroll"
            className="flex min-h-0 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain px-8 py-4"
          >
            <DialogSurfaceContext.Provider value={surface}>
              {children}
            </DialogSurfaceContext.Provider>
          </div>
        </PaperSurface>

        {showCloseButton && (
          <div
            className="absolute top-[30%] right-0 translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: DIALOG_Z_INDEX.close }}
          >
            <DialogPrimitive.Close render={<WaveButton />} />
          </div>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5', className)} {...props} />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'border-foreground/15 bg-foreground/5 -mx-8 mt-2 -mb-4 flex flex-col-reverse gap-2 border-t-2 border-dashed p-4 sm:flex-row sm:justify-end sm:gap-4',
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" theme="yellow" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, style, ...props }: DialogPrimitive.Title.Props) {
  const surface = React.useContext(DialogSurfaceContext)
  const surfaceStyle = surface === 'danger' ? { color: DANGER_SURFACE_TITLE_COLOR } : undefined

  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'splat-skew text-2xl font-black tracking-wider text-current',
        className
      )}
      style={{ ...surfaceStyle, ...style }}
      {...props}
    />
  )
}

function DialogDescription({ className, style, ...props }: DialogPrimitive.Description.Props) {
  const surface = React.useContext(DialogSurfaceContext)
  const surfaceStyle =
    surface === 'danger' ? { color: DANGER_SURFACE_DESCRIPTION_COLOR } : undefined

  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm leading-relaxed font-medium opacity-85', className)}
      style={{ ...surfaceStyle, ...style }}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogTriggerButton,
}
