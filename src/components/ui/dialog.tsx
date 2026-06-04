"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tape } from "./tape"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

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
        "fixed inset-0 isolate z-50 bg-foreground/60 duration-150 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
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
}

const surfaceFills = {
  paper: { bg: "bg-white text-[#0d0d0d]", fill: "#ffffff" },
  cream: { bg: "bg-[#f5f0e8] text-[#0d0d0d]", fill: "#f5f0e8" },
  danger: { bg: "bg-[#ff505e] text-white", fill: "#ff505e" },
} as const

function DialogContent({
  className,
  children,
  showCloseButton = true,
  hasTape = true,
  tapeText = "ALERT!",
  tapeColor = "yellow",
  tapePosition = "news",
  surface = "paper",
  ...props
}: DialogContentProps) {
  const [isReducedMotion, setIsReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const checkRM = () => {
      const storedRM = localStorage.getItem("splat-reduced-motion")
      const mediaRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const hasClass = document.documentElement.classList.contains("reduced-motion")
      setIsReducedMotion(storedRM === "true" || mediaRM || hasClass)
    }
    checkRM()
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const listener = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches || document.documentElement.classList.contains("reduced-motion"))
    }
    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

  const fillInfo = surfaceFills[surface] || surfaceFills.paper

  

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "shadow-soft-splat-lg fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] flex-col duration-150 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          isReducedMotion
            ? "origin-center [transform:translate(-50%,-50%)]"
            : "origin-center [transform:translate(-50%,-50%)_rotate(-1.5deg)]",
          className
        )}
        {...props}
      >
        {/* Top Paper Tear SVG */}
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

        {/* Dialog Content body */}
        <div className={cn("relative z-10 px-8 py-4 flex flex-col gap-4 border-l-[3px] border-r-[3px] border-chaos-black dark:border-white/20", fillInfo.bg)}>
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
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <Button
                  variant="destructive"
                  textColor="black"
                  hoverColor="green"
                  textHoverColor="white"
                  className="shadow-soft-splat-sm absolute -top-1 -right-3 z-50 size-8 rounded-full border-[3px] border-chaos-black p-0 hover:scale-110 active:scale-95"
                  size="icon-sm"
                />
              }
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </div>

        {/* Bottom Paper Tear SVG */}
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
          render={<Button variant="outline" textColor="black" hoverColor="yellow" textHoverColor="black" />}
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
}
