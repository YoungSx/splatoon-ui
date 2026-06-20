'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

import { InkSplashCanvas } from './ink-splash-canvas'
import { PaperTearEdge } from './paper-tear-edge'
import { TapePicture } from './tape-picture'
import { power3In } from '@/lib/wobble-math'
import { WaveButton } from './wave-button'

const CLOSE_DELAY = 1200
const DURATION_IN = 700
const DURATION_OUT = CLOSE_DELAY - 200

// ── Dialog Context (for fullScreen lifecycle management) ──

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  registerTrigger: (node: HTMLButtonElement | null) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

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

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ref.current = value
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => assignRef(ref, value))
  }
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

type DialogTriggerButtonProps = Omit<
  DialogPrimitive.Trigger.Props,
  'render' | 'children'
> &
  Pick<
    React.ComponentProps<typeof Button>,
    | 'children'
    | 'variant'
    | 'size'
    | 'theme'
    | 'hasChevron'
    | 'color'
    | 'hoverColor'
    | 'textColor'
    | 'textHoverColor'
  >

function DialogTriggerButton({
  ref,
  children,
  variant = 'yellow',
  size = 'default',
  theme,
  hasChevron = true,
  color,
  hoverColor,
  textColor,
  textHoverColor,
  ...props
}: DialogTriggerButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const { registerTrigger } = useDialogContext()

  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={(triggerProps) => {
        const { ref: triggerRef, ...buttonProps } = triggerProps as {
          ref?: React.Ref<HTMLButtonElement>
          [key: string]: unknown
        }

        return (
          <Button
            {...buttonProps}
            ref={mergeRefs(registerTrigger, triggerRef, ref)}
            variant={variant}
            size={size}
            theme={theme}
            hasChevron={hasChevron}
            color={color}
            hoverColor={hoverColor}
            textColor={textColor}
            textHoverColor={textHoverColor}
          >
            {children}
          </Button>
        )
      }}
      {...props}
    />
  )
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'bg-overlay data-open:animate-in data-open:fade-in-0 fixed inset-0 isolate z-50 supports-backdrop-filter:backdrop-blur-sm',
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean
  hasTape?: boolean
  tapePosition?: 'news' | 'event'
  surface?: 'paper' | 'cream' | 'danger'
  fullScreen?: boolean
}

const surfaceFills = {
  paper: { bg: 'bg-white text-black', fill: 'var(--color-white)' },
  cream: { bg: 'bg-white text-black', fill: 'var(--color-white)' },
  danger: { bg: 'bg-red text-white', fill: 'var(--color-red)' },
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
          className="pointer-events-none fixed inset-0 z-[var(--z-nav-overlay)]"
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
          className="fixed inset-0 z-50 supports-backdrop-filter:backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {isModalMounted && (
        <div className="pointer-events-none fixed inset-0 z-[var(--z-dialog)] flex items-center justify-center p-4 sm:p-8">
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
          className="fixed top-5 right-4 z-[var(--z-dialog-close)] sm:top-8 sm:right-8"
          style={{
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
          'shadow-soft-splat-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] flex-col outline-none sm:max-w-md',
          isReducedMotion
            ? 'origin-center [transform:translate(-50%,-50%)]'
            : 'origin-center [transform:translate(-50%,-50%)_rotate(-1.5deg)]',
          className
        )}
        {...props}
      >
        <PaperTearEdge
          edge="top"
          color={fillInfo.fill}
          className="pointer-events-none relative z-10 mb-[-2px] w-full select-none"
        />

        {hasTape && (
          <div
            className={cn(
              'pointer-events-none absolute top-0 z-30 inline-grid select-none',
              tapePosition === 'news'
                ? 'left-0 translate-x-[10px] -translate-y-[25px] -rotate-[10deg]'
                : 'right-0 -translate-x-[10px] -translate-y-[15px] rotate-[10deg]'
            )}
            style={{ width: 140 }}
          >
            <TapePicture asset="sticker-9" fill={false} />
          </div>
        )}

        <div className={cn('relative z-10 flex flex-col gap-4 px-8 py-4', fillInfo.bg)}>
          {children}

          {showCloseButton && (
            <div className="absolute -top-1 -right-3 z-50">
              <DialogPrimitive.Close render={<WaveButton />} />
            </div>
          )}
        </div>

        <PaperTearEdge
          edge="bottom"
          color={fillInfo.fill}
          className="pointer-events-none relative z-10 mt-[-2px] w-full select-none"
        />
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

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'splat-skew text-2xl font-black tracking-wider text-current uppercase',
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm leading-relaxed font-medium opacity-85', className)}
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
