"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createTriggerButton } from "@/components/ui/trigger-button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Tape } from "./tape"
import { XIcon } from "lucide-react"
import { InkSplashCanvas } from "./ink-splash-canvas"
import { power3In } from "@/lib/wobble-math"
import navStyles from "@/components/ui/nav-menu-button.module.css"

const CLOSE_DELAY = 1200
const DURATION_IN = 700
const DURATION_OUT = CLOSE_DELAY - 200

// ── Dialog Context (for fullScreen lifecycle management) ──

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
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

interface DialogProps extends Omit<DialogPrimitive.Root.Props, 'open' | 'onOpenChange'> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Dialog({ children, open: controlledOpen, onOpenChange, ...props }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

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
    () => ({ open: isOpen, setOpen: handleOpenChange, triggerRef }),
    [isOpen, handleOpenChange]
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

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

const DialogTriggerButton = createTriggerButton(DialogPrimitive.Trigger, "dialog-trigger")

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/90 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean
  hasTape?: boolean
  tapeText?: string
  tapeColor?: "yellow" | "red" | "blue" | "green"
  tapePosition?: "news" | "event"
  surface?: "paper" | "cream" | "danger"
  fullScreen?: boolean
}

const surfaceFills = {
  paper: { bg: "bg-white text-[#0d0d0d]", fill: "#ffffff" },
  cream: { bg: "bg-[#f5f0e8] text-[#0d0d0d]", fill: "#f5f0e8" },
  danger: { bg: "bg-[#ff585e] text-white", fill: "#ff585e" },
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
  const contentRef = React.useRef<HTMLDivElement>(null)
  const animFrameRef = React.useRef<number>(0)
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const splashCountRef = React.useRef(Math.round(10000 * Math.random()))
  const preloadedBgRef = React.useRef<HTMLImageElement | null>(null)

  React.useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { preloadedBgRef.current = img }
    img.src = '/_images/backgrounds/camo-black-2x.webp'
  }, [])

  const isModalMounted = open || modalActive || modalHeadingOut

  const handleClose = React.useCallback(() => {
    if (!modalActive || modalHeadingOut) return

    setSplatState('out')
    setModalHeadingOut(true)
    splashCountRef.current += 1

    try { triggerRef?.current?.focus() } catch (_) { /* */ }

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

    closeTimerRef.current = setTimeout(() => {
      cancelAnimationFrame(animFrameRef.current)
      setModalActive(false)
      setModalHeadingOut(false)
      setSplatState('ready')
      setOpen(false)
    }, CLOSE_DELAY)
  }, [modalActive, modalHeadingOut, setOpen, triggerRef])

  // Open effect — mirrors TrailerVideo's open useEffect
  React.useEffect(() => {
    if (!open) return

    // Cancel any in-progress close animation
    clearTimeout(closeTimerRef.current)
    cancelAnimationFrame(animFrameRef.current)
    setModalHeadingOut(false)

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

  // Sync with Dialog open state (handle external close)
  React.useEffect(() => {
    if (!open && modalActive && !modalHeadingOut) {
      handleClose()
    }
  }, [open, modalActive, modalHeadingOut, handleClose])

  React.useEffect(() => () => {
    clearTimeout(closeTimerRef.current)
    cancelAnimationFrame(animFrameRef.current)
  }, [])

  const canvasState = splatState === 'out' ? 'out' as const
    : splatState === 'ready' ? 'idle' as const
    : 'in' as const

  return (
    <DialogPrimitive.Portal keepMounted>
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

      {isModalMounted && (
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50"
          onClick={handleClose}
        />
      )}

      {isModalMounted && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
          <div
            ref={(node) => {
              contentRef.current = node
              if (typeof ref === 'function') ref(node as HTMLDivElement)
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement
            }}
            className={cn(
              "relative w-full max-w-[1000px] overflow-visible outline-none pointer-events-auto",
              className
            )}
            style={{
              transformOrigin: 'center center',
              transform: modalActive
                ? 'scale(1) translateY(0)'
                : 'scale(0.7) translateY(20%)',
              opacity: modalActive ? 1 : 0,
              ...(modalHeadingOut ? {} : {
                transitionProperty: 'transform, opacity',
                transitionDuration: '0.6s',
                transitionTimingFunction: 'ease',
                transitionDelay: '0.5s',
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
          className={cn(
            navStyles.iconWrap, navStyles.morph, navStyles.pressed,
            'fixed z-[120] cursor-pointer right-4 top-5 sm:right-8 sm:top-8',
          )}
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
        >
          <span data-menu-trigger-line="" className={navStyles.icon} />
        </DialogPrimitive.Close>
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
  tapeText = "ALERT!",
  tapeColor = "yellow",
  tapePosition = "news",
  surface = "paper",
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
          "shadow-soft-splat-lg fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] flex-col outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          isReducedMotion
            ? "origin-center [transform:translate(-50%,-50%)]"
            : "origin-center [transform:translate(-50%,-50%)_rotate(-1.5deg)]",
          className
        )}
        {...props}
      >
        <svg
          aria-hidden="true"
          className="relative z-10 mb-[-2px] w-full pointer-events-none select-none"
          style={{ fill: fillInfo.fill }}
          viewBox="0 0 448 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M253.96 23.774a4.711 4.711 0 0 1-4.693 4.328h-49.535c-.131 0-.255-.027-.384-.038-2.431-.198-4.348-2.205-4.348-4.68a4.724 4.724 0 0 1 4.732-4.716h18.204c-.006-.106-.017-.21-.017-.315 0-3.452 2.808-6.25 6.27-6.25h.62a6.26 6.26 0 0 1 5.038 2.54 6.194 6.194 0 0 1 1.233 3.71c0 .106-.01.21-.016.315H249.267c2.614 0 4.733 2.111 4.733 4.717 0 .133-.029.258-.04.389M53.446.102H9.693C4.34.102 0 4.437 0 9.782v50.044h448V9.783c0-5.346-4.338-9.68-9.693-9.68H53.445Z"
            fillRule="evenodd"
          />
        </svg>

        <div className={cn("relative z-10 px-8 py-4 flex flex-col gap-4 border-l-[3px] border-r-[3px] border-chaos-black", fillInfo.bg)}>
          {hasTape && (
            <Tape
              variant="torn"
              color={tapeColor}
              text={tapeText}
              className={cn(
                "absolute z-30 select-none pointer-events-none w-[35%] max-w-[120px]",
                tapePosition === "news"
                  ? "left-6 -top-5 origin-center [transform:translate(0,-50%)_rotate(-12deg)]"
                  : "right-6 -top-5 origin-center [transform:translate(0,-50%)_rotate(12deg)]"
              )}
            />
          )}
          {children}

          {showCloseButton && (
            <div className="absolute -top-1 -right-3 z-50">
              <DialogPrimitive.Close
                data-slot="dialog-close"
                className="inline-flex items-center justify-center bg-[#eaff3d] text-[#603bff] border-none cursor-pointer p-3 animate-[morph_3s_linear_infinite] transition-transform duration-300 ease-[cubic-bezier(0.21,0.12,0.35,1.43)] hover:scale-110"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
          )}
        </div>

        <svg
          aria-hidden="true"
          className="relative z-10 mt-[-2px] w-full pointer-events-none select-none"
          style={{ fill: fillInfo.fill }}
          viewBox="0 0 448 24"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 .826c0 9.527 5.976 17.64 14.378 20.862 2.49.955 5.184 1.5 8.01 1.5h403.223c4.635 0 8.94-1.407 12.514-3.816C444.082 15.354 448 8.548 448 .826H0Z"
            fillRule="evenodd"
          />
        </svg>
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-8 -mb-4 mt-2 flex flex-col-reverse gap-2 border-t-2 border-dashed border-foreground/15 bg-foreground/5 p-4 sm:flex-row sm:justify-end sm:gap-4",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="outline" theme="yellow" />}
        >
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
      className={cn("splat-skew text-2xl font-black uppercase tracking-wider text-current", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm font-medium opacity-85 leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
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
