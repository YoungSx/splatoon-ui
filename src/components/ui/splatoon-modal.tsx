"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import styles from "./splatoon-modal.module.css"

/* ── Scroll lock counter (supports stacked modals) ──────────────────────── */

let scrollLockCount = 0
let scrollLockY = 0

function lockScroll() {
  if (scrollLockCount === 0) {
    scrollLockY = window.scrollY
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollLockY}px`
    document.body.style.width = "100%"
  }
  scrollLockCount++
}

function unlockScroll() {
  scrollLockCount--
  if (scrollLockCount <= 0) {
    scrollLockCount = 0
    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    window.scrollTo(0, scrollLockY)
  }
}

/* ── Context ────────────────────────────────────────────────────────────── */

interface SplatoonModalContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  contentRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLElement | null>
}

const SplatoonModalContext = React.createContext<SplatoonModalContextValue | null>(null)

function useSplatoonModal() {
  const ctx = React.useContext(SplatoonModalContext)
  if (!ctx) throw new Error("useSplatoonModal must be used within SplatoonModal")
  return ctx
}

/* ── Root ────────────────────────────────────────────────────────────────── */

interface SplatoonModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

function SplatoonModal({ children, open: controlledOpen, onOpenChange, defaultOpen = false }: SplatoonModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement | null>(null)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value)
      if (controlledOpen === undefined) setUncontrolledOpen(value)
    },
    [controlledOpen, onOpenChange],
  )

  return (
    <SplatoonModalContext.Provider value={{ open, setOpen, contentRef, triggerRef }}>
      {children}
    </SplatoonModalContext.Provider>
  )
}

/* ── Trigger ────────────────────────────────────────────────────────────── */

interface SplatoonModalTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

function SplatoonModalTrigger({ children, onClick, ...props }: SplatoonModalTriggerProps) {
  const { setOpen, triggerRef } = useSplatoonModal()

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={(e) => {
        setOpen(true)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

/* ── Focus trap helper ──────────────────────────────────────────────────── */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/* ── Modal Portal ────────────────────────────────────────────────────────── */

function SplatoonModalPortal({ children }: { children: React.ReactNode }) {
  const { open, setOpen, contentRef, triggerRef } = useSplatoonModal()
  const [mounted, setMounted] = React.useState(false)
  const [isReducedMotion] = useReducedMotion()

  React.useEffect(() => setMounted(true), [])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, setOpen])

  // Focus trap
  React.useEffect(() => {
    if (!open) return
    const container = contentRef.current
    if (!container) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first || !container.contains(document.activeElement)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last || !container.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, contentRef])

  // Focus the modal content on open, restore trigger focus on close
  React.useEffect(() => {
    if (!open) return
    const container = contentRef.current
    if (!container) return

    // Focus the first focusable element inside the modal
    const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    firstFocusable?.focus()

    return () => {
      // Restore focus to the trigger element
      triggerRef.current?.focus()
    }
  }, [open, contentRef, triggerRef])

  // Body scroll lock (stacked-modal safe)
  React.useEffect(() => {
    if (!open) return
    lockScroll()
    return unlockScroll
  }, [open])

  if (!mounted) return null

  const reducedMotionStyle = isReducedMotion
    ? { "--duration": "0.01ms", "--content-delay": "0s" }
    : {}

  return createPortal(
    <div
      className={cn(styles.modal, open && styles.modalOpen)}
      style={{
        "--alpha": open ? 1 : 0,
        "--scale": 1,
        "--duration": open ? "0.6s" : "0.4s",
        "--content-delay": open ? "0.5s" : "0s",
        "--modal-ease": "cubic-bezier(0.35, 0.91, 0.3, 0.99)",
        "--modal-button-ease": "cubic-bezier(0.21, 0.12, 0.35, 1.43)",
        "--duration-factor": 1,
        ...reducedMotionStyle,
      } as unknown as React.CSSProperties}
    >
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        style={{ backgroundColor: `rgba(0, 0, 0, calc(0.9 * var(--alpha)))` }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      {/* Content — centered, fade-only */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={styles.content}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

/* ── Modal Body (the white card) ────────────────────────────────────────── */

interface SplatoonModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  showFrames?: boolean
}

function SplatoonModalBody({ children, className, showFrames = true, ...props }: SplatoonModalBodyProps) {
  const { setOpen } = useSplatoonModal()

  return (
    <div className={cn(styles.body, className)} {...props}>
      {showFrames && (
        <>
          <div className={cn(styles.frame, styles.frameTopRight)}>
            <SquidIcon className={styles.frameIcon} />
          </div>
          <div className={cn(styles.frame, styles.frameBottomLeft)}>
            <SquidIcon className={styles.frameIcon} />
          </div>
        </>
      )}

      {/* Morph blob close button (official style) */}
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => setOpen(false)}
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="4" y1="4" x2="16" y2="16" />
          <line x1="16" y1="4" x2="4" y2="16" />
        </svg>
      </button>

      {children}
    </div>
  )
}

/* ── Stagger container ──────────────────────────────────────────────────── */

interface SplatoonModalStaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function SplatoonModalStagger({ children, className, ...props }: SplatoonModalStaggerProps) {
  const { open } = useSplatoonModal()
  const itemsRef = React.useRef<HTMLDivElement[]>([])

  React.useEffect(() => {
    if (!open) {
      // Reset all items
      itemsRef.current.forEach((el) => {
        if (el) el.classList.remove(styles.staggerItemVisible)
      })
      return
    }

    // Staggered reveal
    itemsRef.current.forEach((el, i) => {
      if (!el) return
      el.style.transitionDelay = `${100 * (i + 1)}ms`
      el.classList.add(styles.staggerItemVisible)
      const onEnd = () => {
        el.style.transitionDelay = ""
        el.removeEventListener("transitionend", onEnd)
      }
      el.addEventListener("transitionend", onEnd)
    })
  }, [open])

  const childArray = React.Children.toArray(children)

  return (
    <div className={className} {...props}>
      {childArray.map((child, i) => (
        <div
          key={i}
          ref={(el) => { if (el) itemsRef.current[i] = el }}
          className={styles.staggerItem}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

/* ── Squid SVG icon (for corner frames) ─────────────────────────────────── */

function SquidIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 50 50"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M25 2C18.4 2 13 7.4 13 14c0 4.2 2.2 7.9 5.5 10L25 50l6.5-26C34.8 21.9 37 18.2 37 14c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
    </svg>
  )
}

/* ── Exports ────────────────────────────────────────────────────────────── */

export {
  SplatoonModal,
  SplatoonModalTrigger,
  SplatoonModalPortal,
  SplatoonModalBody,
  SplatoonModalStagger,
  useSplatoonModal,
}
